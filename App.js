import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
} from "react-native";
import CurrentWeather from "./components/CurrentWeather";
import FiveDayForecast from "./components/FiveDayForecast";
import Constants from "expo-constants";
import * as Location from "expo-location";
import axios from "axios";
import { BottomNavigation } from "react-native-paper";
import {
  DefaultTheme,
  Provider as PaperProvider,
  Button,
} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Font from "expo-font";
import NetInfo from "@react-native-community/netinfo";

Font.loadAsync({
  karla: require("./assets/fonts/karla/Karla-Regular.ttf"),
  karlaLight: require("./assets/fonts/karla/Karla-Light.ttf"),
  karlaMedium: require("./assets/fonts/karla/Karla-Medium.ttf"),
  karlaBold: require("./assets/fonts/karla/Karla-Bold.ttf"),
  montserrat: require("./assets/fonts/Montserrat/Montserrat-Regular.ttf"),
});

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [name, setName] = useState("Pitampura");
  const [main, setMain] = useState({});
  const [weather, setWeather] = useState({});
  const [hourly, setHourly] = useState({});
  const [fiveDayForecast, setFiveDayForecast] = useState({});
  const [result, setResult] = useState(false);
  const [refresh, setRefresh] = useState(false);
  var date = new Date().toDateString();
  const [network, setNetwork] = useState(false);

  const LOCATION_API = "YOUR API KEY";
  const WEATHER_API = "YOUR API KEY";
  // Subscribe

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android" && !Constants.isDevice) {
        setErrorMsg(
          "Oops, this will not work on Snack in an Android emulator. Try it on your device!"
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const unsubscribe = NetInfo.addEventListener((state) => {
        setNetwork(state.isConnected);
        // setNetwork(false);
        // setTimeout(() => setNetwork(true), 3000);
      });

      // Unsubscribe
      unsubscribe();
      await Location.watchPositionAsync({ enableHighAccuracy: true }, (loc) => {
        setLocation(loc);
        // ? reverse geocoding for the name
        axios
          .get(
            `https://us1.locationiq.com/v1/reverse.php?key=${LOCATION_API}&lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&format=json&zoom=14&namedetails=1&addressdetails=1`
          )
          .then((resp) => {
            setName(resp.data.display_name.split(",").slice(0, 2).join(" "));
          });
        // ? open weather map for weather info for that location
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&exclude=current,minutely,alerts&appid=${WEATHER_API}&units=metric`
          )
          .then((resp) => {
            setHourly(resp.data.hourly);
            setMain({
              temp: resp.data.daily[0].temp,
              feels_like: resp.data.daily[0].feels_like,
              humidity: resp.data.daily[0].humidity,
              pressure: resp.data.daily[0].pressure,
            });
            setWeather(resp.data.daily[0].weather[0]);
            setFiveDayForecast(resp.data.daily);
            setResult(true);
          });
      });
    })();
  }, [refresh]);
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: "#212121",
      accent: "#F0A500",
    },
  };
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "current",
      title: "Current Weather",
      icon: (props) => <Icon {...props} name="bolt" size={20} />,
    },
    {
      key: "eight",
      title: "8 Day Forecast",
      icon: (props) => <Icon {...props} name="cloud" size={20} />,
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    current: () => (
      <CurrentWeather
        name={name}
        main={main}
        weather={weather}
        result={result}
        date={date}
        hourly={hourly}
      />
    ),
    eight: () => (
      <FiveDayForecast current={fiveDayForecast} name={name} date={date} />
    ),
  });

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        {network ? (
          <>
            <SafeAreaView></SafeAreaView>
            <BottomNavigation
              navigationState={{ index, routes }}
              onIndexChange={setIndex}
              renderScene={renderScene}
            />
          </>
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Image
              source={require("./assets/notConnected.gif")}
              style={{ width: "100%" }}
            />
            <Text style={{ fontSize: 20, fontFamily: "karlaMedium" }}>
              Connect to the internet
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={{ position: "absolute", top: "6%", right: "3%" }}
          onPress={() => setRefresh(!refresh)}
        >
          <Icon name="refresh" size={20} />
        </TouchableOpacity>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
