
import React, {useEffect, useState} from 'react';

import { useRouter } from "next/router";

//import styles  from './question.module.less';

//import PublishedDate from '../../src/components/publishedDate/publishedDate';

import { useThemeContext } from '../../src/context/themeContext';
import { useUserContext } from '../../src/context/userContext';
import { useNotifyContext } from '../../src/context/notificationContext';
import PageContainer from '../../src/components/layouts/pageContainer';
import PageHeader from '../../src/components/layouts/pageHeader';
import UserImage from '../../src/components/userImage/userImage';
import { createStrapiAxios } from '../../utils/strapi';


import axios from 'axios';
import { useQuery, useQueryClient, useMutation } from "react-query";
import { Image, Spin, Row, Col, Button, Modal, Form, Input } from 'antd';



import TaskInfo, { SideTaskInfo } from './taskInfo';



const { TextArea } = Input;


export default function Task({serverTask}) {

  const router = useRouter();
  const {id} = router.query;

  const [respond, setRespond] = useState(false);

  const theme = useThemeContext();

  const {cities: CITYOBJ} = theme;

  const {currentUser} = useUserContext();

  const userJWT = currentUser?.jwt;
  const userId = currentUser?.user?.id;
console.log('userID----------------------------------------------------------------------------------', userId);
      
//  moment.locale(i18n.language);

  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  const perfMutation = useMutation((value) =>
        axios.put(`${process.env.NEXT_PUBLIC_API}/tasks/${id}`, 
                    value, 
                    {
                        headers: {
                        Authorization: `Bearer ${userJWT}` }
                    }    
                    )
        );

  const mutation = useMutation((value) =>
  axios.post(`${process.env.NEXT_PUBLIC_API}/responses`, 
              value, 
              {
                 headers: {
                  Authorization: `Bearer ${userJWT}` }
              }    
            )
  );

const queryName = `Response${id}`;

  const {isLoading : QLoading,
            isFetching: QFetch,  
            data: {data: task = {}, meta: meta = null} = {} }  = useQuery(["task", id],
                                                 () => getTask(id),
                                               {
                                                 keepPreviousData: false,
                                                 refetchOnMount: false,
                                                 refetchOnWindowFocus: false,
                                                 initialData: serverTask,
                                               //  staleTime: 0.5 * 60 * 1000,

                                               }
                                             );          

/* const {isFetching: RFetch, 
          isLoading: RLoading,
          data: { data: responses = {} } = {} } = useQuery(queryName, api.responses,{refetchOnWindowFocus: false }) ;
  
 */
  if (QFetch||QLoading) {
    return (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginTop: "150px"}}><Spin size = 'large'/></div>
    )
  }

  

  const onRespond = () => {
    setRespond(true);
  };



const handleOk = ({text}) => {
  const mutateValue = {
    text: text, 
    task: id,
  }

  mutation.mutate(mutateValue,
                    {
                      onSuccess: () => {
                        if (queryName) {
                          queryClient.invalidateQueries(queryName);
                        }  
                        onSuccess();
                      }
                    }
    );

};
  const onSuccess = () => {
    setRespond(false);
    
  }


  const onChoosePerformer = (value) => {
    const mutateValue = {
        performer: value, 
        
      }
    
      perfMutation.mutate(mutateValue,
                        {
                          onSuccess: () => {
                             queryClient.invalidateQueries(`Task${id}`);
                            console.log("added performer");
                            //onSuccess();
                          }
                        }
        );
    
    };
   

    console.log('TASK-------------------------------------------------------------------------------------------', task);

 const itemData = task.attributes;
      const {author, 
              title, 
              text, 
              contractual, 
              budget,
              branches,
              publishedAt: published_at, 
              performer,
              documents,
              status,
              slug,
              id: taskId,
            } = itemData;
    
      const cityName = theme.cities.find(city => city.id === itemData.city)?.city;
      
      const responses = itemData.responses.data;
     
    
      let responsesAvatars = responses.map(resp => {
          const exp = resp.attributes?.expert.data.attributes;
          const ava = exp?.user.data.attributes.avatar.data.attributes.url;
          return ava;
      }); 


const specName = '';

const {name: username, surname, city : authorCity }  = author.data.attributes;
const userImage= author.data?.attributes.avatar?.data?.attributes.url?? '';
const userCityName = theme.cities.find(city => city.id === authorCity)?.city;

//const isOwner = (userId === author.data.attributes.expert.data.id);



//sets to show 'response button ' depebds of user already has responded this task

//const userR = responses.filter(item => item.user.id === userId);
//const userResponse = userId && userR.length > 0 ? userR[0] : null; 

//const showResBtn = userJWT && userResponse === null && performer === null;

//const showConfBtn = userJWT !==undefined && userJWT !== null && userId === performer?.id;

const showResBtn = true;

const showConfBtn = false;


const myTask = userId === author?.data?.id;

  return (
    <>
      <Modal
        visible={respond}
        title={'Откликнуться на задачу'}
        onOk={handleOk}
        onCancel={() => setRespond(false)}
        footer={null}
      >
         <Form
            style={{maxWidth: "560px"}}
            form={form}
            name="respondTask"
            layout = 'vertical'
            onFinish={handleOk}
            validateTrigger='onSubmit'
            scrollToFirstError
          >
              
            <Form.Item
              name="text"
              label="Ваш комментарий к задаче" //{t()}
            >
              <TextArea rows={5} style= {{width: "100%"}}/>                   
            </Form.Item>

            <Form.Item >
              <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                  <Button type="primary" htmlType="submit"
                        style={{
                                  width: '50%', marginTop: "20px"
                              }}
                  >
                   {'Сохранить'}
                  </Button>
                </div>    
            </Form.Item>
          </Form>
      </Modal>
           
       <PageHeader title={title}/>
                   
        <PageContainer>
      
              <Col  xs={24} sm={24} md={24} lg={18} xl={18} >
                <TaskInfo
                
                id = {id}
                specialization = {specName}
                branches = {branches.data}
                text={text}
                documents = {documents.data?? []}
                username = {`${username} ${surname}`}
                userImage = {userImage}
                userCityName = {userCityName}
                onChoosePerformer = {onChoosePerformer}
              //  userResponse = {userResponse}
                isOwner = {myTask}
                responses = {responses}
                performer = {performer}
               /> 

              
              </Col>
             
                <Col xs={0} sm={0} md={6} lg={6} xl={6} >
                  <SideTaskInfo 
                    contractual={contractual}
                    budget={budget}
                    cityName = {cityName}
                    published_at = {published_at}
                    responses = {responsesAvatars}
                    userJWT={userJWT}
                    onRespond = {onRespond}
                    showRespBtn = {showResBtn}
                    showConfirmBtn = {showConfBtn}
                    myTask = {myTask}
                    /> 
                 
               </Col>
             
      
      
           </PageContainer>   
    </>
  )
}




async function getTask(id) {

 
  const data = await createStrapiAxios()
 
 .get(`/tasks/${id}?populate=deep, 5`)
 .then(res => res.data)

 return (data) 

};

/* async function getAnswers(id) {

 
  const data = await createStrapiAxios()
 .get(`/answers/?filters[question][id][$eq]=${id}&populate=deep,3&sort[0]=publishedAt:desc`)
 .then(res => res.data)

 return (data) 

}; */



export async function getServerSideProps(context) {
  
  const {id} = context.query;

  const data = await getTask(id);

  
  return { props: { serverTask: data } }  
}
 
