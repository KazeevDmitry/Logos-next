
import React, { useEffect } from 'react';

import { useQuery, dehydrate, QueryClient } from "react-query";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css'

import { useUserContext } from '../src/context/userContext';

import { useTranslation } from 'react-i18next'

import axios from 'axios';
import { createStrapiAxios } from '../utils/strapi';

import { Pagination } from 'antd';

const PAGESIZE = 3;


export default function Experts({serverExperts}) {

  const {currentUser} = useUserContext();

  const router = useRouter();
  const [page, setPage] = useState(parseInt(router.query.page)?? 1);

  /* const getExperts = async (cPage) =>
    await createStrapiAxios()
          .get(`/users?limit=${pageSize}&start=${(cPage-1)*pageSize}`)
          .then(res => res.json());
   */
 // const {data = {}} = useQuery(
  const {isSuccess,
         isLoading,  
         data: experts = []  }  = useQuery(
                                                        ["experts", page],
                                                        async () =>
                                                        await createStrapiAxios()
                                                              .get(`/users?limit=${PAGESIZE}&start=${(page-1)*PAGESIZE}`)
                                                              .then(res => res.data),
                                                        {
                                                          keepPreviousData: true,
                                                          refetchOnMount: false,
                                                          refetchOnWindowFocus: false,
                                                          initialData: serverExperts 
                                                        }
                                                      );
  function handlePaginationChange(value) {
    setPage(value);
    router.push(`experts/?page=${value}`, undefined, { shallow: true });
  }

   useEffect(() => {
    if (router.query.page) {
      setPage(parseInt(router.query.page));
    }
  }, [router.query.page]); 
  
  

  let EXPERTS = [];

 if (isSuccess) {

     EXPERTS = experts.map((item, i) => 
          <p> {`${item.name}   ${item.surname}`}</p>
    )
  
 }

  return (

    <div className={styles.container}>
      
      <div className={styles.main}>
        <h1 className={styles.title}>
         <p> EXPERTS page</p>
         <p>{currentUser?.name}</p>
         <p>{currentUser?.surname}</p>
         <p>{currentUser?.avatar?.url}</p>
        </h1>

        {isSuccess && <div>{EXPERTS}</div>}
        {isLoading && <div style={{color: "red"}}>LOADING</div>}

        <Pagination 
          current={page} 
          onChange={handlePaginationChange} 
          //total={  data?.info.pages} 
          total={20}
          pageSize={PAGESIZE}
          />
  
       </div>
    </div>

  )
}

export async function getServerSideProps(context) {
  let page = 1;
  const pageSize = 3;
  if (context.query.page) {
    page = parseInt(context.query.page);
  }

  const res = await createStrapiAxios()
  .get(`/users?limit=${PAGESIZE}&start=${(page-1)*PAGESIZE}`)

  const data = await res.data;

  
  return { props: { serverExperts: data } }  // data
}