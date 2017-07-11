import styles from '../styles/nav'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { Link } from 'react-router'

import classNames from 'classnames'

const navigation = [
  {
    iconClass: 'pho-cat-photos',
    labelKey: 'Nav.photos',
    route: '/photos'
  },
  {
    iconClass: 'pho-cat-albums',
    labelKey: 'Nav.albums',
    route: '/abums'
  }
]

const NavItem = ({ t, iconClass, labelKey, route }) => (
  <li className={styles['coz-nav-item']}>
    <Link to={route} className={classNames(styles[iconClass], styles['coz-nav-link'])} activeClassName={styles['active']}>
      { t(labelKey) }
    </Link>
  </li>
)

export const Nav = ({ t }) => (
  <nav>
    <ul className={styles['coz-nav']}>
      {navigation.map(item => (
        <NavItem t={t} {...item} />
      ))}
    </ul>
  </nav>
)

export default translate()(Nav)
