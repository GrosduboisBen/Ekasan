import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNav from './BottomTabNav'; 
import { MaterialIcons } from '@expo/vector-icons';
import CustomDrawerContent from '../components/CustomDrawerContent';
import DocumentsStackScreen from './AgentsStackNav';





const Drawer = createDrawerNavigator();

const DrawerNav = () => {

    return(

        <Drawer.Navigator
          screenOptions={{
          header: () => null ,
        }}
      >
        <Drawer.Screen name="Home" component={BottomTabNav} options={{ title: 'Accueil' }}/>

      </Drawer.Navigator>
    )
}

export default DrawerNav;