import { AUTH_USER } from "../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../../config.js";
//Register
export const actionSignup = (email, password) => {
    console.log("Action: Inscription")
    return async (dispatch) => {
        try {
            var formdata = new FormData();
            formdata.append("name", "required_name");
            formdata.append("first_name", "required_first_name");
            formdata.append("last_name", "required_last_name");
            formdata.append("password", password);
            formdata.append("email", email);
            formdata.append("username", email);
    
            var requestOptions = {
            method: 'POST',
            body: formdata,
            };
    
            const response = await fetch( API_URL + "/user/create/", requestOptions);
            const responseData = await response.json();

            if (!response.ok) {
                console.log("FAILED")
                //console.log(responseData)
                throw new Error(JSON.stringify(responseData))
            } else {
                console.log("OK")
               return responseData
            }
        } catch(error) {
            throw error
        }
    } 
}

// Auth
export const actionAuth = () => {
    console.log("Action: Auth")
    return async (dispatch) => {
        try {
            var requestOptions = {
            method: 'GET',
            };
    
            const response = await fetch( API_URL + "/auth", requestOptions);
            const responseData = await response.json();

            if (!response.ok) {
                console.log("FAILED")
                //console.log(responseData)
                throw new Error(JSON.stringify(responseData))
            } else {
                console.log("OK")
               return responseData
            }
        } catch (error) {
            throw error
        }
    }
}

// Login
export const actionLogin = (username, password, grant_type, client_id, client_secret) => {
    console.log("Action: Login")
    return async (dispatch) => {
        let authenticationError = false;
        let authenticationData = "";
        try {
            const response = await dispatch(actionAuth());
            authenticationData = response;
            console.log(response);
            if (response.hashed == true) {
                throw new Error("We cannot do the login request because the auth request contains a secret hashed instead of a non-scret hashed. Please contact the administrator.")
            }
        } catch (error) {
            authenticationError = true;
            alert(error);
        }

        console.log("authenticationError sur auth :" + authenticationError)
        if (authenticationError == false && authenticationData != '') {
            try {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
                const qs = require('qs');
                let urlencoded = qs.stringify({
                'grant_type': 'password',
                'username': 'admin',
                'password': '1fS"lu],)@?9',
                'client_id': authenticationData.client_id,
                'client_secret': authenticationData.secret 
                });
    
    
                var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                
                };
                
                const response = await fetch(API_URL + "/login/", requestOptions)
                const responseData = await response.json();
    
                if (!response.ok) {
                    console.log("FAILED")
                    console.log(JSON.stringify(response))
                    throw new Error(JSON.stringify(responseData))
                } else {
                    console.log("OK")
                    saveToAsyncStorage(responseData.access_token)
                   return responseData
                }
            } catch (error) {
                throw error
            }
        }
    }
}

// Enregistrer la data dans AsyncStorage
const saveToAsyncStorage = async (token) => {
    console.log("Save Token To Async Storage")
    console.log(token)
    await AsyncStorage.setItem("access_token", token)
}

//Auth action
const actionAuthUser = ( token) =>{
    console.log("Action: AuthUser")
    return{
        type: AUTH_USER,
        token: token
    }
}
