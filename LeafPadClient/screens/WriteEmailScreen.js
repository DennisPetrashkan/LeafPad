import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { ref, child, get } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../services/Config';

const WriteEmailScreen = ({navigation}) => {
  const [emailContent, setEmailContent] = useState('');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [emailAddresses, setEmailAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleValueChange=(itemValue, itemIndex) =>setRecipient(itemValue)

  const fetchClientList = async () => {
    const userId = FIREBASE_AUTH.currentUser.uid;
    
    const dbRef = ref(FIREBASE_DATABASE);
    
    try {
      const snapshot = await get(child(dbRef, 'users/' + userId + '/clients'));
      console.log("bruh")
      const clients = [];
      snapshot.forEach((clientSnapshot) => {
        clients.push(clientSnapshot.val().clientEmail);
        console.log("hello")
      });

      setEmailAddresses(clients);
     
      setLoading(false);
    } catch (error) {
      console.error('Error fetching client list:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientList();
  }, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (result.type === 'success') {
        setAttachment(result);
        console.log(attachment);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const sendEmail = async () => {
    try {
      const apiUrl = 'http://192.168.43.146:3001/send-email';

      const requestBody = {
        to: recipient,
        subject: subject,
        text: emailContent,
        attachment: attachment,
      };

      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (response.ok) {
            console.log('POST success');
          }
          return response.json();
        })
        .then((data) => {
          Alert.alert('Success', data.message);
        })
        .catch((error) => {
          console.error('Error:', error);
          Alert.alert('Error', 'Failed to send email.');
        });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send email.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Write Email</Text>

      <Text>Recipient:</Text>

      <Picker
        selectedValue={recipient}
        onValueChange={handleValueChange}
        style={styles.pickerStyles}
        itemStyle={styles.pickerItem}>
          {
            emailAddresses.map(email => <Picker.Item key={email} label={email} value={email}/>)
          }
      </Picker>

      <Text>Subject:</Text>
      <TextInput
        style={styles.input}
        value={subject}
        onChangeText={(text) => setSubject(text)}
      />

      <Text>Email Content:</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        value={emailContent}
        onChangeText={(text) => setEmailContent(text)}
      />

      <Button title="Attach File" onPress={pickDocument} />
      {attachment && <Text>Attachment: {attachment.name}</Text>}

      <Button title="Send Email" onPress={sendEmail} />
    </View>
  );
};

const styles = {
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#58dbca',
  },
  pickerStyles:{
    width:'100%',
    backgroundColor:'white',
    color:'white',
    
  },
  pickerItem: {
    color: "black"
  }
};

export default WriteEmailScreen;
