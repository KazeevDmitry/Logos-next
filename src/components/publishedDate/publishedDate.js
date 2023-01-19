import React from 'react';

import styles from './publishedDate.module.less';
import useMediaQuery from '../../../utils/useMediaQuery';
import {
    EyeOutlined,
    CalendarOutlined,
  } from '@ant-design/icons';



export default function PublishedDate({currDate= new Date(), 
    textColor= "#CED3DB", 
    imgColor= "#CED3DB", 
    conversations, 
    views, 
    marginLeft="auto", width = '80%', showEye=false}) {

    const above1023 = useMediaQuery('(min-width: 1023px)');

    const imgWidth = above1023 ? "20px" : "16px"

    const cDay = currDate.getDate();
    const cMonth = currDate.getMonth()+1;

    const cYear = currDate.getFullYear() % 100;
    const dateStr = `${cDay<10 ? '0': ''}${cDay}.${cMonth<10 ? '0': ''}${cMonth}.${cYear<10 ? '0': ''}${cYear}`;

    const conv = conversations ?? '?';
    const cViews = views ?? '?';
    
    return(
        <div className={styles.wrapper} style={{color: textColor, marginLeft: marginLeft}}>
            <div className={styles.dateWrapp}>
                <CalendarOutlined width = {imgWidth} height = {imgWidth} color = {imgColor}/>
                <span className={styles.date}>{ dateStr }</span>
            </div>
            {showEye && <div className={styles.convWrapp}>
                {/* <Icons.Conversations color = {imgColor}/>
                <span className={styles.date}>{conv}</span> */}

                <EyeOutlined  width = {imgWidth} height = {imgWidth} color = {imgColor}/>
                <span className={styles.date}>{cViews}</span>
            </div>}

      </div>
    )


}
