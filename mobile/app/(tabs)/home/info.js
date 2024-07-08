import { Pressable, StyleSheet, Text, View, TextInput, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { SimpleLineIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { BottomModal } from "react-native-modals";
import { ModalTitle, ModalContent } from "react-native-modals";
import { SlideAnimation } from "react-native-modals";
import api from "../../../api/axiosconfig";



const info = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState(params?.title);
  const [content, setContent] = useState(params?.content);
  const [category, setCategory] = useState(params?.category);

  const handleCategoryOption = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  const editJournal = async () => {
    try {
      const journalData = {
        title: title,
        content: content,
        category: category,
      };


      const response = await api.put(`journal/entries/${params.id}/`, journalData);
      if (response.status === 200) {
        Alert.alert('Journal Entry Updated', 'Your journal entry has been successfully updated.');
        console.log('Journal entry updated:', response.data);
        // Optionally navigate to another screen or update state as needed
        router?.push("/home")
      } else {
        Alert.alert('Error', 'Failed to update journal entry. Please try again later.');
        console.error('Failed to update journal entry:', response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request setup error:', error.message);
      }
      Alert.alert('Error', 'Failed to update journal entry. Please try again later.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Ionicons name="md-arrow-back" size={24} color="black" onPress={() => router.push('/home')} />
      </View>

      <View style={{ marginTop: 5 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>
          Category - {params?.category}
        </Text>
      </View>

      <Text style={{ marginTop: 20, fontSize: 17, fontWeight: "600" }}>
        {params?.title}
      </Text>

      <Text style={{ marginTop: 20, fontSize: 17, fontWeight: "600" }}>
        {params?.content}
      </Text>

      <View style={{ marginTop: 50 }} />

      <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 5 }} onPress={() => setModalVisible(!isModalVisible)}>
        <SimpleLineIcons name="note" size={24} color="black" />
        <Text style={{ color: "#7CB9E8", fontSize: 16, fontWeight: "500" }}>
          Edit Journal
        </Text>
      </Pressable>

      <View style={{ marginTop: 15 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
            <AntDesign name="calendar" size={24} color="black" />
            <Text>Date Added</Text>
          </View>

          <Pressable
            style={{ backgroundColor: "#F0F0F0", padding: 7, borderRadius: 6 }}
          >
            <Text>{params?.createdAt}</Text>
          </Pressable>
        </View>
      </View>

      <BottomModal
        onBackdropPress={() => setModalVisible(!isModalVisible)}
        onHardwareBackPress={() => setModalVisible(!isModalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalTitle={<ModalTitle title="Add a Journal" />}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        visible={isModalVisible}
        onTouchOutside={() => setModalVisible(!isModalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 380 }}>
        <Text>Enter Title</Text>
          <View
            style={{
              marginVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Input journal title"
              style={{
                padding: 10,
                borderColor: "#E0E0E0",
                borderWidth: 1,
                borderRadius: 5,
                flex: 1,
              }}
            />
          </View>

          <Text>Enter Journal</Text>

          <View
            style={{
              marginVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Input journal content here"
              style={{
                padding: 10,
                borderColor: "#E0E0E0",
                borderWidth: 1,
                borderRadius: 5,
                flex: 1,
              }}
            />
            <Ionicons onPress={editJournal} name="send" size={24} color="#007FFF" />
          </View>

          <Text>Choose Category</Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginVertical: 10,
            }}
          >
            <Pressable
              onPress={() => handleCategoryOption('Work')}
              style={{
                borderColor: (category) === 'Work' ? '#4F4F4F' : '#E0E0E0',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderWidth: 1,
                borderRadius: 25,
              }}
            >
              <Text>Work</Text>
            </Pressable>
            <Pressable
              onPress={() => handleCategoryOption('Personal')}
              style={{
                borderColor: (category) === 'Personal' ? '#4F4F4F' : '#E0E0E0',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderWidth: 1,
                borderRadius: 25,
              }}
            >
              <Text>Personal</Text>
            </Pressable>
            <Pressable
              onPress={() => handleCategoryOption("Travel")}
              style={{
                borderColor: (category) === 'Travel' ? '#4F4F4F' : '#E0E0E0',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderWidth: 1,
                borderRadius: 25,
              }}
            >
              <Text>Travel</Text>
            </Pressable>
          </View>
        </ModalContent>
      </BottomModal>
      
    </View>
  );
};

export default info;

const styles = StyleSheet.create({});
