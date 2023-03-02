
import React from 'react';

import styles from './pageHeader.module.less';
import PageContainer from './pageContainer';
import { Row, Col } from 'antd';
import {useThemeContext} from '../../context/themeContext';

export default function PageHeader ({children, xs=0, sm=0, md=8, lg=7, xl=6, title}) {

    const theme = useThemeContext();
    
    const gut = theme?.gutters?.gorizontal[theme?.id]?? 20;
    const gorGutter = `${gut/2}px`;
    

return (
    <div style={{width: "100%", marginTop: "100px", marginLeft: "auto", marginRight: "auto", maxWidth: "1400px"}}>
    <Row gutter = {[gut, gut]} style={{width: `100%+${gorGutter}`}}>
   
        <Col
            xs={24-xs}
            sm={24-sm}
            md={24-md}
            lg={24-lg}
            xl={24-xl}
        >
        <div className={styles.flexContainer}>
          <h3 lang='ru' className={styles.headText}>{title}</h3>
        
        </div> 
        </Col> 
        <Col
            xs={xs}
            sm={sm}
            md={md}
            lg={lg}
            xl={xl}
        >
            {children}
        </Col>
        </Row>
      </div>
)};      