import React, { useContext } from 'react';

import styles from './taskCard.module.less';
import { Divider } from 'antd';
import PublishedDate from '../publishedDate/publishedDate';
import {useThemeContext} from '../../context/themeContext';
import moment from 'moment';
import UserImage from '../userImage/userImage';
//import RatingBar from '../../components/ratingbar/ratingbar';
import { Typography, Col } from 'antd';
//import Icons from '../../Utils/icons';
import Plural from '../../../utils/plural';
import SVGIcons from '../../../utils/icons/ManualExport';
import {EnvironmentOutlined, CheckOutlined, ClockCircleOutlined, EditOutlined} from '@ant-design/icons';
//import icons from '../../Utils/icons';

const { Paragraph } = Typography;

export default function TaskCard ({title, 
                                       id, 
                                       cnt=24,
                                       slug,
                                       text,
                                       contractual,
                                       budget, 
                                       published_at, 
                                       status,
                                       cityName, 
                                       responsesAvatars, 
                                       userOnline=false, 
                                       authorStatus, 
                                       branches=[],
                                       specialization,
                                       marginTop,
                                       expandedText = false,
                                       showAnswers = true,
                                       fromMainPage=false
                                      }) {

    const theme = useThemeContext();  
    const moreStrColor = fromMainPage ? "black" : "#0066FF";
    const moreStr = <span style={{color: moreStrColor, fontWeight: "600"}}>{`>>>>`}</span>;
   
const p = theme?.gutters?.gorizontal[theme?.id]?? 20;

    const pad = `${p}px ${p}px ${p}px ${p}px`;
  
    const currDate = new Date(published_at);

    const branchElements = branches.map(item => {

        return (

            <div className={styles.branchLabel}>
                {item.attributes?.name?? ''}
            </div>

        )
    })

    const respCount = responsesAvatars.length;

    let aStatusStyle = {};
    let aStatusText = '';
    
    switch(authorStatus) {
      case "youAuthor":
        aStatusStyle = {color: "rgba(63, 68, 201, 1)", backgroundColor: "rgba(63, 68, 201, 0.15)"};
        aStatusText = "Вы автор"
        
        break;
      case "youChosen":
        aStatusStyle = {color: "rgba(244, 179, 54, 1)", backgroundColor: "rgba(244, 179, 54, 0.15)"};
        aStatusText = "Подтвердите участие"
        break;
      case "youPerformer":
          aStatusStyle = {color: "rgba(0, 102, 255, 1)", backgroundColor: "rgba(0, 102, 255, 0.15)"};
          aStatusText = "Вы исполнитель"
          break;
      case "hasPerformer":
          aStatusStyle = {color: "rgba(0, 102, 255, 1)", backgroundColor: "rgba(0, 102, 255, 0.15)"};
          aStatusText = "Выбран исполнитель"
          break;

      case "youRespond":
            aStatusStyle = {color: "rgba(50, 214, 155, 1)", backgroundColor: "rgba(50, 214, 155, 0.15)"};
            aStatusText = "Вы откликнулись"
            break;
      default:
        aStatusStyle = {};
        aStatusText = ""
    } 

    aStatusStyle = {...aStatusStyle, minWidth: "120px", marginTop: "20px", fontSize: "14px", textTransform: "none" };

    const linkTO = fromMainPage ? `tasks/${id}` : `${id}`;
    

  

  

return(
        <Col span={cnt}>
          <div
            className={styles.card}
            style = {{marginTop: marginTop, padding: pad }}
            >

            {/* <Link to={linkTO} style={{ color: 'black' }}> */}
            {/* <Link to={`${slug}`} style={{ color: 'black' }}> */}
              <div className={styles.titleBlock}
                  
              >
                  <div className={styles.questionBody}>
                      <span style={{fontSize: "28px", fontWeight: "450"}}>{title}</span>
                      {!contractual && <span style={{fontSize: "24px", marginLeft: "20px", color: "#0066FF"}}>{budget}&nbsp;&#8381;</span>}
                      {contractual && <span style={{fontSize: "18px", marginLeft: "20px", color: "#0066FF", minWidth: "150px"}}>По договоренности</span>}   
                       {/* TODO   t()  ------------------------------------------------------------------------------------------- */}
                  </div>
                  <div className={styles.questionRow}>
                    <div className={styles.specBlock} >
                        {specialization !== '' && <div className={styles.specLabel}>
                          {specialization}
                        </div>}
                        {branchElements}
                    </div>
                    {/* <div style={{marginTop: "20px"}}>
                        <PublishedDate width = {"170px"} currDate = {currDate} textColor = "#5E6674"/>
                        </div>     */}
                     
                  </div>  
              </div>    
    {/*           </Link > */}
            <div className={styles.descriptionBlock}>
               <div className={styles.contentStyle}>
                   <Divider/>
                <Paragraph 
                  
                  ellipsis={
                    !expandedText
                      ? {
                        rows: 2,
                        expandable: !fromMainPage,
                        symbol: moreStr,
                        tooltip: false,
                      }
                      : false
                  }>
                {text}
                </Paragraph>
                <Divider/>
               </div>
               {/* {showAnswers && <div className={styles.answersBlock}>
                 <Plural count={answers} i18nextPath="answers.plural" />
               </div>} */}


                <div className={styles.questionRow} style={{marginTop: "0px"}}>
                    <div className={styles.specBlock} style={{flexWrap: "nowrap", 
                                                              marginTop: "20px"}} >
                        <div style={{
                              marginRight: "20px", 
                              display: "flex", 
                              alignItems: "center",
                              color: "rgb(94, 102, 116)",
                              flexWrap: "nowrap"}} >

                            <EnvironmentOutlined style={{fontSize: '22px'}} color = "#CED3DB" />

                            <span style={{marginLeft: "5px"}}>
                                {cityName}
                            </span>
                        </div>
                        <PublishedDate showEye ={false} marginLeft = "20px" currDate = {currDate} textColor = "#5E6674"/>
                        <div className={styles.answersBlock}>
                       {/*    <Plural count={respCount} i18nextPath="responses.plural" /> */}
                          <ResponseImages 
                            responses={responsesAvatars}

                          />
                        </div>
                     </div>

                     
                    {authorStatus !== '' && <div className={styles.branchLabel} style={aStatusStyle}>
                        {authorStatus === "youAuthor" && <EditOutlined color= "rgba(63, 68, 201, 1)"/>}
                        {authorStatus === "youChosen" && <ClockCircleOutlined color= "rgba(244, 179, 54, 1)"/>}
                        {(authorStatus === "youPerformer" || authorStatus === "hasPerformer") && <CheckOutlined color= "rgba(0, 102, 255, 1)"/>}
                        {authorStatus === "youRespond" && <CheckOutlined color= "rgba(50, 214, 155, 1)"/>}
                            <span style={{marginLeft: "10px"}}>{aStatusText}</span>
                        </div>}
                </div>     
            </div>
          </div>
          </Col>
 
  )
}


export function ResponseImages ({responses=[], width = 45}) {

  const images = responses.slice(0,4).map((avatar) => {
      
      return (
          <div style={{display:"inline-block", marginLeft: "-20px", zIndex: "1"}}>
              <UserImage 
                  image= {avatar}
                  online={false}
                  width= {width}
          />  
         </div>
      )

  })
return (
    <>
    <div style={{display: "flex", paddingLeft: "20px"}}>
        {images}
        {responses.length>4 && <div className={styles.responsesBlock}>
            +
             <Plural count={responses.length-4} i18nextPath="responses.plural" /> 
        </div> }
    </div>
    </>
)

};
