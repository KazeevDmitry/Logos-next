import React from 'react';
import styles from './newsCard.module.less';
import { Col } from 'antd';
import PublishedDate from '../publishedDate/publishedDate';
import Link from 'next/link';
import Image from 'next/image';
import { useThemeContext } from '../../context/themeContext';

export default function NewsCard ({title, slug, image, published_at, cnt, catgName, showCatg=true}) {


    const currDate = new Date(published_at);
    const artImage = `url(${process.env.NEXT_PUBLIC_UPLOADS_API}${image})`;
   
return(
    <Col span={cnt}>

        <Link href={`/news/${slug}`} style={{ color: 'white' }}> 
          <div lang="ru"
            className={styles.card}
            style={{
              //backgroundImage: `${artImage}`
              backgroundImage: artImage,
              hyphens: "auto",
              backgroundSize: 'cover',
            }}>

            {showCatg && catgName && <div className={styles.catglabel}>
                {catgName.toUpperCase()}
            </div>}
            
            <h5 className={styles.title}
                style={{ zIndex: 1 }}
             >
                  { title } 
            </h5>
           
            <PublishedDate marginLeft={"20px"} width = {"170px"} currDate = {currDate} textColor = "white"/>
          </div>
          </Link >
    </Col>      
  )
}

export function PartnerNewsCard ({title, url, image}) {

const THEME = useThemeContext();

  const gutter = THEME?.gutters?.gorizontal[THEME?.id];

 const pad = `${gutter}px`;


  const artImage = `${process.env.NEXT_PUBLIC_UPLOADS_API}${image}`;


  return(
  <Link href={url?? ''} style={{ color: 'black', cursor: "pointer" }}> 
          <div
            className={styles.partnerCard}
            style={{
                //    marginLeft: !THEME.isDesktop ? "20px" : pad,
                //    marginRight: !THEME.isDesktop ? "20px" : pad, 
                    paddingLeft: !THEME.isDesktop ? "20px" : pad, 
                    paddingRight: !THEME.isDesktop ? "20px" : pad,
                  //  width: `100%+${gutter*2}px`,
                  }}
            >
             <div className={styles.flexCont}>
             
                 <img
                 style={{width:"70px", height: "45px"}}
                src={artImage}
                alt="..."
                /> 
             </div>
             <div lang = "ru" className={styles.flexCont} style={{marginLeft:pad, textAlign: "left", hyphens: "auto"}}>
                {/* <p style={{textAlign: "left", hyphens: "auto"}}> */}
                  {title}
               {/*  </p> */}
             </div>
          </div>
          </Link >
  )          
}