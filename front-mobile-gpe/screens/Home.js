import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import ChatBox from './Chatbox';

const patchNotes = [
  { version: '1.0.1', notes: 'Fixed minor bugs and improved performance.' },
  { version: '1.0.2', notes: 'Added new user profile features.' },
  { version: '1.0.3', notes: 'Improved chat interface and user experience.' },
  { version: '1.0.4', notes: 'Fixed crash issues on startup.' },
  { version: '1.0.5', notes: 'Added support for push notifications.' },
];

function HomePage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images.png')} style={styles.profileImage} />
        <Text style={styles.welcomeText}>Bonjour, {'\n'} Wiem</Text>
      </View>
      <ChatBox />

      {/* Patch Notes Section */}
      <Text style={styles.patchNotesTitle}>Patch Notes</Text>
      {patchNotes.map((note, index) => (
        <View key={index} style={styles.patchNote}>
          <Text style={styles.patchNoteVersion}>Version {note.version}</Text>
          <Text style={styles.patchNoteText}>{note.notes}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 30,
    marginRight: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  historyText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  patchNotesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  patchNote: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    width: '100%',
  },
  patchNoteVersion: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  patchNoteText: {
    fontSize: 16,
  },
});

export default HomePage;









