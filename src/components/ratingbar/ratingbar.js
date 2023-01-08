import React from 'react';
import styles from './ratingbar.module.less';
import Plural from '../../../utils/plural';
import { TrophyOutlined, StarOutlined } from '@ant-design/icons';

export default function RatingBar ({stars=0, reviews=0, cups=0, fontSize = 14}) {

    return(
        <div className={styles.row2} style={{fontSize: `${fontSize}px`, fontWeight: "400"}}>
            <div className={styles.numBlock}>
                <StarOutlined 
                    style={{color : stars > 0 ? "#F44336" : "#CED3DB", 
                            fontSize: `${fontSize+4}px`, 
                            fontWeight: "600"}}
                    /* color = {stars > 0 ? "#F44336" : "#CED3DB"}  */
                />
                <span  className={styles.innerBlock} style={{color : stars > 0 ? "#F44336" : "#CED3DB"}}>{stars}</span>    
            </div>
            <div className={ styles.feedback}>
                <span 
                    style={{color : reviews > 0 ? "#0066FF" : "#CED3DB"}}
                >
                    <Plural count={reviews} i18nextPath="reviews.plural" />
                </span>
            </div>
            <div className={styles.numBlock}>
            
                <TrophyOutlined style={{color : cups > 0 ? "#F4B336" : "#CED3DB", 
                            fontSize: `${fontSize+4}px`, 
                            fontWeight: "600"}}
                />
                <span className={styles.innerBlock}
                    style={{color : cups>0 ? "#F4B336" : "#CED3DB"}}
                >
                    {cups}
                </span>
            </div>    
        </div>

    )
};
