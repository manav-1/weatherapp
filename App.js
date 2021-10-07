import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Platform
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
  const [hourly, setHourly] = useState({});
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
            `https://us1.locationiq.com/v1/reverse.php?key=${YOUR_APP_KEY}&lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&format=json`
          )
          .then((resp) => {
            setName(
              (resp.data.address.suburb
                ? resp.data.address.suburb
                : resp.data.address.town) +
                ", " +
                resp.data.address.state
            );
          });
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&exclude=current,minutely,alerts&appid=${YOUR_APP_KEY}&units=metric`
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
