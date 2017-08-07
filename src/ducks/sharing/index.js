/* global cozy */
export const filterSharedByLinkDocuments = (ids, doctype) =>
  fetchShareLinkPermissions(ids, doctype, 'collection').then(sets => sets.map(set => set.attributes.permissions['collection'].values[0]))

export const filterSharedWithMeDocuments = (ids, doctype) =>
  fetchSharedWithMePermissions(ids, doctype, 'rule0').then(sets => sets.map(set => set.attributes.permissions['rule0'].values[0]))

export const filterSharedWithOthersDocuments = (ids, doctype) =>
  fetchSharedWithOthersPermissions(ids, doctype, 'rule0').then(sets => sets.map(set => set.attributes.permissions['rule0'].values[0]))

// TODO: move this to cozy-client-js
// there is cozy.client.files.getCollectionShareLink already, but I think that
// there is a need of a bit of exploratory work and design for that API...

/**
 * SHARE BY LINK
 */

const createShareLinkPermission = (id, doctype) =>
  cozy.client.fetchJSON('POST', `/permissions?codes=email`, {
    data: {
      type: 'io.cozy.permissions',
      attributes: {
        permissions: {
          files: {
            type: 'io.cozy.files',
            verbs: ['GET'],
            values: [id],
            selector: 'referenced_by'
          },
          collection: {
            type: doctype,
            verbs: ['GET'],
            values: [id]
          }
        }
      }
    }
  })

const getShareLinkPermission = (id, doctype) =>
  fetchShareLinkPermissions([id], doctype, 'collection')
  .then(permissions => permissions.length === 0 ? undefined : permissions[0])

const buildShareLink = (id, sharecode) =>
  `${window.location.origin}/public?sharecode=${sharecode}&id=${id}`

export const getShareLink = (id, doctype = 'io.cozy.photos.albums') =>
  getShareLinkPermission(id, doctype)
  .then(permission => permission ? { sharelink: buildShareLink(id, permission.attributes.codes.email), id: permission._id } : undefined)

export const createShareLink = (id, doctype = 'io.cozy.photos.albums') =>
  getShareLinkPermission(id, doctype)
  .then(permission => permission || createShareLinkPermission(id, doctype))
  .then(permission => ({ sharelink: buildShareLink(id, permission.attributes.codes.email), id: permission._id }))

/**
 * helpers
 */

export const SHARED_BY_LINK = 'sharedByLink'
export const SHARED_WITH_ME = 'sharedWithMe'
export const SHARED_WITH_OTHERS = 'sharedWithOthers'

const fetchPermissions = (sharingType) =>
  (ids, doctype, key) =>
    cozy.client.fetchJSON('GET', `/permissions/doctype/${doctype}/${sharingType}`)
      .then(permissions => permissions.filter(permission => {
        const obj = permission.attributes.permissions[key]
        return obj && obj.type === doctype && ids.find(id => obj.values.indexOf(id) !== -1) !== undefined
      })
    )

const fetchSharedWithMePermissions = fetchPermissions(SHARED_WITH_ME)
const fetchSharedWithOthersPermissions = fetchPermissions(SHARED_WITH_OTHERS)
const fetchShareLinkPermissions = fetchPermissions(SHARED_BY_LINK)

const fetchSharing = (id) => cozy.client.fetchJSON('GET', `/sharings/${id}`)

const fetchSharings = (ids) => Promise.all(ids.map(fetchSharing))

export const deletePermission = (id) =>
  cozy.client.fetchJSON('DELETE', `/permissions/${id}`)

const createContact = (email, url) => cozy.client.fetchJSON('POST', '/data/io.cozy.contacts/', {
  cozy: [
    {url}
  ],
  email: [
    {
      address: email,
      primary: true
    }
  ]
})

const createSharing = (docId, docName, targetId, sharingType = 'master-slave') =>
  cozy.client.fetchJSON('POST', '/sharings/', {
    desc: docName,
    permissions: {
      album: {
        description: 'album',
        type: 'io.cozy.photos.albums',
        values: [docId]
      },
      files: {
        description: 'photos',
        type: 'io.cozy.files',
        values: [
          `io.cozy.photos.albums/${docId}`
        ],
        selector: 'referenced_by'
      }
    },
    recipients: [
      {
        recipient: {
          id: targetId,
          type: 'io.cozy.contacts'
        }
      }
    ],
    sharing_type: sharingType
  })

const getContactId = ({email, url, id}) => id
  ? Promise.resolve(id)
  : createContact(email, url)

export const share = (document, recipient, sharingType) =>
  getContactId(recipient)
  .then(
    (id) => createSharing(document._id, document.name, id, sharingType)
  )

export const getContacts = (ids = []) => cozy.client.fetchJSON('GET', '/data/io.cozy.contacts/_all_docs?include_docs=true', {keys: ids})
  .then(response =>
    response.rows
    .map(row => row.doc)
    .filter(doc => Array.isArray(doc.email))
  )

const getPrimaryOrFirst = property => (obj) => {
  if (!obj[property] || obj[property].length === 0) return ''

  return obj[property].find(property => property.primary) || obj[property][0]
}

export const getEmail = (contact) => getPrimaryOrFirst('email')(contact).address
export const getCozy = (contact) => getPrimaryOrFirst('cozy')(contact).url

const getProperty = (property, comparator) => (list, id) => {
  const wantedItem = list.find(comparator(id)) || {}
  return wantedItem[property]
}

export const getRecipients = (id, type) => fetchSharedWithOthersPermissions([id], type, 'rule0')
  .then(perms => perms.map(perm => perm.attributes.source_id))
  .then(fetchSharings)
  .then(sharings =>
    sharings.map(sharing =>
      sharing.attributes.recipients.map(info =>
        ({
          id: info.recipient.id,
          status: info.status,
          type: sharing.attributes.sharing_type
        })
      )
    )
  )
  .then(arrayOfArrays => [].concat(...arrayOfArrays))
  .then(async recipients => {
    const ids = recipients.map(recipient => recipient.id)
    const contacts = await getContacts(ids)
    return recipients.map(recipient => ({
      ...recipient,
      email: getProperty('email', id => item => item._id === id)(contacts, recipient.id),
      url: getProperty('url', id => item => item._id === id)(contacts, recipient.id)
    }))
  })

import ShareModal from './ShareModal'
import withSharings from './withSharings'

export { ShareModal, withSharings }
