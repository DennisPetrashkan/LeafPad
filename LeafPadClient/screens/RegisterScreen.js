import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../services/Config';
import { ref, set } from 'firebase/database';
import { KeyboardAvoidingView } from 'react-native';

function RegisterScreen() {
  const Register = async () => {
    setLoading(true);

    try {
      // Check if name, lastName, email, and password are provided
      if (!name.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
        Alert.alert('Required Fields', 'All fields are required.');
        return;
      }

      // Check password requirements
      if (password.length < 6 || /\s/.test(password)) {
        Alert.alert('Password Requirements', 'Password must be at least 6 characters and cannot contain spaces.');
        return;
      }

      // Create user with email and password
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);

      // Set user details in the Realtime Database
      set(ref(FIREBASE_DATABASE, 'users/' + FIREBASE_AUTH.currentUser.uid), {
        name: name,
        lastName: lastName,
      });

      // Display an alert to indicate successful registration
      Alert.alert('Registration Successful', 'You have been registered successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Registration Failed', 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.content}>
        <Text style={styles.heading}>Register</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setName(text)}
          placeholder="First Name *"
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setLastName(text)}
          placeholder="Last Name *"
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email Address *"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password *"
        />
        <Text style={styles.passwordRequirements}>
          Password Requirements:
          {'\n'}1. At least 6 characters.
          {'\n'}2. Cannot contain spaces.
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <TouchableOpacity style={styles.registerButton} onPress={Register}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#58dbca',
  },
  input: {
    height: 40,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  registerButton: {
    backgroundColor: '#58dbca',
    height: 50,
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffff',
  },
  passwordRequirements: {
    fontSize: 12,
    marginHorizontal: 10,
    marginBottom: 20,
    color: 'gray',
  },
});

export default RegisterScreen;
