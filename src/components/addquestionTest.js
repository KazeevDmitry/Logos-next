import React, { useRef, useEffect, useState } from 'react';

import styles from '../styles/addquestion.module.less';


import {useThemeContext} from '../src/context/themeContext';
import {useUserContext} from '../src/context/userContext';

import { useRouter } from "next/router";
import{ Form,
  Input,
  Button,
  Popover,
  } from 'antd';

import {
  ClockCircleOutlined,  
  CloseOutlined,
  QuestionCircleTwoTone,
  
} from '@ant-design/icons';

const {TextArea} = Input;

import BranchSelect from '../src/components/branchSelect/branchSelect';


export default function AddQuestion() {

    const [sectionMinHeigth, setSectionMinHeigth] = useState(''); 

    const [form] = Form.useForm();
    const theme = useThemeContext();
    const router=useRouter();

    const p = theme?.gutters?.gorizontal[theme?.id];

    const pad = `${p}px`;


    const onBranchChange = (value) => {
      console.log("VALUE FROM BRANCH SELECT---------------------------------", value);
      if (value.branch_id||value.subbranch_id) 
      { setUnsavedChanges(true)}
    };

    const onFinish = (values) => {
      console.log("VALUES------------------------------", values);
    };
        
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


  const onValuesChange = (newV, allV) => {
    console.log("NEWV ---------------------------------", newV);
    console.log("ALLV ---------------------------------", allV);
    if ((allV.header !==''&& allV.header)||(allV.body !==''&& allV.body)) 
    { setUnsavedChanges(true)}
  }

      return (
        <div className={styles.layoutSection} style={{minHeight: sectionMinHeigth}}>
          <div className={styles.blockMain} style={{padding: pad}}>
            <div className={styles.closeBtn} onClick={()=> router.back()}><CloseOutlined /></div>
            
            <h3 className={styles.title}>Задайте вопрос юристам портала</h3>
            <Form
                        style={{width: "100%", font: "inherite", fontSize: "18px"}}
                        form={form}
                        name="question"
                        layout = 'vertical'
                        onFinish={onFinish}
                        validateTrigger='onSubmit'
                        scrollToFirstError
                        onValuesChange={onValuesChange}
                        
                        >
                <HelpLabel
                      title="Введите заголовок вопроса"
                      popoverContent="Повседневная практика показывает, что разбавленное изрядной долей эмпатии, рациональное мышление обеспечивает актуальность форм воздействия. Картельные сговоры не допускают ситуации, при которой акционеры крупнейших компаний призваны к ответу. Как уже неоднократно упомянуто, ключевые особенности структуры проекта являются только методом политического участия и в равной степени предоставлены сами себе."
                      popoverTitle="Заголовок вопроса это:"
                      style={{width: "100%"}}
                    >          
                 <Form.Item
                            name="header"
                            rules={[
                                {
                                    required: true,
                                    message: 'Заполните поле!',
                                },
                            ]}
                             style={{marginBottom: '0px'}}
                            >
                    
                      {/* <Input
                        size='large'
                      />   */}
                      <TextArea
                        autoSize={{
                          minRows: 2,
                          maxRows: 2,
                        }}
                        maxLength={150}
                        size={theme.size}
                      />
                    
                  </Form.Item>            
                  </HelpLabel>  

                  <HelpLabel
                      title="Раскройте суть вопроса"
                      showHelp={false}
                      style={{width: "100%", marginTop: pad}}
                    >          
                 <Form.Item
                            name="body"
                            rules={[
                                {
                                    required: true,
                                    message: 'Заполните поле!',
                                },
                            ]}
                             style={{marginBottom: '0px'}}
                            >
       
                      <TextArea
                        autoSize={{
                          minRows: 3,
                          maxRows: 3,
                        }}
                     //   maxLength={150}
                        size={theme.size}
                        prefix={<ClockCircleOutlined />}
                        status="error"
                      />
                    
                  </Form.Item>            
                  </HelpLabel>  
             
                  <HelpLabel
                    title="Выберите сферу, к которой относится вопрос"
                    style={{marginTop: pad, width: "100%"}}
                    popoverContent="Повседневная практика показывает, что разбавленное изрядной долей эмпатии, рациональное мышление обеспечивает актуальность форм воздействия. Картельные сговоры не допускают ситуации, при которой акционеры крупнейших компаний призваны к ответу. Как уже неоднократно упомянуто, ключевые особенности структуры проекта являются только методом политического участия и в равной степени предоставлены сами себе."
                      popoverTitle="Рекомендуем указать сферу правоотношений для..."
                  >
                    <BranchSelect
                      onChange={onBranchChange}
                    />  
                  </HelpLabel> 
              
                  <Form.Item style={{marginBottom: "0px"}} >
                            <Button type="primary" 
                                htmlType="submit"
                               // size={theme.size}
                                  style={{
                                    marginTop: pad
                                  }} 
                            >
                            ОПУБЛИКОВАТЬ ВОПРОС
                            </Button>
                        </Form.Item>

            </Form> 

            
          </div>  
          
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
