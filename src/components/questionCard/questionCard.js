import React, {useContext, useState} from 'react';

import { Typography } from 'antd';
import { useQuery, useQueryClient, useMutation } from 'react-query';


import axios from 'axios';

import styles from './questionCard.module.less';
import UserImage from '../userImage/userImage';
import Plural from '../../../utils/plural';

import moment from 'moment';

import { Col, Row, Pagination, Modal, Button,Input } from 'antd';

import {CaretDownOutlined, CaretUpOutlined} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
import {useUserContext} from '../../context/userContext';
import {useThemeContext} from '../../context/themeContext';
import { createStrapiAxios } from '../../../utils/strapi';
import PublishedDate from '../publishedDate/publishedDate';
import {EnvironmentOutlined} from '@ant-design/icons';


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
                                      }) {

  const [ellipsis, setEllipsis] = useState(true);
  const [showModal, setShowModal]  = useState(false);
  
  const {currentUser} = useUserContext();

  const theme = useThemeContext();

  const {t} = useTranslation();
  
  const moreStr = <span style={{color: "#0066FF", fontWeight: "600"}}>{`>>>>`}</span>;
  
  const userJWT = currentUser.jwt;
  
  const currDate = new Date(date);

  const cityName = theme.cities.find(city => city.id === authorCity)?.city;

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

const answersStr = <Plural count={childrenCount} i18nextPath="answers.plural" />;

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
        <div className={styles.Card}>
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
          <div lang='ru' className={styles.contentStyle}>
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
                }>
              {description}
            </Paragraph>
          </div>
          <div style={{
                        display: "flex",
                        justifyContent : "space-between",
                        alignItems: "base-line",
                        width: "100%",
                      }}
          >
            <div style={{
                        display: "flex",
                        justifyContent : "flex-start",
                        alignItems: "center",
                       
                      }}
            >
                 <PublishedDate 
                    style={{marginRight: "10px"}} 
                  // width = {"170px"} 
                    currDate = {currDate} 
                    textColor = "#babec5"
                    imageColor = "#babec5"
                    
                  />
                  <div style={{fontWeight: "600", fontSize: "16px", marginRight: "10px", color: "#babec5",}}>
                    {authorName}
                  </div>  
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
                              }}
                  >
                    {cityName}
                  </div>
            </div>  
          </div>
        </div>
  </Col>
  </>
    )
  }

  export const AddEntryDialog = ({articleId, currParent, onSuccess, onCancel}) => {


    const {currentUser} = useUserContext();
    const userJWT = currentUser.jwt;
    const userId = currentUser.id;
  

    if (!userJWT) {
      return null;
    }

    const queryClient = useQueryClient();
    const [modalText, setModalText] = useState('');

    const mutation = useMutation((newComment) =>
    axios.post(`${process.env.NEXT_PUBLIC_API}/comments`, 
                newComment, 
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
