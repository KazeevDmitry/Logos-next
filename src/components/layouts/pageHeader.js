
import React from 'react';

import styles from './pageHeader.module.less';


export default function PageHeader (props) {
return (
    <div className={styles.flexContainer}>
          <h3 lang='ru' className={styles.headText}>{props.title}</h3>
          {props.children}
      </div>  

)};      