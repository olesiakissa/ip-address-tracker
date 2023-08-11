import {
  MapContainer,
  TileLayer,
  Marker
} from 'react-leaflet'

const Map = ({latitude, longitude, cacheData}) => {
    const position = latitude && longitude ? [latitude, longitude] : [cacheData?.positionLat, cacheData?.positionLng]

    return (
        <div id="map">
        {position && (
            <MapContainer
                key={JSON.stringify([latitude, longitude])}
                center={position}
                zoom={13}
                scrollWheelZoom={true}>
            <TileLayer 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker position={position}>
            </Marker>
        </MapContainer>
        )}
        
    </div>
    )
}

export default Map