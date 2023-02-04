import React, { useRef, useEffect, useState } from 'react';

import styles from '../styles/addquestion.module.less';

import { useQuery, useQueryClient, useMutation } from 'react-query';

import {useThemeContext} from '../src/context/themeContext';
import {useUserContext} from '../src/context/userContext';

import { useRouter } from "next/router";
import Link from 'next/link'
import{ Form,
  Input,
  Button,
  Popover,
  } from 'antd';

import {
  StopTwoTone,  
  CloseOutlined,
  QuestionCircleTwoTone,
  CheckOutlined,
  
} from '@ant-design/icons';

import axios from 'axios';

const {TextArea} = Input;

import BranchSelect from '../src/components/branchSelect/branchSelect';


export default function AddQuestion() {

     const [sectionMinHeigth, setSectionMinHeigth] = useState(''); 
    /*const [errorStatus, setErrorStatus] = useState(false);
    const [qTitle, setQtitle] = useState('');
    const [qBody, setQbody] = useState('');
    const [qBranch, setQbranch] = useState({
      branch_id: null,
      subbranch_id: null,
    }); */

    const [stateValues, setStateValues] = useState(
      {
        errorStatus: false,
        qTitle: '',
        qBody: '',
        qBranch: {
          branch_id: null,
          subbranch_id: null,
        },
      }
    )
   
     const [questionSaved, setQuestionSaved] = useState(false);

const { errorStatus,qTitle,qBody,qBranch } = stateValues;

    const [form] = Form.useForm();
    const theme = useThemeContext();
    const router=useRouter();

  const {currentUser} = useUserContext();
  const userId = currentUser.id;
   
  const userJWT = currentUser.jwt;

    const p = theme?.gutters?.gorizontal[theme?.id];

    const pad = `${p}px`;
    const halfPad = `${p/2}px`;


    const onBranchChange = (value) => {
      const nV = value;
      if (nV.branch_id||nV.subbranch_id) 
        {setUnsavedChanges(true)}
      /* setQbranch(nV);
      setErrorStatus(false); */
      setStateValues({...stateValues, qBranch: nV, errorStatus: false })
    };

    const onBodyChange = (e) => {
      const nV = e.target.value;
      if (nV && nV !== '') 
       { setUnsavedChanges(true)}
      /* setQbody(nV);
      setErrorStatus(false); */
      setStateValues({...stateValues, qBody: nV, errorStatus: false })
    };

    const onTitleChange = (e) => {
      const nV = e.target.value;
      if (nV && nV !== '') 
        {setUnsavedChanges(true)}
      /* setQtitle(nV);
      setErrorStatus(false); */
      setStateValues({...stateValues, qTitle: nV, errorStatus: false })
    };


    const mutation = useMutation((newQuestion) =>
      axios.post(`${process.env.NEXT_PUBLIC_API}/questions`, 
                newQuestion, 
                {
                   headers: {
                    Authorization: `Bearer ${userJWT}` }
                }    
              )
    );

    const onSuccess = () => {
      console.log("Вопрос сохранен--------------------------------------------------------------!!!!!!!!!!!!!!!!!!!!!");
      setUnsavedChanges(false);
      setQuestionSaved(true);
    };

    const onFinish = () => {

      if (!qBody||qBody===''||!qTitle||qTitle===''||(!qBranch.branch_id&&!qBranch.subbranch_id))
      {
        //setErrorStatus(true);
        setStateValues({...stateValues, errorStatus: true })
        return
      }
      const mutateValue = {
        "data": {
          "author": userId,
          "title": qTitle, 
          "description": qBody,
          "branch": qBranch.branch_id,
          //"branch": {"data": {"id": qBranch.branch_id},}
          "subbranch": qBranch.subbranch_id,
          }
        }

      mutation.mutate(mutateValue,
                        { onError: (error, variables, context) => { console.log(`НЕ удалось отправить вопрос ${context.id}, Ошибка : ${error}`)},
                          onSuccess: () => { onSuccess()},
                        }
                      );
      };

   // };
        
    useEffect(() => {
      if (typeof window !== 'undefined') {
          setSectionMinHeigth(`${document.documentElement.clientHeight-200}px`);
      }
    }, []);

    const [unsavedChanges, setUnsavedChanges] = useState(false);

  const warningText =
    'Есть несохраненные изменения, покинуть страницу?';

  useEffect(() => {
    const handleWindowClose = (e) => {
      if (!unsavedChanges) return
      e.preventDefault()
      return (e.returnValue = warningText)
    }
    const handleBrowseAway = () => {
      if (!unsavedChanges) return
      if (window.confirm(warningText)) return
      router.events.emit('routeChangeError')
      throw 'routeChange aborted.'
    }
    window.addEventListener('beforeunload', handleWindowClose)
    router.events.on('routeChangeStart', handleBrowseAway)
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
      router.events.off('routeChangeStart', handleBrowseAway)
    }
  }, [unsavedChanges])


  


      return (

        <div className={styles.layoutSection} style={{minHeight: sectionMinHeigth}}>
          {!questionSaved && 
          <div className={styles.blockMain} style={{padding: pad}}>
            <div className={styles.closeBtn} onClick={()=> router.back()}><CloseOutlined /></div>
            
            <h3 className={styles.title}>Задайте вопрос юристам портала</h3>
         
                <HelpLabel
                      title="Введите заголовок вопроса"
                      popoverContent="Повседневная практика показывает, что разбавленное изрядной долей эмпатии, рациональное мышление обеспечивает актуальность форм воздействия. Картельные сговоры не допускают ситуации, при которой акционеры крупнейших компаний призваны к ответу. Как уже неоднократно упомянуто, ключевые особенности структуры проекта являются только методом политического участия и в равной степени предоставлены сами себе."
                      popoverTitle="Заголовок вопроса это:"
                      style={{width: "100%"}}
                    >          
         
                      <TextArea
                        autoSize={{
                          minRows: 2,
                          maxRows: 2,
                        }}
                        maxLength={150}
                        size={theme.size}
                        onChange={onTitleChange}
                        status={errorStatus && (!qTitle||qTitle==='') ? "error" : null}
                      />
                    
              
                  </HelpLabel>  

                  <HelpLabel
                      title="Раскройте суть вопроса"
                      showHelp={false}
                      style={{width: "100%", marginTop: pad}}
                    >          
                      <TextArea
                        autoSize={{
                          minRows: 3,
                          maxRows: 3,
                        }}
                     //   maxLength={150}
                        size={theme.size}
                        onChange={onBodyChange}
                        status={errorStatus && (!qBody||qBody==='') ? "error" : null}
                      />
                    
                  </HelpLabel>  
             
                  <HelpLabel
                    title="Выберите сферу, к которой относится вопрос"
                    style={{marginTop: pad, width: "100%"}}
                    popoverContent="Повседневная практика показывает, что разбавленное изрядной долей эмпатии, рациональное мышление обеспечивает актуальность форм воздействия. Картельные сговоры не допускают ситуации, при которой акционеры крупнейших компаний призваны к ответу. Как уже неоднократно упомянуто, ключевые особенности структуры проекта являются только методом политического участия и в равной степени предоставлены сами себе."
                      popoverTitle="Рекомендуем указать сферу правоотношений для..."
                  >
                    <BranchSelect
                      onChange={onBranchChange}
                      errorStatus={errorStatus && qBranch.branch_id === null && qBranch.subbranch_id===null}
                    />  
                  </HelpLabel> 
                  <div
                  style={{
                    marginTop: pad,
                    display: "flex",
                    justifyContent: errorStatus ? "space-between" : "flex-start",
                  }}
                  >
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      onClick={onFinish}
                    >
                      ОПУБЛИКОВАТЬ ВОПРОС
                    </Button>
                    { errorStatus &&
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <StopTwoTone twoToneColor="#F44336"/>
                        <div
                            text-align = {'left'} 
                            style={{
                              color: '#F44336', 
                              marginLeft:"5px",
                            }}
                            >
                                Есть незаполненные поля! 
                        </div>
                        
                      </div>
                    }

                  </div>
          </div>  
          }

          {questionSaved &&
            <div
              className={styles.blockMain}
              style={{width: "500px"}}
            >
              <div
                style={{
                  display:"flex",
                  border: "1px solid lightgreen"  ,
                  width: "100%",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  borderRadius: "10px",
                  padding: halfPad,
                }}
              >
                  <CheckOutlined 
                     style={{fontSize: "70px", color: "lightgreen"}}
                  />
                  <div style={{
                    fontSize: "24px",
                    fontWeight: "450",
                    width: "100%",
                    textAlign: "center"
                  }}>
                    Вопрос опубликован!
                  </div>
              </div>
              <div
                style={{
                  widrh:'100%',
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: halfPad,
                }}
              >
                  <Link href='/' passHref={true}>
                    Главная страница
                  </Link>
                  <Link href='questions/me'>
                    <a> Мои вопросы</a>
                  </Link>
  
              </div>

            </div>
          }
        </div>
      );
    };

  export function HelpLabel ({title, showHelp=true, style, children, onHelpClick, popoverContent, popoverTitle}) {

    const [open, setOpen] = useState(false);

    const hide = () => {
      setOpen(false);
    };
  
    const handleOpenChange = (newOpen) => {
      setOpen(newOpen);
    };

      return (
          <div 
            className={styles.labelContent} 
            style={style}
          >
              <div
                className={styles.labelText}
              >
                <div >
                  {title?? ''} 
                </div>
                {showHelp && 
                <Popover
                  content={<div lang="ru" style={{width: "400px", hyphens: "auto"}}>{popoverContent}</div>}
                  title={<p style={{fontWeight: "600"}}>{popoverTitle}</p>}
                  trigger="click"
                  open={open}
                  onOpenChange={handleOpenChange}
                >
                  <div onClick={onHelpClick} style={{cursor: "pointer", marginLeft : "10px"}}>
                    <QuestionCircleTwoTone />
                  </div>
                </Popover>
                }
                
              </div>
              {children}
          </div>
      );
  }
