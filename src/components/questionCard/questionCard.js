import React, {useContext, useState} from 'react';

import { Typography } from 'antd';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import Link from 'next/link';

import axios from 'axios';

import styles from './questionCard.module.less';
import UserImage from '../userImage/userImage';
import Plural from '../../../utils/plural';

import moment from 'moment';

import { Col, Row, Pagination, Modal, Button,Input } from 'antd';

import {CaretDownOutlined, CaretUpOutlined, EnvironmentOutlined, WechatOutlined} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
import {useUserContext} from '../../context/userContext';
import {useThemeContext} from '../../context/themeContext';
import { createStrapiAxios } from '../../../utils/strapi';
import PublishedDate from '../publishedDate/publishedDate';

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

  const [ellipsis, setEllipsis] = useState(true);
  const [showModal, setShowModal]  = useState(false);
  
  const {currentUser} = useUserContext();
  const [showChildren, setShowChildren] = useState(false);
  theme = useThemeContext();

  const {t} = useTranslation();
  
  const moreStr = <span style={{color: "#0066FF", fontWeight: "600"}}>{`>>>>`}</span>;
  
  const userJWT = currentUser.jwt;
  
  const currDate = new Date(date);

  const cityName = theme.cities.find(city => city.id === authorCity)?.city;

  const p = theme?.gutters?.gorizontal[theme?.id];

  const pad = `${p}px`;


const ANSWERS = answers.map(item=>{
  console.log("ANSWER--------------------------------------------------------------", item);

  return (
    <AnswerCard
      author={item.attributes.author.data.attributes}
      text = {item.attributes.text}
      date={item.attributes.publishedAt}
      pad={pad}
    />
  ) 
});


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

//const answersStr = <Plural count={childrenCount} i18nextPath="answers.plural" />;

    return(
      <>
      {showModal && 
        <AddEntryDialog
          articleId = {articleId}
          currParent = {commentId?? null}
          // userJWT = {userJWT?? null}
          // userId = {userId?? null}
          queryName = {queryName}
          onSuccess = {onAddSuccess}
          onCancel = {onAddCancel}
          //source = {source}
          // userId = {userId}
          />
      }

      <Col span={24}>
        <div className={styles.Card} style={{padding: pad}}>
          <div className={styles.title}>
            <div lang='ru' style={{hyphens: "auto"}}>
              {title}
            </div>  
            <div style={{
                          display: "flex", 
                          justifyContent: "flex-start",
                          marginTop: "15px",
                          }}
            >
              <div className={styles.branchLabel}>
                {branch}
              </div>  
              <div className={styles.branchLabel} style={{marginLeft: "5px"}}>
                {subbranch}
              </div>  
            </div>  
          </div>
          <div lang='ru' className={styles.contentStyle} style={{marginTop: pad}}>
            <Paragraph 
              ellipsis={
                  ellipsis
                    ? {
                      rows: 5,
                      expandable: true,
                      symbol: moreStr,
                      tooltip: false,
                    }
                    : false
                }
                style={{marginBottom: "0px"}}
                >
              {description}
            </Paragraph>
          </div>
          <div style={{
                        display: "flex",
                        justifyContent : "space-between",
                        alignItems: "base-line",
                        width: "100%",
                        flexWrap: 'wrap',
                      }}
          >
            <div style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: pad,
                      }}
            >
              <div
                style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
              >
                 <PublishedDate 
                    style={{marginRight: "10px"}} 
                  // width = {"170px"} 
                    currDate = {currDate} 
                    textColor = "#babec5"
                    imageColor = "#babec5"
                    imageStyle = {{
                      fontSize: `19px`, 
                      fontWeight: "450"
                      }}
                  />
                  <div style={{fontWeight: "600", fontSize: "16px", marginRight: "10px", color: "#babec5",whiteSpace: "nowrap"}}>
                    {authorName}
                  </div> 
              </div>

                  <div
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
                   </div>     
            </div> 
            
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                marginTop: pad,
              }}
            >
              {!ellipseAnswers &&
                <div 
                className={styles.ellipseAnswers}
                style={{marginRight: pad, whiteSpace: "nowrap"}}>
   
                  {childrenCount>0 && 
                  <span >
                      <Plural count={childrenCount} i18nextPath="answers.plural" /> 
                  </span>}
                  {childrenCount==0 && 
                  <span >
                      Нет ответов
                  </span>}
                </div>}

            {/*   <button className={styles.answerBtnBorder} disabled={!userJWT } onClick = {onAnswerBtn}>
                  {t('buttons.answer')}
              </button> */}
{/*               <Button type="primary" 
                      ghost 
                      style={{fontSize: "18px", lineHeight: '20px'}}
                      
                      >
                {t('buttons.answer')}
              </Button> */}
            </div>  


          </div>
                    
          {/* {showChildren &&  */}
          {ellipseAnswers &&
          <div className={styles.answersBlock} style={{marginTop: pad, padding: '0px'}}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: pad,
              }}
            >
              <p style={{fontSize: '20px', fontWeight: "600", lineHeight: '22px'}}>Ответы специалистов</p>
              <span className={styles.ellipseAnswers}>
                      <Plural count={childrenCount} i18nextPath="answers.plural" /> 
                  </span>
            </div>
            {ANSWERS}
          </div>}
        </div>
  </Col>
  </>
    )
  }

  //***************************************************************************************************** */

  export const AddEntryDialog = ({questionId, onSuccess, onCancel}) => {


    const {currentUser} = useUserContext();
    const userJWT = currentUser.jwt;
    const userId = currentUser.id;
  

    if (!userJWT) {
      return null;
    }

    const queryClient = useQueryClient();
    const [modalText, setModalText] = useState('');

    const mutation = useMutation((newAnswer) =>
    axios.post(`${process.env.NEXT_PUBLIC_API}/answers`, 
                newAnswer, 
                {
                   headers: {
                    Authorization: `Bearer ${userJWT}` }
                }    
              )
    );

    const onModalChange = (e) => {
      setModalText(e.target.value);
    };

    const handleOk = () => {

      const mutateValue = {
        "data": {
          "author": userId,
          "text": modalText, 
          "article": articleId,
          "parent": currParent,
          }
        }

    mutation.mutate(mutateValue,
                      {
                        onSuccess: () => {
                         
                          queryClient.invalidateQueries(["comments", articleId, currParent]);
                          queryClient.invalidateQueries(["commentChildren", currParent]);
                          onSuccess();
                        }
                      }
      );
    };
  
    return (
      <Modal
        visible={true}
        title="Ваш комментарий"
        onOk={handleOk}
        onCancel={() => onCancel()}
        footer={[
          <Button key="cancel" 
            onClick={() => onCancel()}
            >
            Отмена
          </Button>,
          <Button key="submit" type="primary" 
            onClick={handleOk}
            >
            Сохранить
          </Button>,
          
        ]}
      >
        <TextArea rows={4} onChange = {onModalChange} value = {modalText}/>
      </Modal>

    )
  }

  export function AnswerCard ({author, date, text, pad}) {

    const theme = useThemeContext();

    const userImage = author.avatar.data.attributes.url?? '';
    const userOnline = false;
    const username=  `${author.name} ${author.surname}`;
    const spec = author.expert.data.attributes.specializations.data[0]?.attributes?.name?? '';
    const cityName = theme.cities.find(city => city.id === author.city)?.city;

    return (
      <>
      <div className={styles.answerCard} style={{marginTop: pad}}>
        <div className={styles.userWrapper}>
              <div className={styles.leftUserBox}>
        
                <UserImage
                    image= {userImage}
                    online={userOnline}
                    width= {55}
                   // username={username}
                />
                <div className={styles.nameBox}>
                    <span style={{fontSize: "18px", lineHeight: "20px"}}>{username}</span>
                    <span style={{color: "#5E6674", fontWeight: "400", fontSize: "16px", lineHeight: "16px"}}> {spec}</span>
                    <span style={{color: "#5E6674", fontWeight: "400", fontSize: "16px", lineHeight: "16px"}}> {`г. ${cityName}`}</span>
                </div>    
              </div>
              <Button type="primary" ghost icon={<WechatOutlined />}>
                Написать
              </Button>  
          </div>  
          <div lang='ru' className={styles.contentStyle} style={{marginLeft: '65px', marginTop: "15px", marginBottom: "15px"}}>
              {text}
            </div>  
          <div style={{display:"flex", justifyContent: "flex-start"}}>
              <span style={{color: "#5E6674", fontWeight: "400", fontSize: "14px", lineHeight: "16px"}}>{moment(date).format('DD MMM YYYY    hh:mm')}</span>
            </div>  
      </div>
      </>
    )
  }