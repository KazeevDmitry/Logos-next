import React, {useEffect, useRef, useState} from 'react';


import { useUserContext } from '../../context/userContext';

import styles from '../../../styles/userCircle.module.less';
import RatingBar from '../ratingbar/ratingbar';


import UserImage from '../userImage/userImage';


export default function UserCircle({uImage = '', width, name, spec='', surname, stars=0, reviews = 0, cups=0, }) {

    const [showCard, setShowCard] = useState(false);
 
    const onMouseEnter = (e) => {
        setShowCard(true);
    };

    const cTop = width - width*0.2-5;
    const cLeft = width*0.2 - 300+5;

return (
  <div 
      style={{width: `${width}px`, height: `${width}px`, position: "relative", borderRadius: "50%"}} 

    >
  
      <UserImage
        image= {uImage}
        width= {width}
        onMouseEnter = {onMouseEnter}
        onMouseLeave = {() => setShowCard(false)}
      />
      {showCard && 
          <LittleCard
            username={name}
            surname={surname}
            top = {cTop}
            left={cLeft}
            stars = {stars}
            reviews={reviews}
            cups={cups}
            spec={spec}
          />
      }
  
   </div> 

)};

export function LittleCard({ username, surname, spec, stars=0, reviews = 0, cups=0, top, left }){
 
  const nameStr = `${username} ${surname}`;


  return (
    <>
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
 

    </>
  )
}