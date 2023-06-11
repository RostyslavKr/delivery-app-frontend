import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

import { getBrovserLocation } from '../../utils/geo';

import css from './Map.module.css';

const containerStyle = {
  width: '700px',
  height: '550px',
};
const defaultOptions = {
  panControl: true,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  clickableIcons: false,
  keyboardShortcuts: false,
  scrollwheel: false,
  disableDoubleClickZoom: true,
  fullscreenControl: false,
};

const Map = ({ center }) => {
  const mapRef = useRef(undefined);
  const [markers, setMarker] = useState([]);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [origin, setOrigin] = useState([]);
  const [destination, setDestination] = useState([]);
  const [distance, setDistance] = useState([]);
  const [duration, setDuration] = useState('');

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const geocoder = new google.maps.Geocoder();
    // eslint-disable-next-line no-undef

    geocoder.geocode({ latLng: markers[0] }, function (results, status) {
      // eslint-disable-next-line no-undef
      if (status === google.maps.GeocoderStatus.OK) {
        const add = results[0].formatted_address;
        setDestination(add);
      }
    });
    geocoder.geocode({ latLng: center }, function (results, status) {
      // eslint-disable-next-line no-undef
      if (status === google.maps.GeocoderStatus.OK) {
        const add = results[0].formatted_address;
        setOrigin(add);
      }
    });
  }, [markers, center]);

  const calculateRoute = async () => {
    if (origin === [null] || destination === [null]) {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService();
    const results = await directionService.route({
      origin: origin,
      destination: destination,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  };

  const cleanRoute = () => {
    setDirectionsResponse(null);
    setDistance([]);
    setDuration('');
  };

  const onClickGeolocation = () => {
    if (directionsResponse) {
      return;
    }
    getBrovserLocation()
      .then(curLoc => {
        setMarker([curLoc]);
      })
      .catch(err => setMarker(err));
  };

  const onMapClick = e => {
    if (directionsResponse) {
      return;
    }
    setMarker([
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      },
    ]);
  };

  const onLoad = useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(function callback(map) {
    mapRef.current = undefined;
  }, []);

  return (
    <div className={css.container}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={defaultOptions}
        onClick={onMapClick}
      >
        <Marker position={center} />
        {markers.length !== 0 &&
          markers.map(marker => (
            <Marker
              key={marker.lat}
              position={{
                lat: marker.lat,
                lng: marker.lng,
              }}
            />
          ))}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
      {directionsResponse && (
        <div className={css.itemInfoDelivery}>
          <p>Time delivery: {duration}</p>
          <p>Distance: {distance}</p>
          <button onClick={cleanRoute}>Clean route</button>
        </div>
      )}
      <button className={css.calculateRouteButton} onClick={calculateRoute}>
        Calculate route
      </button>
      <button
        className={css.geoLocationButton}
        onClick={onClickGeolocation}
      ></button>
    </div>
  );
};
export default Map;
