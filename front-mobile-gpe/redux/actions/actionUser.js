// Récupérer les information de l'utilisateur connecté 
export const actionGetMe = (token) => {
    console.log("Action: GetMe")
    return async (dispatch) => {  
        try {
            const response = await fetch('http://192.168.1.12:8741/me',{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token, 
            },
            });

            const body = await response.json();
    
            if (response.ok) {
                console.log("response.ok == true") 
                console.log()
                console.log(body.message)
                console.log("message==",body.message)
                if (body.code == "error"){
                  isLoading(null)
                  alert(body.message)
                }
                return body.message;
            } else {
              console.log("response 1")
              console.log(response.statusText)
              console.log(body)
                console.log("response.ok == false") 
                throw new Error(body.detail ? body.detail: body.message)
            }
    
        } catch (error) {
            //setError(error.message);
            console.log("Action GetMe")
            if (error.message == "Expired JWT Token"){
                //retourner a la page dacceuil
            }
            console.log(error.message)
        }
    } 
}

// Récupérer les information de l'utilisateur connecté 
export const actionUpdateMe = (token, user_id, user_data) => {
    console.log("Action: UpdatetMe ---------------------------------------------------")
    return async (dispatch) => {  
        try {
            const response = await fetch('http://192.168.1.12:8741/users/' + user_id, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token, 
            },
            body : JSON.stringify(user_data)
            });

            const body = await response.json();
    
            if (response.ok) {
                console.log("response.ok == true") 
                console.log(body)    
                console.log("message==",body.message)
                if (body.code == "error"){
                  isLoading(null)
                  alert(body.message)
                }
                return body.message;
            } else {
              console.log("response 1")
              console.log(response.statusText)
              console.log(body)
                console.log("response.ok == false") 
                throw new Error(body.detail ? body.detail: body.message)
            }
    
        } catch (error) {
            //setError(error.message);
            console.log("Action GetMe")
            if (error.message == "Expired JWT Token"){
                //retourner a la page dacceuil
            }
            console.log(error.message)
        }
        console.log("Action: UpdatetMe FIN---------------------------------------------------")

    } 
}