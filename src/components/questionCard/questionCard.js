import React, {useEffect, useState} from 'react';

import { Typography } from 'antd';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import Link from 'next/link';

import axios from 'axios';

import styles from './questionCard.module.less';
import UserImage from '../userImage/userImage';
import Plural from '../../../utils/plural';

import moment from 'moment';

import { Col, Row, Pagination, Modal, Button,Input } from 'antd';

import {CaretDownOutlined, CaretUpOutlined, EnvironmentOutlined, MessageOutlined} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
import {useUserContext} from '../../context/userContext';

import {useThemeContext} from '../../context/themeContext';
import { createStrapiAxios } from '../../../utils/strapi';
import PublishedDate from '../publishedDate/publishedDate';

import parse from 'html-react-parser';

let theme={};

const { Paragraph } = Typography;
const { TextArea } = Input;

export default function QuestionCard ({authorName, 
                                       authorAvatar,
                                       branch,
                                       subbranch,
                                       description,
                                       title,
                                       authorCity,
                                       date,
                                       questionID,
                                       childrenCount,
                                       answers,
                                       ellipseAnswers=false,
                                      }) {

  const [answerText, setAnswerText]  = useState('');
  
  const {currentUser} = useUserContext();


  const isExpert = currentUser?.isExpert;

  const [showChildren, setShowChildren] = useState(ellipseAnswers && !isExpert);
  theme = useThemeContext();

  const {t} = useTranslation();
  
  const moreStr = <span style={{color: "#0066FF", fontWeight: "600"}}>{`>>>>`}</span>;
  
  const userJWT = currentUser?.jwt;
  
  const cityName = theme.cities.find(city => city.id === authorCity)?.city;

  const p = theme?.gutters?.gorizontal[theme?.id];

  const pad = `${p>15 ? p/2 : p}px`;

 

/* const ANSWERS = answers.map((item, i)=>{

  return (
    <AnswerCard
    key={i}
      author={item.attributes.author.data.attributes}
      text = {item.attributes.text}
      date={item.attributes.publishedAt}
      pad={pad}
    />
  ) 
}); */


  const onAnswerBtn = () => {
    setShowModal(true);
  };


  const onAddSuccess = () => {
    setShowModal(false);    
    setShowChildren(true);
  };

  const onAddCancel = () => {
    setShowModal(false);    
  };
  const onAnswerChange = (e) => {
    setAnswerText(e.target.value);    
  };
 
//const answersStr = <Plural count={childrenCount} i18nextPath="answers.plural" />;

    return(
      <>
    
        <div className={styles.Card} 
           // style={{padding: pad}}
            >
          {!ellipseAnswers && <div className={styles.title} style={{padding: pad}}>
            <qheader className={styles.qheader} lang='ru' style={{hyphens: "auto"}} >
              {title}
            </qheader>  
            <div style={{
                          display: "flex", 
                          justifyContent: "flex-start",
                          marginTop: "15px",
                          }}
            >
              <div className={styles.branchLabel}>
                {branch}
              </div>  
              {subbranch && <div className={styles.branchLabel} style={{marginLeft: "5px"}}>
                {subbranch}
              </div> } 
            </div>  
          </div>}
          <div lang='ru' className={styles.contentStyle} style={{marginTop: pad, marginLeft: pad, marginRight: pad}}>
            <Paragraph 
              ellipsis={
                  {
                      rows: 5,
                      expandable: false,
                     // symbol: moreStr,
                     symbol: '',
                      tooltip: false,
                    }
                }
                style={{marginBottom: "0px"}}
                >
              {description}
            </Paragraph>
          </div>
          <div className={styles.cardFooter} style={{
                        display: "flex",
                        justifyContent : "space-between",
                        alignItems: "base-line",
                        width: "100%",
                        flexWrap: 'wrap',
                        padding: pad,
                      }}
            >
                  <div style={{
                              display: "flex",
                              flexDirection: "column",
                           //   marginTop: pad,
                            }}
                  >
                        <div
                          style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          flexWrap: "wrap",
                        }}
                        >
                            <PublishedDate 
                                style={{marginRight: "10px"}} 
                              // width = {"170px"} 
                                currDate = {date} 
                                textColor = "#babec5"
                                imageColor = "#babec5"
                                imageStyle = {{
                                  fontSize: `19px`, 
                                  fontWeight: "450"
                                  }}
                                format="DD MMM YYYY"  
                              />
                            <div style={{fontWeight: "600", fontSize: "16px", marginRight: "10px", color: "#babec5",whiteSpace: "nowrap"}}>
                              {authorName}
                            </div> 
                        </div>

                        {cityName && <div
                          style={{
                            display: "flex",
                            justifyContent : "flex-start",
                            alignItems: "center",
                            flexWrap: 'nowrap',
                            //marginTop: pad,
                          
                          }}
                        >
                            <EnvironmentOutlined 
                                          style={{
                                          //  color : "#CED3DB", 
                                            color: "#babec5",
                                            fontSize: `19px`, 
                                            fontWeight: "600",
                                            //marginLeft: "10px"
                                            }}/>
                            <div  style={{
                                          marginLeft: "5px", 
                                          fontSize: "16px",
                                          color: "#babec5",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis",
                                        }}
                            >
                              {cityName}
                            </div>
                        </div>}     
                    </div> 
            
             

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
         //       marginTop: pad,
              }}
            >
              {!ellipseAnswers &&
               <span className={styles.ellipseAnswers}
                     style={{whiteSpace: "nowrap"}}
               >
                  <Plural count={childrenCount} i18nextPath="answers.plural" /> 
              </span>
               
                }

 {/* <div 
                className={styles.ellipseAnswers}
                style={{marginRight: pad, whiteSpace: "nowrap"}}>
                 */} 
   
                  {/* {childrenCount>0 && 
                  <span >
                      <Plural count={childrenCount} i18nextPath="answers.plural" /> 
                  </span>}
                  {childrenCount==0 && 
                  <span >
                      Нет ответов
                  </span>} 
                  </div>
                  */}
                


            </div>  


          </div>

          {/* {isExpert && ellipseAnswers && 
             <div className={styles.answerCard} style={{marginTop: pad}}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: "20px",
                  }}
                >
                   <span style={{fontSize: '20px', fontWeight: "600", lineHeight: '22px'}}>Ваш ответ</span>
                   <Button type="primary" 
                      ghost 
                      style={{fontSize: "18px", lineHeight: '20px'}}
                      onClick={onAnswerSave}
                      >
                      Опубликовать ответ
                    </Button>
                </div>

                <TextArea
                        autoSize={{
                          minRows: 3,
                          maxRows: 5,
                        }}
                     //   maxLength={150}
                        size={theme.size}
                        onChange={onAnswerChange}
                        value={answerText}
                      //  status={errorStatus && (!qBody||qBody==='') ? "error" : null}
                  />
             </div>} */}
                    
          {/* {showChildren && 
        
          <div className={styles.answersBlock} style={{marginTop: pad, padding: '0px'}}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{fontSize: '20px', fontWeight: "600", lineHeight: '22px'}}>Ответы специалистов</span>
              {!isExpert && <span className={styles.answers}>
                      <Plural count={childrenCount} i18nextPath="answers.plural" /> 
                  </span>}
            </div>
            {ANSWERS}
          </div>} */}
        </div>

  </>
    )
  }

  //***************************************************************************************************** */


  export function AnswerCard ({author, date, text, pad, style}) {

    const theme = useThemeContext();

    const userImage = author.avatar?.data?.attributes?.url?? '';
    const userOnline = false;
    const username=  `${author.name} ${author.surname}`;
    const spec = author.expert.data.attributes.specializations?.data[0]?.attributes?.name?? '';
    const cityName = theme.cities.find(city => city.id === author.city)?.city?? '';

    return (
      <>
      <div className={styles.answerCard} style={style}>
        <div className={styles.userWrapper}>
              <div className={styles.leftUserBox}>
        
                <UserImage
                    image= {userImage}
                    online={userOnline}
                    width= {35}
                   // username={username}
                />
                <div className={styles.nameBox}>
                    <span style={{fontSize: "18px", lineHeight: "20px"}}>{username}</span>
                    <span style={{color: "#5E6674", fontWeight: "400", fontSize: "16px", lineHeight: "16px"}}> {spec}</span>
                    <span style={{color: "#5E6674", fontWeight: "400", fontSize: "16px", lineHeight: "16px"}}> {`${cityName !== '' ? 'г.' : ''} ${cityName}`}</span>
                </div>    
              </div>
              <Button type="primary" ghost icon={<MessageOutlined />} style={{minWidth: "40px", borderRadius: '25%'}}>
               {/*  {theme.id !== "xs" && theme.id !== "sm" ? "Написать" : ''} */}

              </Button>  
          </div>  
          <div lang='ru' className={styles.contentStyle} style={{marginLeft: '65px', marginTop: "15px", marginBottom: "15px"}}>
              {parse(text)}
            </div>  
          <div style={{display:"flex", justifyContent: "flex-start", marginLeft: '15px', marginBottom: '15px'}}>
              <span style={{color: "#5E6674", fontWeight: "400", fontSize: "14px", lineHeight: "16px"}}>{moment(date).format('DD MMM YYYY    hh:mm')}</span>
            </div>  
      </div>
      </>
    )
  }