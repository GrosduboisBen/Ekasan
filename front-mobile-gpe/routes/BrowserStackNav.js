import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import AgendaScreen from '../screens/Categorie'
import { MaterialIcons } from '@expo/vector-icons';
import Browser from '../screens/Browser';


const BrowserStack = createStackNavigator();

const BrowserStackScreen = ({navigation}) => {
  return (

    <BrowserStackStack.Navigator
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
            
            <BrowserStack.Screen name='Browser' component={Browser} options={{title :'Browser', }}/>

        </BrowserStackStack.Navigator>
  )
}

export default BrowserStackScreen

const styles = StyleSheet.create({})