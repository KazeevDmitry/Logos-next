import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from "react-query";
import { Spin, Row, Col } from 'antd';
import { useSearchParams, useParams, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../Providers/themeContext';
import FeedbackCard from './feedbackCard';
import { useTranslation } from 'react-i18next';
import styles from './sideFeedbacks.module.less';
import Icons from '../../Utils/icons';
import Plural from '../../Utils/plural';



export default  function SideFeedbacks ({userId}) {

  const theme = useContext(ThemeContext);


    const pad = `${theme?.gutters.vertical[theme.id]}px`;

  const {t} = useTranslation();
 
  const api = {
    feedbacks: () => axios.get(`${process.env.REACT_APP_API}/feedbacks?_where[task.performer.id]=${userId}`),
        
  };


const {isFetching: QFetch, 
        isLoading: QLoading,
        data: { data: feedbacks = [] } = {} } = useQuery(`sideFeedbacks${userId}`, api.feedbacks,{refetchOnWindowFocus: true }) ;




  if (QFetch||QLoading) {
    return (
        <div className={styles.block} style={{padding: pad, height: "150px"}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%"}}><Spin size = 'large'/></div>
      </div>
    )
  }

  const count = feedbacks.length> 0 ? feedbacks.length : 1;

let ratings = [];

ratings.push({num: 5, rating: feedbacks.filter(item => item.rating === 5).length});
ratings.push({num: 4, rating: feedbacks.filter(item => item.rating === 4).length});
ratings.push({num: 3, rating: feedbacks.filter(item => item.rating === 3).length});
ratings.push({num: 2, rating: feedbacks.filter(item => item.rating === 2).length});
ratings.push({num: 1, rating: feedbacks.filter(item => item.rating === 1).length});

const ratingBars = ratings.map(item => {

    const {num, rating} = item;
    const bar = `${rating*100/count}%`;
    const proc = (100*rating/count).toFixed(1)

    return (
        <Row gutter={[10, 10]} style={{marginTop: "15px", width: "100%"}} align="middle">
            <Col flex="20px">
                <span>{num}</span>
            </Col>
            <Col flex="auto">
                <div style={{width: "100%", height: "3px", backgroundColor: "#EAEFF6"}}>
                    <div style={{width: bar, height: "3px", backgroundColor: "#0066FF"}}> </div>
                </div>
            </Col>
            <Col flex="55px">
                <div style={{width: "100%", textAlign: "left"}}>
                    <span >{`${proc}%`}</span>
                </div>
            </Col>
        </Row>
    )
});

    let summRating = 0;

    feedbacks.forEach(element => summRating =  summRating + element.rating );

   const avgProc = (summRating/count).toFixed(1);

    return(
   
            <div className={styles.block} style={{padding: pad}}>
                <div className={styles.blockHeader}> 
                    <span>{t('labels.feedbacks')}</span>
                    <div className={styles.prockHeader} >
                    <Icons.Star color = "#F44336"/>
                        <span> {avgProc}</span>
                    </div>
                </div>
                {ratingBars}
                <span 
                    style={{marginTop: "30px",  color : count > 0 ? "#0066FF" : "#CED3DB"}}
                >
                    <Plural count={count} i18nextPath="reviews.plural" />
                </span>
            </div>
    )     
        
}