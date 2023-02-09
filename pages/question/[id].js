
import React from 'react';

import { useQuery } from "react-query";
import { useState } from "react";
import { useRouter } from "next/router";


import { Pagination, Row, Col } from 'antd'; 

import PublishedDate from '../../src/components/publishedDate/publishedDate';

import { useThemeContext } from '../../src/context/themeContext';
import { useUserContext } from '../../src/context/userContext';
import PageContainer from '../../src/components/layouts/pageContainer';
import PageHeader from '../../src/components/layouts/pageHeader';

import { createStrapiAxios } from '../../utils/strapi';
import QuestionCard from '../../src/components/questionCard/questionCard';
import SideFilter from '../../src/components/SideFilter/sideFilter';


export default function Question({serverQuestion}) {

  const {currentUser} = useUserContext();

  const THEME = useThemeContext();


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

  if (isSuccess) {
    console.log("QUESTION--------------------------------------------------------------", question);
  
  }

  const total = meta?.pagination?.total?? 0;


 
const item=question.attributes;
   
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

      //const ANSWERS = childrenArr.map()
     
      console.log("childrenArr--------------------------------------------------------------", childrenArr);

      /* return(
        <>
        
         <Col  xs={24} sm={24} md={24} lg={24} xl={24}  xxl={24}>

        
            <QuestionCard
               authorName={`${authorName} ${authorSurname}`}
               authorAvatar = {authorAvatar}
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

      
        </Col>

        </>
      )
      } */
    

 const p = THEME?.gutters?.gorizontal[THEME?.id];

 const pad = `${p}px`;

 
  return (

   
    <>
      
        <PageHeader 
          /* title={t('headers.experts')} */
          title={`Вопрос#${id}`}
        />
        <PageContainer>
         
        {isSuccess && <>
        {/* <div>
            <Row 
              style = {{width: `100%+${THEME?.gutters?.gorizontal[THEME?.id]}`, marginBottom: "20px"}} 
              gutter={[p, p]}
            >  */}
                  <Col  xs={24} sm={24} md={16} lg={17} xl={18} style={{padding: '0px'}}> 

                     <QuestionCard
                        authorName={`${authorName} ${authorSurname}`}
                        authorAvatar = {authorAvatar}
                        branch={branchName}
                        subbranch={subbranchName}
                        description={description}
                        authorCity={authorCity}
                        date={date}
                        questionID = {item.id}
                        childrenCount = {childrenArr.length}
                        title={title}
                        answers={childrenArr}
                        ellipseAnswers={true}
                    />
                 

                  
                   </Col>

                <Col xs={0} sm={0} md={8} lg={7} xl={6} >
                    <SideFilter show = {{
                        city: true,
                        budget: false,
                        branch: true}
                    }/>   
                </Col>
           {/*   </Row> */}
                 
                  {/* </div> */} 
                  
                  </> }
                 
  
            {/* </Row> */}
  
       </PageContainer>
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