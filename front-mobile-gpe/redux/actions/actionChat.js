import { IA_API_URL } from "../../config.js";

export const actionChat = (message) => {
    console.log("Action: Chat IA")
    return async (dispatch) => {
        try {
            var myHeaders = new Headers();
            //myHeaders.append("X-CSRFToken", "jlXz78Egco1dbcABgbZHhcudgkRlWkB6");
            //myHeaders.append("Authorization", "Bearer secret_UDS7ls9eoucJClFIU8XAG6ox9k2jQgjbGDvAV0uDoZy");
            var formdata = new FormData();
            //formdata.append("file", fileInput.files[0], "Acces.png");
            formdata.append("content", message);
            var requestOptions = {
            method: 'POST',
            //headers: myHeaders,
            body: formdata,
            //redirect: 'follow'
            };
            console.log( IA_API_URL + "/chat/")
            const response = await fetch(IA_API_URL + "/chat/", requestOptions);
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
