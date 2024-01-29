import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../services/Config';
import { KeyboardAvoidingView } from 'react-native';

function LoginScreen() {
  const LogIn = async () => {
    setLoading(true);

    try {
      // Trim spaces and convert email to lowercase
      const trimmedEmail = email.trim().toLowerCase();

      // Sign in with email and password
      const response = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      console.log(response);
    } catch (error) {
      console.log(error);
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.content}>
        <Text style={styles.heading}>Log In</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <TouchableOpacity style={styles.loginButton} onPress={LogIn}>
              <Text style={styles.buttonText}>Log In</Text>
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
  loginButton: {
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
});

export default LoginScreen;
