import React, {useContext, useState} from 'react';

import { Typography } from 'antd';
import { useQuery, useQueryClient, useMutation } from 'react-query';


import axios from 'axios';

import styles from './commentCard.module.less';
import UserImage from '../../components/userImage/userImage';
import Plural from '../../../utils/plural';

import moment from 'moment';

import { Col, Row, Pagination, Modal, Button,Input } from 'antd';

import {CaretDownOutlined, CaretUpOutlined} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
import {useUserContext} from '../../context/userContext';
import { createStrapiAxios } from '../../../utils/strapi';


const { Paragraph } = Typography;
const { TextArea } = Input;

export default function CommentCard ({commentId, 
                                      userImage, 
                                      userOnline, 
                                      username, 
                                      date, 
                                      content, 
                                      likes=0, 
                                      dislikes=0, 
                                      nested = false, 
                                      articleId,
                                      queryName, 
                                      isOwner=false,
                                      ...props}) {

  const [ellipsis, setEllipsis] = useState(true);
  const [showChildren, setShowChildren] = useState(false);
  const [showModal, setShowModal]  = useState(false);
  //const [childrenCount, setChildrenCount]  = useState(0);
  

  const {currentUser} = useUserContext();

  const {t} = useTranslation();
  
  const moreStr = <span style={{color: "#0066FF", fontWeight: "600"}}>{`>>>>`}</span>;
  
  const userJWT = currentUser.jwt;
  
  const {isSuccess,
    isLoading,  
    isFetching,
    isError,
    data: { data = [] , meta = null} = {} }  = useQuery(["commentChildren", commentId],
                                         () => getComments(commentId),
                                       {
                                         keepPreviousData: true,
                                         refetchOnMount: false,
                                         refetchOnWindowFocus: false,
                                       }
                                     );
  
let childrenCount = 0;

if (isSuccess) {
  childrenCount = meta.pagination.total;
}

  const expandBtnText = `${t('buttons.expandComments')} (${childrenCount})`

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
        <div className={styles.commentCard}>
          <div className={styles.userWrapper}>
            <div className={styles.leftUserBox}>
      
              <UserImage
                  image= {userImage}
                  online={userOnline}
                  width= {35}
                  username={username}
              />
              <div className={styles.nameBox}>
                  <span style={{fontSize: "16px"}}>{username}</span>
                  <span style={{color: "#5E6674", fontWeight: "400", fontSize: "14px", lineHeight: "16px"}}>{moment(date).format('DD MMM YYYY    hh:mm')}</span>
              </div>    
            </div>

          </div>  
          <div className={styles.contentStyle}>
            <Paragraph 
              style={{marginBottom: "5px"}}
              ellipsis={
                ellipsis
                  ? {
                    rows: 3,
                    expandable: true,
                    symbol: moreStr,
                    tooltip: false,
                  }
                  : false
              }>
            {content}
            </Paragraph>
          </div>
         
          <div className={styles.likesBox}>
                                                    
                                                    {/*  {childrenCount>0 && 
                                                    <Button 
                                                        //type="text" 
                                                        icon={!showChildren ? <CaretDownOutlined /> : <CaretUpOutlined />}
                                                        onClick={() => setShowChildren(!showChildren)}
                                                      >
                                                        <Plural count={childrenCount} i18nextPath="answers.plural" /> 
                                                      </Button>} */}

              {childrenCount>0 && 
                <div 
                  className={styles.ellipseAnswers}
                  onClick={() => setShowChildren(!showChildren)}
                >
                  {!showChildren ? <CaretDownOutlined /> : <CaretUpOutlined />}
                  <span 
                    style={{
                      marginLeft: "5px"
                    }}
                  >
                      <Plural count={childrenCount} i18nextPath="answers.plural" /> 
                  </span>
                
                </div>}

              <button className={styles.answerBtn} disabled={!userJWT } onClick = {onAnswerBtn}>
                  {t('buttons.answer')}
              </button>

              
          </div>

                   
          {showChildren && 
          <div className={styles.commentsBlock}>
            {props.children}
          </div>}
    </div>
  </Col>
  </>
    )
  }


async function getComments(commentId) {

  
  const data = await createStrapiAxios()
 .get(`/comments?filters[parent]=${commentId}`)
 .then(res => res.data)
 .catch(e => console.log("ERROR in getComments --------", e));
 return (data) 

};



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
