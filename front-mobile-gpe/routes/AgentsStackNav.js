import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import Agents from '../screens/Agents';

const AgentsStack = createStackNavigator();

const AgentsStackScreen = ({navigation}) => {

    return(
        <AgentsStack.Navigator
            screenOptions={{
                header: () => null ,
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
            
            <AgentsStack.Screen name='Agents' component={Agents} options={{title :'Agents', }}/>

        </AgentsStack.Navigator>
    )
}

export default AgentsStackScreen;