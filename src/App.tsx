import React from 'react';
import {View, Text} from 'react-native';
import styles from './styles';

import MapboxGL from '@rnmapbox/maps';
//android
MapboxGL.setWellKnownTileServer('Mapbox');
//ios
//MapboxGL.setWellKnownTileServer('maplibre');
//or
//MapboxGL.setWellKnownTileServer('mapbox');

MapboxGL.setAccessToken('MAPBOX_TOKEN');

function App(): JSX.Element {
  //declare coords
  type coords = {
    lat: number;
    lon: number;
  };

  type marker = {
    id: number;
    coords: coords;
  };

  const [markers, setMarkers] = React.useState(new Array<marker>());
  const [idMarker, setIdMarker] = React.useState(0);

  //add marker to array
  const addMarker = (m: marker) => {
    setMarkers([...markers, m]);
    setIdMarker(idMarker + 1);
  };

  const setMarkerPosition = (index: number, lat: number, lon: number) => {
    const newMarkers: marker[] = [...markers];
    const c: coords = {lat: lat, lon: lon};
    newMarkers[index] = {
      ...newMarkers[index],
      coords: c,
    };
    setMarkers(newMarkers);
  };

  return (
    <View style={{flex: 1}}>
      <MapboxGL.MapView
        id={'map'}
        style={{flex: 1}}
        onPress={e => {
          addMarker({
            id: idMarker,
            coords: {
              lat: e.geometry.coordinates[0],
              lon: e.geometry.coordinates[1],
            },
          });
        }}>
        <MapboxGL.UserLocation
          visible={true}
          renderMode={'native'}
          showsUserHeadingIndicator={true}
          showsUserLocation={true}
          animated={true}
          zIndex={100}
          layerIndex={100}
        />
        <MapboxGL.Camera zoomLevel={8} />
        {markers.length > 1 ? (
          <MapboxGL.ShapeSource
            id={'line'}
            key={'line'}
            shape={{
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: markers.map((marker: marker) => {
                      return [marker.coords.lat, marker.coords.lon];
                    }),
                  },
                },
              ],
            }}>
            <MapboxGL.LineLayer
              id={'lineLayer'}
              key={'lineLayer'}
              style={styles.lineLayer}
            />
          </MapboxGL.ShapeSource>
        ) : null}

        {markers.map((marker: marker, index: number) => {
          return (
            <MapboxGL.PointAnnotation
              id={'marker' + index}
              key={'marker' + index}
              coordinate={[marker.coords.lat, marker.coords.lon]}
              draggable
              onDragEnd={(e) => {
                setMarkerPosition(
                  index,
                  e.geometry.coordinates[0],
                  e.geometry.coordinates[1],
                );
              }}>
              <View style={styles.marker}>
                <Text style={styles.markerText}>{index + 1}</Text>
              </View>
            </MapboxGL.PointAnnotation>
          );
        })}
      </MapboxGL.MapView>
    </View>
  );
}

export default App;
