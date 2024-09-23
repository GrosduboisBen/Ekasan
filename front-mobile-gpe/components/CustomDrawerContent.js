
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native'
import {Text, Avatar, Title, Drawer} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backgroundColorNames } from 'chalk';


const CustomDrawerContent = (props) => {
    const dispatch = useDispatch(); // utiliser dispatch

    const loggout = async () => {
        await AsyncStorage.removeItem("access_token");
        props.navigation.navigate('Login');
    }

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContentContainer}>
           <View style={styles.userInfoContainer}>
            <View style={styles.userInfoDetails}>
                <Avatar.Image
                    source={{uri : 'https://cdn.pixabay.com/photo/2020/04/07/15/07/vault-5013752__340.png' }}
                    size={50}
                    style={{ alignSelf: 'center' }}
                />
                <View style={styles.name}>
                    <Title style={styles.title}>Ekasan</Title>

                </View>

            </View>
            

           </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
                label='Agenda' 
                icon={({color, size}) => <MaterialIcons name="view-agenda" size={size} color={color} />} 
                onPress={() => props.navigation.navigate('Agenda')} 
            />
            <DrawerItem
                label='Nous contacter' 
                icon={({color,size}) =><MaterialIcons name="contact-support" size={size} color={color} />}
                onPress={() => props.navigation.navigate('ContactUs')} 
            />
                
        </Drawer.Section>

      </DrawerContentScrollView>

      <Drawer.Section style={styles.logOutSection}>
      <DrawerItem
                label='Déconnexion' 
                icon={({color, size}) => <MaterialIcons name="logout" size={size} color={color} />} 
                onPress={() => props.navigation.navigate ('Login')}
            />
      </Drawer.Section>

    </View>
  )
}

export default CustomDrawerContent

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    drawerContentContainer:{
        flex:1
    },
    drawerSection:{
        marginTop:20,
        borderTopWidth:0.2,
        
    },
    logOutSection:{
        marginBottom:-1,
        borderTopWidth:0.5,
        borderTopColor:'#333',
        backgroundColor: '#ed0974'
    },
    title:{
        textAlign: 'center',
    },
})