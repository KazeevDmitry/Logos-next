
import React, {useContext, useState, useEffect} from 'react';

import styles from './pageContainer.module.less';
import { Row } from 'antd';
import {useThemeContext} from '../../context/themeContext';

export default function PageContainer ({children, maxWidth='1400px', bGcolor=''}) {
    
    const theme = useThemeContext();

    
    const gut = theme?.gutters?.gorizontal[theme?.id]?? 20;
    const gorGutter = `${gut/2}px`;
    const pad = `${gut}px`;

return (
    <div className={styles.container} style={{marginTop: pad, paddingBottom: pad, maxWidth: maxWidth, backgroundColor: bGcolor}}>
        <Row gutter = {[gut, gut]} style={{width: `100%+${gorGutter}`}}>
          {children}
          </Row>
      </div>  

)};      
