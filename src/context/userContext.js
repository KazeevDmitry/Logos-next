import React, {useState, createContext, useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = (props) => {
   
    const [currentUser, setCurrentUser] = useState({});

    return(
        <UserContext.Provider value = {{currentUser, setCurrentUser}} >
            {props.children}
        </UserContext.Provider>
    )
}

export function useUserContext() {
    return useContext(UserContext);
  }