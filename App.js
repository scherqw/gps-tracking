import React, { useEffect, useState } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, View, Button, TouchableHighlight, Text } from 'react-native';
import * as Location from 'expo-location';

export default function App() {

  const [locationData, setLocationData] = useState({
    current: null,
    previous: null,
  });


  const userLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted"){
      setErrorMsg("Permission to access location was denied")
    }

    const init_loc = await Location.getCurrentPositionAsync({});
    
    setLocationData({
      current: {
        latitude: init_loc.coords.latitude,
        longitude: init_loc.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },

      previous: null,
    })

    await Location.watchPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,
      distanceInterval: 1,
    },

    (location) => {

      const updatedData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setLocationData((prevData) => {
        return {
          previous: prevData.current,
          current: updatedData,
        }
      });

    }
  );
};

  // Distance Calculation:
  // Option 1:
  // Using Haversine formula:
  // d = 2r arcsin(sqrt(sin²((lat2-lat1)/2) + cos(lat1)cos(lat2)sin²((lon2-lon1)/2)))
  // d : distance between two points in km
  // r : radius of the Earth (6371km)
  // lat1, lon1 : latitude and longitude of the first point
  // lat2, lon2 : latitude and longitude of the second point
  // Option 2:
  // Geolib library

  useEffect(() => {
    userLocation();
  }, []);


  return (
    <View style={styles.container}>
      <MapView style={styles.map} 
        region={locationData.current}
      >
       <Marker coordinate={locationData.current} title='Current Location'></Marker>
      </MapView>
      {/* <TouchableHighlight onPress={userLocation}>
        <View style={styles.button}>
          <Text>Get Location</Text>
        </View>
      </TouchableHighlight> */}
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
