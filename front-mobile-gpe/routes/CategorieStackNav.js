import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import Browser from '../screens/Browser';
import Categorie from '../screens/Categorie';
import ChatPage from '../screens/ChatPage';


const CategorieStack = createStackNavigator();

const CategorieStackScreen = ({navigation}) => {
  return (

    <CategorieStack.Navigator
            screenOptions={{
                headerLeft: () => (
                    <MaterialIcons 
                    name="menu" 
                    size={24} 
                    color="black" 
                    onPress={()=> navigation.openDrawer()}
                    />
                )
            }} 
        >
            
            <CategorieStack.Screen name='Categorie' component={Categorie} options={{title :'Categorie', }}/>
            <CategorieStack.Screen name='ChatPage' component={ChatPage} options={{title :'ChatPage', }}/>

        </CategorieStack.Navigator>
  )
}

export default CategorieStackScreen

const styles = StyleSheet.create({})