import React, { useContext, useState } from 'react';

import Link from 'next/link';
import styles from './taskInfo.module.less';
import { Divider } from 'antd';
import PublishedDate from '../../src/components/publishedDate/publishedDate';

import { useThemeContext } from '../../src/context/themeContext';
import { useUserContext } from '../../src/context/userContext';
import moment from 'moment';
import UserImage from '../../src/components/userImage/userImage';
import RatingBar from '../../src/components/ratingbar/ratingbar';
import { Typography, Row, Col, Button } from 'antd';
//import Icons from '../../Utils/icons';
import Plural from '../../utils/plural';
import { useTranslation } from 'react-i18next';

import { ResponseCard } from '../../src/components/commentCard/commentCard';
import {ResponseImages} from '../../src/components/taskCard/taskCard';

import {EnvironmentOutlined} from '@ant-design/icons';

const { Paragraph } = Typography;
let theme = {};

export default function TaskInfo ({title, 
                                       id, 
                                       text,
                                       isOwner = false,
                                       responses = [],
                                       userResponse,
                                       userCityName, 
                                       performer, 
                                       userImage,
                                       userOnline, 
                                       username, 
                                       branches,
                                       specialization,
                                       marginTop = "0px",
                                       documents=[],
                                       expandedText = false,
                                       showAnswers = true,
                                       onChoosePerformer

                                      }) {

    theme = useThemeContext();  

    const [addComment, setAddComment] = useState(false);

    


const p = theme?.gutters?.gorizontal[theme?.id]?? 20;

    const pad = `${p}px ${p}px ${p}px ${p}px`;
    const respPad = `${p}px ${p}px ${p <= 30 ? "30px" : pad} ${p}px`
    const respMt = `${p}px`;

    const branchElements = branches.map(item => {
        
        return (

            <div className={styles.branchLabel}>
                {item.attributes.name}
            </div>

        )
    })


    const files = documents.map(item => {
        return (
            <Col span = {8}>
                <div className={styles.files}>
                    {item.name}
                </div>
            
            </Col>

        )
    })



    const thisOnChoosePerformer = (value) => {
        onChoosePerformer?.(value)
         };
        

    const responseCards = responses.map(item => {
        const {id, published_at, text, user} = item;
       
   
        return (
        
            <ResponseCard
                    key = {id}
                    user = {user}
                    date={published_at}
                    content = {text}
                    responseId = {id}
                    isOwner = {isOwner}
                    onChoosePerformer = {thisOnChoosePerformer}                 
                    source = {{table: 'discussions', field: 'response'}}
                    performer = {performer}    
                    
                    >
                        
                 </ResponseCard>  
        )         
    });



return(
   <>     
          <div
            className={styles.card}
            style = {{marginTop: marginTop, padding: pad}}
            >

            <div className={styles.headers}> Основная информация </div>    
            <Row style = {{marginTop: "20px"}}>
               {/*  <Col  xs={24} sm={24} md={8} lg={8} xl={8} >
                    <div className={styles.flexBlock}>
                        <span className={styles.labelClass}> Необходимая квалификация</span>
                        <span className={styles.specLabel}>{specialization}</span>
                    </div>
                </Col> */}
                {/* <Col  xs={24} sm={24} md={16} lg={16} xl={16} > */}
                <Col  xs={24} sm={24} md={24} lg={24} xl={24} >
                    <div className={styles.flexBlock}>
                        <span className={styles.labelClass}> Отрасли права, к которым относится задача</span>
                        <div className={styles.branchBlock}>
                            {branchElements}
                        </div>
                    </div>
                </Col>
            </Row>
            <div className={styles.flexBlock}>
                <span className={styles.labelClass}> Описание задачи</span>
                <p className={styles.description}>
                    {text}
                </p>
            </div>
            <div className={styles.headers} style ={{marginTop: "50px"}}> Прикрепленные документы </div>
            <Row gutter = {[theme?.gutters?.gorizontal, theme?.gutters?.vertical]} style ={{marginTop: "20px"}}>
                 {documents.length > 0 && files}   
                 {documents.length == 0 &&
                  <Col  xs={24} sm={24} md={12} lg={12} xl={12} >
                        <div className={styles.files}>
                            Нет прикрепленных документов
                        </div>
                    
                    </Col>}
            </Row>
            <div className={styles.headers} style ={{marginTop: "50px"}}> Постановщик задачи </div>
            <div className={styles.userBlock} style={{marginTop: "20px"}}>
                <UserImage
                    image= {userImage}
                    online={userOnline}
                    width= {60}
                    username={username}
                />
                <div className={styles.nameBox}>
                    <span style={{fontSize: "16px"}}>{username}</span>
                    <div style={{display: "flex", 
                                flexWrap: "nowrap", 
                                marginTop: "10px",
                                alignItems: 'center',
                                }} >
                            {userCityName && userCityName !== '' && <EnvironmentOutlined 
                            style={{
                                //color : "#CED3DB", 
                                fontSize: `16px`, 
                                color : "darkgrey",
                                //fontWeight: "600"
                                }}
                            />}

                            <span style={{
                                            marginLeft: "10px", 
                                            fontWeight: 400, 
                                            fontSize: "14px",
                                            //color : "#CED3DB", 
                                            color : "darkgrey",
                                            }}>
                                {userCityName}
                            </span>
                        </div>
                </div>    
            </div>


          </div>
              {!isOwner && userResponse && 
                 <div className={styles.card}
                    style = {{minHeight: "50px", padding: pad, marginTop: respMt}}
                  >
                 <div className={styles.headers} style ={{marginBottom: "20px"}}> Ваш отклик </div>     
                 {/* <CommentCard
                    commentId = {userResponse.id}
                    username = {`${userResponse.user?.name} ${userResponse.user?.surname}`}
                    userImage = {userResponse.user?.avatar?.length ? userResponse.user?.avatar?.url : ''}
                    userOnline = {false}
                    stars = {0}
                    reviews = {"0"}
                    cups = {0}
                    date={userResponse.published_at}
                    content = {userResponse.text}
                    likes = {0}
                    dislikes = {0}
                    articleId = {id}
                    
                    >
                 </CommentCard>   */}

                 <ResponseCard
                    key = {userResponse.id}
                    user = {userResponse.user}
                    date={userResponse.published_at}
                    content = {userResponse.text}
                    responseId = {userResponse.id}
                    isOwner = {false}
                    
                    source = {{table: 'discussions', field: 'response'}}
                    
                    >
                        
                 </ResponseCard>  
                 </div>}
                {isOwner && responses.length>0 &&
                 <div className={styles.card}
                    style = {{minHeight: "50px", padding: pad, marginTop: respMt}}
                  >
                    <div className={styles.headers} style ={{marginBottom: "20px"}}> Отклики </div>  
                    <Row gutter = {[0, 20]}   style={{width: "100%"}}>
                        {responseCards}
                    </Row>   
                 </div>}   
</>
 
 
  )
}


export function SideTaskInfo ({contractual, 
                               id,
                               budget, 
                               cityName, 
                               published_at, 
                               responses, 
                               userJWT, 
                               myTask,
                               showRespBtn=true,
                               showConfirmBtn=false,
                               onRespond}) {

    const {t} = useTranslation();
    
   
    const p = theme?.gutters?.gorizontal[theme?.id]?? 20;
    const pad = `${p}px`;
    const currDate = new Date(published_at);

    const onBtnClick = () => {
        onRespond?.();
    };

    const onConfBtnClick = () => {
        console.log("Подтвердил");
    };

    const onEditClick = () => {
        navigate(`edittask`);
    };

    

    return (
        <>
        <div className={styles.card}
            style = {{padding: `${pad} ${pad} ${p <= 30 ? "30px" : pad} ${pad}`}}
         >
            {!contractual && <span className ={styles.price}>{budget}&nbsp;&#8381;</span>}
            {contractual && <span style={{
                                    fontSize: "24px", 
                                    color: "#0066FF"}}>
                                        По договоренности
                            </span>} 
            <div style={{
                        display: "flex", 
                        flexWrap: "nowrap", 
                        marginTop: "20px", 
                        marginBottom: "20px"}} >
                <EnvironmentOutlined style={{
                                        fontSize : "20px", 
                                        color : "#5E6674"}} />
                <span style={{
                                marginLeft: "10px", 
                                fontWeight: "500", 
                                fontSize: "18px",
                                color : "#5E6674",
                                }}>
                    {cityName}
                </span>
            </div>
            <PublishedDate 
                showEye ={false} 
                marginLeft = "0px" 
                currDate = {currDate} 
                textColor = "#5E6674" 
                imageStyle = {{
                                fontSize : `22px`, 
                                fontWeight : "500",
                                color: "#5E6674",
                            }}/>
            {/* <div className={styles.responsesBlock} style={{height: theme?.elementHeight}}>
                {responses.length>0 ? <Plural count={responses.length} i18nextPath="responses.plural" /> : "Нет откликов"}
            </div> */}
            <div style={{marginTop: "20px"}}>
                <ResponseImages responses={responses}/>
            </div>
            {!myTask && showRespBtn && <Button 
                size={theme?.size} 
                style={{width: "100%", marginTop: "30px"}}
                type="primary" 
                htmlType="button"
                onClick={onBtnClick}
                disabled = {!userJWT}
                >
                    {t('buttons.responseTask')}
            </Button>}
            {!myTask && showConfirmBtn && <Button 
                size={theme?.size} 
                style={{width: "100%", marginTop: "30px"}}
                type="primary" 
                htmlType="button"
                onClick={onConfBtnClick}
                disabled = {!userJWT}
                >
                    {t('buttons.confirmTask')}
            </Button>}
            {myTask && <Button 
                size={theme?.size} 
                style={{width: "100%", marginTop: "30px"}}
                type="primary" 
                htmlType="button"
                onClick={onEditClick}
                disabled = {!userJWT}
                >
                    {t('buttons.editTask')}
            </Button>}
            {!userJWT && !showRespBtn &&
                <div className={styles.loginDiv}>
                    Чтобы откликнуться на задачу, вам необходимо
                    <Link to = "/auth">
                        Войти или зарегистироваться
                    </Link>
                </div>
            }
        </div>

       
        </>
    )
}

/* 
export function ResponseImages ({responses}) {
    const userImages = responses.slice(0,4).map(({user}) => {
        if (!user) {
            return null
        }
        const {name: username, surname}  = user;
        const userImage= user?.avatar?.url?? '';

        return (
            <div style={{display:"inline-block", marginLeft: "-20px", zIndex: "1"}}>
            
             
                <UserImage 
                    image= {userImage}
                    online={false}
                    width= {45}
                    username={username?? ''}
            />  
           </div>
        )
    });

    return (
        <>
        <div style={{display: "flex", paddingLeft: "20px"}}>
            {userImages}
            {responses.length>4 && <div className={styles.responsesBlock}>
                +
                 <Plural count={responses.length-4} i18nextPath="responses.plural" /> 
            </div> }
        </div>
        </>
    )
} */