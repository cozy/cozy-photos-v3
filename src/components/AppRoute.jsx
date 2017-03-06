import React from 'react'
import { Route, Redirect } from 'react-router'

import Timeline from '../containers/Timeline'
import AlbumList from '../components/AlbumList'
import Viewer from '../containers/Viewer'

import App from './App'
export const ComingSoon = () => (<p style='margin-left: 2em'>Coming soon!</p>)

const AppRoute = (
  <Route component={App}>
    <Redirect from='/' to='photos' />
    <Route path='photos' component={Timeline}>
      <Route path=':photoId' component={Viewer} />
    </Route>
    <Route path='albums' component={AlbumList} />
    <Route path='shared' component={ComingSoon} />
    <Route path='trash' component={ComingSoon} />
  </Route>
)

export default AppRoute
