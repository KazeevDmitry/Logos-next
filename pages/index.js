import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/mainPage.module.less'

import Link from 'next/link'

import {useThemeContext} from '../src/context/themeContext'
import {useUserContext} from '../src/context/userContext'

import { useTranslation } from 'react-i18next'
import UserCircle from '../src/components/userCircle/userCircle';
import UserImage from '../src/components/userImage/userImage';

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

  const theme = useThemeContext();

  THEME = theme;

  const currentUser = useUserContext();

  const {t} = useTranslation();

  
  const [showLittleCard, setshowLittleCard] = useState();
  const [circleUser, setCircleUser] = useState({});


  console.log("SPEC------------------------", THEME.spec);
  
  const res = `-${theme?.appContainerPadding}px`;

  const bigCircle = theme.size === "middle" ? "100px" : (theme.id === "xl" ? "130px" : "150px");
  const midlCircle = theme.size === "middle" ? "80px" : (theme.id === "xl" ? "100px" : "120px");
  const smallCircle = theme.size === "middle" ? "60px" : (theme.id === "xl" ? "80px" : "100px");

  const circleStyles = [
    
    {
      top: "44%",
      right: "16%",
      width: bigCircle,
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

 /*  const circleStyles = [
    
    {
      top: "49%",
      right: "14%",
      width: bigCircle,
    },
    {
      top: "28.8%",
      right: "6%",
      width: bigCircle,
    },
    {
      top: "16.5%", 
      right: "16.5%",
      width: midlCircle,
    },
    {
      top: "33%",
      right: "22.3%",
      width: midlCircle,
    },
    {
      top: "23%",
      right: "33.5%",
      width: smallCircle,
    },
    {
      top: "47%",
      right: "30%",
      width: smallCircle,
    },
    
  ]; */

  const onMouseEnter = (user) => (e) => {
    let c = e.target.getBoundingClientRect();

    const left = Math.round(c.left - 300 + c.width * 0.2 + window.pageXOffset);
    const top = Math.round(c.bottom -60 + window.pageYOffset - c.height * 0.2);
    

    setCircleUser({user, left, top});
    setshowLittleCard(true);

  };

  const onMouseLeave = () => {
    setshowLittleCard(false);
  }

  const circleUsers = circlePeople.map((item, i) => {
    return (
      <div style={{...circleStyles[i], position: "absolute"}}> 
        <Link href='experts' >
          <UserImage
            image= {item.avatar[0].url}
            width= {circleStyles[i].width}
            onMouseEnter = {onMouseEnter(item)}
            onMouseLeave = {onMouseLeave}
            style={{cursor: "pointer"}}
          />
        </Link> 
      </div>
    )
  });


const USERS_COUNT= 1000;

  return (
    <>
   <div className={styles.sectionPromo} style={{marginLeft: res, marginRight: res, padding: `0px ${theme?.appContainerPadding}px`}}> 
   
       <div className={styles.txtWrapper} style={{marginLeft: `6%-${theme?.appContainerPadding}px`, height: "100%"}}>
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
            spec={"Адвлкат"} //временно------------------------------------------------------------------------------
        />}
        <MainTabs/>   
    

    </div>

    
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
            <div className={styles.gridElement}> {nameStr} 
              </div>
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

export async function getServerSideProps() {

  
  const res = await createStrapiAxios()
  .get(`/users?populate=avatar&start=0&limit=6&sort[0]=rating:desc&filters[rating][$null]`)

  const data = await res.data;

  
  return { props: { circlePeople: data } }
}


function MainTabs ({onChange}, ...props) {

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
