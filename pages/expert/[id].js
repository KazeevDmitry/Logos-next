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

    console.log('feedbacks--------------------------', feedbacks);

if (isLoading || isFetching) {
    return
}

if (isError) {
    console.log('error in expert query (useQuery())');
    return
}


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
      children: 'Content of Tab Pane 2',
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
                <Row gutter = {[pad, pad]}>
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
 
   .get(`/experts/${id}?populate[0]=branches&populate[1]=user.avatar&populate[2]=feedbacks`)
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