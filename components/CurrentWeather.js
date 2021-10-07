import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
  ImageBackground,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";

function CurrentWeatherForecast({ name, main, weather, result, date, hourly }) {
  const [refresh, setRefresh] = useState(false);
  const icon = `https://openweathermap.org/img/wn/${weather.icon}@4x.png`;

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  return result ? (
    <ImageBackground
      style={StyleSheet.absoluteFill}
      resize="cover"
      source={{
        uri: "https://images.unsplash.com/photo-1530908295418-a12e326966ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=100",
      }}
    >
      <ScrollView
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgba(200,200,200, 0.4)", padding: 20 },
        ]}
      >
        <Text style={styles.title}>
          {name} <Icon name="map-marker" size={10} />
        </Text>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 20,
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 80, fontFamily: "karlaBold", marginRight: 10 }}
          >
            {main.temp.day.toFixed(1)}
          </Text>
          <Text style={{ fontSize: 28, fontFamily: "karlaMedium" }}>
            °C{"\n"}
            {weather.main}
          </Text>
        </View>
        <Text style={{ fontFamily: "karlaMedium", fontSize: 16 }}>
          {date}, {main.temp.max.toFixed(1)} °C / {main.temp.min.toFixed(1)} °C
        </Text>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image style={styles.img} source={{ uri: icon }} />
        </View>

        <View>
          <Text style={[styles.center, styles.centerHeading]}>
            Hourly Forecast (48 Hours)
          </Text>
          <ScrollView style={styles.hourly} horizontal={true}>
            {hourly.map((item, index) => {
              const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`;
              return (
                <View key={index} style={styles.hourContainer}>
                  <Text style={{fontFamily:'karlaMedium'}}>{formatAMPM(new Date(item.dt * 1000))}</Text>
                  <Text style={{fontSize: 13, fontFamily: 'karlaLight'}}>{item.weather[0].main}</Text>
                  <Image
                    source={{ uri: iconUrl }}
                    style={{ height: 50, width: 50 }}
                  />

                  <Text style={{fontFamily:'karlaMedium'}}>{item.temp} °C</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.tempContainer}>
          <View>
            <Text style={[styles.center, styles.centerHeading]}>Max</Text>
            <Text style={styles.center}>{main.temp.max.toFixed(1)} °C</Text>
          </View>
          <View>
            <Text style={[styles.center, styles.centerHeading]}>Min</Text>
            <Text style={styles.center}>{main.temp.min.toFixed(1)} °C</Text>
          </View>
        </View>

        <View style={styles.tempContainer}>
          <View>
            <Text style={[styles.center, styles.centerHeading]}>Humidity </Text>
            <Text style={styles.center}>{main.humidity}</Text>
          </View>
          <View>
            <Text style={[styles.center, styles.centerHeading]}>Pressure </Text>
            <Text style={styles.center}>{main.pressure}</Text>
          </View>
        </View>
        <View style={styles.tempContainer}>
          <View>
            <Text style={[styles.center, styles.centerHeading]}>
              Feels Like{" "}
            </Text>
            <Text style={styles.center}>
              {main.feels_like.day.toFixed(1)} °C
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  ) : null;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontFamily: "karlaMedium",
  },
  center: {
    textAlign: "center",
    fontWeight: "600",
    fontFamily: "karlaMedium",
    fontSize: 22,
  },
  tempContainer: {
    marginTop: 30,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  img: {
    width: 200,
    height: 200,
    margin: "auto",
  },
  imgText: {
    fontSize: 25,
  },
  centerHeading: { fontFamily: "karlaBold", fontSize: 30 },
  hourContainer: {
    backgroundColor: "rgba(255,255,255,0.5)",
    marginRight: 10,
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    width: 90,
  },
  hourly: {
    marginTop: 25,
  },
});

export default CurrentWeatherForecast;
