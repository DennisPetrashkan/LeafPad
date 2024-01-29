// // Import necessary components and libraries
// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
// import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../services/Config';
// import { ref, child, get, update } from 'firebase/database';

// // Define EditClientScreen component
// function EditClientScreen({ route, navigation }) {
//   // Extract clientId from route params
//   const { clientId } = route.params;

//   // State variables for client details
//   const [clientDetails, setClientDetails] = useState({
//     clientName: '',
//     clientLastName: '',
//     clientEmail: '',
//     clientAddress: '',
//     clientPhoneNumber: '',
//   });

//   // Effect to fetch client details when component mounts
//   useEffect(() => {
//     const fetchClientDetails = async () => {
//       const userId = FIREBASE_AUTH.currentUser.uid;
//       const dbRef = ref(FIREBASE_DATABASE);
//       try {
//         const snapshot = await get(child(dbRef, `users/${userId}/clients/${clientId}`));
//         if (snapshot.exists()) {
//           setClientDetails(snapshot.val());
//         }
//       } catch (error) {
//         console.error('Error fetching client details:', error);
//       }
//     };

//     fetchClientDetails();
//   }, [clientId]);

//   // Function to handle client details update
//   const handleUpdateClient = async () => {
//     const userId = FIREBASE_AUTH.currentUser.uid;
//     const dbRef = ref(FIREBASE_DATABASE);

//     try {
//       await update(child(dbRef, `users/${userId}/clients/${clientId}`), clientDetails);
//       // Navigate back to the previous screen
//       navigation.goBack();
//     } catch (error) {
//       console.error('Error updating client details:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Edit Client</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="First Name"
//         value={clientDetails.clientName}
//         onChangeText={(text) => setClientDetails({ ...clientDetails, clientName: text })}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Last Name"
//         value={clientDetails.clientLastName}
//         onChangeText={(text) => setClientDetails({ ...clientDetails, clientLastName: text })}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={clientDetails.clientEmail}
//         onChangeText={(text) => setClientDetails({ ...clientDetails, clientEmail: text })}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Address"
//         value={clientDetails.clientAddress}
//         onChangeText={(text) => setClientDetails({ ...clientDetails, clientAddress: text })}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Phone Number"
//         value={clientDetails.clientPhoneNumber}
//         onChangeText={(text) => setClientDetails({ ...clientDetails, clientPhoneNumber: text })}
//         keyboardType="numeric"
//       />
//       <TouchableOpacity style={styles.saveButton} onPress={handleUpdateClient}>
//         <Text style={styles.saveButtonText}>Save Changes</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// // Define styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//   },

//   heading: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },

//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },

//   saveButton: {
//     backgroundColor: '#58dbca',
//     padding: 10,
//     borderRadius: 5,
//     alignSelf: 'center',
//   },

//   saveButtonText: {
//     color: '#ffffff',
//     fontWeight: 'bold',
//   },
// });

// export default EditClientScreen;


import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../services/Config';
import { ref, child, get, update } from 'firebase/database';

function EditClientScreen({ route, navigation }) {
  const { clientId } = route.params;
  const [clientDetails, setClientDetails] = useState({});
  const [phoneNumberError, setPhoneNumberError] = useState('');

  useEffect(() => {
    const fetchClientDetails = async () => {
      const userId = FIREBASE_AUTH.currentUser.uid;
      const dbRef = ref(FIREBASE_DATABASE);
      try {
        const snapshot = await get(child(dbRef, `users/${userId}/clients/${clientId}`));
        if (snapshot.exists()) {
          setClientDetails(snapshot.val());
        }
      } catch (error) {
        console.error('Error fetching client details:', error);
      }
    };

    fetchClientDetails();
  }, [clientId]);

  const formatPhoneNumber = (number) => {
    // Format phone number as (___) ___-____
    const formattedNumber = number.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    return formattedNumber;
  };

  const validatePhoneNumber = (number) => {
    // Validate that the phone number has exactly 10 digits and contains only positive integers
    return /^\d{10}$/.test(number);
  };

  const handleUpdateClient = async () => {
    const userId = FIREBASE_AUTH.currentUser.uid;
    const dbRef = ref(FIREBASE_DATABASE);

    // Check if name and last name are provided
    if (!clientDetails.clientName.trim() || !clientDetails.clientLastName.trim()) {
      Alert.alert('Required Fields', 'Name and Last Name are required fields.');
      return;
    }

    // Reformat client name and last name
    const formattedClientName = clientDetails.clientName.trim();
    const formattedClientLastName = clientDetails.clientLastName.trim();

    // Reformat client email and convert to lowercase
    const formattedClientEmail = clientDetails.clientEmail.trim().toLowerCase();

    // Reformat client phone number
    const formattedClientPhoneNumber = formatPhoneNumber(clientDetails.clientPhoneNumber);

    // Validate phone number
    if (!validatePhoneNumber(clientDetails.clientPhoneNumber)) {
      setPhoneNumberError('Invalid phone number. Please enter a 10-digit positive integer.');
      return;
    }

    // Clear phone number error if valid
    setPhoneNumberError('');

    // Update the client data
    try {
      await update(child(dbRef, `users/${userId}/clients/${clientId}`), {
        ...clientDetails,
        clientName: formattedClientName,
        clientLastName: formattedClientLastName,
        clientEmail: formattedClientEmail,
        clientPhoneNumber: formattedClientPhoneNumber,
      });

      // Display an alert to indicate successful update
      Alert.alert('Client Updated', 'Client information updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error updating client details:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Client</Text>
      <Text style={styles.note}>* Name and Last Name are required fields</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name *"
        value={clientDetails.clientName}
        onChangeText={(text) => setClientDetails({ ...clientDetails, clientName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name *"
        value={clientDetails.clientLastName}
        onChangeText={(text) => setClientDetails({ ...clientDetails, clientLastName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={clientDetails.clientEmail}
        onChangeText={(text) => setClientDetails({ ...clientDetails, clientEmail: text.trim().toLowerCase() })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={clientDetails.clientAddress}
        onChangeText={(text) => setClientDetails({ ...clientDetails, clientAddress: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={clientDetails.clientPhoneNumber}
        onChangeText={(text) => setClientDetails({ ...clientDetails, clientPhoneNumber: text.replace(/[^0-9]/g, '') })}
        keyboardType="numeric"
      />
      {phoneNumberError ? (
        <Text style={styles.errorText}>{phoneNumberError}</Text>
      ) : null}
      <TouchableOpacity style={styles.saveButton} onPress={handleUpdateClient}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
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

export default EditClientScreen;
