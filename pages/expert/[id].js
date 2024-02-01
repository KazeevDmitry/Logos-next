import React, {useState } from 'react';

import { useQuery } from "react-query";
import { Image as AntImage, Tabs, Space, Spin, Row, Col, Button } from 'antd';

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
import {EnvironmentOutlined, UserOutlined} from '@ant-design/icons';
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
    const cRating = exp.rating;
    
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
      children: <Info expert={expert}/>,
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
                            <span className={styles.cupNum}>{cRating}</span>
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
 
   .get(`/experts/${id}?populate[0]=branches&populate[1]=user.avatar&populate[2]=feedbacks.author.avatar&populate[3]=educations.diplom&populate[4]=specializations`)
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

    const cExpert = expert.attributes;

    const branches = cExpert.branches.data?? [];
    const educations = cExpert.educations.data?? [];
    const experience = cExpert.experience;
    const description = cExpert.description;
    
    console.log('cExpert-------------------------------------------', cExpert);


    const expStr = experience ? `${experience} лет` : 'Не указан';  //  t()-------------------------------------------------------------------------------------------------------------------------------

    const theme = useThemeContext();

    const gutter = theme?.gutters?.gorizontal[theme?.id]?? 20;

    const pad = `${gutter}px`;


    const contentStyle = {
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
      };

const branchesLabels = branches.map(item => {
    return (
        <span className={styles.lawType} style={{fontSize: "14px"}}>{item.attributes?.name?? '----not found----'}</span>
    )
});

let diploms = [];

const educationCards = educations.map(item => {

    const cItem = item.attributes;
    const uCityName = theme.cities.find(city => city.id === cItem.city)?.city;
   const diplom = cItem.diplom?.data?.attributes?.url?? '';
   const cImage = `${process.env.NEXT_PUBLIC_UPLOADS_API}${diplom}`;

    return (
        <>
        {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}> */}
        <div 
            className={styles.education} 
            style={{
                display: "flex", 
                justifyContent: "flex-start",
                alignItems: 'center',
                flexDirection: 'row',
                }}>
            <div >
              
                <AntImage
                  src={cImage}
                  width = {"100px"}
                  height={"150px"}
                />
            </div>
            <div style={{
                display: "flex", 
                justifyContent: "flex-start",
                alignItems: 'start',
                flexDirection: 'column',
                marginLeft: pad,
            }}>
                <h4 className={styles.subtitle}><span className={styles.univercity1}>{cItem.university}</span></h4>
                <div className={styles.subrow1}>
     
                    <span className={styles.univercitySpec2} style={{marginLeft: '0px'}}>{cItem.speciality}</span> 
                    <div className={styles.circleDivider}></div>
                    <span className={styles.year}>{cItem.year}</span>
                </div>
            </div>
        </div>
   
</>
    )
});




    return (
        <div className={styles.blockMain}>
        
           {/* <div className={styles.row1}> */}
               <Row gutter={[pad, pad]} style={{width: "100%"}}>
                   <Col xs={24} sm={24} md={9} lg={9} xl={9}>
                        <div style={{display:'flex', flexDirection: "column", flexWrap:'wrap', width:'100%'}}>
                                <p className={styles.title}>Специализация</p>
                               {/*  <span className={styles.occupation}>{specialization.name}</span> */}
                                <div className={styles.subrow} style={{marginLeft: "-20px"}}>
                                    <span className={styles.comment} style={{marginLeft: "20px", marginTop: "10px", color : "darkgrey"}}>Стаж</span>
                                    <span className={styles.experience} style={{marginTop: "10px"}}>{expStr}</span>
                                    <div style={{display:'flex', flexWrap:'nowrap', marginLeft: "20px", justifyContent: "flex-start", marginTop: "10px"}}>
                                        <UserOutlined style={{color : "darkgrey"}}/>
                                        {/* <span className={styles.facetype}>{fis ? "Физ. лицо" : "Юр. лицо"}</span>   Need to add a fis field into DB expert model*/} 
                                        <span className={styles.facetype}>Физ. лицо</span> 
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

           <div className={styles.row4}>
                <h3 className={styles.title}>Образование</h3>
             
                <Row style = {{width: "100%"}} gutter={[pad, pad]}>
                    {educationCards}
                </Row>
           </div>
       {/*     
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
           </div> */}
     
    </div> 
    )
}