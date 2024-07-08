import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { Calendar } from "react-native-calendars";
import { FontAwesome, Feather, MaterialIcons } from "@expo/vector-icons";
import api from "../../../api/axiosconfig";
import { useRouter } from "expo-router";



const index = () => {
  const today = moment().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(today);
  const [journals, setJournals] = useState([]);
  const router = useRouter();

  const fetchJournals = async () => {
    try {
      const response = await api.get(
        `journal/entries/by-date?date=${selectedDate}`
      );

      const journalEntries = response.data || [];
      console.log("Journal Entries", journalEntries);
      setJournals(journalEntries);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchJournals();
  }, [selectedDate]);
  console.log(journals);
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#7CB9E8" },
        }}
      />

      <View style={{ marginTop: 20 }} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          marginVertical: 10,
          marginHorizontal: 10,
        }}
      >
        <Text>Journal Entries:</Text>
      </View>

      {journals?.map((item, index) => (
        <Pressable
        onPress={() => {
          router?.push({
            pathname: "/home/info",
            params: {
              id: item.id,
              title: item?.title,
              category: item?.category,
              createdAt: item?.date,
              content: item?.content,
            },
          });
        }}

          style={{
            backgroundColor: "#E0E0E0",
            padding: 10,
            borderRadius: 7,
            marginVertical: 10,
            marginHorizontal: 10,
          }}
          key={index}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <FontAwesome name="circle" size={18} color="black" />
            <Text
              style={{
                flex: 1,
                color: "black",
              }}
            >
              {item?.title}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
