import React, {useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { useQuery } from "react-query";
import {  Image as AntImage, Spin, Row, Col, Button } from 'antd';

import stylesArt  from './article.module.less';
import PublishedDate from '../../src/components/publishedDate/publishedDate';
import moment from 'moment';
import { useThemeContext } from '../../src/context/themeContext';
import { useUserContext } from '../../src/context/userContext';
import PageContainer from '../../src/components/layouts/pageContainer';
import PageHeader from '../../src/components/layouts/pageHeader';
import CommentsList from '../../src/components/commetsList/commentsList';
import { useTranslation } from 'react-i18next';
import NewsCard from '../../src/components/newsCard/newsCard';
import { useRouter } from "next/router";
import { createStrapiAxios } from '../../utils/strapi';
import Image  from 'next/image'

import googleImg from '../../public/blueBird.svg';
import vk from '../../public/vk copy.svg';
import odnoklassniki from '../../public/odnoklassniki.svg';


export default function Article({serverArticle}) {

    const router = useRouter();
  const { slug, category } = router.query;
  const [addComment, setAddComment] = useState(false);

  const theme = useThemeContext();

  const {t, i18n} = useTranslation();

  const {currentUser} = useUserContext();

  const userJWT = currentUser.jwt;
      
  moment.locale(i18n.language);
  



  const {isSuccess,
    isLoading,  
    isFetching,
    isError,
    data: { data: article = {} , meta: metaArticle = null} = {} }  = useQuery(["article", slug],
                                         () => getArticle(slug),
                                       {
                                         keepPreviousData: true,
                                         refetchOnMount: false,
                                         refetchOnWindowFocus: false,
                                         initialData: serverArticle 
                                       }
                                     ); 
  const {isSuccess: isSimSuccess,
         isLoading: isSimLoading,  
         data: { data: similarNewsArr = [] } = {} }  = useQuery(
          ["simarticles", category, slug],
          () => getSimilarArticles(category, slug),
          {
           keepPreviousData: true,
           refetchOnMount: false,
           refetchOnWindowFocus: false,
  
          }
  );

if (isError) {
  return (
    <div style={{marginTop: "200px", color : "red" }}>

        СТАТЬЯ НЕ НАЙДЕНА!
    </div>
  )
}

if (!isSuccess) {
  return
}

let NEWS = [];
 
if (isSimSuccess) {
  


  NEWS = similarNewsArr.map((item, i) => {
  
    const itemAttrib = item.attributes;
    const {title, slug} = itemAttrib;
    const image = itemAttrib.image.data?.attributes?.url ?? '';
    const catgName = itemAttrib.category.data?.attributes?.name ?? null;
    const catgSlug = itemAttrib.category.data?.attributes?.slug ?? null;
    const published_at = itemAttrib.publishedAt;

    return(

      <NewsCard
        key={slug}
        title = {title}
        slug = {slug}
        image = {image}
        published_at = {published_at}
        cnt= {24}
        catgName = {catgName}
        showCatg = {true}
        catgSlug = {catgSlug}
      />

    )
  });
} 

const onLeaveComment = () => {
    setAddComment(true);
  };

  const onAddSuccess = () => {
    setAddComment(false);
    
  }

  if (isFetching||isLoading) {
    const pageHeight = window.innerHeight;
    const mt = `${pageHeight}px`;
    return (
      <div className = {stylesArt.spinBlock} style={{height: mt}}><Spin size = 'large'/></div>
      
    )
  }

  const itemAttrib = article.attributes;
  const {
    title, 
    content, 
    publishedAt: published_at
  } = itemAttrib;

  const image = itemAttrib.image.data?.attributes?.url ?? '';
  const cImage = `${process.env.NEXT_PUBLIC_UPLOADS_API}${image}`;

  const gutter = theme?.gutters?.gorizontal[theme?.id]?? 20;

  const pad = `${gutter}px`;
  
  return (
    <>
       
        <PageHeader title={title}>
            
          </PageHeader>  
       
        <PageContainer>
          
      
          <Row gutter = {gutter}>
              <Col  xs={24} sm={24} md={24} lg={18} xl={18} >
               
                 
               
              </Col>
             
                <Col xs={0} sm={0} md={6} lg={6} xl={6} >
                  <div className={stylesArt.lastNews}>
                    {t('headers.similarnews')}
                  </div>
                      <Row gutter={[gutter, gutter]}>
                          {NEWS}
                      </Row> 
               </Col>
             
      
           </Row>
           </PageContainer>   
    </>
  )
}


async function getArticle(slug) {

  const data = await createStrapiAxios()
 /* .get(`/article/${slug}&populate=%2A`) */
 .get(`/article/${slug}?populate=%2A`)
 .then(res => res.data)
 .catch(e => {
    console.log("ERROR in GetArticle --------", e);
    return null;
  });

//console.log("slug from getarticle --------------------------------------------------------------------", slug);

 return (data) 

};

async function getSimilarArticles(category, slug) {

  const data = await createStrapiAxios()
 .get(`/articles?filters[slug][$ne]=${slug}&filters[category][slug][$eq]=${category}&pagination[page]=1&pagination[pageSize]=2&populate=%2A`) // пока берем две новости изкатегории временно
 .then(res => res.data)
 .catch(e => {
    console.log("ERROR in GetSimilarArticles --------", e)
    return null;
  });
 return (data) 

};


export async function getServerSideProps(context) {
 
  const {category, slug} = context.query;

  const data = await getArticle(slug);
  
  //console.log("slug from getServerSideProps --------------------------------------------------------------------", slug);
  
  return { props: { serverArticle : data } }  
}