
import React, {useContext, useState, useEffect} from 'react';

import styles from './pageContainer.module.less';
import { Row } from 'antd';
import {useThemeContext} from '../../context/themeContext';

export default function PageContainer (props) {
    
    const theme = useThemeContext();
    
    const gut = theme?.gutters?.gorizontal[theme?.id]?? 20;
    const gorGutter = `${gut/2}px`;
    const pad = `${gut}px`;

return (
    <div className={styles.container} style={{marginTop: pad}}>
        <Row gutter = {[gut, gut]} style={{width: `100%+${gorGutter}`}}>
          {props.children}
          </Row>
      </div>  

)};      
