import styles from '../styles/addToAlbum'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import Modal from 'cozy-ui/react/Modal'
import classNames from 'classnames'

import { cancelAddToAlbum } from '../actions/albums'

const AddToAlbumModal = ({t, visible, onDismiss}) => {
  return visible
    ? (<Modal
      title={t('Albums.add_photos.title')}
      cancelAction={() => onDismiss()}
      >
      <div className={classNames(styles['coz-modal-section'], styles['coz-create-album'])}>
        <form>
          <label className={styles['coz-create-album-label']}>
            {t('Albums.add_photos.create_label')}
          </label>
          <div className={styles['coz-inline-form']}>
            <input className={styles['coz-input-text']} type='text' />
            <button className={styles['coz-btn--regular']}>
              {t('Albums.add_photos.create_button')}
            </button>
          </div>
        </form>
      </div>
      <ul className={classNames(styles['coz-modal-section'], styles['coz-albums-list'])}>
        <li className={styles['coz-album']}>
          <img />
          <strong className={styles['coz-album-name']}>
            Example album 1
          </strong>
        </li>
        <li className={styles['coz-album']}>
          <img />
          <strong className={styles['coz-album-name']}>
            Example album 2
          </strong>
          <p className={styles['coz-album-properties']}>
            Share (read & write)
          </p>
        </li>
      </ul>
    </Modal>)
    : null
}

const mapStateToProps = (state, ownProps) => {
  return {
    visible: state.ui.isAddingToAlbum
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDismiss: () => {
    dispatch(cancelAddToAlbum())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(AddToAlbumModal))