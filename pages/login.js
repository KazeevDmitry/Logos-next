import React, { useRef, useEffect, useState } from 'react';

import styles from '../styles/auth.module.less';
import axios from 'axios';

import { useRouter } from 'next/router';

import {useThemeContext} from '../src/context/themeContext';
import {useUserContext} from '../src/context/userContext';

import Link from 'next/link';
import Image from 'next/image'

import { setCookie } from 'cookies-next'; 
import { createStrapiAxios } from '../utils/strapi';

import PageHeader from '../src/components/layouts/pageHeader';
import PageContainer from '../src/components/layouts/pageContainer';

import {
    
    CloseOutlined,
    
  } from '@ant-design/icons';

import googleImg from '../public/google.svg';
import vk from '../public/vk copy.svg';
import odnoklassniki from '../public/odnoklassniki.svg';
import { InfoCircleOutlined } from "@ant-design/icons";


import { Form,
    Input,
    Button,
    Modal, Col,
    } from 'antd';


export default function Auth ({logIn = true}) {

    const [form] = Form.useForm();

    const {currentUser, setCurrentUser} = useUserContext();

    const [values, setValues] = React.useState({
        
            inputType: 'e-mail',
            showPassInfo: false,
            xPopup : 0,
            yPopup: 0,
            passInfoText: '',
            codeInfoText: '',
                   
          })

    const [sectionMinHeigth, setSectionMinHeigth] = useState('');     

    const [formStatus, setFormStatus] = useState({error: '', text: ''});      
    const [modalOpen, setModalOpen] = useState(false);
    const [curEmail, setCurEmail] = useState();

    const myRef = useRef(null);

    const theme = useThemeContext();
    const p = theme?.gutters?.gorizontal[theme?.id];

    const pad = p<30 ? '30px' : `${p}px`;
  
    const router = useRouter();

                  
        const onPassFocus = (i) => (e) => {
     
            let c = e.target.getBoundingClientRect();

            let str = i===1 ? 'passwordInfo' : 'labels.codeInfo';
            

            setValues({...values, xPopup: c.left + 420, 
                           yPopup: c.top + window.pageXOffset-15,
                           showPassInfo: true,
                           passInfoText: str})
        }
 
        const onPassBlur = () => {

            setValues({...values, showPassInfo: false});
        }

        const resetFormStatus = () => {
            if (formStatus.error === 'error') {
                setFormStatus({error: '', text: ''});
            }
        }

        const onCloseBtn = () => {
            if (router.query.confirmed || router.query.resetpassword) {
                router.push('/');
            }else{
                router.back();
            }
        }
  
        const onFinish = async (values) => {
            
            axios.post('/api/login', values).then(async (res) => {
                const JWT = res.data.jwt;

                await createStrapiAxios(JWT)
                //.get(`/users/${res.data.user.id}?populate=avatar`)
                .get(`/users/${res.data.user.id}?populate[0]=avatar&populate[1]=expert`)
                .then((res) => {
                    let isExp = false;
                    if (res.data.expert && res.data.expert.id) {
                        isExp = true;    
                    }
                    
                    setCurrentUser({...res.data, jwt: JWT, isExpert : isExp});
                    
                })
                .catch((error) => console.log('ERROR from /users/id------------', error));

                //setCurrentUser({...res.data.user, jwt: res.data.jwt});
                //router.back();
                /* if (router.query.confirmed) {
                    router.push('/');
                }else{
                    router.back();
                } */
                onCloseBtn();
              })
              .catch(error => {
                console.log('An error occurred:', error);   
                    if (error.response?.status !== 500) 
                    {
// handle ALL ERRORS but not only 500 status   
                        if (error.response?.status === 400) {
                            if (error.response?.data?.error?.message === 'Your account email is not confirmed') {
                                setFormStatus({error: 'warn', text: 'Подтвердите вашу почту, перейдя по ссылке в письме.'});    
                            }

                        }else {
                            setFormStatus({error: 'error', text: 'ОШИБКА АВТОРИЗАЦИИ! Проверьте введенные данные.'});
                        }
                    }
                    else {
                        setFormStatus({error: 'error', text: 'ОШИБКА ПЕРЕДАЧИ ДАННЫХ!'});
                    }
                });
            };
        
       

    

    const onfogPass = async () => {
        try {
          const values = await form.validateFields(['email']);
          console.log('Success:', values);
          await axios
            .post(`${process.env.NEXT_PUBLIC_UPLOADS_API}/api/auth/forgot-password`, {
                email: values.email,
            })
            .then(response => {
               console.log('Your user received an email');
                setCurEmail(values.email);
                setModalOpen(true);
            })
            .catch(error => {
                // Handle error.
                console.log('An error occurred email not sent:', error.response);
            });
          

        } catch (errorInfo) {
          console.log('Failed:', errorInfo);
        }
      };
const onModalOk = () => {
    setModalOpen(false);
    onCloseBtn();
};

useEffect(() => {
    if (typeof window !== 'undefined') {
        setSectionMinHeigth(`${document.documentElement.clientHeight-200}px`);
    }
}, []);

const maxWidth = theme.id === 'xs' || theme.id === 'sm' ? '768px' : '350px';
const bGcolor = theme.id === 'xs' || theme.id === 'sm' ? 'white' : '';
         
    return(
        //<div className={styles.sectionEnter} style={{minHeight: sectionMinHeigth}}>
        <>

<PageHeader 
        /* title={t('headers.experts')} */
          title="Вход"  
          maxWidth={maxWidth}
          closeBtn = {true}
        >
         
        </PageHeader>
     
         <PageContainer 
            maxWidth={maxWidth} 
            bGcolor={bGcolor}
         >  

          <Col span = {24}>    

            <Modal
                title="Восстановление пароля"
                /* style={{
                top: 20,
                }} */
                centered
                open={modalOpen}
                onOk={onModalOk}
                onCancel={onModalOk}
                footer={[
                    
                    <Button key="submit" type="primary" onClick={onModalOk}>
                      OK
                    </Button>,
                  ]}
            >
                <p>{`На вашу почту`}</p>
                <p style={{fontSize: "18px", fontWeight: "600"}}>{curEmail}</p>
                <p>Отправлена ссылка, проверьте входящие сообщения</p>
            </Modal>  
            
            <div className={styles.blockMain} style={{padding: pad, maxWidth: '350px'}}>

             
                    <Form
                        style={{width: '100%'}}
                        form={form}
                        name="login"
                        layout = 'vertical'
                        onFinish={onFinish}
                        validateTrigger='onSubmit'
                        scrollToFirstError
                        >

                            <Form.Item
                                name="email"
                                style={{marginBottom: "0px"}}
                                rules={[
                                {
                                    type: 'email',
                                    message: 'Неверно введена почта!',
                                },
                                {
                                    required: true,
                                    message: 'Укажите E-mail!',
                                },
                                ]}

                            >
                                <Input
                                    size={theme?.size}
                                    status={formStatus.error}
                                    style={{fontFamily: 'inherit'}}
                                    placeholder={'E-mail'}
                                    onChange = {resetFormStatus}
                                />

                            </Form.Item>
                        {/* </div>     */}
                            <Form.Item
                                name="password"
                                //label={'labels.password'}
                                style={{
                                    marginTop: '15px', 
                                    marginBottom: '10px'}}
                                validateFirst={true}
                            
                            //  rules={Validation().password}
                            rules={[
                                {
                                    required: true,
                                    message: 'Введите пароль!!',
                                },
                                ]}
                            
                            >
                                <Input.Password
                                    size={theme?.size}
                                    onFocus={onPassFocus(1)}
                                    onBlur={onPassBlur}
                                    status={formStatus.error}
                                    placeholder={'Пароль'}
                                    onChange = {resetFormStatus}
                                />
                            </Form.Item>
                        <div style={{display: "flex", justifyContent: "flex-end", marginTop: "10px"}}>
                            
                            <Button 
                                type="link" 
                                onClick={onfogPass}
                                >
                                    Забыли пароль?
                            </Button>
                            
                        </div>    
                        
                        {(formStatus.error === 'error' || formStatus.error === 'warn') && <div
                            text-align = {'left'} 
                            style={{color: formStatus.error === 'error' ? '#F44336' : '#dd9211', marginTop: '10pxs'}}
                        >
                             {formStatus.text}   
                        </div>}
                        <Form.Item >
                            <Button type="primary" htmlType="submit"
                                size={theme?.size}
                                style={{
                                    width: '100%',
                                    marginTop: "24px"
                                }}
                            >
                            Войти
                            </Button>
                                       
                        </Form.Item>

                    {!router.query.confirmed && 
                       <>
                        <div className={styles.register}>

                            <Link 
                                href="/register" 
                                passHref={true}
                                replace={true}
                                className={styles.registerLink}
                                >
                                  {'РЕГИСТРАЦИЯ >>'}
                            </Link>
                        </div>

                        <div className={styles.divider}></div>

                        
                       
                       <h4 className={styles.socialTitle}>Войти через соцсети</h4>
                        <div className={styles.socialLinks}>
                            <Link href="#" >
                                <Image
                                    src={vk}
                                    alt="VK..."
                                    width={50}
                                    height={50}
                                />
                            </Link>
                            <Link href="#" >
                                <Image
                                    src={odnoklassniki}
                                    alt="VK..."
                                    width={50}
                                    height={50}
                                />
                            </Link>
                            <Link href="#" >
                                <div style ={{width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#F5F6F7", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                <Image
                                    src={googleImg}
                                    alt="VK..."
                                    width={20}
                                    height={20}
                                />
                                </div>
                            </Link>
                           
                        </div>
                        </>
                        }
                        {router.query.confirmed && 
                            <div className={styles.infodiv}>
                                <InfoCircleOutlined 
                                className={styles.infoimage}
                                />
                                <div style={{textAlign: "left", marginLeft: "10px"}}>
                                    Не забудьте заполнить ваш профиль в личном кабинете!
                                </div>
                            </div>
                        }

                        
                    </Form>
            </div>                    

        </Col>
        </PageContainer>
        </>
    )
}
