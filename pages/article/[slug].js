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

  const userJWT = currentUser?.jwt;
      
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
        <PublishedDate 
            style={{marginTop: "20px", fontSize: "16px"}}
            width = {"25%"}
            currDate = {new Date(published_at)} 
            textColor = {theme?.isDesktop ? "#262626" : "white"} 
            imgColor = {theme?.isDesktop ? "#CED3DB": "white"}
            marginLeft= {"0px"}
            imageStyle = {{
              fontSize: `24px`, 
              fontWeight: "600"}
              }
         />
      </PageHeader>  
   
    <PageContainer>
      
  
      <Row gutter = {gutter}>
          <Col  xs={24} sm={24} md={24} lg={18} xl={18} >
           
              <article className = {stylesArt.articleStyle} style={{paddingBottom: pad}}>
                <AntImage
                  src={cImage}
                  preview={{ maskClassName: `${stylesArt.antImageMask}` }}
                  width = {"100%"}
                  // src={bgSvg}
                  style={{ borderRadius: '10px 10px 0px 0px'}}
                  fallback = "data:image/png;base64,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"
                />
                <div className={stylesArt.articleBlock} style={{paddingRight: pad, paddingLeft: pad, marginTop: pad}}>
                  <ReactMarkdown  remarkPlugins={[gfm]}>
                    { content }
                  
                  </ReactMarkdown>
                  {theme?.id==="xs" && <span style={{ marginRight: "20px"}}> {`${t('labels.share')}: `} </span>}
                  <div className={stylesArt.netIconsBlock}>
                        {theme?.id !== "xs" && <span style={{ marginRight: "20px"}}> {`${t('labels.share')}: `} </span>}
                        <div >
                           <Image
                                src={vk}
                                alt="VK..."
                                width={50}
                                height={50}
                            />
                        </div>
  
                        <div style={{marginLeft: "20px"}}>
                            <Image
                                src={googleImg}
                                alt="VK..."
                                width={50}
                                height={50}
                            />
                        </div>
                        <div style={{marginLeft: "20px"}}>
                           <Image
                                src={odnoklassniki}
                                alt="VK..."
                                width={50}
                                height={50}
                            />
                        </div>
                        
                    </div>
                </div>
                
              </article>
              <div className={stylesArt.commentsBlock} style={{padding: pad}}>
                <div className={stylesArt.commentsHeader} style={{marginBottom: pad}}>
                  <span style={{lineHeight: "32px"}}>{t('headers.comments')}</span>
                  <Button type="primary" disabled={!userJWT} className={stylesArt.addCommentBtn} onClick={onLeaveComment}>{t('buttons.leaveComment')}</Button>
                </div>

                 <CommentsList 
                    addEntry = {addComment} 
                    onAddEntry = {onAddSuccess} 
                    articleId = {article.id}
                    parent={null}
                  /> 
         
              </div>

              {!theme?.isDesktop && 
                  <div className={stylesArt.commentsBlock} style={{padding: pad}} >
                      <div className={stylesArt.commentsHeader}>
                        {t('headers.similarnews')}
                      </div>  
                      <Row gutter={[gutter, gutter]}
                          style={{marginTop: "20px"}}
                       >
                          {NEWS}
                      </Row>      
                  </div>}
           
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