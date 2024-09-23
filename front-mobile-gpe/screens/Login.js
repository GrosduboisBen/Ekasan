// import AsyncStorage from '@react-native-async-storage/async-storage';
import {LinearGradient} from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { actionSignup, actionLogin, actionAuth } from '../redux/actions/actionAuths';
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Register from './Register';
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/Theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'


const Login = ({navigation}) => {

    const dispatch = useDispatch();

    const [email, setEmail] = useState({ value: 'wiem@wiem.com', error: '' });
    const [password, setPassword] = useState({ value: 'wiem111', error: '' });
    const [isSignup, setIsSignup] = useState(true); 
    const [error, setError] = useState(); 
    const [isLoading, setIsLoading] = useState(false); 
  
    const onLoginPressed = async () => {
      const emailError = emailValidator(email.value)
      const passwordError = passwordValidator(password.value)
      if (emailError || passwordError) {
        setEmail({ ...email, error: emailError })
        setPassword({ ...password, error: passwordError })
        return
      }

      try {
        const response = await dispatch(actionLogin());
        console.log(response)

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
    } catch (error) {
        console.log(error)
        alert(error)
    }


    }

    const load = async() => {
        //console.log("Screen Login: recherche si un token existe afin de savoir si on logged le user, pb expiration token")
        // const access_token = await AsyncStorage.getItem('access_token');
       // console.log("je recupere le storage !")


       /*  if (access_token !== null && access_token != undefined) {
            //console.log("token not null")
            //console.log(access_token)
            navigation.navigate('Home');
        } */
    }

    useLayoutEffect(() => {
        load();
    }, [])


    useEffect(()=> {
        if (error != null) {
            Alert.alert(
                'ERREUR',
                error,
                [{text: 'OK'}]
            ) 
        }
        
    }, [error]);

    const handleSubmit  = async () => {
        if (email.length > 0 && password.length > 0){
          if (isSignup) {
            //console.log ('Inscription')
            setError(null);
            setIsLoading(true);
            try {
                await dispatch(actionSignup(email, password));
                setIsLoading(false);
                setIsSignup(false)

            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
          } else{
            //console.log ('Connexion')
            setError(null);
            setIsLoading(true);
            try {
                await dispatch(actionLogin(email, password));
                setIsLoading(false);
                navigation.navigate('Home');
                
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
          }
        }  else{
            alert('Veuillez remplir tous les champs') 
        }  
    }
    return (
        <Background>
          <BackButton goBack={navigation.goBack} />
          <Logo />
          <TextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: '' })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: '' })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          <View style={styles.forgotPassword}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}
            >
              <Text style={styles.forgot}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
          <Button mode="contained" onPress={onLoginPressed}>
            Login
          </Button>
          <View style={styles.row}>
            <Text>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Register')}>
              <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </Background>
      )
    }
    
    const styles = StyleSheet.create({
      forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
      },
      row: {
        flexDirection: 'row',
        marginTop: 4,
      },
      forgot: {
        fontSize: 13,
        color: theme.colors.secondary,
      },
      link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
      },
    })

export default Login;