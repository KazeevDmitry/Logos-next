
import React from 'react';

import styles from './pageHeader.module.less';
import PageContainer from './pageContainer';
import { Row, Col } from 'antd';
import {useThemeContext} from '../../context/themeContext';


import {
    CloseOutlined,
  } from '@ant-design/icons';
import { useRouter } from 'next/router';

export default function PageHeader ({children, xs=0, sm=0, md=8, lg=7, xl=6, title, maxWidth='1400px', closeBtn =false}) {

    const theme = useThemeContext();
    const router= useRouter();
    
    const gut = theme?.gutters?.gorizontal[theme?.id]?? 20;
    const gorGutter = `${gut/2}px`;
    

return (
    <div style={{width: "100%", marginTop: "100px", marginLeft: "auto", marginRight: "auto", maxWidth: maxWidth}}>
    <Row gutter = {[gut, gut]} style={{width: `100%+${gorGutter}`}}>
   
        <Col
            xs={24-xs}
            sm={24-sm}
            md={24-md}
            lg={24-lg}
            xl={24-xl}
        >
        <div className={styles.flexContainer}>
          <h1 lang='ru' className={styles.headText}>{title}</h1>
        
        </div> 
        </Col> 
        <Col
            xs={xs}
            sm={sm}
            md={md}
            lg={lg}
            xl={xl}
        >
            {!closeBtn && children}
            {closeBtn && <div style={{
                            display: 'flex', 
                            alignItems: 'flex-end', 
                            justifyContent: 'flex-end',
                            height: '100%'
                        }}>
              <div className={styles.closeBtn}
              style={{borderRadius: '50%', 
                      width: '25px', 
                      height: '25px', 
                      backgroundColor: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center'}} 
              onClick={()=> router.back()}>
                <CloseOutlined />
              </div>
          </div>    }
        </Col>
        </Row>
      </div>
)};      