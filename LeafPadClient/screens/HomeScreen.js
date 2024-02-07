// General Purpose External Imports

// React Imports
import React, { useState, useEffect, useCallback, Alert } from 'react';
import { StyleSheet, Button, View, Text, TouchableOpacity, FlatList } from 'react-native';

// Firebase Imports
import { ref, child, get } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../services/Config';

// Other Imports
import { Audio } from 'expo-av';
import { Buffer } from 'buffer';
import OpenAI from "openai";
import * as FileSystem from 'expo-file-system';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

// Internal Imports
import { saveNote } from './WriteNoteScreen';

function Home({ navigation }) {
  const [name, setName] = useState('');
  const [clientList, setClientList] = useState([]);
  const [recording, setRecording] = useState()
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [audioUri, setAudioUri] = useState('');
  const [audioTranscript, setAudioTranscript] = useState('');

  const getTranscript = async () => {
  
    try{
      const data = Buffer.from(
        await FileSystem.readAsStringAsync(audioUri, {
          encoding: FileSystem.EncodingType.Base64,
        }),
        'base64',
      )

      const openai = new OpenAI({ apiKey: 'api key' });
      // console.log(data)
      const transcription = await openai.audio.transcriptions.create({
        file: data.data,
        model: "whisper-1",
      });
    
      console.log(transcription.text);
      
    } catch (error) {
      console.error(error);
    }
  }

  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY = {android: {extension: ".wav", outputFormat: "AndroidOutputFormat.DEFAULT"}, ios: {
        extension: ".wav"
      }}
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    setAudioUri(uri);
    console.log('Recording stopped and stored at', uri);
    getTranscript();
  }


  const fetchUserName = () => {
    const userId = FIREBASE_AUTH.currentUser.uid;
    const dbRef = ref(FIREBASE_DATABASE);
    get(child(dbRef, 'users/' + userId)).then((snapshot) => {
      setName(snapshot.val().name);
    });
  };

  const fetchClientList = useCallback(async () => {
    const userId = FIREBASE_AUTH.currentUser.uid;
    const dbRef = ref(FIREBASE_DATABASE);
    try {
      const snapshot = await get(child(dbRef, 'users/' + userId + '/clients'));
      const clients = Object.entries(snapshot.val() || {}).map(([key, value]) => ({ id: key, ...value }));
      setClientList(clients);
    } catch (error) {
      console.error('Error fetching client list:', error);
    }
  }, []);
  

  useEffect(() => {
    
    fetchClientList();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchClientList();
    });

    return unsubscribe
  }, [fetchClientList, navigation]);

  const AddClientNavigation = () => {
    navigation.navigate('AddClient');
  };

  const navigateToEditClient = (clientId) => {
    navigation.navigate('EditClient', { clientId });
  };

  const renderItem = ({ item }) => (
    <View style={styles.clientContainer}>
      <Text style={styles.clientName}>{item.clientName} {item.clientLastName}</Text>
      <View style={styles.clientInfoContainer}>
        <Text>Email: {item.clientEmail}</Text>
        <Text>Address: {item.clientAddress}</Text>
        <Text>Phone Number: {item.clientPhoneNumber}</Text>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={() => navigateToEditClient(item.id)}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button color='#58dbca' onPress={() => FIREBASE_AUTH.signOut()} title='Logout' />
      {fetchUserName()}
      <View style={styles.greetingContainer}>
        <Text style={styles.heading1}>Hello {name}</Text>
      </View>
      <FlatList
        data={clientList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.clientList}
      />
      <TouchableOpacity style={styles.addClients} onPress={AddClientNavigation}>
        <Text style={styles.heading2}>Add Clients</Text>
      </TouchableOpacity>
      <Text>Recognized Text: {audioTranscript.speech}</Text>
      <TouchableOpacity style={styles.micContainer} onPress={(recording ? stopRecording: startRecording)}>
        {recording ? <Entypo name="dots-three-horizontal" size={50} color="#DB5869" /> : <FontAwesome name="microphone" size={50} color="#DB5869" /> }
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 15,
  },

  greetingContainer: {
    alignItems: 'center',
    paddingBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },

  heading1: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#58dbca',
  },

  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  clientContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  clientName: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  clientInfoContainer: {
    marginTop: 10,
  },

  editButton: {
    backgroundColor: '#58dbca',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-end',
  },

  editButtonText: {
    color: '#ffffff',
  },

  addClients: {
    height: 60,
    width: '100%',
    backgroundColor: '#58dbca',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },

  writeEmail: {
    height: 60,
    width: '100%',
    backgroundColor: '#DB5869',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },

  clientList: {
    flex: 1,
  },

  noteContent: {
    fontSize: 16,
  },
  micContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 150
  }
});

export default Home;
