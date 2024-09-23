import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNav from './routes/DrawerNav';
import Login from './screens/Login';
import StartScreen from './screens/StartScreen';
import store from './redux/store';
import { Provider } from 'react-redux';
import ResetPassword from './screens/ResetPassword';
import Register from './screens/Register';
import Browser from './screens/Browser';
import ChatPage from './screens/ChatPage';

const Stack = createStackNavigator();



export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
          <Stack.Navigator
            initialRouteName='StartScreen'
            screenOptions={{ headerShown : false}}
          >
            <Stack.Screen name="StartScreen" component={StartScreen}/>
            <Stack.Screen name="Login" component={Login} options={{title:"Connexion"}}/>
            <Stack.Screen name="ResetPassword" component={ResetPassword} options={{title:"ResetPassword"}}/>
            <Stack.Screen name="Register" component={Register} options={{title:"Register"}}/>
            <Stack.Screen name="ChatPage" component={ChatPage} options={{title:"Chatpage"}}/>
            <Stack.Screen name="Browser" component={Browser} options={{title:"Browser"}}/>
            <Stack.Screen name="Home" component={DrawerNav}/>
          </Stack.Navigator>
        

      </NavigationContainer>
    </Provider>
      
  );
}


