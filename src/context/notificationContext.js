import React, {useState, useEffect, createContext, useContext } from 'react';

import{ 
    notification, 
    } from 'antd';

export const NoteContext = createContext();

export const NoteProvider = (props) => {
   
    //const [currentUser, setCurrentUser] = useState({});
   
    const [api, contextHolder] = notification.useNotification();

    function infoNotification (message, description) {
      api.info({
        message: message,
        description: description,
        placement : 'topRight',
      });
    };  
    function successNotification (message, description) {
      api.success({
        message: message,
        description: description,
        placement : 'topRight',
      });
    };  
  
    
    return(
        <NoteContext.Provider value = {{infoNotification, successNotification}} >
            {contextHolder}
            {props.children}
        </NoteContext.Provider>
    )
}

export function useNotifyContext() {
    return useContext(NoteContext);
  }