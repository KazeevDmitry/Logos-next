
import React, { useEffect } from 'react';

import { useQuery, dehydrate, QueryClient } from "react-query";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css'

import { useUserContext } from '../src/context/userContext';

import { useTranslation } from 'react-i18next'

import axios from 'axios';
import { createStrapiAxios } from '../utils/strapi';

import Plural from '../utils/plural';
import { Pagination, Row, Col } from 'antd'; 

import SearchField from '../src/components/searchField/searchField';
/* import SideFilter from '../src/components/SideFilter/sideFilter'; */
import PageContainer from '../src/components/layouts/pageContainer';
import PageHeader from '../src/components/layouts/pageHeader';
import { useThemeContext } from '../src/context/themeContext';
import SideFilter from '../src/components/SideFilter/sideFilter';
import UserCard from '../src/components/userCard/userCard';
import ExpertCard from '../src/components/expertCard/expertCard';
import MyPagination from '../src/components/pagination';

const PAGESIZE = 8;


export default function Experts({serverExperts}) {

  const {currentUser} = useUserContext();

  const THEME = useThemeContext();


  const router = useRouter();
  const [page, setPage] = useState(1);

  const {search, branch, specialization, city} = router.query;
   
    const {isSuccess,
           isLoading,  
           data: {data: experts = [], meta: meta = null} = {} }  = useQuery(["experts", page, search, branch, specialization, city],
                                                () => getUsers({page, search, branch, specialization, city}),
                                              {
                                                keepPreviousData: true,
                                                refetchOnMount: false,
                                                refetchOnWindowFocus: false,
                                                initialData: serverExperts 
                                              }
                                            );

   useEffect(() => {
    if (router.query.page) {
      setPage(parseInt(router.query.page));
    }
  }, [router.query.page]); 
  
  

  let EXPERTS = [];
  let total = 0;

 if (isSuccess) {

    total = meta?.pagination?.total?? 0;

    EXPERTS = experts.map((item, i) => {
  
      const itenBranchesArr = item.attributes.branches.data;
      const user = item.attributes.user.data.attributes;
      const cityName = THEME.cities.find(city => city.id === user.city)?.city;
      const spec = item.attributes.specializations?.data[0]?.attributes?.name?? '';
      const rating = item.attributes.rating?? 0;
      const description = item.attributes.description;

      return(
        <>
         {/* <Col  xs={24} sm={12} md={12} lg={12} xl={12}  xxl={12}> */}
         <Col  xs={24} sm={24} md={24} lg={24} xl={24}  xxl={24}>
{/* 
        <Link href="/experts" passHref = {true}> */}  {/* use id from item for href */}
           <a style={{ color: 'black' }}>
             <ExpertCard
               username={user.name}
               surname={user.surname}
               stars = {4} //временно---------------------------------------------------------------------------------
                 reviews={18} //временно--------------------------------------------------------------------------------------
               cups={rating}
               spec={spec}
               image = {user ? user.avatar?.data?.attributes?.url : ''}
               online = {"true"}
               cityName={cityName}
               branches={itenBranchesArr}
               description={description}
             />
           </a>  
        
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
    
      {total>PAGESIZE &&
       <p><Plural count={total} i18nextPath="questions.plural" /></p> 
      }
    </div>
)
 }

 
  return (

   
    <>
      
        <PageHeader 
          /* title={t('headers.experts')} */
          title="Эксперты"  
        />
        <PageContainer>
         
                 <Col  xs={24} sm={24} md={16} lg={17} xl={18} >
     
                  <SearchField 
                    style={{ width: "100%", marginTop: "0px", borderRadius: "10px", marginBottom: pad}} 
                    //placeholder={t('placeholders.searchExperts')}
                    placeholder="Введите полностью или частично имя или фамилию"
                    />  
                    {!THEME.isDesktop && <SideFilter show = {{
                        city: true,
                        budget: false,
                        branch: true}
                    }/>}
                {/* <ExpertList /> */}
               
                  {pagination()}
               


  
                {isSuccess && <div>
                  <Row 
                    style = {{width: `100%+${THEME?.gutters?.gorizontal[THEME?.id]}`, marginBottom: "20px"}} 
                    gutter={[pad, pad]}
                  >
                    {EXPERTS}
                  </Row>
                 
                  </div>}
        {isLoading && <div style={{color: "red"}}>LOADING</div>}

                {pagination()}
                </Col>
                <Col xs={0} sm={0} md={8} lg={7} xl={6} >
                    <SideFilter show = {{
                        city: true,
                        budget: false,
                        branch: true}
                    }/>   
                </Col>
  
            {/* </Row> */}
  
       </PageContainer>
    </>

        
  
   
  )
}

async function getUsers({page, search, branch, specialization, city}) {

  let searchArr = []; 

  if (search) {
    searchArr.push(`filters[$or][0][user][name][$containsi]=${search}&filters[$or][1][user][surname][$containsi]=${search}`);
  }
  if (branch) {
    searchArr.push(`filters[branches][id][$eq]=${branch}`);
  }
  if (specialization) {
    searchArr.push(`filters[specializations][id][$eq]=${specialization}`);
  }
  if (city) {
    searchArr.push(`filters[user][city][$eq]=${city}`);
  }

  let countSearchStr = searchArr.join("&");

  searchArr.push(`pagination[page]=${page}&pagination[pageSize]=${PAGESIZE}`);
  
  searchArr.push(`populate=%2A`);
    
  searchArr.push(`sort[0]=rating:desc`);

  let searchStr = searchArr.join("&");

  const data = await createStrapiAxios()
 .get(`/experts?populate[0]=branches&populate[1]=specializations&populate[2]=user.avatar&${searchStr}`)
 .then(res => res.data)


 return (data) 

};



export async function getServerSideProps(context) {
  let page = 1;
 
  if (context.query.page) {
    page = parseInt(context.query.page);
  }

  const {search, branch, specialization, city} = context.query;

  const data = await getUsers({page, search, branch, specialization, city});

  
  return { props: { serverExperts: data } }  
}