import styles from '../styles/nav'

import React from 'react'
import { translate } from '../lib/I18n'
import { Link } from 'react-router'
import classNames from 'classnames'

export const Nav = ({ t }) => (
  <nav>
    <ul className={styles['coz-nav']}>
      <li className={styles['coz-nav-item']}>
        <Link to='/photos' className={classNames(styles['coz-nav-link'], styles['pho-cat-photos'])} activeClassName={styles['active']}>
          { t('Nav.photos') }
        </Link>
      </li>
      <li className={styles['coz-nav-item']}>
        <Link to='/albums' className={classNames(styles['coz-nav-link'], styles['pho-cat-albums'])} activeClassName={styles['active']}>
          { t('Nav.albums') }
        </Link>
      </li>
      <li className={styles['coz-nav-item']}>
        <Link to='/shared' className={classNames(styles['coz-nav-link'], styles['pho-cat-shared'])} activeClassName={styles['active']}>
          { t('Nav.shared') }
        </Link>
      </li>
      <li className={styles['coz-nav-item']}>
        <Link to='/trash' className={classNames(styles['coz-nav-link'], styles['pho-cat-trash'])} activeClassName={styles['active']}>
          { t('Nav.trash') }
        </Link>
      </li>
    </ul>
  </nav>
)

export default translate()(Nav)
