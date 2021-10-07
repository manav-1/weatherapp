import React from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

function FiveDayWeatherForeCast({ current, name, date }) {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1542522588986-fe2a9c2affe6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=100",
      }}
      style={[StyleSheet.absoluteFill, { padding: 10 }]}
    >
      <ScrollView>
        <Text style={styles.title}>
          {name} <Icon name="map-marker" size={15} />
        </Text>
        <Text
          style={{ fontFamily: "karlaLight", fontSize: 18, color: "white" }}
        >
          8 Day Weather Forecast
        </Text>
        {current.map((item, index) => (
          <DayWeatherForecast weather={item} key={index} />
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

function DayWeatherForecast({ weather }) {
  const date = new Date(weather.dt * 1000).toDateString();
  const icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <View style={styles.weatherContainer}>
      <Text style={styles.weatherTitle}>
        {weather.temp.day} °C , {weather.weather[0].main}
      </Text>
      <Text style={styles.heading}>Min Temp </Text>
      <Text style={styles.text}>{weather.temp.min} °C</Text>
      <Text style={styles.heading}>Max Temp </Text>
      <Text style={styles.text}>{weather.temp.max} °C</Text>
      <Text style={styles.heading}>Feels Like</Text>
      <Text style={styles.text}>{weather.feels_like.day} °C</Text>
      <Text style={styles.heading}>Pressure</Text>
      <Text style={styles.text}>{weather.pressure}</Text>
      <Text style={styles.heading}>Humidity</Text>
      <Text style={styles.text}>{weather.humidity}</Text>
      <Image style={styles.img} source={{ uri: icon }} />

      <Text style={styles.date}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  weatherContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.3))",
    borderRadius: 10,
    position: "relative",
  },
  title: {
    fontSize: 35,
    fontFamily: "karlaMedium",
    color: "#fff",
  },
  date: {
    position: "absolute",
    top: 5,
    right: 5,
    fontFamily: "karlaMedium",
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#000A",
    padding: 5,
    borderRadius: 5,
  },
  heading: {
    fontFamily: "karlaMedium",
    fontSize: 15,
    color: "#fff",
  },
  text: {
    fontFamily: "karlaMedium",
    fontSize: 25,
    color: "#fff",
    marginBottom: 10,
  },
  weatherTitle: {
    backgroundColor: "#000A",
    fontSize: 30,
    fontFamily: "karlaBold",
    color: "#fff",
    marginBottom: 10,
    padding: 8,
    position: "absolute",
    bottom: 5,
    right: 5,
    borderRadius: 8,
  },
  img: {
    width: 100,
    height: 100,
    position: "absolute",
    top: "50%",
    right: 5,
  },
});

export default FiveDayWeatherForeCast;
