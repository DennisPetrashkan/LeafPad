// General Purpose External Imports

// React Imports
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Button, View, Text, TouchableOpacity, FlatList } from 'react-native';

// Firebase Imports
import { ref, child, get } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../services/Config';

// Other Imports
import Voice from '@react-native-voice/voice';
import { Permissions } from 'expo-permissions';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

// Internal Imports
import { saveNote } from './WriteNoteScreen';

function Home({ navigation }) {
  const [name, setName] = useState('');
  const [clientList, setClientList] = useState([]);
  const [result, setResult] = useState('nothing');
  const [isRecording, setIsRecording] = useState(false);

  const onSpeechStart = (event) => {
    console.log('Recording Started. . .:', event);
  };

  const onSpeechResults = result => { setResult(result.value[0])}

  const startRecording = async () => {
    setIsRecording(true)
    try{
      await Voice.start('en-US');
    }catch (err){
      console.log(err)
    }
  };

  const stopRecording = async () => {
    try{
      await Voice.stop()
      // Voice.removeAllListeners();
      setIsRecording(false)
    } catch (error){
      console.log(error)
    }
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
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = stopRecording;
    Voice.onSpeechResults = onSpeechResults
    // Voice.onSpeechError = () => console.log('onSpeechError:', error );

    fetchClientList();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchClientList();
    });
    // , () => {Voice.destroy().then(Voice.removeAllListeners)}
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

      <TouchableOpacity style={styles.micContainer} onPress={(isRecording ? stopRecording: startRecording)}>
        {!isRecording ? <FontAwesome name="microphone" size={50} color="#DB5869" /> : <Entypo name="dots-three-horizontal" size={50} color="#DB5869" />}
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
