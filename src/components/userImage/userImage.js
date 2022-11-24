import React from 'react';
import styles from './userImage.module.less';
import { UserOutlined } from '@ant-design/icons';


export default function UserImage ({image, online, width, onClick}) {


    const wrapDiv = {
        position: "relative",
        width: width, 
        height: width
    }

    let gWidth = width/5;

    let greenWidth = 0;

    if (gWidth > 26) {
        greenWidth = 26;
    }else {
        greenWidth = gWidth<12 ? 12 : gWidth;
    }
    
    const greenBorderWidth = width<120 ? "2px" : "3px";

    const greenWidthStr = `${Math.round(greenWidth)}px`;

    const r = width/2;

    const greenPos = r + (r*0.7071) - greenWidth/2;

    const greenPosStr = `${Math.round(greenPos)}px`;

    const greenLightStyle = {
       
        height: greenWidthStr,
        width: greenWidthStr,
        top: greenPosStr,
        left: greenPosStr,
        borderWidth: greenBorderWidth
         
    }

    const userImage = `${process.env.REACT_APP_API}${image}`

    
    const letterStyle = {
        fontSize: `${width/2}px`,
        color: "#fff"
    }


    const imageStyle = {
        width: width,
        height: width,
        borderRadius: "50%",
        
    }
      

    return (

        <div style={wrapDiv} onClick={()=>onClick?.()}>
            { image !== '' && <img style={imageStyle}
                                      src={userImage} //временно
                                      alt="img">
                                  </img> }
            {/* { image ==='' && <div className={styles.imageDiv} style={{...imageStyle, backgroundColor: circleColor}}>
                                <span className={styles.userImageLetter} style={letterStyle}>
                                    {username[0]}
                                </span>
                            </div>} */}

            { image ==='' && <div className={styles.imageDiv} style={{...imageStyle}}>
                                <UserOutlined style={letterStyle}/>    
                            </div>}
                            

            <div className={ styles.greenLight + ' ' + ((online === "true") ? "" : styles.nonActive)}
                style={greenLightStyle}
            ></div>
        </div>
    )
};