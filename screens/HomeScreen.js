import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [locationData, setLocationData] = useState({
    current: null,
    previous: null,
  });

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.warn("Permission to access location was denied");
      return;
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
    });

    await Location.watchPositionAsync(
      {
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

        setLocationData((prevData) => ({
          previous: prevData.current,
          current: updatedData,
        }));
      }
    );
  };

  useEffect(() => {
    userLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={locationData.current}>
        {locationData.current && (
          <Marker
            coordinate={locationData.current}
            title="Current Location"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
