import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { translate } from 'cozy-ui/react/I18n'
import { openAddToAlbum, removeFromAlbum, getAlbum } from '../ducks/albums'
import { SelectionBar } from '../ducks/selection'
import Alerter from '../components/Alerter'
import confirm from '../lib/confirm'
import { DeleteConfirm, deletePhotos } from '../ducks/timeline'

const getAlbumId = (router) => {
  return router.params.albumId
}

const mapStateToProps = (state, ownProps) => ({
  album: getAlbumId(ownProps.router) ? getAlbum(state, getAlbumId(ownProps.router)) : undefined
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: {
    'album-add': {
      action: selected => dispatch(openAddToAlbum(selected))
    },
    'delete': {
      action: selected => confirm(<DeleteConfirm t={ownProps.t} count={selected.length} related={false} />,
        () => dispatch(deletePhotos(selected))
      ),
      displayCondition: () => ownProps.router.location.pathname.startsWith('/photos')
    },
    'album-remove': {
      action: selected => dispatch(removeFromAlbum(ownProps.album, selected))
        .then(() => Alerter.success('Albums.remove_photos.success', { album_name: ownProps.album.name }))
        .catch(() => Alerter.error('Albums.remove_photos.error.generic')),
      displayCondition: () => getAlbumId(ownProps.router) !== undefined
    }
  }
})

export default translate()(withRouter(connect(mapStateToProps, mapDispatchToProps)(SelectionBar)))