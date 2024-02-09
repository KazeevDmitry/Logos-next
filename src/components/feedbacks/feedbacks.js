import React, {useState, useEffect, useContext} from 'react';

import { Row, Pagination } from 'antd';
import { useThemeContext } from '../../context/themeContext';


import FeedbackCard from './feedbackCard';


// import cityInitObj from '../../directories/russia.json'; //-----------------------------------------------------------------------------------------------

// const CITYOBJ = cityInitObj.map((item, index) => {
//   const { region, city } = item;
//   const newitem = { id: index, region, city };
//   return newitem;
// });
// //--------------------------------------------------------------------------------------------------------------------------------------------------------

export default  function Feedbacks ({feedbacks}) {

  const [ currPage, setCurrPage ] = useState(1);

  const theme = useThemeContext();

  const count = feedbacks.lenght?? 1;

  const showStep = 6;

  const setCurrentPage = (page) => {
    window.scrollTo(0,0)
      setCurrPage(page);
  };


const gutter = `${theme?.gutters.vertical[theme.id]}px`;

    const cards = feedbacks.map ((item) => {

      console.log('feedback for card---------------------------------------------', item.attributes);
        return(
            
               <FeedbackCard feedback={item.attributes}/> 
              
               
        )
});

    return(
   
            <>
                <Row style = {{width: "100%"}} gutter={[theme?.gutters.gorizontal, theme?.gutters.vertical]}>
                            {cards}
                    </Row>
                <Row justify= 'center' style={{marginTop: "40px", marginBottom: "40px"}}>
                
                    <Pagination current={currPage} pageSize={showStep} onChange={setCurrentPage} total={count} hideOnSinglePage={true} size={theme?.id === "xs"||theme?.id==="sm" ? "small" : "middle"} />
                
                </Row>  
            </>
    )     
        
}