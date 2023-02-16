
import React, {useEffect, useState} from 'react';

import { useQuery, useMutation, useQueryClient } from "react-query";

import { useRouter } from "next/router";

import styles  from './question.module.less';

import { Pagination, Row, Col, Button } from 'antd'; 

import PublishedDate from '../../src/components/publishedDate/publishedDate';

import { useThemeContext } from '../../src/context/themeContext';
import { useUserContext } from '../../src/context/userContext';
import PageContainer from '../../src/components/layouts/pageContainer';
import PageHeader from '../../src/components/layouts/pageHeader';

import { createStrapiAxios } from '../../utils/strapi';
import QuestionCard from '../../src/components/questionCard/questionCard';
import {AnswerCard} from '../../src/components/questionCard/questionCard';
import SideFilter from '../../src/components/SideFilter/sideFilter';
import {AskQuestionSideBlock} from '../../src/components/SideFilter/sideFilter';

import cardStyles from '../../src/components/questionCard/questionCard.module.less';
import { Typography, Input } from 'antd';
import Plural from '../../utils/plural';
import {CaretDownOutlined, CaretUpOutlined, EnvironmentOutlined, StopTwoTone, InfoCircleOutlined} from '@ant-design/icons';

import axios from 'axios';

const { Paragraph } = Typography;
const { TextArea } = Input;

export default function Question({serverQuestion}) {

  const {currentUser} = useUserContext();
  
 const userId = currentUser?.id;
 const userJWT = currentUser?.jwt;
 
  const [sectionMinHeigth, setSectionMinHeigth] = useState(''); 
  const [showChildren, setShowChildren] = useState(false );
  const [answerText, setAnswerText]  = useState('');
  const [isExpert, setIsExpert]  = useState(false);
  const [errorStatus, setErrorStatus]  = useState(false);


  const queryClient = useQueryClient();

  const THEME = useThemeContext();
const theme=THEME;

  const router = useRouter();
  
  const {id} = router.query;
   
    const {isSuccess,
           isLoading,  
           data: {data: question = {}, meta: meta = null} = {} }  = useQuery(["question", id],
                                                () => getQuestion(id),
                                              {
                                                keepPreviousData: true,
                                                refetchOnMount: false,
                                                refetchOnWindowFocus: false,
                                                initialData: serverQuestion 
                                              }
                                            );


  const total = meta?.pagination?.total?? 0;


 
const item=question.attributes;
const questionId = question.id;
   
      const authorName = item.author.data.attributes.name;
      const authorSurname = item.author.data.attributes.surname?? '';
      const authorAvatar = item.author.data.attributes.avatar.data.attributes.url?? '';
      const authorCity = item.author.data.attributes.city;
      const branchName = item.branch?.data?.attributes?.name?? '';
      const subbranchName = item.subbranch?.data?.attributes?.name?? '';
      const description = item.description;
      const title = item.title;
      const date = item.publishedAt;
      const childrenArr=item.answers.data?? [];
      const childrenCount = childrenArr.length;

      const cityName = theme.cities.find(city => city.id === authorCity)?.city;
      const currDate = new Date(date);
      
 const p = THEME?.gutters?.gorizontal[THEME?.id]?? 20;

 const pad = `${p}px`;


const ANSWERS = childrenArr.map(item=>{

  return (
    <AnswerCard
      author={item.attributes.author.data.attributes}
      text = {item.attributes.text}
      date={item.attributes.publishedAt}
      pad={pad}
    />
  ) 
});

const [unsavedChanges, setUnsavedChanges] = useState(false);

  const warningText =
    'Есть несохраненные изменения, покинуть страницу?';

  useEffect(() => {
    const handleWindowClose = (e) => {
      if (!unsavedChanges) return
      e.preventDefault()
      return (e.returnValue = warningText)
    }
    const handleBrowseAway = () => {
      if (!unsavedChanges) return
      if (window.confirm(warningText)) return
      router.events.emit('routeChangeError')
      throw 'routeChange aborted.'
    }
    window.addEventListener('beforeunload', handleWindowClose)
    router.events.on('routeChangeStart', handleBrowseAway)
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
      router.events.off('routeChangeStart', handleBrowseAway)
    }
  }, [unsavedChanges])

/* 
 useEffect(() => {
  if (typeof window !== 'undefined') {
    
      setSectionMinHeigth(`${document.documentElement.clientHeight-200-p}px`);
  }}, []); */

  useEffect(() => {
      if ( currentUser ) {
          if (!Object.keys(currentUser).length) {
            setIsExpert(false);    
            setShowChildren(true);
          }else {
            setShowChildren(!currentUser.status === 1);
            setIsExpert(currentUser.status === 1);
          }
        }
}, [currentUser]);

const onSuccess =() => {
  setAnswerText('');
  setUnsavedChanges(false);
}

const onAnswerChange = (e) => {
  setAnswerText(e.target.value);   
  if (e.target.value !== ''){
  setErrorStatus(false) 
  setUnsavedChanges(true)
}
};

const mutation = useMutation((newAnswers) =>
axios.post(`${process.env.NEXT_PUBLIC_API}/answers`, 
            newAnswers, 
            {
               headers: {
                Authorization: `Bearer ${userJWT}` }
            }    
          )
);

const onSendAnswer = () => {

if(!answerText || answerText==='') {
  setErrorStatus(true);
  return;
}

  const mutateValue = {
    "data": {
      "author": userId,
      "text": answerText, 
      "question": questionId,
      
      }
    }

mutation.mutate(mutateValue,
                  {
                    onSuccess: () => {
                     
                      queryClient.invalidateQueries(["question", id]);
                      
                      onSuccess();
                    },
                    onError: (e) => {
                      console.log("error in mutation------------------------------------------------", e);
                    }
                  }
  );
};




  return (

   
    <>
     {/*  <section style={{minHeight: sectionMinHeigth, width: "100%",}}> */}
        <PageHeader 
          /* title={t('headers.experts')} */
         // title={`Вопрос#${id}`}
         title={title}
        />
        <PageContainer>
         
        

                  <Col  xs={24} sm={24} md={16} lg={17} xl={18} 
                    //style={{padding: '0px'}}
                  > 

                    { !currentUser  && 
                        <div style={{
                          backgroundColor: "lightgrey",
                          width : "100%",
                          height: "420px",
                          borderRadius: "10px",
                        }}>

                        </div>
                    }

{/* ************************************************************************************************************************************************* */}    
                  {isSuccess && currentUser && <>
     
 <div className={cardStyles.Card} style={{padding: pad, marginBottom: "40px"}}>
         
          <div lang='ru' className={styles.contentStyle} >
          {/*   <Paragraph 
              ellipsis={
                  {
                      rows: 5,
                      expandable: false,
                      tooltip: false,
                    }
                }
                style={{marginBottom: "0px"}}
                > */}
              {description}
            {/* </Paragraph> */}
          </div>


          {isExpert &&
          <>
             <div className={cardStyles.answerCard} style={{marginTop: pad,}}>
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
                   { errorStatus &&
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <StopTwoTone twoToneColor="#F44336"/>
                        <div
                            text-align = {'left'} 
                            style={{
                              color: '#F44336', 
                              marginLeft:"5px",
                            }}
                            >
                                Введите текст ответа! 
                        </div>
                        
                      </div>
                    }
                   <Button type="primary" 
                      ghost 
                      style={{fontSize: "18px", lineHeight: '20px'}}
                      onClick={onSendAnswer}
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
                        status={errorStatus  ? "error" : null}
                  />
             </div>
             
            </> }

            { isExpert && <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  marginTop: pad,
                }}
              >          
                  {childrenCount>0 && <div 
                        className={cardStyles.ellipseAnswers}
                        onClick={() => setShowChildren(!showChildren)}
                      >
                        {!showChildren ? <CaretDownOutlined /> : <CaretUpOutlined />}
                        <span 
                          style={{
                            marginLeft: "5px",
                            lineHeight: '18px'
                          }}
                        >
                            <Plural count={childrenCount} i18nextPath="answers.plural" /> 
                        </span>
                  </div>}     
                  {childrenCount===0 &&
                  <span className={cardStyles.answers}>
                    Нет ответов
                  </span>
                  
                  }
               </div>}  
                    
          {showChildren && 
          <>
            {!isExpert && <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: pad
            }}
          >
            <span style={{fontSize: '20px', fontWeight: "600", lineHeight: '22px'}}>Ответы специалистов</span>
            <span className={cardStyles.answers}>
                    <Plural count={childrenCount} i18nextPath="answers.plural" /> 
                </span>
          </div>}        
          <div className={cardStyles.answersBlock} style={{padding: '0px'}}>
            {ANSWERS}
          </div>
          </>}
        </div>
             
             </> }

{/* ************************************************************************************************************************************************* */}                      
             </Col>

                <Col xs={0} sm={0} md={8} lg={7} xl={6} >
                   
                    <div className={styles.sideAskBlock} style={{padding: pad, }}> 
                      <span className={styles.sideBlockHeader}>
                          {`${authorName} ${authorSurname}`}
                      </span>
                    
                      <div
                          style={{
                            display: "flex",
                            justifyContent : "flex-start",
                            alignItems: "center",
                            flexWrap: 'nowrap',
                            marginTop: "10px",
                          
                          }}
                        >
                            <EnvironmentOutlined 
                                          style={{
                                          //  color : "#CED3DB", 
                                            color: "darkgrey",
                                            fontSize: `22px`, 
                                            fontWeight: "600",
                                            //marginLeft: "10px"
                                            }}/>
                            <div  style={{
                                          marginLeft: "5px", 
                                          fontSize: "18px",
                                          color: "darkgrey",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis",
                                        }}
                            >
                              {cityName}
                            </div>
                        </div>  
                        <PublishedDate 
                                style={{fontSize: "18px", marginTop: "10px",}} 
                              // width = {"170px"} 
                                currDate = {currDate} 
                                textColor = "darkgrey"
                                imageColor = "darkgrey"
                                imageStyle = {{
                                  fontSize: `22px`, 
                                  fontWeight: "500"
                                  }}
                              />   
                    </div>

                {!isExpert && <AskQuestionSideBlock style= {{padding: pad, marginTop: pad}}/>}
                </Col>
               
  
  
       </PageContainer>
       {/* </section> */}
    </>

        
  
   
  )
}

async function getQuestion(id) {

 
  const data = await createStrapiAxios()
 .get(`/questions/${id}?populate=deep`)
 .then(res => res.data)


 return (data) 

};



export async function getServerSideProps(context) {
  
  const {id} = context.query;

  const data = await getQuestion(id);

  
  return { props: { serverQuestion: data } }  
}