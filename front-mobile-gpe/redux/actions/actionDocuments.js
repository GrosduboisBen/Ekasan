//Envoyer un document sur l'api
export const actionPostDocuments = (token, formData) => {
    console.log("Action: PostDocument")
    return async (dispatch) => {  
        try {
            const response = await fetch('http://192.168.1.12:8741/user_documents',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token, 
            },
            body: formData
            });

            const body = await response.json();
    
            if (response.ok) {
                console.log("response.ok == true") 
                console.log(body)
                return body;
            } else {
              console.log("response 1")
              console.log(response.statusText)
              console.log(body)
                console.log("response.ok == false") 
                throw new Error(body.detail ? body.detail: body.message)
            }
    
        } catch (error) {
            //setError(error.message);
            console.log("Action PostDocuments CATCH()")
            if (error.message == "Expired JWT Token"){
                //retourner a la page dacceuil
            }
            console.log(JSON.stringify(error))
            console.log(error.message)
        } finally {

        }
    } 
}

// Récupérer les documents de l'utilisateur depuis l'api (ex: user id 11)
export const actionGetDocuments = (token, user_id) => {
    console.log("Action: GetDocument")
    return async (dispatch) => {  
        try {
            const response = await fetch('http://192.168.1.12:8741/user_documents/'+user_id+'/user',{
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
                //console.log(body)
                if (body.code == "error"){
                  isLoading(null)
                  alert(body.message)
                }
                return body;
            } else {
              console.log("response 1")
              console.log(response.statusText)
              console.log(body)
                console.log("response.ok == false") 
                throw new Error(body.detail ? body.detail: body.message)
            }
    
        } catch (error) {
            //setError(error.message);
            console.log("Action GetDocuments CTACH)")
            if (error.message == "Expired JWT Token"){
                //retourner a la page dacceuil
            }
            console.log(error.message)
            return(error.message)
        } finally {

        }
    } 
}
