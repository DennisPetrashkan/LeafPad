// External General-Use Import
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ref, child, push, update } from 'firebase/database';

// Internal Imports
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../services/Config';

// Main Function
function AddClientScreen({ navigation }) {

  // Setting States
  const [clientName, setClientName] = useState('');
  const [clientLastName, setClientLastName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhoneNumber, setClientPhoneNumber] = useState('');

  // Format Phone Number Into (###) ###-####
  const formatPhoneNumber = (number) => {
    const formattedNumber = number.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    return formattedNumber;
  };

  // Validate Phone Number Consists of Positive Integers
  const validatePhoneNumber = (number) => {
    return /^\d{10}$/.test(number);
  };

  // Save Client Info To Database
  const handleSaveClient = () => {
    // Check if name and last name are provided
    if (!clientName.trim() || !clientLastName.trim()) {
      Alert.alert('Required Fields', 'Name and Last Name are required fields.');
      return;
    }

    // Reformat client name and last name
    const formattedClientName = clientName.trim();
    const formattedClientLastName = clientLastName.trim();

    // Reformat client email and convert to lowercase
    const formattedClientEmail = clientEmail.trim().toLowerCase();

    // Reformat client phone number
    const formattedClientPhoneNumber = formatPhoneNumber(clientPhoneNumber);

    // Validate phone number
    if (!validatePhoneNumber(clientPhoneNumber)) {
      Alert.alert('Invalid phone number. Please enter a 10-digit positive integer.');
      return;
    }

    // Get Database and User Info
    const userId = FIREBASE_AUTH.currentUser.uid;
    const dbRef = ref(FIREBASE_DATABASE);

    // Generate a unique key for the new client
    const newClientKey = push(child(dbRef, `users/${userId}/clients`)).key;

    // Create client object
    const newClient = {
      clientName: formattedClientName,
      clientLastName: formattedClientLastName,
      clientEmail: formattedClientEmail,
      clientAddress,
      clientPhoneNumber: formattedClientPhoneNumber,
    };

    // Update the client data
    update(child(dbRef, `users/${userId}/clients/${newClientKey}`), newClient);

    // Display an alert to indicate successful save
    Alert.alert('Client Saved', 'Client information saved successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  // main JSX
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Client</Text>
      <Text style={styles.note}>* Name and Last Name are required fields</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name *"
        value={clientName}
        onChangeText={(text) => setClientName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name *"
        value={clientLastName}
        onChangeText={(text) => setClientLastName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={clientEmail}
        onChangeText={(text) => setClientEmail(text.trim().toLowerCase())}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={clientAddress}
        onChangeText={(text) => setClientAddress(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={clientPhoneNumber}
        onChangeText={(text) => setClientPhoneNumber(text.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveClient}>
        <Text style={styles.saveButtonText}>Save Client</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },

  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  
  note: {
    fontSize: 12,
    marginBottom: 10,
    color: 'gray',
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  saveButton: {
    backgroundColor: '#58dbca',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },

  saveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default AddClientScreen;