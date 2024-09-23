import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import DocumentsStackScreen from './AgentsStackNav';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import Home from '../screens/Home';
import AgentsStackScreen from './AgentsStackNav';
import Browser from '../screens/Browser';
import Categorie from '../screens/Categorie';


const Tab = createBottomTabNavigator();


const BottomTabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={({route})=> (
        {
          tabBarIcon: ({focused,color, size}) => {
            let iconName;
            if (route.name ==='Home'){
              iconName = 'home'
            } else if (route.name === 'Agents') {
                iconName = 'perm-data-setting';
            } else if (route.name === 'Browser') {
              iconName = 'all-inbox';
            } else if (route.name === 'Categorie') {
              iconName = 'all-inbox';
            }
            return <MaterialIcons name={iconName} size={size} color={color} />
          }
        }
        
      )}

      tabBarOptions={{
        activeTintColor: '#1CE4FF',
        inactiveTintColor: 'white',
        labelStyle: { marginBottom:5, fontSize:11},
        style: {backgroundColor: '#0B132B'},
      }}
    >
      <Tab.Screen name='Home' component={Home} options={{title: 'Accueil'}}/>
      <Tab.Screen name='Browser' component={Browser} options={{title: 'Browser'}}/>
      <Tab.Screen name='Categorie' component={Categorie} options={{title: 'Categorie'}}/>
      <Tab.Screen name='Agents' component={AgentsStackScreen} options={{title: 'Agents'}}/>

    </Tab.Navigator>
  )
}



const styles = StyleSheet.create({})

export default BottomTabNav