
import React, { useEffect } from 'react';

import styles from '../styles/Home.module.css'

import { useUserContext } from '../src/context/userContext';

import { useTranslation } from 'react-i18next'

import axios from 'axios';
import { createStrapiAxios } from '../utils/strapi';


export default function Experts() {

  const {currentUser} = useUserContext();
  
  async function btn() {
  

    // await axios.post('/api/user')
    // .then(async (res) => {
    //   console.log('jwt from api/user---------', res.data);
      await createStrapiAxios(currentUser.jwt)   // res.data 
      .get(`/tasks`)
      .then((res) => console.log('TASKS----------------', res))
      .catch((error) => {
          console.log('ERROR from tasks-----------------',error);
          return null;
      });
    // });

    console.log('type of user.id-----------------', typeof(currentUser.id));

  }


  return (

    <div className={styles.container}>
      
      <div className={styles.main}>
        <h1 className={styles.title}>
         <p> EXPERTS page</p>
         <button onClick={btn}>PRESS ME</button>
         <p>{currentUser?.name}</p>
         <p>{currentUser?.surname}</p>
         <p>{currentUser?.avatar?.url}</p>
        </h1>

  
       </div>
    </div>

  )
}
