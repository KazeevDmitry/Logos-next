
import React, { useEffect } from 'react';
import axios from 'axios';

import styles from '../styles/Home.module.css'

import { useUserContext } from '../src/context/userContext';

import { useTranslation } from 'react-i18next'


export default function Experts() {

  const {currentUser} = useUserContext();
  
  

  return (

    <div className={styles.container}>
      
      <div className={styles.main}>
        <h1 className={styles.title}>
         <p> EXPERTS page</p>
         <p>{currentUser?.name}</p>
         <p>{currentUser?.surname}</p>
         <p>{currentUser?.avatar?.url}</p>
        </h1>

  
       </div>
    </div>

  )
}
