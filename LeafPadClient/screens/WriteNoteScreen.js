import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { ref } from 'firebase/database';
import { FIREBASE_DATABASE, FIREBASE_AUTH } from '../services/Config';
import { saveNote, deleteNote } from '../services/NoteBackend';


const WriteNoteScreen = () => {
  const [noteContent, setNoteContent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [noteList, setNoteList] = useState([]);

  
  const fetchNoteList = async () => {
    const userId = FIREBASE_AUTH.currentUser.uid;
    const dbRef = ref(FIREBASE_DATABASE);
    try {
      const snapshot = await get(child(dbRef, 'users/' + userId + '/notes'));
      const notes = Object.entries(snapshot.val() || {}).map(([key, value]) => ({ id: key, ...value }));
      setNoteList(notes);
    } catch (error) {
      console.error('Error fetching note list:', error);
    }
  }

  useEffect(() => {
    fetchNoteList()
  }, []);


  const onSave = () => {
    saveNote(noteContent, dueDate);
    setNoteContent('');
    setDueDate('');
  }


  const formatDueDate = (input) => {

    function formatfunct(_, p1, p2, p3) {
      let result = p1;
      if (p1.length>1) {
        if (p1)
        result += '/' + p2;
      }

      if (p2.length>1) {
        result += '/' + p3
      }
      return result;
    }

    if (input.length < dueDate.length)
    {
      if (dueDate[dueDate.length-1] === '/'){
        setDueDate(input.substring(0, input.length-1));
        return
      }
    }
    
    const newInput = input.replace(/\//g, "");
    const formattedDate = newInput.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/, formatfunct);
    setDueDate(formattedDate);
  }

  
  const renderItem = ({ item }) => (
    <View style={styles.noteContainer}>
      <Text style={styles.noteDueDate}>Due Date: {item.date}</Text>
      <View style={styles.noteContentContainer}>
        <Text>Email: {item.content}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteNote(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Write Note</Text>

      <TextInput
        style={styles.input}
        placeholder="Write your note here"
        multiline
        numberOfLines={4}
        value={noteContent}
        onChangeText={(text) => setNoteContent(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="MM/DD/YYYY"
        keyboardType="numeric"
        maxLength={10}
        value={dueDate}
        onChangeText={formatDueDate}
      />

      <Button title="Save Note" onPress={onSave} />
      <FlatList
        data={noteList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.noteList}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#58dbca',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#58dbca',
    padding: 10,
    marginBottom: 20,
  },
  noteList: {
    flex: 1,
  },
  noteContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  noteDueDate: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  noteContentContainer: {
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#58dbca',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-end',
  },

  deleteButtonText: {
    color: '#ffffff',
  },

});

export { saveNote };
export default WriteNoteScreen;