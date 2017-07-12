import React from 'react'
import { Route, Redirect } from 'react-router'

import Layout from './Layout'
import Timeline from '../containers/Timeline'
import AlbumsView from '../containers/AlbumsView'
import SharedByMeAlbumsView from '../containers/SharedByMeAlbumsView'
import AlbumPhotos from '../containers/AlbumPhotos'
import Viewer from '../components/Viewer'

export const ComingSoon = () => (<p style='margin-left: 2em'>Coming soon!</p>)

const AppRoute = (
  <Route component={Layout}>
    <Route path='photos' component={Timeline}>
      <Route path=':photoId' component={Viewer} />
    </Route>
    <Route path='albums' component={AlbumsView}>
      <Route path=':albumId' component={AlbumPhotos}>
        <Route path=':photoId' component={Viewer} />
      </Route>
    </Route>
    <Route path='sharedbyme' component={SharedByMeAlbumsView}>
      <Route path=':albumId' component={AlbumPhotos}>
        <Route path=':photoId' component={Viewer} />
      </Route>
    </Route>
    <Redirect from='/*' to='photos' />
  </Route>
)

export default AppRoute
