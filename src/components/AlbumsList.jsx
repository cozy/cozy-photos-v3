import styles from '../styles/albumsList'

import React from 'react'

import { withEmpty } from '../components/Empty'
import AlbumItem from '../components/AlbumItem'
import NewAlbum from '../components/NewAlbum'

const DumbAlbumsList = props => (
  <div className={styles['pho-album-list']}>
    {props.albums.map((a) => <AlbumItem album={a} key={a._id} onServerError={props.onServerError} />)}
    <NewAlbum />
  </div>
)

const AlbumsList = withEmpty(props => props.albums.length === 0, 'albums', DumbAlbumsList)

export default AlbumsList
