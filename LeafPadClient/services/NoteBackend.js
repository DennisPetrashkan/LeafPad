import { scheduleNotification, cancelNotification } from '../services/PushNotificationHandler';
import { FIREBASE_DATABASE, FIREBASE_AUTH } from '../services/Config';
import { Alert } from 'react-native';

const saveNote = async (noteContent, dueDate) => {

  if (!dueDate == null){
    dateValidation(noteContent);
  }
  
  try {
    const userId = FIREBASE_AUTH.currentUser.uid;
    const dbRef = ref(FIREBASE_DATABASE);
    
    const newNoteKey = push(child(dbRef, `users/${userId}/notes`)).key;

    // Save the note content and due date under the generated ID
    newNote = {
      content: noteContent,
      date: dueDate,
    }

    update(child(dbRef, `users/${userId}/notes/${newNoteKey}`), newNote);

    scheduleNotification(noteContent, new Date(), newNoteKey)

    Alert.alert('Note Saved', 'Your note has been saved successfully.');
  } catch (error) {
    console.error('Error saving note:', error);
    Alert.alert('Error', 'An error occurred while saving the note. Please try again.');
  }
};


const dateValidation = () => {
  const dateComponents = dueDate.split('/');

  // Check if there are three components
  if (dateComponents.length === 3) {
  // Reorder the components to YYYY/MM/DD
      const formattedDate = `${dateComponents[2]}/${dateComponents[0]}/${dateComponents[1]}`;

  // Create a Date object from the formatted date
      const date = new Date(formattedDate);

      // Check if the date is valid
      if (isNaN(date)) {
          // Invalid date
          Alert.alert('Enter a valid date!');
          return;
      }

  } else {
      // Invalid date format
      Alert.alert('Enter a valid date!');
      return;
  }

  if(noteContent.length == 0){
      Alert.alert("Enter your note!")
      return
  }
}


const deleteNote = async (noteId) => {
  cancelNotification(noteId)
  const userId = FIREBASE_AUTH.currentUser.uid;
  const dbRef = ref(FIREBASE_DATABASE);
  update(child(dbRef, `users/${userId}/notes/${noteId}`), null);
}


export { saveNote, deleteNote }

  