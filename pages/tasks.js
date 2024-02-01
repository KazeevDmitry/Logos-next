
import React, { useEffect } from 'react';
import Link from 'next/link';

import { useQuery } from "react-query";
import { useState } from "react";
import { useRouter } from "next/router";
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
import TaskCard from '../src/components/taskCard/taskCard';
import MyPagination from '../src/components/pagination';


const PAGESIZE = 5;


export default function Tasks( {serverTasks} ) {

  const {currentUser} = useUserContext();
  const [isExpert, setIsExpert]  = useState(false);

  const THEME = useThemeContext();


  const router = useRouter();
  const [page, setPage] = useState(1);

  const userId = currentUser?.id;

  const {search, branch, specialization, budgetmin, budgetmax, contractual, city} = router.query;
   
    const {isSuccess,
           isLoading,  
           data: {data: tasks = [], meta: meta = null} = {} }  = useQuery(["tasks", page, search, branch, specialization, budgetmin, budgetmax, contractual, city],
                                                () => getQuestions({page, search, branch, budgetmin, budgetmax, contractual, city}),
                                              {
                                                keepPreviousData: true,
                                                refetchOnMount: false,
                                                refetchOnWindowFocus: false,
                                                initialData: serverTasks ,
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

  let TASKS = [];
  let total = 0;

 if (isSuccess) {

    total = meta?.pagination?.total?? 0;

    
    TASKS = tasks.map((item, i) => {


    
      const itemData = item.attributes;
      const {author, 
              title, 
              text, 
              contractual, 
              budget,
              branches,
              publishedAt: published_at, 
              performer,
              status,
              slug,
            } = itemData;
      
              console.log('itemData ----------------------------------------------------------------------------', itemData);

      const cityName = THEME.cities.find(city => city.id === itemData.city)?.city;
      
      const responses = itemData.responses.data;
      const taskId = item.id;
    
      let responsesAvatars = responses.map(resp => {
          const exp = resp.attributes?.expert.data.attributes;
          const ava = exp?.user.data.attributes.avatar.data.attributes.url;
          return ava;
      });


      const hasPerformer = !!performer.data ;

      let authorStatus = '';

      const performerId = performer.data?.attributes.user.data.id;
      
      authorStatus = 
                       (userId === author.data?.id ? "youAuthor" :
                       (userId === performerId && status !== "confirmed" ? "youChosen" :
                       (userId === performerId && status === "confirmed" ? "youPerformer" : 
                       (!!responses.find(item => item.user === userId) ? "youRespond" : 
                       (!!performer.data && status !== "confirmed" && userId !== performerId ? "hasPerformer" : '' ))))); 
   
     console.log('authorStataus-------------------------------------------------------', authorStatus);




      return(
        <>
        
         <Col  xs={24} sm={24} md={24} lg={24} xl={24}  xxl={24}>

         <Link href={`/task/${item.id}`} style={{ color: 'black', cursor: "pointer" }}> 
          
            <TaskCard
               title = {title}
               id = {taskId}
               slug={slug}
               text={text}
               contractual={contractual}
               budget={budget}
               published_at={published_at} 
               status={status}
                cityName={cityName} 
                responsesAvatars = {responsesAvatars} 
                authorStatus={authorStatus} 
                branches={branches.data}
                expandedText = {false}
                showAnswers = {true}
                fromMainPage={false}
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
          title="Задачи"  
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
                     {TASKS} 
                  </Row>
                 
                  </div>}
     

                {pagination()}
                </Col>
                <Col xs={0} sm={0} md={8} lg={7} xl={6} >

                    <SideFilter show = {{
                        city: true,
                        budget: true,
                        branch: true,
                        showreset: true,
                      }
                    }/>   
                    
                </Col>
  
            {/* </Row> */}
  
       </PageContainer>
    </>

        
  
   
  )
}

async function getQuestions({page, search, branch, specialization, contractual, budgetmin, budgetmax, city}) {

  let searchArr = []; 

  if (search) {
    searchArr.push(`filters[$or][0][title][$containsi]=${search}&filters[$or][1][text][$containsi]=${search}`);
  }
  if (branch) {
    searchArr.push(`filters[branches][id][$eq]=${branch}`);
  }

 /*  if (contractual) {
    searchArr.push(`filters[contractual][$eq]=true`);
  } */
  if (specialization) {
    searchArr.push(`filters[specialization][id][$eq]=${specialization}`);
  }
  if (budgetmin) {
    searchArr.push(`filters[budget][$gte]=${budgetmin}`);
  }
  if (budgetmax) {
    searchArr.push(`filters[budget][$lte]=${budgetmax}`);
  }
  if (city) {
    searchArr.push(`filters[city][$eq]=${city}`);
  }
 

  searchArr.push(`pagination[page]=${page}&pagination[pageSize]=${PAGESIZE}`);
  
  searchArr.push(`sort[0]=publishedAt:desc`);

  let searchStr = searchArr.join("&");

  const data = await createStrapiAxios()

 .get(`/tasks?populate=deep,5&${searchStr}`)
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

  
   return { props: { serverTasks: data } }  
 }