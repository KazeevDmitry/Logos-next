import React, {useContext} from 'react';
import axios from 'axios';
import { useQuery } from "react-query";
import { Spin, Row } from 'antd';
import CommentCard from '../../components/commentCard/commentCard';
import { AddEntryDialog } from '../../components/commentCard/commentCard';

import {useUserContext} from '../../context/userContext';
import {useThemeContext} from '../../context/themeContext';
import { createStrapiAxios } from '../../../utils/strapi';


const CommentsList = ({parent, articleId, addEntry=false, onAddEntry}) => {

  const {currentUser} = useUserContext();
  const userJWT = currentUser.jwt;
  

  const {isSuccess,
    isLoading,  
    isFetching,
    isError,
    data: { data: commentsArr = [] , meta = null} = {} }  = useQuery(["comments", articleId, parent],
                                         () => getComments(articleId, parent),
                                       {
                                         keepPreviousData: true,
                                         refetchOnMount: false,
                                         refetchOnWindowFocus: false,
                                       }
                                     );
    
  if (isFetching|| isLoading) {
    return (
      <div style={{width: "100%", display : "flex", justifyContent: "center", alignItems: "center"}}><Spin size = 'large'/></div>
    )
  }
  

   const comments = commentsArr.map((item , index) => {

    const id = item.id;

    const {publishedAt: date, text: content} = item.attributes;
   
    const author = item.attributes.author.data.attributes;

    const {name: username, surname}  = author;

    const userImage= author.avatar?.data?.attributes?.url?? '';

   // const queryName = `${source.table}-${articleId}-${id}`;

    return (
       <CommentCard
          key = {id}
          commentId = {id}
          username = {`${username} ${surname}`}
          userImage = {userImage}
          userOnline = {false}
          date={date}
          content = {content}
          likes = {0}
          dislikes = {0}
          articleId = {articleId}
          count = {meta.total}
         // queryName= {queryName}
        >
          <CommentsList  
              key = {`list${id}`} 
              parent = {id} 
              articleId = {articleId}
            />
        </CommentCard>    
  
    )
  }); 
       
  

return (
    <>
    {addEntry && 
        <AddEntryDialog
        articleId = {articleId}
        currParent = {null}
        userJWT = {userJWT?? null}
        onSuccess = {() => onAddEntry?.(false)}
        onCancel = {() => onAddEntry?.(false)}
        />
      }
      { meta.pagination?.total==0 && !parent ? 
        <div style={{textAlign: "center", width: "100%", fontSize: "16px"}}>
          Для этой статьи пока нет комментариев
        </div> :
        <Row gutter = {[0, 20]}   style={{width: "100%"}}>
          {comments}
        </Row> 
      }
    </>  
)
};

export default CommentsList;


async function getComments(articleId, parent) {

  
  const parentStr = parent ? `filters[parent]=${parent}` : `filters[parent][$notNull]`;

  const data = await createStrapiAxios()
 .get(`/comments?filters[article][id][$eq]=${articleId}&${parentStr}&populate[1]=article&populate[2]=author.avatar`)
 .then(res => res.data)
 .catch(e => console.log("ERROR in getComments --------", e));
 return (data) 

};