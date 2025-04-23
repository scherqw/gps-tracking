import React, { useEffect, useState } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, View, Button, TouchableHighlight, Text } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  })

  const [displayCoords, setDisplayCoords] = useState('');

  const userLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted"){
      setErrorMsg("Permission to access location was denied")
    }
    await Location.watchPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,
      distanceInterval: 1,
    },

    (location) => {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      setDisplayCoords(`Latitude: ${location.coords.latitude}\nLongitude: ${location.coords.longitude}`)
    }
  );
};

  useEffect(() => {
    userLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} 
        region={mapRegion}
      >
       <Marker coordinate={mapRegion} title='Current Location'></Marker>
      </MapView>
      {/* <TouchableHighlight onPress={userLocation}>
        <View style={styles.button}>
          <Text>Get Location</Text>
        </View>
      </TouchableHighlight> */}
      <Text style={styles.lati_longi}>{displayCoords}</Text>
      {/* console.log(location.coords.latitude, location.coords.longitude) */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '50%',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#89CFF0',
    padding: 10,
  },
  lati_longi: {
    fontSize: 20
  }
});
