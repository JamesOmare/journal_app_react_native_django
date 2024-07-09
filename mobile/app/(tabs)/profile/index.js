import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewBase,
  Alert,
} from "react-native";
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import api from "../../../api/axiosconfig";
import { Entypo } from "@expo/vector-icons";



const IndexScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Daily');
  const [publishedJournals, setpublishedJournals] = useState([]);



  useEffect(() => {
    fetchSummaryJournals();
  }, [selectedCategory]);

  const fetchSummaryJournals = async () => {
    try {
      const response = await api.get(
        `journal/entries/summary?period=${selectedCategory}`
      );

      const journalEntries = response.data || [];
      console.log("Journal Profile Entries", journalEntries);
      setpublishedJournals(journalEntries)
    } catch (error) {
      console.log('Error fetching task data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      AsyncStorage.removeItem('access_token');
      AsyncStorage.removeItem('refresh_token');
    
      router.replace('/(authenticate)/login');
    } catch (error) {
      console.error('Error clearing authentication token:', error);
    }
  };
  const handleSummaryPress = (category) => {
    setSelectedCategory(category);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          style={styles.profileImage}
          source={{
            uri: 'https://picsum.photos/id/103/2592/1936.jpg?hmac=aC1FT3vX9bCVMIT-KXjHLhP6vImAcsyGCH49vVkAjPQ',
          }}
        />
        <View style={styles.profileText}>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tasksOverview}>
        <Text style={styles.tasksOverviewTitle}>Journals Summary</Text>
        <View style={styles.tasksContainer}>
        <Pressable
          style={{
            backgroundColor: selectedCategory === 'Daily' ? '#4F8DCC' : '#7CB9E8',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => handleSummaryPress('daily')}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Daily</Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: selectedCategory === 'Weekly' ? '#4F8DCC' : '#7CB9E8',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => handleSummaryPress('weekly')}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Weekly</Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: selectedCategory === 'Monthly' ? '#4F8DCC' : '#7CB9E8',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 'auto',
          }}
          onPress={() => handleSummaryPress('monthly')}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Monthly</Text>
        </Pressable>
        
          
        </View>
        
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ padding: 10 }}>
          {publishedJournals?.length > 0 ? (
            <View>
              {publishedJournals?.length > 0 && <Text>Journals Written {selectedCategory}!</Text>}

              {publishedJournals?.map((item, index) => (
                <Pressable
               
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
                    <Text style={{ flex: 1 }}>{item?.count} Journals Published</Text>
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
             
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: 'white',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileText: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileSubtitle: {
    fontSize: 15,
    color: 'gray',
    marginTop: 4,
  },
  logoutButton: {
    marginLeft: 'auto',
  },
  logoutButtonText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tasksOverview: {
    marginVertical: 12,
  },
  tasksOverviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tasksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskItem: {
    backgroundColor: '#89CFF0',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskCount: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskLabel: {
    marginTop: 4,
  },
});

export default IndexScreen;
