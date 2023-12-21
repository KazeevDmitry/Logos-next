import React from 'react';
import { useState, useContext } from 'react'
import { ThemeContext } from '../../Providers/themeContext';
import { Col, Space, } from 'antd';
import { Rate, Row, Typography, Divider } from 'antd';


import styles from './feedbacks.module.less';

import UserImage from '../userImage/userImage';

import { Link } from "react-router-dom";

import Icons from '../../Utils/icons';
import PublishedDate from '../publishedDate/publishedDate';


const { Paragraph } = Typography;


export default function FeedbackCard ({feedback}) {
        



    const theme = useContext(ThemeContext);

    const moreStr = <span style={{color: "#0066FF", fontWeight: "600"}}>{`>>>>`}</span>;
    
  
   const {name, surname, avatar} = feedback.author;
       const username = `${name} ${surname}`;
       
       const userImage= avatar?.url?? '';
        
       const currDate = new Date(feedback.created_at);

       return (
       
           <Col xs={0} sm={0} md={12} lg={12} xl={12}>
                <div className={styles.smallCard}>
                    <div className={styles.subrow}>
                        <UserImage
                            image= {userImage}
                            online={false}
                            width= {45}
                            username={username}
                        />
                        <span className={styles.someName}>{username}</span>
                    </div>
                    <div className={styles.rowStars}>
                        <span>
                            <Rate style={{color:'red'}} value={feedback.rating} />      
                        </span>
                         <PublishedDate width = {"170px"} currDate = {currDate} textColor = "#5E6674"/>
                    </div>
                    <h4 className={styles.subtitleCard}>{feedback.task.title}</h4>
                    <Divider/>
                    <Paragraph style={{fontWeight: "400", fontSize: "14px"}} ellipsis={{ rows: 3, expandable: true, symbol: moreStr }}  >{feedback.text}</Paragraph>
                    
                </div>
 
            </Col>
           
       )
   }