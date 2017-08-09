import React from 'react'
import classnames from 'classnames'

import Alerter from '../../../components/Alerter'
import ShareAutocomplete from './ShareAutocomplete'
import WhoHasAccess from './WhoHasAccess'
import { share } from '..'

import styles from '../share.styl'

class ShareByEmail extends React.Component {

  share (recipient, sharingType) {
    return share(this.props.document, recipient, sharingType)
      .then(sharing => {
        Alerter.info('Albums.share.shareByEmail.success', { email: recipient.email })
      })
      .catch(err => {
        Alerter.error('Error.generic')
        throw err
      })
  }

  render () {
    return (
      <div>
        <ShareByUrl onSend={(recipient, sharingType) => this.share(recipient, sharingType)} />
        <WhoHasAccess document={this.props.document} />
      </div>
    )
  }
}

class ShareByUrl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      url: undefined,
      id: undefined,
      sharingType: 'master-slave'
    }
  }

  onAutocomplete (email, url, id) {
    this.setState(state => ({ ...state, email, url, id }))
  }

  reset () {
    this.setState(state => ({
      ...state,
      email: '',
      url: undefined,
      id: undefined,
      sharingType: 'master-slave' }))
  }

  sendSharingLink () {
    const {email, url, id, sharingType} = this.state
    this.props.onSend({email, url, id}, sharingType)
    .then(() => {
      this.reset()
    })
    .catch(() => {
      this.reset()
    })
  }

  changeSharingType (sharingType) {
    this.setState(state => ({ ...state, sharingType }))
  }

  render () {
    const { t } = this.context
    return (
      <div className={styles['coz-form-group']}>
        <h3>{t('Albums.share.shareByEmail.subtitle')}</h3>
        <div className={styles['coz-form']}>
          <label className={styles['coz-form-label']} for='email'>{t('Albums.share.shareByEmail.email')}</label>
          <ShareAutocomplete
            value={this.state.email}
            onChange={(email, url, id) => {
              this.onAutocomplete(email, url, id)
            }}
          />
        </div>
        <div className={classnames(styles['coz-form-controls'], styles['coz-form-controls--dispatch'])}>
          <select
            name='select'
            className={styles['coz-select']}
            value={this.state.sharingType}
            onChange={e => this.changeSharingType(e.target.value)}>
            <option value='master-slave'>{t('Share.status.accepted.master-slave')}</option>
            <option value='master-master'>{t('Share.status.accepted.master-master')}</option>
          </select>
          <button
            className={classnames('coz-btn', 'coz-btn--regular')}
            disabled={!this.state.email}
            onClick={e => this.sendSharingLink()}>
            {t('Albums.share.shareByEmail.send')}
          </button>
        </div>
      </div>
    )
  }
}

export default ShareByEmail
