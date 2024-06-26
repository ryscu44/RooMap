import React, { useState, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import Dropdown from "@/components/Dropdown";

interface Marker {
  latitude: number;
  longitude: number;
}

const initialMarkers = [
  {
    latitude: -37.753,
    longitude: 145.0516,
  },
];

export default function App() {
  let userCoords = {
    latitude: 0.0001,
    longitude: 0.0001,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    axios
      .get("http://10.0.2.2:5000/getItems")
      .then((markers) => setMarkers(markers.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Please grant location permissions");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log("Location");
      console.log(currentLocation);
    };
    getPermissions();
  }, []);

  const [markers, setMarkers] = useState<Marker[]>([]);
  const [location, setLocation] = useState<LocationObject>();
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [alive, setAlive] = useState("null");
  const [pouch, setPouch] = useState("null");
  const [sex, setSex] = useState("null");
  const [joey, setJoey] = useState("null");
  const [joeyAlive, setJoeyAlive] = useState("null");
  const [userPos, setUserPos] = useState(userCoords);

  const aliveCheck = [
    { label: "Alive", value: "Alive" },
    { label: "Deceased", value: "Deceased" },
  ];
  const sexCheck = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];
  const pouchCheck = [
    { label: "Yes, with joey", value: "Yes, with joey" },
    { label: "Yes, without joey", value: "Yes, without joey" },
    { label: "No", value: "No" },
  ];
  const joeyCheck = [
    { label: "Jellybean (0-1 months)", value: "Jellybean (0-1 months)" },
    { label: "Pinkie (1-6 months)", value: "Pinkie (0-6 months)" },
    { label: "Velvet (6-9 months)", value: "Velvet (6-9 months)" },
    { label: "Furred (9-12 months)", value: "Furred (9-12 months)" },
    { label: "At foot (12+ months)", value: "At foot (12+ months)" },
  ];
  const joeyAliveCheck = [
    { label: "Euthanised (unviable)", value: "Euthanised (unviable)" },
    {
      label: "Euthanised (due to injury)",
      value: "Euthanised (due to injury)",
    },
    { label: "In rehabilitation ", value: "In rehabilitation" },
  ];

  const handleAliveValueChange = (alive: string) => {
    setAlive(alive);
    console.log(alive);
  };
  const handlePouchValueChange = (pouch: string) => {
    setPouch(pouch);
    console.log(pouch);
  };
  const handleSexValueChange = (sex: string) => {
    setSex(sex);
    console.log(sex);
  };
  const handleJoeyValueChange = (joey: string) => {
    setJoey(joey);
    console.log(joey);
  };
  const handleJoeyAliveValueChange = (joeyAlive: string) => {
    setJoeyAlive(joeyAlive);
    console.log(joeyAlive);
  };

  // const handleSubmit = async () => {
  //   if (location) {
  //     const newMarker: Marker = {
  //       latitude: location?.coords.latitude,
  //       longitude: location?.coords.longitude,
  //     };
  //     setMarkers([...markers, newMarker]);
  //     setModalVisible(false);
  //   } else {
  //     Alert.alert("Location is not available.");
  //   }
  // };

  const handleSubmit = async () => {
    if (location) {
      try {
        await axios.post("http://10.0.2.2:5000/addMarker", {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          alive: alive,
          pouch: pouch,
          sex: sex,
          joey: joey,
          joeyAlive: joeyAlive,
          userPos: userPos,
        });
        const newMarker: Marker = {
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
        };
        setMarkers([...markers, newMarker]);
        setModalVisible(false);
      } catch (error) {
        console.error("Error adding marker:", error);
        Alert.alert("Error adding marker");
      }
    } else {
      Alert.alert("Location is not available.");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        showsCompass
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={(e) => setDetailsModalVisible(true)}
          />
        ))}
      </MapView>
      <Pressable
        style={[styles.submitButton, styles.buttonClose]}
        onPress={() => setModalVisible(true)}
      >
        <View>
          <Text style={styles.addToMapStyle}>Add to map</Text>
        </View>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setDetailsModalVisible(!detailsModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Details Hello World!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setDetailsModalVisible(!detailsModalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <ScrollView contentContainerStyle={styles.modalScrollView}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>
                Latitude: {location?.coords.latitude}
                Longitude: {location?.coords.longitude}
              </Text>
              <Text style={styles.modalText}>Please select below</Text>
              <ScrollView style={{ maxHeight: 300, width: "100%" }}>
                <View>
                  <Text style={styles.dropdownText}>Status:</Text>
                  <Dropdown
                    style={pickerSelectStyles}
                    items={aliveCheck}
                    onValueChange={handleAliveValueChange}
                  />
                  <Text style={styles.dropdownText}>Sex:</Text>
                  <Dropdown
                    style={pickerSelectStyles}
                    items={sexCheck}
                    onValueChange={handleSexValueChange}
                  />
                  {sex === "Female" ? (
                    <>
                      <Text style={styles.dropdownText}>Pouch checked:</Text>
                      <Dropdown
                        style={pickerSelectStyles}
                        items={pouchCheck}
                        onValueChange={handlePouchValueChange}
                      />
                    </>
                  ) : null}

                  {pouch === "Yes, with joey" ? (
                    <>
                      <Text style={styles.dropdownText}>Joey age:</Text>
                      <Dropdown
                        style={pickerSelectStyles}
                        items={joeyCheck}
                        onValueChange={handleJoeyValueChange}
                      />
                    </>
                  ) : null}
                  <Text style={styles.dropdownText}>Joey status:</Text>

                  <Dropdown
                    style={pickerSelectStyles}
                    items={joeyAliveCheck}
                    onValueChange={handleJoeyAliveValueChange}
                  />
                </View>
                <Text style={styles.dropdownText}>Additional notes:</Text>
                <TextInput
                  style={pickerSelectStyles.inputIOS}
                  placeholder="Additional notes"
                />
              </ScrollView>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={handleSubmit}
              >
                <Text style={styles.textStyle}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
    height: "50%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
  },
  dropdownText: {
    marginTop: 25,
    textAlign: "center",
  },
  formLabel: {
    fontSize: 20,
    color: "#fff",
  },
  inputStyle: {
    marginTop: 20,
    width: 300,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: "#b9e4c9",
  },
  formText: {
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 20,
  },
  text: {
    color: "#fff",
    fontSize: 20,
  },

  dropdownStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "black",
    marginVertical: 25,
    fontSize: 20,
  },
  modalScrollView: {
    flexGrow: 1,
  },
  submitButton: {
    position: "absolute",
    top: 700,
    left: 130,
    alignContent: "center",
    borderRadius: 20,
    padding: 9,
    elevation: 2,
    width: 150,
    height: 50,
  },
  addToMapStyle: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
