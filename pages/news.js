
import React, { useEffect } from 'react';

import { useQuery, dehydrate, QueryClient } from "react-query";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from '../styles/news.module.less'

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
import UserCard from '../src/components/userCard/userCard';
import ExpertCard from '../src/components/expertCard/expertCard';

import MyPagination from '../src/components/pagination';
import NewsFilter from '../src/components/SideFilter/newsFilter';
import NewsCard from '../src/components/newsCard/newsCard';
import {PartnerNewsCard} from '../src/components/newsCard/newsCard';

const PAGESIZE = 10;


export default function News({serverNews, categories, partnernews}) {

  const {currentUser} = useUserContext();

  const THEME = useThemeContext();

  
  const router = useRouter();
  const [page, setPage] = useState(1);

  const {category, search} = router.query;
   
    const {isSuccess,
           isLoading,  
           data: {data: data = [], meta: meta = null} = {} }  = useQuery(["news", page, category, search],
                                                () => getNews({category, page, search}),
                                              {
                                                keepPreviousData: true,
                                                refetchOnMount: false,
                                                refetchOnWindowFocus: false,
                                                initialData: serverNews 
                                              }
                                            );
  const { isSuccess: isPartSuccess,
          isLoading: isPartLoading,  
          data: {data: partNews = [], meta: partmeta = null} = {} }  = useQuery(["partnernews"],
                                                                                   () => getPartnerNews(),
                                                                                 {
                                                                                   keepPreviousData: true,
                                                                                   refetchOnMount: false,
                                                                                   refetchOnWindowFocus: false,
                                                                                   initialData: partnernews 
                                                                                 }
                                                                               );                                            
   const {isSuccess: catgSuccess,
          isLoading: catgLoading,  
          data: {
            data: catg = [], 
            meta: metaCatg = null} = {} }  = useQuery(
                                                    "categories",
                                                    () => getCategories(),
                                                    {
                                                      keepPreviousData: true,
                                                      refetchOnMount: false,
                                                      refetchOnWindowFocus: false,
                                                      initialData: categories
                                                    }
                                                  );                                            

   useEffect(() => {
    if (router.query.page) {
      setPage(parseInt(router.query.page));
    }
  }, [router.query.page]); 
  
  

  let NEWS = [];
  let PARTNERNEWS = [];
  let total = 0;

  if (isPartSuccess) {
    PARTNERNEWS = partNews.map((item, i) => {
  
      const itemAttrib = item.attributes;
      const {title, slug} = itemAttrib;
      const image = itemAttrib.image.data?.attributes?.url ?? '';
        
      return(
  
        <PartnerNewsCard
          key={i}
          title = {title}
          url = "#"   //TODO ------------------------------ USE URL FROM partner API --------------------------------------------------
          image = {image}
          
        />
  
      )
    });
  }

 
 if (isSuccess) {

    total = meta?.pagination?.total?? 0;

    let iStep = 6;
    let breakPoint = 0;
    let showCatg = true;

    if (category) {
      showCatg = false;
    }

    NEWS = data.map((item, i) => {
  
      const itemAttrib = item.attributes;
      const {title, slug} = itemAttrib;
      const image = itemAttrib.image.data?.attributes?.url ?? '';
      const catgName = itemAttrib.category.data?.attributes?.name ?? null;
      const catgSlug = itemAttrib.category.data?.attributes?.slug ?? null;
      const published_at = itemAttrib.publishedAt;

      const cnt = THEME?.id==="xs" ? 24 : ((THEME?.id!=="md" && THEME?.id!=="sm") ? (i === breakPoint ? 16 : 8) : (i % 3 ? 12 : 24));

      if (i===breakPoint) {
       
        breakPoint = breakPoint+iStep;
        iStep=iStep===6 ? 4 : 6;
      }

        
      return(
  
        <NewsCard
          key={slug}
          title = {title}
          slug = {slug}
          image = {image}
          published_at = {published_at}
          cnt= {cnt}
          catgName = {catgName}
          showCatg = {showCatg}
          catgSlug = {catgSlug}
        />
  
      )
    });


    
  
 }

 const gutter = THEME?.gutters?.gorizontal[THEME?.id];

 const pad = `${gutter}px`;

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
    
      
    </div>
)
 }

 
  return (

   
    <>
      
        <PageHeader 
          /* title={t('headers.news')} */
          title="Новости"  
        />
        <PageContainer>
         
                 <Col  xs={24} sm={24} md={16} lg={17} xl={18} >
     
                  <SearchField 
                    style={{ width: "100%", marginTop: "0px", borderRadius: "10px", marginBottom: pad}} 
                    //placeholder={t('placeholders.searchExperts')}
                    placeholder="Введите строку для поиска"
                    />  
                    {!THEME.isDesktop && <NewsFilter categoryArr = {catg}/>}
                {/* <ExpertList /> */}
               
                  {pagination()}
               


  
                {isSuccess && <div>
                  <Row 
                    style = {{width: `100%+${THEME?.gutters?.gorizontal[THEME?.id]}`, marginBottom: `${gutter/2}px`, marginTop: `${gutter/2}px`}} 
                    gutter={[gutter, gutter]}
                  >
                   {NEWS} 
                  </Row>
                 
                  </div>}
        

                {pagination()}
                </Col>
                <Col xs={0} sm={0} md={8} lg={7} xl={6} >
                    <NewsFilter 
                        categoryArr={catg}
                    />   

                    <div className={styles.specBlock} style= {{paddingTop: !THEME.isDesktop ? "20px" : pad, paddingBottom: !THEME.isDesktop ? "20px" : pad, marginBottom: pad}}>
                      <div className={styles.specBlockHeader} style={{ marginLeft: !THEME.isDesktop ? "20px" : pad,  marginBottom: !THEME.isDesktop ? "20px" : pad}}>
                         Новости партнеров
                      </div>
                      {PARTNERNEWS}
                    </div>
                </Col>

                
  
            {/* </Row> */}
  
       </PageContainer>
    </>

        
  
   
  )
}

async function getNews({category, page, search}) {

  let searchArr = []; 

  const cPage = page?? 1;

  if (search) {
    searchArr.push(`filters[$or][0][title][$containsi]=${search}&filters[$or][1][content][$containsi]=${search}`);
  }

  if (category) {
    searchArr.push(`filters[category][slug][$eq]=${category}`);
  }

  searchArr.push(`pagination[page]=${cPage}&pagination[pageSize]=${PAGESIZE}`);
  searchArr.push(`sort[0]=createdAt:desc`);

  let searchStr = searchArr.join("&");

  const data = await createStrapiAxios()
 .get(`/articles?${searchStr}&populate=%2A`)
 .then(res => res.data)

 return (data) 

};

async function getCategories() {

  const data = await createStrapiAxios()
 .get(`/categories`)
 .then(res => res.data)

 return (data) 

};

async function getPartnerNews() {

  const data = await createStrapiAxios()
 .get(`/articles?filters[partner][$eq]=true&populate=%2A`)
 .then(res => res.data)

 return (data) 

};


export async function getServerSideProps(context) {
  let page = 1;
 
  if (context.query.page) {
    page = parseInt(context.query.page);
  }


  const {category, search} = context.query;

  const data = await getNews({category, page, search});
  const categories = await getCategories();
  const partnernews = await getPartnerNews();

  
  return { props: { serverNews: data, categories : categories, partnernews } }  
}