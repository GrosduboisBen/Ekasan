import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { actionChat } from '../redux/actions/actionChat';
import { useDispatch } from 'react-redux';

const ChatPage = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    setMessages((prevMessages) => [...prevMessages, { text: route.params.initialMessage, fromUser: true }]);

    setIsLoading(true);

    const delay = setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, { text: "Bonjour, que puis-je faire pour vous?", fromUser: false }]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  const handleSendMessage = async() => {
    if (inputText.trim() === '') {
      alert("Veuillez saisir une phrase...")
    }
    console.log("La saisie utilisateur est : ", inputText)

    setMessages((prevMessages) => [...prevMessages, { text: inputText, fromUser: true }]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await dispatch(actionChat(inputText));
      console.log("La réponse de l'IA est ::: ")
      console.log(response)

      const delay = setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, { text: "Réponse de l'IA à '" + response + "'", fromUser: false }]);
        setIsLoading(false);
      }, 1000);
  
      return () => clearTimeout(delay);
      
  } catch (error) {
      console.log(error)
      alert(error)
  }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item, index }) => (
          <>
            {isLoading && index === messages.length - 1 ? (
              <View style={styles.botMessage}>
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            ) : (
              <View key={index} style={item.fromUser ? styles.userMessage : styles.botMessage}>
                <Text>{item.text}</Text>
              </View>
            )}
          </>
        )}
        contentContainerStyle={styles.messagesContainer}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Champ de saisie et bouton d'envoi */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          placeholder="Saisissez votre question..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e2f9ff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '70%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f2f2f2',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '70%',
  },
  messagesContainer: {
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
  },
  sendButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatPage;




