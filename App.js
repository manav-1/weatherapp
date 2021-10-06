import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
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
  const [fiveDayForecast, setFiveDayForecast] = useState({});
  const [result, setResult] = useState(false);
  const [refresh, setRefresh] = useState(false);
  var date = new Date().toDateString();

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
      await Location.watchPositionAsync({ enableHighAccuracy: true }, (loc) => {
        setLocation(loc);
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=293e6dbc78a29a8c30c6a158449c0ebb&units=metric`
          )
          .then((res) => {
            setName(res.data.name);
            setMain(res.data.main);
            setWeather(res.data.weather[0]);
            setResult(true);
          });
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&exclude=current,minutely,hourly,alerts&appid=293e6dbc78a29a8c30c6a158449c0ebb&units=metric`
          )
          .then((resp) => {
            setFiveDayForecast(resp.data);
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
      />
    ),
    eight: () => (
      <FiveDayForecast current={fiveDayForecast} name={name} date={date} />
    ),
  });

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <SafeAreaView></SafeAreaView>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
        />
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
