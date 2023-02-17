import React from 'react';

import styles from './publishedDate.module.less';
import useMediaQuery from '../../../utils/useMediaQuery';
import {
    EyeOutlined,
    CalendarOutlined,
  } from '@ant-design/icons';

  import moment from 'moment';

export default function PublishedDate({
    currDate= new Date(), 
    textColor, 
    imgColor= "#CED3DB", 
    conversations, 
    views, 
    showEye=false,
    style,
    imageStyle = {
        fontSize: `24px`, 
        fontWeight: "600"
        },
   format = 'DD.MM.YY'
}) {

    const above1023 = useMediaQuery('(min-width: 1023px)');

    const imgWidth = above1023 ? "20px" : "16px";

    
    const dateTimeStr = moment(currDate).format(format);//'DD MMM YYYY    hh:mm'
    const conv = conversations ?? '?';
    const cViews = views ?? '?';

    const wrapStyle={...style, color: textColor?? 'inherit'};

    console.log("wrapStyle-----------------------------------------------", wrapStyle);
    
    return(
        <div className={styles.wrapper} style={wrapStyle}>
            <div className={styles.dateWrapp}>
                <CalendarOutlined style={imageStyle}
                              color = {imgColor}/>
                <div className={styles.date} style={{color: textColor?? 'inherit', marginLeft: "5px"}}>{ dateTimeStr }</div>
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
