import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';
import Modal from 'react-native-modal';
import * as DocumentPicker from 'expo-document-picker';

const AgentsScreen = () => {
  const [agents, setAgents] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [currentAgentId, setCurrentAgentId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [file, setFile] = useState(null);


  useEffect(() => {
    const loadAgents = async () => {
      try {
        const agentsData = await AsyncStorage.getItem('agents');
        if (agentsData !== null) {
          setAgents(JSON.parse(agentsData));
        }
      } catch (error) {
        console.error('Error loading agents:', error);
      }
    };

    loadAgents();
  }, []);

  useEffect(() => {
    const saveAgents = async () => {
      try {
        await AsyncStorage.setItem('agents', JSON.stringify(agents));
      } catch (error) {
        console.error('Error saving agents:', error);
      }
    };

    saveAgents();
  }, [agents]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleUpdateModal = (agent = null) => {
    setUpdateModalVisible(!isUpdateModalVisible);
    if (agent) {
      setCurrentAgentId(agent.id);
      setName(agent.name);
      setDescription(agent.description);
      setFile(agent.file);
    } else {
      setCurrentAgentId(null);
      setName('');
      setDescription('');
      setFile(null);
    }
  };

  const createAgent = () => {
    const newAgent = { id: agents.length.toString(), name, description, instructions, file };
    setAgents([...agents, newAgent]);
    toggleModal();
    // Reset form
    setName('');
    setDescription('');
    setInstructions('');
    setFile(null);
  };

  const updateAgent = () => {
    setAgents(agents.map(agent => 
      agent.id === currentAgentId 
        ? { ...agent, name, description, file } 
        : agent
    ));
    toggleUpdateModal();
  };

  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === 'success') {
      setFile(result);
    }
  };

  const startAgent = (id) => {
    // Logic to start the agent
    console.log(`Agent ${id} started`);
  };

  const deleteAgent = (id) => {
    const updatedAgents = agents.filter(agent => agent.id !== id);
    setAgents(updatedAgents);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <FlatList
        data={agents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.agentItem}>
            <View style={styles.agentDetails}>
              <Text style={styles.agentText}>Name: {item.name}</Text>
              <Text>Description: {item.description}</Text>
              <Text>Instructions: {item.instructions}</Text>
              {item.file ? (
                <Text style={styles.fileText}>File: {item.file.name}</Text>
              ) : (
                <Text style={styles.noFileText}>No file attached</Text>
              )}
            </View>
            <View style={styles.agentActions}>
              <Button title="Start" color="green" onPress={() => startAgent(item.id)} />
              <Button title="Update" onPress={() => toggleUpdateModal(item)} />
              <Button title="Delete" color="red" onPress={() => deleteAgent(item.id)} />
            </View>
          </View>
        )}
      />
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <TextInput
            placeholder="Instructions"
            value={instructions}
            onChangeText={setInstructions}
            style={styles.input}
          />
          <Button title="Pick a file" onPress={pickFile} />
          {file && <Text>Selected file: {file.name}</Text>}
          <Button title="Create Agent" onPress={createAgent} />
          <Button title="Cancel" onPress={toggleModal} />
        </View>
      </Modal>
      <Modal isVisible={isUpdateModalVisible}>
        <View style={styles.modalContent}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <Button title="Pick a file" onPress={pickFile} />
          {file && <Text>Selected file: {file.name}</Text>}
          <Button title="Update Agent" onPress={updateAgent} />
          <Button title="Cancel" onPress={toggleUpdateModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 150,
    paddingHorizontal: 20,
  },
  addButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0B132B',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  agentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  agentDetails: {
    flex: 1,
  },
  agentText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fileText: {
    color: 'green',
    marginTop: 5,
  },
  noFileText: {
    color: 'red',
    marginTop: 5,
  },
  agentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default AgentsScreen;




