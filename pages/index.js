import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/mainPage.module.less'

import Link from 'next/link'

import {useThemeContext} from '../src/context/themeContext'
import {useUserContext} from '../src/context/userContext'

import { useTranslation } from 'react-i18next'
import UserCircle from '../src/components/userCircle/userCircle';
import UserImage from '../src/components/userImage/userImage';
import PageHeader from '../src/components/layouts/pageHeader';
import PageContainer from '../src/components/layouts/pageContainer';
import UserCard from '../src/components/userCard/userCard';

import moment from 'moment';
import 'moment/locale/ru';

import { createStrapiAxios } from '../utils/strapi';

import { Col, Row, Select, Form, Button } from 'antd';
import RatingBar from '../src/components/ratingbar/ratingbar';

import MainLayout from '../src/components/layouts/mainLayout'
import { useState } from 'react'
import CityInput from '../src/components/cityInput/cityInput';
import InputSlider from '../src/components/input-slider/input-slider';

let THEME ={};

export default function Home({circlePeople}) {

  THEME = useThemeContext();

  
  /* const currentUser = useUserContext();

  const {t} = useTranslation(); */

  
  const [showLittleCard, setshowLittleCard] = useState();
  const [circleUser, setCircleUser] = useState(null);

 
  const res = `-${THEME?.appContainerPadding}px`;

  const bigCircle = THEME.size === "middle" ? "100px" : (THEME.id === "xl" ? "130px" : "150px");
  const midlCircle = THEME.size === "middle" ? "80px" : (THEME.id === "xl" ? "100px" : "120px");
  const smallCircle = THEME.size === "middle" ? "60px" : (THEME.id === "xl" ? "80px" : "100px");

  const circleStyles = [
    {
      top: "44%",
      right: "16%",
      width: bigCircle,
      toptolltip: true,
    },
    {
      top: "21.8%",
      right: "6%",
      width: bigCircle,
    },
    {
      top: "9%", 
      right: "16.5%",
      width: midlCircle,
    },
    {
      top: "27%",
      right: "26%",
      width: midlCircle,
    },
    {
      top: "12%",
      right: "33.5%",
      width: smallCircle,
    },
    {
      top: "42%",
      right: "38%",
      width: smallCircle,
    },
    
  ];

  const onMouseEnter = (user, topt) => (e) => {
    let c = e.target.getBoundingClientRect();

  
      const left = Math.round(c.left - 300 + c.width * 0.2 + window.pageXOffset);
      const top = !topt ? Math.round(c.bottom -60 + window.pageYOffset - c.height * 0.2) :
        Math.round(c.top -160 + window.pageYOffset + c.height * 0.2);
      


    setCircleUser({user, left, top});
    setshowLittleCard(true);

  };

  const onMouseLeave = () => {
    setshowLittleCard(false);
    setCircleUser(null);
  }

  const circleUsers = circlePeople.slice(0, 6).map((item, i) => {

    const topt = circleStyles[i].toptolltip;
    const user = item.attributes.user.data.attributes;
    const spec = item.attributes.specializations.data[0].attributes.name;
    const rating = item.attributes.rating;
    const sendUser = {id: item.id, ...user, spec, rating};

    return (
      <div style={{...circleStyles[i], position: "absolute"}}> 
        <Link href='experts' >
          <UserImage
            image= {user ? user.avatar.data?.attributes?.url : ''} 
            width= {circleStyles[i].width}
            onMouseEnter = {onMouseEnter(sendUser, topt)} 
            onMouseLeave = {onMouseLeave}
            style={{cursor: "pointer"}}
          />
        </Link> 
      </div>
    )
  });

  let cnt = 15;
  if (THEME?.id === "sm"||THEME?.id === "md" ) {
    cnt= 14;
  }

 const BESTSPECS = circlePeople.slice(6,cnt).map((item) => {
   
   const user = item.attributes.user.data.attributes;

   
   const cityName = THEME.cities.find(city => city.id === user.city)?.city;
   const spec = item.attributes.specializations?.data[0]?.attributes?.name?? '';
   const rating = item.attributes.rating;

   return (
     <>
     <Col  xs={24} sm={12} md={12} lg={8} xl={8}  xxl={8}>
{/* 
         <Link href="/experts" passHref = {true}> */}  {/* use id from item for href */}
            <a style={{ color: 'black' }}>
              <UserCard
                username={user.name}
                surname={user.surname}
                stars = {4} //временно---------------------------------------------------------------------------------
                  reviews={18} //временно--------------------------------------------------------------------------------------
                cups={rating}
                spec={spec}
                image = {user ? user.avatar?.data?.attributes?.url : ''}
                online = {"true"}
                cityName={cityName}
              />
            </a>  
         {/* </Link> */}
     </Col>
     </>
   )
 });


const USERS_COUNT= 1000;

const userSpec = circleUser?.user?.spec?? '';

  return (
    <>
     <MobyleMainHeader/>
      {THEME.isDesktop && 
      <div className={styles.sectionPromo} style={{marginLeft: res, marginRight: res, padding: `0px ${THEME?.appContainerPadding}px`}}> 
   
        <div className={styles.txtWrapper} style={{marginLeft: `6%-${THEME?.appContainerPadding}px`, height: "100%"}}>
              <Promo count={USERS_COUNT} />
        </div>  
        {circleUsers}
        {showLittleCard && 
          <LittleCard
              username={circleUser.user.name}
              surname={circleUser.user.surname}
              top = {circleUser.top}
              left={circleUser.left}
              stars = {4} //временно---------------------------------------------------------------------------------
              reviews={18} //временно--------------------------------------------------------------------------------------
              cups={circleUser.user.rating}
              spec={userSpec} 
          />}
        <MainTabs/>  
      </div>}   

          <div className={styles.contSection}>
            <div style={{width: "100%", height: "90px"}}>

            </div>
              <InfoBlock
                elements = {BESTSPECS}
                linkTo = '/experts'
                headerT = 'main.top.title'
                linkT = 'links.allExperts'
              /> 
          </div>
        
     
    </>
  )
}


function MobyleMainHeader({ count }) {
  
  const {t, i18n} = useTranslation();
  if (THEME?.isDesktop) {
    return null;
  }

  return (
    <>
      <PageHeader title={t('main.promo.title')}>
        <div className={styles.promoLabel}>
          <p>
            { t('main.promo.subtitle', { count }) }
          </p>
        </div>
        </PageHeader> 

        <MainTabs/>
       
    </>
  )
} 

function Promo({ count }) {
  const { t } = useTranslation();

  return (
    <>
      <h1 className={styles.promoHeader}>
        { t('main.promo.title') }
      </h1>
      <div className={styles.promoLabel}>
        <p>
          { t('main.promo.subtitle', { count }) }
        </p>
      </div>
    </>
  )
}



function LittleCard({ username, surname, spec, stars=0, reviews = 0, cups=0, top, left }){
 
  const nameStr = `${username} ${surname}`;
  
  
  return (
         
      <div className={styles.littleCard} style={{left: `${left}px`, top: `${top}px`}} >
            <div className={styles.gridElement}> 
              {nameStr} 
            </div>
            {/* <div className={styles.gridElement}> 
              {cityName} 
            </div> */}
            <div
              className={styles.gridElement}
              style={{fontSize: "16px", fontWeight: "250", marginTop: "10px", marginBottom: "10px"}}
            >
              {spec}
            </div>
            <div style={{width: "100%"}}>
                    <RatingBar
                        stars = {stars}
                        cups = {cups}
                        reviews = {reviews}
                    />
                  </div>
        </div>
 

  )
}



function MainTabs () {

  const [activeTab, setActiveTab] = useState(1);

  const {t} = useTranslation();
  
  
  const tabStyle1 =
  activeTab === 1
    ? styles.tabCls1 + ' ' + styles.activeTab
    : styles.tabCls1;
const tabStyle2 =
  activeTab === 2
    ? styles.tabCls2 + ' ' + styles.activeTab
    : styles.tabCls2;
const tabTextStyle1 =
  activeTab === 1
    ? styles.activeTab + ' ' + styles.tabText
    : styles.tabText;
const tabTextStyle2 =
  activeTab === 2
    ? styles.activeTab + ' ' + styles.tabText
    : styles.tabText;

  const onFinish = (values) => 
  {
    const {city, spec, budget} = values;

    let searchArr = [];
    if (budget) {
        searchArr.push(`budgetmin=${budget.inp1}&budgetmax=${budget.inp2}`);
    }
    if (city) {
      searchArr.push(`city=${city}`);
    }
    if (spec) {
      searchArr.push(`specialization=${spec}`);
     }

     let searchStr = searchArr.join("&");
   //  navigate(`tasks?${searchStr}`);
   console.log('searchStr-------------------------------', searchStr);
   
  };
      
    const thirdBlock = [];
    let btnName = '';
    let contPadding = "35px";

    if (activeTab === 1) {
      
      thirdBlock.push(
        <Form.Item
        name="budget"
        label= "Бюджет"
        style={{marginRight: "0px", marginBottom: "0px"}}
      >
        <InputSlider
          maxValues={[1000, 500000]}
          step={1000}
        
        />
        </Form.Item>
      );
      btnName = "Найти задачу";
    } else {
      // thirdBlock.push(
      //   <span className={styles.inTabSpan}>Категории права</span>
      // );

      thirdBlock.push(
        <Form.Item
        name="category"
        label="Отрасль права"
        style={{marginRight: "0px", marginBottom: "25px", width: "100%"}}
        >
          <CityInput marker="catg" />
        </Form.Item>  
      );

      btnName = "Найти исполнителя";
      contPadding = "50px";
    }

const s1 = THEME?.isDesktop ? "Ищу задачу": "Задачи";
const s2 = THEME?.isDesktop ? "Ищу исполнителя": "Эксперты";


    return (
      <div className={styles.tabBox}>   
                <div id="tab1" className={tabStyle1}
                    onClick = {() => setActiveTab(1)}
                >
                    <span id="sp1" className={tabTextStyle1}
                    >{s1}</span>
                </div>
                <div id="tab2" className={tabStyle2} onClick = {() => setActiveTab(2)}>
                  <span  id="sp2" className={tabTextStyle2}
                    >{s2}</span>
                </div>
        <Form
                name="tabcontent"
                layout="vertical"
                
                style={{width: "100%"}}
                onFinish={onFinish}
                initialValues={{
                  budget: {inp1: 1000, inp2: 500000},
                }}
              >  
        <Row 
          gutter = {[{xs: 10, sm: 10, md: 15, lg: 20, xl: 30,  xxl: 40}, {xs: 10, sm: 10, md: 15, lg: 20, xl: 30,  xxl: 40}]} 
          // gutter = {theme?.gutters.vertical, theme?.gutters.gorizontal}
          className={styles.tabContentBox}
          style={{marginLeft: "0px", marginRight: "0px", paddingBottom: contPadding}}
          >
                
            <TabCol>
              <Form.Item
                name="city"
                label="Город"
                style={{marginRight: "0px", marginBottom: "0px", width: "100%"}}
              >
                
                <CityInput />
              </Form.Item>  
            </TabCol>
            <TabCol>
              <Form.Item
                name="spec"
                label="Специализация"
                style={{marginRight: "0px", marginBottom: "0px", width: "100%"}}
              >
                <CityInput marker="spec"/>
              </Form.Item>  
              </TabCol>
            <TabCol>{thirdBlock}</TabCol>
            <TabCol>
              <Button 
                size={THEME?.size} 
                style={{width: "100%", marginTop: "33px"}}
                type="primary" 
                htmlType="submit"
              >{btnName}</Button>
            </TabCol>
   
        </Row>
        </Form>
      </div>  
    );
  
}


function TabCol ({children}) {
  return (
    <Col  xs={24} sm={12} md={6} lg={6} xl={6} >
          <div className={styles.inTabBox}>
            {children}
          </div>
        </Col>
  )
}

function InfoBlock ({ elements, linkTo, headerT, linkT}) {
  const {t} = useTranslation();

  const headerStyle = THEME?.isDesktop ? {
    paddingLeft: "0px",
    paddingRight: "0px",
    marginTop: "70px",
    fontSize: "44px"
        
    } : {
        paddingLeft: "10px",
        paddingRight: "10px",
        marginTop: "50px",
        fontSize: "32px"
    }

    return(
    <>
        <div className={styles.headerContainer} style = {headerStyle}>
            <div className={styles.headText}>{t(headerT)}</div>
            {THEME?.isDesktop && 
              <Link href={linkTo}>
                <a  className={styles.headLink}>{t(linkT)}</a>
              </Link>}
        </div>

      <PageContainer>
        {elements}  
        {!THEME?.isDesktop && <Link href={linkTo} className={styles.headLink} style={{marginLeft: "auto", marginRight: "auto", marginTop: "20px"}}>{t(linkT)}</Link>}
      </PageContainer> 
    
    </>    
    )
}


export async function getServerSideProps() {
 
  
  const res = await createStrapiAxios()
 
    .get(`/experts?populate[0]=branches&populate[1]=specializations&populate[2]=user.avatar&pagination[page]=1&pagination[pageSize]=15&sort[0]=rating:desc&filters[rating][$null]`)

  const data = await res.data.data;

  
  return { props: { circlePeople: data } }
}