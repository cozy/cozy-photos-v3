/* global cozy */
const FILES_DOCTYPE = 'io.cozy.files'
const FETCH_LIMIT = 50

export default class CozyAPI {
  constructor (config) {
    cozy.client.init(config)
  }

  async fetchDocuments (doctype) {
    // WARN: cozy-client-js lacks a cozy.data.findAll method that uses this route
    try {
      // WARN: if no document of this doctype exist, this route will return a 404,
      // so we need to try/catch and return an empty response object in case of a 404
      const resp = await cozy.client.fetchJSON('GET', `/data/${doctype}/_all_docs?include_docs=true`)
      // WARN: the JSON response from the stack is not homogenous with other routes (offset? rows? total_rows?)
      // see https://github.com/cozy/cozy-stack/blob/master/docs/data-system.md#list-all-the-documents
      // WARN: looks like this route returns something looking like a couchDB design doc, we need to filter it:
      const rows = resp.rows.filter(row => !row.doc.hasOwnProperty('views'))
      // we normalize the data (note that we add _type so that cozy.client.data.listReferencedFiles works...)
      const docs = rows.map(row => Object.assign({}, row.doc, { id: row.id, type: doctype, _type: doctype }))
      // we forge a correct JSONAPI response:
      return {
        data: docs,
        meta: { count: resp.total_rows },
        skip: resp.offset,
        next: false
      }
    } catch (error) {
      if (error.message.match(/not_found/)) {
        return { data: [], meta: { count: 0 }, skip: 0, next: false }
      }
      throw error
    }
  }

  async queryDocuments (doctype, index, options) {
    const fields = options.fields
    const skip = options.skip || 0
    // Mango wants an array of single-property-objects...
    const sort = options.sort
      ? index.fields.map(f => ({ [f]: options.sort[f] || 'desc' }))
      : undefined

    const queryOptions = {
      limit: FETCH_LIMIT,
      wholeResponse: true, // WARN: mandatory to get the full JSONAPI response
      ...options,
      // TODO: type and class should not be necessary, it's just a temp fix for a stack bug
      fields: [...fields, '_id', 'type', 'class'],
      skip,
      sort
    }

    const { data, meta } = (doctype === FILES_DOCTYPE)
      ? await cozy.client.files.query(index, queryOptions)
      : await cozy.client.data.query(index, queryOptions)

    // we forge a correct JSONAPI response:
    return {
      data: data.map(doc => Object.assign({ _id: doc.id }, doc, doc.attributes)),
      meta,
      next: meta.count > skip + FETCH_LIMIT
    }
  }

  async fetchDocument (doctype, id) {
    const doc = await cozy.client.data.find(doctype, id)
    // we normalize again...
    const normalized = { ...doc, id: doc._id, type: doc._type }
    return { data: [normalized] }
  }

  async createDocument (doc) {
    const created = await cozy.client.data.create(doc.type, doc)
    // we forge a standard response with a 'data' property
    const normalized = { ...created, id: created._id }
    return { data: [normalized] }
  }

  async updateDocument (doc) {
    /* const updated = */ await cozy.client.data.updateAttributes(doc.type, doc.id, doc)
    // we forge a standard response with a 'data' property
    return { data: [doc] }
  }

  async deleteDocument (doc) {
    /* const deleted = */ await cozy.client.data.delete(doc.type, doc)
    // we forge a standard response with a 'data' property
    return { data: [doc] }
  }

  async createIndex (doctype, fields) {
    return await cozy.client.data.defineIndex(doctype, fields)
  }

  async fetchFileByPath (path) {
    try {
      const file = await cozy.client.files.statByPath(path)
      // we forge a standard response with a 'data' property
      return { data: [normalizeFile(file)] }
    } catch (err) {
      return null
    }
  }

  async createFile (file, dirID) {
    const created = await cozy.client.files.create(file, { dirID })
    // we forge a standard response with a 'data' property
    return { data: [normalizeFile(created)] }
  }

  async trashFile (file) {
    /* const trashed = */ cozy.client.files.trashById(file.id)
    // we forge a standard response with a 'data' property
    return { data: [file] }
  }

  async fetchReferencedFiles (doc, skip = 0) {
    // WARN: _type and _id are needed by cozy.client.data.fetchReferencedFiles
    const normalized = { ...doc, _type: doc.type, _id: doc.id }
    // WARN: the stack API is probably not ideal here: referencedFiles are in the 'included' property
    // (that should be used when fetching an entity AND its relations) and the 'data' property
    // only contains uplets { id, type }
    const { included, meta } = await cozy.client.data.fetchReferencedFiles(normalized, { skip, limit: FETCH_LIMIT })
    // we forge a standard response with a 'data' property
    return {
      data: !included ? [] : included.map(file => ({ ...file, ...file.attributes, type: 'io.cozy.files' })),
      meta,
      next: meta.count > skip + FETCH_LIMIT,
      skip
    }
  }

  async addReferencedFiles (doc, ids) {
    await cozy.client.data.addReferencedFiles(doc, ids)
    return ids
  }

  async removeReferencedFiles (doc, ids) {
    // WARN: _type and _id are needed by cozy.client.data.removeReferencedFiles
    const normalized = { ...doc, _type: doc.type, _id: doc.id }
    await cozy.client.data.removeReferencedFiles(normalized, ids)
    return ids
  }
}

const normalizeFile = (file) => ({ ...file, ...file.attributes, id: file._id, type: file._type })
