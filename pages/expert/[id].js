import React, {useState } from 'react';

import { useQuery } from "react-query";
import { Tabs, Space, Spin, Row, Col, Button } from 'antd';

import styles from '././expertInfo.module.less';

import { useThemeContext } from '../../src/context/themeContext';
import { useUserContext } from '../../src/context/userContext';
import PageContainer from '../../src/components/layouts/pageContainer';
import PageHeader from '../../src/components/layouts/pageHeader';
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/router";
import { createStrapiAxios } from '../../utils/strapi';
import Image  from 'next/image';
import UserImage from '../../src/components/userImage/userImage';
import {EnvironmentOutlined} from '@ant-design/icons';
import { TrophyOutlined, StarOutlined } from '@ant-design/icons';
import SideFeedbacks from '../../src/components/feedbacks/sideFeedbacks';
import Feedbacks from '../../src/components/feedbacks/feedbacks';

//import RatingBar from '../../src/components/ratingbar/ratingbar';
//import Feedbacks from '../../src/components/feedbacks/feedbacks';
//import SideFeedbacks from '../../src/components/feedbacks/sideFeedbacks';


export default function ExpertInfo ({serverExpert}) {

    const { t } = useTranslation();
    const theme = useThemeContext();
    const router = useRouter();
    
    const expertId = router.query.id;


    //const cityName = theme.cities.find(city => city.id === user.city)?.city;

 //   const p = theme?.gutters.gorizontal[theme?.id];

   // const pad = `${p}px`;
   
    const { TabPane } = Tabs;
    const [activeKey, setKey] = useState('1');


  const {isSuccess,
    isLoading,  
    isFetching,
    isError,
    data: { data: expert = {} , meta: meta = null} = {} }  = useQuery(["expert", expertId],
                                         () => getExpert(expertId),
                                       {
                                         keepPreviousData: true,
                                         refetchOnMount: false,
                                         refetchOnWindowFocus: false,
                                         initialData: serverExpert 
                                       }
                                     ); 


   /*  const handleClick = (key) => {
      setKey(`${key}`);
  //    console.log({activeKey});
    }
 */
    const exp = expert.attributes;
    const name = exp.user?.data?.attributes?.name;
    const surname = exp.user?.data?.attributes?.surname;
    const username = `${name} ${surname}`;
    const feedbacks = exp.feedbacks?.data;
    const userImage = exp.user?.data?.attributes?.avatar?.data?.attributes?.url?? '';
    
    const cityName = theme.cities.find(city => city.id === exp.user?.data?.attributes?.city)?.city;

    console.log('expert--------------------------', expert);

if (isLoading || isFetching) {
    return
}

if (isError) {
    console.log('error in expert query (useQuery())');
    return
}

const feedBacksBlock = <>
    <Feedbacks
        feedbacks={feedbacks}
    >

    </Feedbacks>
</>

const userTitle = <>  
        <Space>
             <UserImage
                  image= {userImage}
                      online={false}
                      width= {200}
                      username={username}
                       />       
                    
               <div style={{margin:'0 0 20px 20px'}}>
                   <div>
                       <span>{name} {surname}</span>
                   </div>
                   <Space style={{width: "100%", display:'flex', justifyContent:'space-between'}}>

                    <div style={ {
                         display: 'flex',
                         flexDirection: 'row',
                         justifyContent: 'flex-start',
                         alignItems: 'center',
                        }}>

                        <EnvironmentOutlined 
                            style={{
                              color : 'grey', 
                              fontSize: `24px`, 
                              fontWeight: "600"
                              }}/>
                   
                       <div style={{ fontSize: '22px', color: 'grey', marginLeft: '10px'}}>
                           {cityName}
                       </div>

                       </div>

                       {/* <div>
                           <RatingBar
                               stars = {values.stars}
                               cups = {values.cups}
                               reviews = {values.reviews}
                           />
                       </div> */}
                   </Space>
                </div>
        </Space>
        </>;

const tabItems = [
    {
      key: '1',
      label: t('labels.information'),
      children: <span>INFO</span>,
    },
    {
      key: '2',
      label: t('labels.feedbacks'),
      children: feedBacksBlock,
    },
  ];

  const p = theme?.gutters?.gorizontal[theme?.id];

  const pad = `${p}px`;


    return(
        <>

        <PageHeader title= {userTitle}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',    
            }}>
                <Button style={{marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto', }}>НАПИСАТЬ В ЧАТ</Button>
            </div>
        </PageHeader>

        <PageContainer>
            <Col xs={0} sm={0} md={18} lg={18} xl={18}>
               
               
                    <Tabs  defaultActiveKey="1" 
                     items={tabItems} 
                       // onChange={onChange} 
                     //style={{marginTop:'40px'}}
                      />
               
                
            </Col>

            <Col xs={0} sm={0} md={6} lg={6} xl={6}>
                <Row gutter = {[pad, pad]} style={{marginTop: '66px'}}>
                <div className={styles.ratingCup} style={{padding: `0px 0px 0px ${pad}`, overflow: 'hidden'}}>
                    <div className={styles.firstContainer} style={{marginLeft: "0px"}}>
                        <h3 className={styles.title}>Рейтинг</h3>
                        <div className={styles.subrow}>
                        <TrophyOutlined style={{color : "#F4B336" , 
                            fontSize: `24px`, 
                            fontWeight: "600"}}
                />
                            <span className={styles.cupNum}>82459</span>
                        </div>
                    </div>
                    <TrophyOutlined style={{color : "#F4B336" , 
                            marginRight: '-50px',
                            fontSize: `150px`, 
                            fontWeight: "600", 
                            opacity : 0.2}}
                />
                </div>

                 <SideFeedbacks feedbacks={feedbacks}/> 

                </Row>
            </Col> 
        </PageContainer>
        </>
    )

}


async function getExpert(id) {

   
    const data = await createStrapiAxios()
 
   .get(`/experts/${id}?populate[0]=branches&populate[1]=user.avatar&populate[2]=feedbacks.author.avatar&populate[3]=educations.diplom`)
   .then(res => res.data)
   .catch(e => {
      console.log("ERROR in GetExpert --------", e);
      return null;
    });
  
   return (data) 
  
  };


export async function getServerSideProps(context) {
  
    const {id} = context.query;

    const data = await getExpert(id);
      
    return { props: { serverExpert: data } }  
  }


//***************************************************************************************************************************** */


  function Info ({expert}) {

    const cExpert = expert.data.attributes;

    const branches = cExpert.branches;
    const experience = cExpert.experience;
    const description = cExpert.description;

    const expStr = experience ? `${experience} лет` : 'Не указан';  //  t()-------------------------------------------------------------------------------------------------------------------------------

    const theme = useThemeContext();

    const contentStyle = {
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
      };

const branchesLabels = branches.map(item => {
    return (
        <span className={styles.lawType}>{item.data?.attributes?.name?? ''}</span>
    )
});

let diploms = [];

const educationCards = educations.map(item => {

if (item.diplom)
    diploms.push(item.diplom);

    return (
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <div className={styles.education}>
            <h4 className={styles.subtitle}><span className={styles.univercity1}>{item.university}</span></h4>
            <div className={styles.subrow1}>
                {/* <span className={styles.univercitySpec1}>Гражданское право</span>
                <div className={styles.circleDivider}></div> */}
                <span className={styles.univercitySpec2}>{item.speciality}</span>
                <div className={styles.circleDivider}></div>
                <span className={styles.year}>{item.year}</span>
            </div>
        </div>
        </Col>
    )
});


const diplomsCards = diploms.map(elem => {
    return (
        <div style={{height:'307px', width: "215px"}}>
        <Image
            src={`${process.env.REACT_APP_API}${elem.url}`}
         //   preview={{ maskClassName: `${stylesArt.antImageMask}` }}
            width = {"100%"}
                      // src={bgSvg}
                    //   style={{ borderRadius: '10px 10px 0px 0px'}}
            fallback="data:image/png;base64,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"
       />
       </div>
    )
});

    return (
        <div className={styles.blockMain}>
        
           {/* <div className={styles.row1}> */}
               <Row gutter={[40, 20]} style={{width: "100%"}}>
                   <Col xs={24} sm={24} md={9} lg={9} xl={9}>
                        <div style={{display:'flex', flexDirection: "column", flexWrap:'wrap', width:'100%'}}>
                                <p className={styles.title}>Специализация</p>
                                <span className={styles.occupation}>{specialization.name}</span>
                                <div className={styles.subrow} style={{marginLeft: "-20px"}}>
                                    <span className={styles.comment} style={{marginLeft: "20px", marginTop: "10px"}}>Стаж</span>
                                    <span className={styles.experience} style={{marginTop: "10px"}}>{expStr}</span>
                                    <div style={{display:'flex', flexWrap:'nowrap', marginLeft: "20px", justifyContent: "flex-start", marginTop: "10px"}}>
                                        <img className={styles.human} src={human} alt="img"></img>
                                        <span className={styles.facetype}>{fis ? "Физ. лицо" : "Юр. лицо"}</span>
                                    </div>    
                                 </div>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={15} lg={15} xl={15}>
                        <div className={styles.category}>
                            <p className={styles.title}>Категории права</p>
                            <div className={styles.subrow}>
                                {branchesLabels}
       
                            </div>
                        </div>
                    </Col>
               </Row>
           {/* </div> */}
           <div className={styles.row2} style={{width: "100%"}}>
               <h3 className={styles.title}>Личная информация</h3>
               <h4 className={styles.comment2}>О себе</h4>
               <div className={styles.personalInfo}><span className={styles.personalText}>{description}</span></div>
           </div>
           {/* <div className={styles.row3}>
                <h3 className={styles.title}>Услуги и цены</h3>
                <h4 style={{marginTop:'20px'}}><span className={styles.serviceType}>Услуги по регистрации бизнеса</span></h4>
                <div className={styles.serviceContainer}>
                    <div><span>Юридическое сопровождение сделок с недвижимостью с недвижимостью</span></div>
                    <div><span>15 000 ₽</span></div>
                    <div><span>Юридическое сопровождение сделок с недвижимостью</span></div>
                    <div><span>15 000 ₽</span></div>
                    <div><span>Юридическое сопровождение сделок с недвижимостью</span></div>
                    <div><span>15 000 ₽</span></div>
                </div>
                <h4 style={{marginTop:'30px'}}><span className={styles.serviceType}>Услуги по ликвидации бизнеса</span></h4>
                <div className={styles.serviceContainer}>
                    <div><span>Юридическое сопровождение сделок с недвижимостью</span></div>
                    <div><span>15 000 ₽</span></div>
                </div>
           </div> */}
           <div className={styles.row4}>
                <h3 className={styles.title}>Образование</h3>
             
                <Row style = {{width: "100%"}} gutter={[theme?.gutters.gorizontal, theme?.gutters.vertical]}>
                    {educationCards}
                </Row>
           </div>
           
           <div className={styles.row5} style={{width: "100%"}}>
                <div className={styles.withArrows}>
                    <h3 className={styles.title}>Сертификаты и документы</h3>
                </div>    
         
           
                <Carousel 
                    width='90%'
                    centerMode={true} 
                    centerSlidePercentage='25'
                    //centerSlidePercentage={theme?.id === 'xl' || theme?.id === 'xxl' ? '30' : '50' }
                    infiniteLoop={false} showArrows={true} showThumbs={false}
                    emulateTouch={true} swipeable={true}
                    >
                    {diplomsCards}
                </Carousel>
           </div>
     
    </div> 
    )
}