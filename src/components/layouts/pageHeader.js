
import React from 'react';

import styles from './pageHeader.module.less';
import PageContainer from './pageContainer';
import { Col } from 'antd';

export default function PageHeader ({children, xs=0, sm=0, md=8, lg=7, xl=6, title}) {
return (
    <div style={{width: "100%", marginTop: "100px"}}>
    <PageContainer>
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
      </PageContainer>  
      </div>
)};      