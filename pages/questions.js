
import React, { useEffect } from 'react';
import Link from 'next/link';

import { useQuery, dehydrate, QueryClient } from "react-query";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css'
import Plural from '../utils/plural';
import { useUserContext } from '../src/context/userContext';

import { useTranslation } from 'react-i18next'

import axios from 'axios';
import { createStrapiAxios } from '../utils/strapi';


import { Pagination, Row, Col, Button } from 'antd'; 

import SearchField from '../src/components/searchField/searchField';
/* import SideFilter from '../src/components/SideFilter/sideFilter'; */
import PageContainer from '../src/components/layouts/pageContainer';
import PageHeader from '../src/components/layouts/pageHeader';
import { useThemeContext } from '../src/context/themeContext';
import SideFilter from '../src/components/SideFilter/sideFilter';
import UserCard from '../src/components/userCard/userCard';
import QuestionCard from '../src/components/questionCard/questionCard';
import MyPagination from '../src/components/pagination';
import {AskQuestionSideBlock} from '../src/components/SideFilter/sideFilter'
const PAGESIZE = 5;


export default function Questions(
  {serverQuestions}
  ) {

  const {currentUser} = useUserContext();
  const [isExpert, setIsExpert]  = useState(false);

  const THEME = useThemeContext();


  const router = useRouter();
  const [page, setPage] = useState(1);

  const {search, branch, subbranch} = router.query;
   
    const {isSuccess,
           isLoading,  
           data: {data: questions = [], meta: meta = null} = {} }  = useQuery(["questions", page, search, branch, subbranch],
                                                () => getQuestions({page, search, branch, subbranch}),
                                              {
                                                keepPreviousData: true,
                                                refetchOnMount: false,
                                                refetchOnWindowFocus: false,
                                                initialData: serverQuestions ,
                                              }
                                            );

   useEffect(() => {
    if (router.query.page) {
      setPage(parseInt(router.query.page));
    }
  }, [router.query.page]); 
  
  useEffect(() => {
    if ( currentUser ) {
        if (!Object.keys(currentUser).length) {
          setIsExpert(false);    
        }else {
          setIsExpert(currentUser.status === 1);
        }
      }
}, [currentUser]);

  let QUESTIONS = [];
  let total = 0;

 if (isSuccess) {

    total = meta?.pagination?.total?? 0;

    QUESTIONS = questions.map((item, i) => {
  
      const authorName = item.attributes.author.data.attributes.name;
      const authorSurname = item.attributes.author.data.attributes.surname?? '';
     // const authorAvatar = item.attributes.author.data.attributes.avatar.data.attributes.url?? '';
      const authorCity = item.attributes.author.data.attributes.city;
      const branchName = item.attributes.branch?.data?.attributes?.name?? '';
      const subbranchName = item.attributes.subbranch?.data?.attributes?.name?? '';
      const description = item.attributes.description;
      const title = item.attributes.title;
      const date = item.attributes.publishedAt;
      const childrenArr=item.attributes.answers.data?? [];


      return(
        <>
        
         <Col  xs={24} sm={24} md={24} lg={24} xl={24}  xxl={24}>

         <Link href={`/question/${item.id}`} style={{ color: 'black', cursor: "pointer" }}> 
          
            <QuestionCard
               authorName={`${authorName} ${authorSurname}`}
               //authorAvatar = {authorAvatar}
               branch={branchName}
               subbranch={subbranchName}
               description={description}
               authorCity={authorCity}
               date={date}
               questionID = {item.id}
               childrenCount = {childrenArr.length}
               title={title}
               answers={childrenArr}
             />
          
          </Link>
      
        </Col>

        </>
      )
    });
    
  
 }

 const p = THEME?.gutters?.gorizontal[THEME?.id];

 const pad = `${p}px`;

 const pagination = () => {
  return(
    <div 
                  style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      paddingRight: THEME.isDesktop ? "0px" : "10px",
                  }}
                >
                  <MyPagination
                    page = {page}
                    total = {total}
                    pageSize = {PAGESIZE}
                    setPage = {setPage}
                  />
    
      {total>PAGESIZE && <>
     
      <p >
             <Plural count={total} i18nextPath="questions.plural" /> 
       </p>
       </>}
      
    </div>
)
 }


  return (

   
    <>
      
        <PageHeader 
          /* title={t('headers.experts')} */
          title="Вопросы и ответы"  
        />
        <PageContainer>
         
                 <Col  xs={24} sm={24} md={16} lg={17} xl={18} >
     
                  <SearchField 
                    style={{ width: "100%", marginTop: "0px", borderRadius: "10px", marginBottom: pad}} 
                    //placeholder={t('placeholders.searchExperts')}
                    placeholder="Введите строку для поиска"
                    />  
                    {!THEME.isDesktop && <SideFilter show = {{
                        city: false,
                        budget: false,
                        branch: true,
                        showreset: false,
                      }
                    }/>}
                {/* <ExpertList /> */}
               
                  {pagination()}
               


  
                {isSuccess && <div>
                  <Row 
                    style = {{width: `100%+${THEME?.gutters?.gorizontal[THEME?.id]}`, marginBottom: "20px"}} 
                    gutter={[pad, pad]}
                  >
                    {QUESTIONS}
                  </Row>
                 
                  </div>}
        {isLoading && <div style={{color: "red"}}>LOADING</div>}

                {pagination()}
                </Col>
                <Col xs={0} sm={0} md={8} lg={7} xl={6} >

                {!isExpert && 
                <AskQuestionSideBlock style={{padding: pad, marginBottom: pad}}/>}

                    <SideFilter show = {{
                        city: false,
                        budget: false,
                        branch: true,
                        showreset: false,
                      }
                    }/>   
                    
                </Col>
  
            {/* </Row> */}
  
       </PageContainer>
    </>

        
  
   
  )
}

async function getQuestions({page, search, branch, subbranch}) {

  let searchArr = []; 

  if (search) {
    searchArr.push(`filters[$or][0][title][$containsi]=${search}&filters[$or][1][description][$containsi]=${search}`);
  }
  if (branch) {
    searchArr.push(`filters[branch][id][$eq]=${branch}`);
  }
  if (subbranch) {
    searchArr.push(`filters[subbranch][id][$eq]=${subbranch}`);
  }
 

  searchArr.push(`pagination[page]=${page}&pagination[pageSize]=${PAGESIZE}`);
  
  searchArr.push(`sort[0]=publishedAt:desc`);

  let searchStr = searchArr.join("&");

  const data = await createStrapiAxios()

 .get(`/questions?populate=deep,2&${searchStr}`)
 .then(res => res.data)


 return (data) 

};



export async function getServerSideProps(context) {
   let page = 1;

   if (context.query.page) {
     page = parseInt(context.query.page);
   }

   const {search, branch, subbranch} = context.query;
   const data = await getQuestions({page, search, branch, subbranch});

  
   return { props: { serverQuestions: data } }  
 }