import React, { Children, useContext, useState } from 'react';
//import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import TweenOne from 'rc-tween-one';

// import CityInput from '@components/cityInput/cityInput';
import InputSlider from '@components/input-slider/input-slider';

import Tasks from '@components/tasks/tasks';
import Advantages2 from '@components/advantages2/advantages2'; 
import Footer from '@components/footer/footer';
import UserCard from '@components/userCard/userCard';
import NewsCard from '@components/newsCard/newsCard';
import News from '@components/news/news';
import Plural from '@components/globFunc';

import { useQuery } from "react-query";
import styles from './main-page.module.less';
import starsvg from './icons/Star_red.svg';
import cupsvg from './icons/cup.svg';
import checkedSvg from './icons/checked.svg';

import TaskCard from '../../components/tasks/taskCard';
import { UserContext } from '../../Providers/UserContext';
import { ThemeContext } from '../../Providers/themeContext';

import { Select, Button, Row, Col, Form, Spin } from 'antd';

import { Link, useNavigate } from "react-router-dom";

import PageHeader from '../../components/layout/pageHeader';
import PageContainer from '../../components/layout/pageContainer';
import RatingBar from '../../components/ratingbar/ratingbar';
// import { default as CATEGORIES } from '../../directories/kategory.json';
// import { default as SPECIALIZATION } from '../../directories/special.json';
// import cityInitObj from '../../directories/russia.json';

let THEME = {};
let userId = null;

// let SPECIALIZATION = [];
// let CATEGORIES = [];
let EXPERTS = [];

const USERS_COUNT = 1000;

let coord = {};


function PromoDiv({children}) {

  const [values, setValues] = useState({
    showModal: false,
    username: '',
    soname: '',
    stars: 0,
    reviews: 0,
    cups: 0,
    circleId: 0,
  });

  const onMouseEnter = (e) => {
    let c = e.target.getBoundingClientRect();

    coord = {
      left: c.left - 300 + c.width * 0.25 + window.pageXOffset,
      top: c.bottom - 100 + window.pageYOffset - c.height * 0.25
    };

    const { name : username, surname: soname, id } =
      experts[+e.target.id - 1];

      // const { username, soname, stars, reviews, cups, id } =
      // props.humanArr[+e.target.id - 1];


    if (!values.showModal) {
      setValues({
        ...values,
        showModal: true,
        username,
        soname,
        stars: 4,
        reviews: 18,
        cups: 1356,
        // stars,
        // reviews,
        // cups,
        circleId: id
      });
    }
  };

  const onMouseLeave = (e) => {
    setValues({...values, showModal: false });
  };

  const api = {
    people: () => axios.get(`${process.env.REACT_APP_API}/users?_limit=6&_start=0`),
    count: () => axios.get(`${process.env.REACT_APP_API}/users/count?${countSearchStr}`),
    
  };
  

  const {isFetching: QFetch, 
    isLoading: QLoading,
    data: { data: experts = [] } = {} } = useQuery('expertsForCircles', api.people,{refetchOnWindowFocus: true }) ;



if (QFetch||QLoading) {
  return (

    null
    
  )
}



console.log('experts');
console.log(experts);

console.log(`${process.env.REACT_APP_API}/users?_limit=6&_start=0`);

EXPERTS = experts;

  const res = `-${THEME?.appContainerPadding}px`
  return (<div className={styles.sectionPromo} style={{marginLeft: res, marginRight: res, padding: `0px ${THEME?.appContainerPadding}px`}}>
   {/* {children} */}
   <div className={styles.txtWrapper}>
              <Promo count={USERS_COUNT} />
            </div>  
         
                  {/* </PromoDiv> */}
                  <Link to = {`experts/${experts[0].id}`} className={styles.promoImg_1}>
               
                    <img
                      id="1"
                      className={styles.promoFoto}
                      src={`${process.env.REACT_APP_API}${experts[0].avatar?.url}`}
                      alt="..."
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                      
                    ></img>
                  </Link>
                  <Link to = {`experts/${experts[1].id}`} className={styles.promoImg_2}>
               
                      <img
                        id="2"
                        className={styles.promoFoto}
                        src={`${process.env.REACT_APP_API}${experts[1].avatar?.url}`}
                        alt="..."
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                      ></img>
                    </Link>
                  <Link to = {`experts/${experts[2].id}`} className={styles.promoImg_3}>
                    
                    <img
                      id="3"
                      className={styles.promoFoto}
                      src={`${process.env.REACT_APP_API}${experts[2].avatar?.url}`}
                      alt="..."
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                    ></img>
                  </Link>
                  <Link to = {`experts/${experts[3].id}`} className={styles.promoImg_4}>
                    
                    <img
                      id="4"
                      className={styles.promoFoto}
                      src={`${process.env.REACT_APP_API}${experts[3].avatar?.url}`}
                      alt="..."
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                    ></img>
                  </Link>
                  <Link to = {`experts/${experts[4].id}`} className={styles.promoImg_5}>
               
                    <img
                      id="5"
                      className={styles.promoFotoLg}
                      src={`${process.env.REACT_APP_API}${experts[4].avatar?.url}`}
                      alt="..."
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                    ></img>
                  </Link>
                  <Link to = {`experts/${experts[5].id}`} className={styles.promoImg_6}>
                    
                    <img
                      id="6"
                      className={styles.promoFotoLg}
                      src={`${process.env.REACT_APP_API}${experts[5].avatar?.url}`}
                      alt="..."
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                    ></img>
                  </Link>


                  <LittleCard
              isVisible={values.showModal}
              username={values.username}
              soname={values.soname}
              stars={values.stars}
              reviews={values.reviews}
              cups={values.cups}
              modalX={coord.left}
              modalY={coord.top}
            />
     
                <TabContent1/>
  </div>)
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

        <TabContent1/>

    </>
  )
} 
export default function MainPage (props) {

  THEME= useContext(ThemeContext);

  
  const {t} = useTranslation();

   const [values, setValues] = useState({
      showModal: false,
      username: '',
      soname: '',
      stars: 0,
      reviews: 0,
      cups: 0,
      circleId: 0,
      activeTab: 1,
      cityListOn: false
    });

    const {currentUser} = useContext(UserContext);
 
 userId = currentUser.user?.id;

 //------------------------------------user list for circles and best experts cards ----------------------------------------------------------------


 



 //------------------------------------user list for circles and best experts cards ----------------------------------------------------------------


    const onMouseEnter = (e) => {
      let c = e.target.getBoundingClientRect();

      coord = {
        left: c.left - 300 + c.width * 0.25 + window.pageXOffset,
        top: c.bottom - 100 + window.pageYOffset - c.height * 0.25
      };

      const { name : username, sirname: soname, id } =
        experts[+e.target.id - 1];

        // const { username, soname, stars, reviews, cups, id } =
        // props.humanArr[+e.target.id - 1];


      if (!values.showModal) {
        setValues({
          ...values,
          showModal: true,
          username,
          soname,
          stars: 4,
          reviews: 18,
          cups: 1356,
          // stars,
          // reviews,
          // cups,
          circleId: id
        });
      }
    };

    const onMouseLeave = (e) => {
      setValues({...values, showModal: false });
    };

    const onCircleClick = (index) => {
     
      props.onCircleClick(index);
    };

    const onTabChanged = (activeTab) => {
            if (activeTab !== values.activeTab) {
                setValues({...values, activeTab});
            }
        }

      

   
    const { humanArr } = props;

    let cnt = 9;
  if (THEME?.id === "sm"||THEME?.id === "md" ) {
    cnt= 8;
  }

// best experts array --> 
// const BESTSPECS = humanArr.slice(0,cnt).map((item) => {
  
// fetchihg lastest 5 acticles -->

    const limit = THEME?.id==="sm" ? 4 : 5;

    const {isFetching: artFetching, 
      data: { data: articles = [] } = {} } = useQuery(`ArticlesLatest`,() => axios.get(`${process.env.REACT_APP_API}/articles?_sort=published_at:DESC&_limit=${limit}&_start=0`),
               {
                  refetchOnWindowFocus: false }
    ); 

    const newsArticles = articles.map(({title, slug, image, category, published_at }, i) => {
      
  
      cnt = THEME?.id==="xs" ? 24 : (THEME?.id!=="sm" ? (i % 5 ? 8 : 16) : (i % 3 ? 12 : 24));


      const cImage = image ? `url(${process.env.REACT_APP_API}${image.url || image?.formats?.medium?.url})` : '';


      



// const BESTSPECS = experts.slice(0,cnt).map((item) => {

//   return (
//     <>
//     <Col  xs={24} sm={12} md={12} lg={8} xl={8}  xxl={8}>
//       <Link to="/experts" style={{ color: 'black' }}>
//         <UserCard
//           username={item.username}
//           soname={item.soname}
//           stars={item.stars}
//           reviews={item.reviews}
//           cups={item.cups}
//           specid={item.specid}
//           image = {item.image}
//           online = {item.online}
//           checked= {item.checked}
//         /> 
//       </Link>
//     </Col>
//     </>
//   )
// });

  
      return(
  
        <NewsCard
        key={slug}
          title = {title}
          slug = {slug}
          image = {cImage}
          category = {category}
          published_at = {published_at}
          cnt= {cnt}
          catgName = ''
          showCatg = {true}
        />
  
      )
    });


    const {isFetching: taskFetching, 
      data: { data: tasks = [] } = {} } = useQuery(`TasksLatest`,() => axios.get(`${process.env.REACT_APP_API}/tasks?_sort=published_at:DESC&_limit=6&_start=0`),
               {
                  refetchOnWindowFocus: false }
    ); 

    const taskCards = tasks.map(({title, id, slug, text, created_at, author, branches, specialization, contractual, budget, city, responses, performer, status }, i) => {

      const cityName = THEME?.cities.find(item => item.id === city)?.city;
    
      let authorStatus = userId !== null && userId !== undefined ? 
                           (userId === author?.id ? "youAuthor" :
                           (userId === performer?.id && status !== "confirmed" ? "youChosen" :
                           (userId === performer?.id && status === "confirmed" ? "youPerformer" : (!!responses.find(item => item.user === userId) ? "youRespond" : '')))) : ''; 
         if (performer !== null && performer !== undefined && status !== "confirmed" && userId !== performer?.id)
         {
            authorStatus= "hasPerformer"                    
         } 
    
        
    
      return(
        <>
    
          {/* <Col style = {{width: "100%"}}> */}
            <TaskCard
              key={id}    
              title = {title}
              id = {id}
              slug = {slug}
              text = {text}
              published_at = {created_at}
              cnt= {THEME?.isDesktop ? 12 : 24}
              budget = {budget}
              contractual = {contractual}
              branches = {branches}
              specialization = {specialization ? specialization?.name : ''}
              // marginTop = {gutter}
              cityName = {cityName}
              responses = {responses}
              authorStatus = {authorStatus}
              fromMainPage = {true}
            />
          {/* </Col> */}
        </>  
        )
      });
          
    return (
      
      <>
      
        <MobyleMainHeader count={USERS_COUNT}/>
         <PromoDiv>
                  <Link to = 'contractorinfo'  className={styles.promoImg_2}>
                    <img
                      id="2"
                      className={styles.promoFoto}
                      // src={`${process.env.REACT_APP_API}${experts[1].avatar?.url}`} 
                      alt="..."
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                      // onClick={() => onCircleClick(humanArr[1].id)}
                    ></img>
                  </Link>
                  <Link to = 'contractorinfo' className={styles.promoImg_3}>
                    <img
                      id="3"
                      className={styles.promoFoto}
                      // src={`${process.env.REACT_APP_API}${experts[2].avatar?.url}`}
                      alt="..."
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                      // onClick={() => onCircleClick(humanArr[2].id)}
                    ></img>
                  </Link>
                  <Link to = 'contractorinfo' className={styles.promoImg_4}>
                    <img
                      id="4"
                      className={styles.promoFoto}
                      // src={`${process.env.REACT_APP_API}${experts[3].avatar?.url}`}
                      alt="..."
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                      // onClick={() => onCircleClick(humanArr[3].id)}
                    ></img>
                  </Link>
                  <Link to = 'contractorinfo' className={styles.promoImg_5}>
                    <img
                      id="5"
                      className={styles.promoFotoLg}
                      // src={`${process.env.REACT_APP_API}${experts[4].avatar?.url}`}
                      alt="..."
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                      // onClick={() => onCircleClick(humanArr[4].id)}
                    ></img>
                  </Link>
                  <Link to = 'contractorinfo' className={styles.promoImg_6}>
                    <img
                      id="6"
                      className={styles.promoFotoLg}
                      // src={`${humanArr[5].image || 'https://picsum.photos/200/300?random=42&blur=3&grayscale'}`}
                      // src={`${process.env.REACT_APP_API}${experts[5].avatar?.url}`}
                      alt="..."
                      onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave}
                      // onClick={() => onCircleClick(humanArr[5].id)}
                    ></img>
                  </Link>
            
            {/* <LittleCard
              isVisible={values.showModal}
              username={values.username}
              soname={values.soname}
              stars={values.stars}
              reviews={values.reviews}
              cups={values.cups}
              modalX={coord.left}
              modalY={coord.top}
            />
     
                <TabContent1/> */}

        </PromoDiv>
        <div className={styles.contSection}>
          <div style={{width: "100%", height: "90px"}}></div>
          {/* <InfoBlock
            elements = {BESTSPECS}
            linkTo = '/experts'
            headerT = 'main.top.title'
            linkT = 'links.allExperts'
          /> */}
          <InfoBlock
            elements = {newsArticles}
            linkTo = '/news'
            headerT = 'headers.news'
            linkT = 'links.allnews'
          />
          <InfoBlock
            elements = {taskCards}
            linkTo = '/tasks'
            headerT = 'headers.tasks'
            linkT = 'links.alltasks'
          />
          <Advantages2 />
          
        </div>
 
      </>
    );
  
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
            {THEME?.isDesktop && <Link to={linkTo} className={styles.headLink}>{t(linkT)}</Link>}
        </div>

      <PageContainer>
        {elements}  
        {!THEME?.isDesktop && <Link to={linkTo} className={styles.headLink} style={{marginLeft: "auto", marginRight: "auto", marginTop: "20px"}}>{t(linkT)}</Link>}
      </PageContainer> 
    
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

export function LittleCard({ isVisible = null, username, soname, stars, reviews = '', cups, modalX, modalY, checked }){
  const { t } = useTranslation();
  const nameStr = `${username} ${soname}`;

  const reviewStr = <Plural count={reviews} i18nextPath="reviews.plural" />;
  const showCh = ((checked === 'true') ? true : false);

  return (
    <>
      {isVisible && (<TweenOne
        animation={{
          opacity: 0,
          type: 'from',
          duration: 250,
        }}
        // leave={{ opacity: 0, width: 0, scale: 0, duration: 742, type: 'to', }}
        // appear={false}
      >
        <div className={styles.littleCard} style={{left: modalX, top: modalY}} >
            <div className={styles.gridElement}> {nameStr} 
                {showCh && <img className={styles.checked} src={checkedSvg} alt=""></img>}
            </div>
            {/* <img src={starsvg} alt='...' ></img>  
            <div className={styles.secondRowItem}>{stars}</div>     
            <div className={styles.reviewsItem}>{reviewStr}</div>
            <img src={cupsvg} alt='...'></img>      
            <div className={styles.secondRowItem}>{cups}</div>    */}
            <div style={{width: "100%"}}>
                    <RatingBar
                        stars = {stars}
                        cups = {cups}
                        reviews = {reviews}
                    />
                  </div>
        </div>
      </TweenOne>)}
   

    </>
  )
}

function TabContent1 ({onChange}, ...props) {

  const [activeTab, setActiveTab] = useState(1);

  const {t} = useTranslation();
  const navigate= useNavigate();
  
  
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
     navigate(`tasks?${searchStr}`);
   
  };
      
    const thirdBlock = [];
    let btnName = '';
    let contPadding = "35px";

    if (activeTab === 1) {
      // thirdBlock.push(<span className={styles.inTabSpan}>Бюджет</span>);

      thirdBlock.push(
        <Form.Item
        name="budget"
        label= {t("labels.budget") }
        style={{marginRight: "0px", marginBottom: "0px"}}
      >
        <InputSlider
          maxValues={[1000, 500000]}
          step={1000}
        
        />
        </Form.Item>
      );
      btnName = t('buttons.findTask');
    } else {
      // thirdBlock.push(
      //   <span className={styles.inTabSpan}>Категории права</span>
      // );

      thirdBlock.push(
        <Form.Item
        name="category"
        label={t('labels.catPrava')}
        style={{marginRight: "0px", marginBottom: "25px", width: "100%"}}
        >
          <CityInput marker="catg" />
        </Form.Item>  
      );

      btnName = t('buttons.findExpert');
      contPadding = "50px";
    }

const s1 = THEME?.isDesktop ? t('labels.lookTask'): t('labels.tasks');
const s2 = THEME?.isDesktop ? t('labels.lookExpert'): t('labels.experts');


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
          gutter = {{xs: 10, sm: 10, md: 15, lg: 20, xl: 30,  xxl: 40}, {xs: 10, sm: 10, md: 15, lg: 20, xl: 30,  xxl: 40}} 
          // gutter = {theme?.gutters.vertical, theme?.gutters.gorizontal}
          className={styles.tabContentBox}
          style={{marginLeft: "0px", paddingBottom: contPadding}}
          >
                
            <TabCol>
              <Form.Item
                name="city"
                label={t('labels.city')}
                style={{marginRight: "0px", marginBottom: "0px", width: "100%"}}
              >
                
                <CityInput />
              </Form.Item>  
            </TabCol>
            <TabCol>
              <Form.Item
                name="spec"
                label={t('labels.speciality')}
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


export function CityInput({value, onChange, marker="city", width="100%"}) {
   
   const theme = useContext(ThemeContext);

   console.log("specialization");
console.log(theme?.specializations);

  // const SPECIALIZATION = theme?.specialization;
  // const CITYOBJ = theme?.cities;
  // const CATEGORIES = theme?.branches;

// if (!SPECIALIZATION || !CITYOBJ || !CATEGORIES) {
//   return (null)
// }

  const onThisChange = (newvalue) => {

     onChange?.(newvalue);
  };

  const api = {
    payments: () => axios.get(`${process.env.REACT_APP_API}/payments`),
  };

const {isFetching: QFetch, 
        isLoading: QLoading,
        data: { data: payments = [] } = {} } = useQuery(`Payments`, api.payments,{refetchOnWindowFocus: false }) ;

  
  if (QFetch||QLoading) {
    return (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginTop: "150px"}}><Spin size = 'large'/></div>
    )
  }

  const elements = marker === "spec" ? 
  theme?.specializations.map(({ id, name }) => 
      <Select.Option key={id} value={+id}>{name}</Select.Option>
    ) : (marker ===  "city" ? 
    theme?.cities.map(( item, index) => {
      const { region, city } = item;
      const cityStr = `${city}  ${region}`;
      return(
       <Select.Option key={index} value={+item.id} title ={cityStr}>{city}</Select.Option>
      );
    }
    ) : (marker === "payment" ? payments.map((item) => {
      const { id, name } = item;
      return <Select.Option key={id} value={+id}>{name}</Select.Option>;
     }) : 
     theme?.branches.map((item) => {
       const { id, name } = item;
       return <Select.Option key={id} value={+id}>{name}</Select.Option>;
      }))
    );

  return (
    <Select
      showSearch
      style = {{width: width}}
      placeholder=""
      optionFilterProp="children"
      value={value ? +value : null}
      onChange={onThisChange}
      size={theme?.size}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      filterSort={(optionA, optionB) =>
        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
      }
    
    >
      { elements }
    </Select>
  );
}


// const elements = CATEGORIES.map((item) => {
//   const { id, katgName } = item;
//   return <Select.Option key={item} value={id} className={styles.tabInput}>{katgName}</Select.Option>;
// });