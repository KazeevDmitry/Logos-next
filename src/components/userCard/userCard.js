import React, { useContext } from 'react';

import styles from './userCard.module.less';
import checkedSvg from './icons/checked.svg';
import UserImage from '../userImage/userImage';
import { Row, Col } from 'antd'
import RatingBar from '../ratingbar/ratingbar';
import {useThemeContext} from '../../context/themeContext';

import {EnvironmentOutlined} from '@ant-design/icons';


export default function UserCard({username, surname, image, stars, reviews = '0', cups, spec, online, cityName}){

  const  THEME = useThemeContext();

    const cHeight = THEME?.isDesktop ? 80 : 60;
    const cardHeight = THEME?.id !== "xs" ? "150px" : "130px";
    
    return (
      
        <div className={styles.card}
        //   style ={{height: cardHeight}}
        >
          <Row gutter={[20, 40]} 
            justify= "center" align = "middle" 
            
            wrap={false}
            style={{width: "100%", height: "100%"}}
          >
  
            <Col flex={`${cHeight}px`}
              style={{paddingLeft: "0px"}}
            >
             
       
                  <UserImage
                  image= {image}
                  online={online}
                   width= {cHeight}
             
              />
            
            </Col>
  
            <Col flex="auto" style = {{height: "100%"}}>
                <div className={styles.inCardBlock}>
                    
                      <div className={styles.specname}>
                        {`${username} ${surname}`}
                       </div>
                    
                    <div className={styles.occupation} style={{fontSize: "16px", marginTop: "10px"}}>{spec}</div>

                    <div className={styles.cityBlock} style={{ marginTop: "10px"}}>
                      <EnvironmentOutlined />
                      <div className={styles.occupation} style={{marginLeft: "10px"}}>{cityName}</div>
                    </div>  
  
                    <div style={{width: "100%", maxWidth: "250px", marginTop: "10px"}}>
                      <RatingBar
                          stars = {stars}
                          cups = {cups}
                          reviews = {reviews}
                      />
                    </div>
                </div>
            </Col>      
          </Row>  
        </div>  
  
    );
  }
  