// import styles from '../styles/albumList'

import React from 'react'
import { translate } from '../lib/I18n'

import Empty from '../components/Empty'
import Topbar from '../components/Topbar'

export const PhotosList = ({ t }) => {
  return (
    <div>
      <Topbar viewName='albums' />
      <div role='contentinfo'>
        <Empty emptyType='albums' />
      </div>
    </div>
  )
}

export default translate()(PhotosList)
