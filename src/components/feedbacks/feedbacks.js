import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from "react-query";
import { Spin, Row, Pagination } from 'antd';
import { useSearchParams, useParams, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../Providers/themeContext';
import FeedbackCard from './feedbackCard';


// import cityInitObj from '../../directories/russia.json'; //-----------------------------------------------------------------------------------------------

// const CITYOBJ = cityInitObj.map((item, index) => {
//   const { region, city } = item;
//   const newitem = { id: index, region, city };
//   return newitem;
// });
// //--------------------------------------------------------------------------------------------------------------------------------------------------------

export default  function Feedbacks ({userId}) {

  const [ currPage, setCurrPage ] = useState(1);

  const theme = useContext(ThemeContext);

  const location = useLocation();

  const queryClient = useQueryClient();

    
  const showStep = 6;

  const setCurrentPage = (page) => {
    window.scrollTo(0,0)
      setCurrPage(page);
  };

  const queryName = `feedbacks${currPage}${userId}`;

  useEffect(() => {
    setCurrPage(1);
    
    queryClient.invalidateQueries(queryName);
    
  }, [location]);



 
  const api = {
    feedbacks: () => axios.get(`${process.env.REACT_APP_API}/feedbacks?_where[task.performer.id]=${userId}&_limit=${showStep}&_start=${(currPage-1)*showStep}&_sort=created_at:DESC`),
   
     count: () => axios.get(`${process.env.REACT_APP_API}/feedbacks/count?_where[task.performer.id]=${userId}&_limit=${showStep}&_start=${(currPage-1)*showStep}`),
   
  };


const {isFetching: QFetch, 
        isLoading: QLoading,
        data: { data: feedbacks = [] } = {} } = useQuery(queryName, api.feedbacks,{refetchOnWindowFocus: true }) ;


const {isFetching: CFetch, 
        isLoading: CLoading,
        data: { data: count = 0 } = {} } = useQuery(`Count${queryName}`, api.count,{refetchOnWindowFocus: false }) ;


  if (QFetch||QLoading||CFetch||CLoading) {
    return (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginTop: "150px"}}><Spin size = 'large'/></div>
    )
  }

const gutter = `${theme?.gutters.vertical[theme.id]}px`;

    const cards = feedbacks.map ((item) => {

        return(
            
                <FeedbackCard feedback={item}/>
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