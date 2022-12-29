
import React, { useEffect } from 'react';

import { useQuery, dehydrate, QueryClient } from "react-query";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css'

import { useUserContext } from '../src/context/userContext';

import { useTranslation } from 'react-i18next'

import axios from 'axios';
import { createStrapiAxios } from '../utils/strapi';

import { Pagination, Row, Col } from 'antd';

import SearchField from '../src/components/searchField/searchField';
/* import SideFilter from '../src/components/SideFilter/sideFilter'; */
import PageContainer from '../src/components/layouts/pageContainer';
import PageHeader from '../src/components/layouts/pageHeader';
import { useThemeContext } from '../src/context/themeContext';
import SideFilter from '../src/components/SideFilter/sideFilter';

const PAGESIZE = 3;


export default function Experts({serverExperts}) {

  const {currentUser} = useUserContext();

  const THEME = useThemeContext();

  const router = useRouter();
  const [page, setPage] = useState(parseInt(router.query.page)?? 1);

  const {search, branch, specialization, city} = router.query;
   
    const {isSuccess,
           isLoading,  
           data: experts = []  }  = useQuery(["experts", page, search, branch, specialization, city],
                                                () => getUsers({page, search, branch, specialization, city}),
                                              {
                                                keepPreviousData: true,
                                                refetchOnMount: false,
                                                refetchOnWindowFocus: false,
                                                initialData: serverExperts 
                                              }
                                            );

  function handlePaginationChange(value) {
    
    router.query.page = value;
    const url = {
      pathname: router.pathname,
      query: router.query
    }
    router.push(url, undefined, { shallow: true });
    setPage(value);
  }

   useEffect(() => {
    if (router.query.page) {
      setPage(parseInt(router.query.page));
    }
  }, [router.query.page]); 
  
  console.log("users------------------------", experts);

  let EXPERTS = [];

 if (isSuccess) {

     EXPERTS = experts.map((item, i) => 
          <p> {`${item.name}   ${item.surname}`}</p>
    )
  
 }

 const p = THEME?.gutters?.gorizontal[THEME?.id];

 const pad = `${p}px`;

  return (

   
    <>
      
        <PageHeader 
          /* title={t('headers.experts')} */
          title="Эксперты"  
        />
        <PageContainer>
         
                 <Col  xs={24} sm={24} md={16} lg={18} xl={18} >
     
                  <SearchField 
                    style={{ width: "100%", marginTop: "0px", borderRadius: "10px", marginBottom: pad}} 
                    //placeholder={t('placeholders.searchExperts')}
                    placeholder="Введите полностью или частично имя или фамилию"
                    />  
                {/* <ExpertList /> */}

                {isSuccess && <div>{EXPERTS}</div>}
        {isLoading && <div style={{color: "red"}}>LOADING</div>}

        <Pagination 
          current={page} 
          onChange={handlePaginationChange} 
          //total={  data?.info.pages} 
          total={20}
          pageSize={PAGESIZE}
          />
                </Col>
                <Col xs={0} sm={0} md={8} lg={6} xl={6} >
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
    searchArr.push(`filters[$or][0][name][$containsi]=${search}&filters[$or][1][surname][$containsi]=${search}`);
  }
  if (branch) {
    searchArr.push(`filters[branches][id][$eq]=${branch}`);
  }
  if (specialization) {
    searchArr.push(`filters[specialization][id][$eq]=${specialization}`);
  }
  if (city) {
    searchArr.push(`filters[city][$eq]=${city}`);
  }

  let countSearchStr = searchArr.join("&");

  searchArr.push(`limit=${PAGESIZE}&start=${(page-1)*PAGESIZE}`);

  searchArr.push(`populate=%2A`);
    
  searchArr.push(`sort[0]=rating:desc`);

  let searchStr = searchArr.join("&");

  console.log("SearchStr---------------", searchStr);

  const data = await createStrapiAxios()
 .get(`/users?${searchStr}`)
 .then(res => res.data)


 console.log("USERS ------------------- ", data);

 return (data) 

};



export async function getServerSideProps(context) {
  let page = 1;
 
  if (context.query.page) {
    page = parseInt(context.query.page);
  }

  console.log("query------------", context.query);
  console.log("Search------------", context.query.search);

  const {search, branch, specialization, city} = context.query;

  const data = await getUsers({page, search, branch, specialization, city});

  
  return { props: { serverExperts: data } }  
}