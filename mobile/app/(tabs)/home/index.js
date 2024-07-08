import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewBase,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { BottomModal } from "react-native-modals";
import { ModalTitle, ModalContent } from "react-native-modals";
import { SlideAnimation } from "react-native-modals";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import moment from "moment";
import { useRouter } from "expo-router";
import api from "../../../api/axiosconfig";

const index = () => {
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const today = moment().format("MMM Do");
  const [isModalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [category, setCategory] = useState('Personal');
  const [todo, setTodo] = useState("");
  const [publishedJournals, setpublishedJournals] = useState([]);
  const [marked, setMarked] = useState(false);

  const handleCategoryOption = (selectedCategory) => {
    setCategory(selectedCategory);
  };
  const suggestions = [
    {
      id: "0",
      todo: "Drink Water, keep healthy",
    },
    {
      id: "1",
      todo: "Go Excercising",
    },
    {
      id: "2",
      todo: "Go to bed early",
    }

  ];
  const addJournal = async () => {
    try {
      // Fetch current user details from Django DRF API
      const currentUserResponse = await api.get('auth/users/current');
      const userId = currentUserResponse.data.id; 

      const journalData = {
        title: title,
        // content: content,
        content: todo,
        category: category,
        date: new Date().toISOString().split('T')[0], // Format date as YYYY-MM-DD
        user: userId, // Use retrieved user ID
      };
  

      const response = await api.post('journal/entries/', journalData);
      if (response.status === 201) {
        Alert.alert('Journal Entry Published', 'Your journal entry has been successfully published.');
        console.log('Journal entry published:', response.data);
        // Optionally navigate to another screen or clear form inputs
        setTitle('');
        setContent('');
        setCategory('');
        await getUserJournals();
        setModalVisible(false);
        setTodo("");
      } else {
        Alert.alert('Error', 'Failed to publish journal entry. Please try again later.');
        console.error('Failed to publish journal entry:', response.data);
      }


    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request setup error:', error.message);
      }
      Alert.alert('Error', 'Failed to publish journal entry. Please try again later.');
    }
  };

     
 
  useEffect(() => {
    getUserJournals();
  }, [marked, isModalVisible]);
  const getUserJournals = async () => {
    try {
      const response = await api.get(
        `journal/entries/`
      );

      setTodos(response.data);

      const fetchedJournals = response.data || [];

    
      const published = fetchedJournals.filter(
        (data) =>  data.published === true
      );
      
      setpublishedJournals(published);

    } catch (error) {
      console.log("error", error);
    }
  };
 
  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };


  return (
    <>
      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
      <Pressable
        style={{
          backgroundColor: selectedCategory === 'All' ? '#4F8DCC' : '#7CB9E8',
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => handleCategoryPress('All')}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>All</Text>
      </Pressable>
      <Pressable
        style={{
          backgroundColor: selectedCategory === 'Work' ? '#4F8DCC' : '#7CB9E8',
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => handleCategoryPress('Work')}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Work</Text>
      </Pressable>
      <Pressable
        style={{
          backgroundColor: selectedCategory === 'Personal' ? '#4F8DCC' : '#7CB9E8',
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => handleCategoryPress('Personal')}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Personal</Text>
      </Pressable>
      <Pressable
        style={{
          backgroundColor: selectedCategory === 'Travel' ? '#4F8DCC' : '#7CB9E8',
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 'auto',
        }}
        onPress={() => handleCategoryPress('Travel')}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Travel</Text>
      </Pressable>
        <Pressable onPress={() => setModalVisible(!isModalVisible)}>
          <AntDesign name="pluscircle" size={30} color="#007FFF" />
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ padding: 10 }}>
          {todos?.length > 0 ? (
            <View>
              {publishedJournals?.length > 0 && <Text>Journals Written Today! {today}</Text>}

              {publishedJournals?.map((item, index) => (
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
                    <Entypo
                      name="circle"
                      size={18}
                      color="black"
                    />
                    <Text style={{ flex: 1 }}>{item?.title}</Text>
                  </View>
                </Pressable>
              ))}

              {publishedJournals?.length > 0 && (
                <View>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      margin: 10,
                    }}
                  >
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 130,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
            
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 15,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                No Journals for today! add a Journal
              </Text>
              <Pressable
                onPress={() => setModalVisible(!isModalVisible)}
                style={{ marginTop: 15 }}
              >
                <AntDesign name="pluscircle" size={30} color="#007FFF" />
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

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
              onChangeText={(text) => setTitle(text)}
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
              value={todo}
              onChangeText={(text) => setTodo(text)}
              placeholder="Input a new task here"
              style={{
                padding: 10,
                borderColor: "#E0E0E0",
                borderWidth: 1,
                borderRadius: 5,
                flex: 1,
              }}
            />
            <Ionicons onPress={addJournal} name="send" size={24} color="#007FFF" />
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
                borderColor: category === 'Work' ? '#4F4F4F' : '#E0E0E0',
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
                borderColor: category === 'Personal' ? '#4F4F4F' : '#E0E0E0',
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
                borderColor: category === 'Travel' ? '#4F4F4F' : '#E0E0E0',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderWidth: 1,
                borderRadius: 25,
              }}
            >
              <Text>Travel</Text>
            </Pressable>
          </View>

          <Text>Some sugggestions</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              marginVertical: 10,
            }}
          >
            {suggestions?.map((item, index) => (
              <Pressable
                onPress={() => setTodo(item?.todo)}
                style={{
                  backgroundColor: "#F0F8FF",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 25,
                }}
                key={index}
              >
                <Text style={{ textAlign: "center" }}>{item?.todo}</Text>
              </Pressable>
            ))}
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default index;

const styles = StyleSheet.create({});
