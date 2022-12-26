
import React, {useContext, useState, useEffect} from 'react';

import styles from './pageContainer.module.less';
import { Row } from 'antd';
import {useThemeContext} from '../../context/themeContext';

export default function PageContainer (props) {
    
    const theme = useThemeContext();
    
    const gorGutter = `${theme?.gutters?.gorizontal[theme?.id]/2}px`;

return (
    <div className={styles.container}>
        <Row gutter = {[theme?.gutters?.gorizontal[theme?.id], theme?.gutters?.gorizontal[theme?.id]]} style={{width: `100%+${gorGutter}`}}>
          {props.children}
          </Row>
      </div>  

)};      
