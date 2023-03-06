import React, {useState, useEffect, createContext, useContext } from 'react';

import { getLoggedUser } from '../../utils/getLoggedUser';
import axios from 'axios';
import { createStrapiAxios } from '../../utils/strapi';

export const UserContext = createContext();

export const UserProvider = (props) => {
   
    //const [currentUser, setCurrentUser] = useState({});
    const [currentUser, setCurrentUser] = useState(null);

    async function getUser() {
      
        await axios.post('/api/user')
        .then(async (res) => {

            console.log('JWT userContext', res.data);
            const JWT = res.data;
            if (!JWT) {
                return
            }
            // let response = await createStrapiAxios(JWT)
            // .get(`/users/me`);
            
            // let br = await response.data;

            let user = await createStrapiAxios(JWT)
            .get(`/users/me`)
            .then((res) => res.data)
            .catch((error) => {
                console.log('ERROR from users/me-----------------',error);
                return null;
            });
                      
            if (!user) {
               // console.log("NO USER----WTF!!!!!  RETURN");
                return;
            }

            await createStrapiAxios(JWT)
            .get(`/users/${user?.id}?populate[0]=avatar&populate[1]=expert`)
            .then((res) => {
                let isExp = false;
                    if (res.data.expert && res.data.expert.id) {
                        isExp = true;    
                    }
                setCurrentUser({...res.data, jwt: JWT, isExpert : isExp})
            })
            .catch((error) => console.log('ERROR from /users/id------------', error));
            
            // let cU = await response?.data;
            // setCurrentUser({...cU, jwt: JWT});
        })
        .catch(()=>{setCurrentUser({})});
      }  
  
    useEffect(() => {

        getUser();
      }, []); 

    return(
        <UserContext.Provider value = {{currentUser, setCurrentUser}} >
            {props.children}
        </UserContext.Provider>
    )
}

export function useUserContext() {
    return useContext(UserContext);
  }