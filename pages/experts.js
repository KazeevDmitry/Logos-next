
import React, { useEffect } from 'react';
import axios from 'axios';

import styles from '../styles/Home.module.css'


import { useTranslation } from 'react-i18next'


export default function Experts() {

  async function getUser() {
    axios.post('/api/user').then((user) => {

      if (user.data.strapiToken) {
        console.log('jwt from app---------------', user.data.strapiToken);
      }
      else {
        console.log('no token----', user);
      }

      //setCurrentUser(user);
      
    })
    .catch(error => console.log(error))
  }

  useEffect(() => {
    getUser();
  }, []); 
  
  

  return (

    <div className={styles.container}>
      
      <div className={styles.main}>
        <h1 className={styles.title}>
         <p> EXPERTS page</p>
        </h1>

  
       </div>
    </div>

  )
}
