/** @jsxImportSource @emotion/react */
import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectSelectedId, selectSelectedEntity } from '../redux/content'

import { useMap, Polygon, Polyline, Marker } from 'react-leaflet'
import { flyToOptions } from './config'

// https://github.com/PaulLeCam/react-leaflet/issues/453
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css' // Re-uses images from ~leaflet package
import * as L from 'leaflet'
import 'leaflet-defaulticon-compatibility'

const styles = {
  pathOptions: { color: 'deepskyblue' },
}

// ! Preventing unnecessary re-rendering
// Since selectedEntity somehow gets a new reference even though neither of its 3 properties changed,
// I cheat useMemo here to depend only on selectedId in spite of returning the selectedEntity object.
// This forces memoizedSelectedEntity to maintain the same reference, dependent only on selectedId.
//
// It's done to avoid re-rendering SelectedGeo unless selected entity has changed;
// which, besides being wasteful, makes the map shiver.

const SelectedGeo = () => {
  const map = useMap()
  const selectedId = useSelector(selectSelectedId)
  const selectedEntity = useSelector(selectSelectedEntity)
  const memoizedSelectedEntity = useMemo(() => selectedEntity, [selectedId])

  useEffect(() => {
    if (!map || !selectedId || !memoizedSelectedEntity) return

    const { type, coordinates } = memoizedSelectedEntity
    const polygon = type === 'Point' ? [coordinates] : coordinates

    map.flyToBounds(L.polygon(polygon).getBounds(), flyToOptions)
  }, [map, selectedId, memoizedSelectedEntity])

  if (!selectedEntity) return null
  const { id, type, coordinates } = selectedEntity

  const positions = coordinates

  const eventHandlers = {
    click: () => {
      console.log(`${id} clicked`)
    },
  }
  const { pathOptions } = styles

  switch (type) {
    case 'Polygon':
      return <Polygon {...{ positions, eventHandlers, pathOptions }} />
    case 'Point':
      return <Marker {...{ position: positions, eventHandlers, pathOptions }} />
    case 'LineString':
      return <Polyline {...{ positions, eventHandlers, pathOptions }} />
    default:
      return <Polygon {...{ positions, eventHandlers, pathOptions }} />
  }
}

export default SelectedGeo
