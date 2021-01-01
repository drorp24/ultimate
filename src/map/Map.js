/** @jsxImportSource @emotion/react */

import SelectedGeo from './SelectedGeo'

import 'leaflet/dist/leaflet.css'
import { MapContainer, WMSTileLayer, LayersControl } from 'react-leaflet'
import { tileProviders, locations } from './config'

const styles = {
  map: {
    height: '100%',
    overflow: 'hidden',
  },
}

const Map = () => (
  <MapContainer
    center={locations.home}
    zoom={11}
    scrollWheelZoom={false}
    css={styles.map}
  >
    <LayersControl>
      {tileProviders.map(({ name, checked, args }) => (
        <LayersControl.BaseLayer {...{ name, checked }} key={name}>
          <WMSTileLayer {...{ ...args }} />
        </LayersControl.BaseLayer>
      ))}
    </LayersControl>
    <SelectedGeo />
  </MapContainer>
)

export default Map
