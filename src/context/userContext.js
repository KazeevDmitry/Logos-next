import React, {useState, useEffect, createContext, useContext } from 'react';

import { getLoggedUser } from '../../utils/getLoggedUser';
import axios from 'axios';
import { createStrapiAxios } from '../../utils/strapi';

export const UserContext = createContext();

export const UserProvider = (props) => {
   
    const [currentUser, setCurrentUser] = useState({});

    async function getUser() {
      
        await axios.post('/api/user')
        .then(async (user) => {

            const JWT = user.data.strapiToken;
            let response = await createStrapiAxios(JWT)
            .get(`/users/me`);
            
            let br = await response.data;
            response = await createStrapiAxios(JWT)
            .get(`/users/${br?.id}`);
            
            let cU = await response?.data;
            setCurrentUser({...cU, jwt: JWT});
        })
      }  
  
    useEffect(() => {
        getUser();
      }, []); 

console.log('user from userContext------------', currentUser);

    return(
        <UserContext.Provider value = {{currentUser, setCurrentUser}} >
            {props.children}
        </UserContext.Provider>
    )
}

export function useUserContext() {
    return useContext(UserContext);
  }