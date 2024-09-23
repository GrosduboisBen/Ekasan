export const actionPostCategories = (token,name, matchWords) => {
    return async (dispatch) => {   
        try {
            const response = await fetch('http://192.168.1.12:8741/categories',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }, body: JSON.stringify({ name: name, matchWords : [matchWords]})
            });
    
            const body = await response.json();
    
            if (response.ok) {
                console.log("response.ok == true") 
                console.log(body)
                return body;
            } else {
                console.log("response.ok == false") 
                throw new Error(body.detail)
            }

        } catch (error) {
            //setError(error.message);
            console.log("ActionCategories.js catch()")
            console.log(error.message)
        } finally {
            //setLoading(false);
        }
    } 
}

export const actionGetCategories = (token,user_id) => {
    return async (dispatch) => {   
        try {
            const response = await fetch('http://192.168.1.12:8741/users/'+user_id+'/categories',{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            });
    
            const body = await response.json();
    
            if (response.ok) {
                console.log("response.ok == true") 
                // console.log(body)
                return body;
            } else {
                console.log("response.ok == false") 
                console.log("body",body)
                throw new Error(body.detail)
            }

        } catch (error) {
            //setError(error.message);
            console.log("ActionCategories.js catch()")
            console.log(error.message)
        } finally {
            //setLoading(false);
        }
    } 
}
    