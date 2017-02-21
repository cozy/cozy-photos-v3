import styles from '../styles/photoList'

import React from 'react'
import classNames from 'classnames'
import { Link, withRouter } from 'react-router'

import { STACK_FILES_DOWNLOAD_PATH } from '../constants/config'

export const Photo = ({ photo, selected = false, onToggle, router }) => {
  const parentPath = router.location.pathname
  return (
    <div className={classNames(
      styles['pho-photo'],
      { [styles['pho-photo--selected']]: selected }
    )}>
      <span className={styles['pho-photo-select']} data-input='checkbox'>
        <input
          type='checkbox'
          checked={selected}
         />
        <label onClick={e => {
          e.stopImmediatePropagation()
          onToggle(photo._id, selected)
        }} />
      </span>
      <Link to={`${parentPath}/${photo._id}`}>
        <img
          className={styles['pho-photo-item']}
          src={`${STACK_FILES_DOWNLOAD_PATH}/${photo._id}`}
        />
      </Link>
    </div>
  )
}

export default withRouter(Photo)
