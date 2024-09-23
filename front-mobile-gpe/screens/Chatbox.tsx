// ChatBox.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ChatPage from './ChatPage';

const ChatBox = () => {
  const navigation = useNavigation();

  const openChatPage = () => {
    navigation.navigate('ChatPage', {
      initialMessage: "Posez une question", // Passe le message initial à la page de chat
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={openChatPage}>
      <MaterialCommunityIcons name="chat" size={30} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0B132B',
    padding: 10,
    borderRadius: 30,
  },
});

export default ChatBox;

