import React from 'react';
import { Spin, Row, Col } from 'antd';
import {useThemeContext} from '../../context/themeContext';
//import FeedbackCard from './feedbackCard';
import { useTranslation } from 'react-i18next';
import styles from './sideFeedbacks.module.less';
import Plural from '../../../utils/plural';
import { StarOutlined } from '@ant-design/icons';


export default  function SideFeedbacks ({feedbacks=[], isDataFetching=false}) {

  const theme = useThemeContext();


    const pad = `${theme?.gutters?.vertical[theme.id]}px`;

  const {t} = useTranslation();
 


  const count = feedbacks.length> 0 ? feedbacks.length : 1;

let ratings = [];


for (let i = 5; i > 0; i--) {
    ratings.push({num: i, rating: feedbacks.filter(item => item.attributes.stars === i).length});
  }

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
            <Col flex="30px" style={{paddingRight: '0px'}}>

                <div style={{width: "100%", textAlign: "right"}}>
                    <span >{`${proc}%`}</span>
                </div>
            </Col>
        </Row> 


    )
});
const initialValue = 0;
const summRating = ratings.reduce(
    (acc, item) => acc + item.num*item.rating, initialValue
  );


const avgProc = (summRating/count).toFixed(1);

    return(
   
            <div className={styles.block} style={{padding: pad}}>
                <div className={styles.blockHeader}> 
                    <span>{t('labels.feedbacks')}</span>
                    <div className={styles.prockHeader} >
                    <StarOutlined style = {{color : "#F44336"}}/>
                        <span style = {{color : "#F44336"}}> {avgProc}</span>
                    </div>
                </div>
                {ratingBars}
                <span 
                    style={{marginTop: "30px",  color : count > 0 ? "#0066FF" : "#CED3DB"}}
                >
                    <Plural count={feedbacks.length} i18nextPath="reviews.plural" />
                </span>
            </div>
    )     
        
}