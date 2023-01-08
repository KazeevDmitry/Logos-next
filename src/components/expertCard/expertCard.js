import React from 'react';

import styles from './expertCard.module.less';
import checkedSvg from './icons/checked.svg';
import UserImage from '../userImage/userImage';
import { Row, Col } from 'antd'
import RatingBar from '../ratingbar/ratingbar';
import {useThemeContext} from '../../context/themeContext';
import { Typography } from 'antd';

import {EnvironmentOutlined} from '@ant-design/icons';

const { Paragraph } = Typography;

export default function ExpertCard({username, surname, image, stars, reviews = '0', cups, spec, online, cityName, branches, description}){

  const  THEME = useThemeContext();

    const cHeight = THEME?.id === "xxl" || THEME?.id === "xl" ? 150 : 120;
    const cardHeight = THEME?.id !== "xs" ? "150px" : "130px";


    const branchDivs = branches.map((item, i) => 
 
    <div 
        key = {item.id}
        className={styles.branch}
        >
            {item.attributes.name.toUpperCase()}
    </div>
);
    

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
                    <div className={styles.wrapBlock +' '+ styles.branchWrap} style={{marginBottom: "15px"}}>
                      <div className={styles.specname} style={{marginRight:"20px", marginBottom: '10px'}}>
                        {`${username} ${surname}`}
                       </div>
                      <div className={styles.special} style={{fontSize: "16px"}}>{spec}</div> 
                    </div>
                    {THEME.isDesktop && <div className={styles.wrapBlock}>
                      {branchDivs}
                    </div>}
                    
                    {description && THEME.isDesktop && 
                      <div >
                        <Typography.Paragraph 
                          style={{marginBottom: "0px"}}
                          ellipsis={
                            {
                                rows: 2,
                              //  expandable: true,
                              //  symbol: moreStr,
                                tooltip: false,
                              }
                          
                          }>
                        {description}
                        </Typography.Paragraph>
                      </div>  }

                    <div className={styles.wrapBlock} style={{justifyContent: "space-between"}}>
                      <div className={styles.cityBlock} style={{ marginTop: "10px"}}>
                        <EnvironmentOutlined 
                            style={{
                              //color : cups > 0 ? "#F4B336" : "#CED3DB", 
                              fontSize: `19px`, 
                              fontWeight: "600"
                              }}/>
                        <div className={styles.occupation} style={{marginLeft: "10px", fontSize: "15px"}}>{cityName}</div>
                      </div>  
    
                      <div style={{width: "100%", maxWidth: "200px", marginTop: "10px"}}>
                        <RatingBar
                            stars = {stars}
                            cups = {cups}
                            reviews = {reviews}
                            fontSize = {15}
                        />
                      </div>
                    </div>
                    
                    
                </div>
            </Col>      
          </Row>  
        </div>  
  
    );
  }
  