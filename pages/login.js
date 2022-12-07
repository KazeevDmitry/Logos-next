import React, { useRef, useContext, useState } from 'react';

import styles from '../styles/auth.module.less';
import axios from 'axios';

import { useRouter } from 'next/router';

import {useThemeContext} from '../src/context/themeContext';
import {useUserContext} from '../src/context/userContext';

import Link from 'next/link';
import Image from 'next/image'

import { setCookie } from 'cookies-next'; 


import {
    
    CloseOutlined,
    
  } from '@ant-design/icons';

import googleImg from '../public/google.svg';
import vk from '../public/vk copy.svg';
import odnoklassniki from '../public/odnoklassniki.svg';


import { Form,
    Input,
    Button,
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

    const [formStatus, setFormStatus] = useState({error: '', text: ''});      

    const myRef = useRef(null);

    const theme = useThemeContext();
  
    const router = useRouter();

        // const history = useHistory();
                
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

  
        const onFinish = async (values) => {
            
            axios.post('/api/login', values).then((res) => {
                setCurrentUser({...res.data.user, jwt: res.data.jwt});
                router.back();
              })
              .catch(error => {
                console.log('An error occurred:', error);   
                    if (error.response && error.response?.status !== 500) 
                    {
                          if (error.response.data?.message[0]?.messages[0].id === 'Auth.form.error.invalid') 
                        {
                            setFormStatus({error: 'error', text: 'ОШИБКА АВТОРИЗАЦИИ! Проверьте введенные данные.'});
                        }    
                    }
                    else {
                        setFormStatus({error: 'error', text: 'ОШИБКА ПЕРЕДАЧИ ДАННЫХ!'});
                    }
                });

         
    return(
        <div className={styles.sectionEnter}>
            
            <div className={styles.blockMain} ref={myRef}>

                <div className={styles.closeBtn} onClick={()=> router.back()}><CloseOutlined /></div>
            
                <h3 className={styles.title}>{logIn ? 'Вход' : 'Регистрация'}</h3>
                    
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
                                //label="E-mail"
                                // style={{marginBottom: '15px'}}
                                rules={[
                                {
                                    type: 'email',
                                    message: 'Неверно введена почта!',
                                },
                                {
                                    required: true,
                                    message: 'E-mail нужно ввести обязательно!',
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
                                // marginTop: '40px', 
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
                            <Link href="/recovery" passHref={true}>
                                    {/* <a className={styles.recoveryLink}> */}
                                        Забыли пароль?
                                    {/* </a> */}
                                
                            </Link>
    
                        </div>    
                        
                        {formStatus.error === 'error' && <div
                            text-align = {'left'} 
                            style={{color: '#F44336', marginTop: '10pxs'}}
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

                        <div className={styles.register}>

                            <Link 
                                href="/register" 
                                passHref={true}
                                replace={true}
                                >
                                <a className={styles.registerLink}>
                                    {'Зарегистрироваться'}
                                    </a>

                            </Link>
                        </div>
                        
                        <div className={styles.divider}></div>
                        <h4 className={styles.socialTitle}>Войти через соцсети</h4>
                        <div className={styles.socialLinks}>
                            <Link href="/" >
                                <Image
                                    src={vk}
                                    alt="VK..."
                                    width={50}
                                    height={50}
                                />
                            </Link>
                            <Link href="/" >
                                <Image
                                    src={odnoklassniki}
                                    alt="VK..."
                                    width={50}
                                    height={50}
                                />
                            </Link>
                            <Link href="/" >
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

                        
                    </Form>
            </div>                    

        </div>
    )
}
