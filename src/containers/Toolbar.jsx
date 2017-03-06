import styles from '../styles/toolbar'

import React from 'react'
import { translate } from '../lib/I18n'
import classNames from 'classnames'

import UploadButton from './UploadButton'

export const Toolbar = ({ t, viewType }) => (
  <div className={styles['pho-content-toolbar']} role='toolbar'>
    {viewType === 'photos' &&
      <UploadButton t={t} />
    }
    {viewType === 'albums' &&
      <button class={classNames('coz-btn', 'coz-btn--secondary', styles['coz-btn--album'])}>{t('Toolbar.new_album')}</button>
    }
  </div>
)

export default translate()(Toolbar)
