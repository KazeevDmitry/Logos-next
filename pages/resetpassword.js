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


import {
    
    CloseOutlined,
    
  } from '@ant-design/icons';

import { InfoCircleOutlined } from "@ant-design/icons";


import { Form,
    Input,
    Button,
    Modal,
    } from 'antd';


export default function ResetPassword ({logIn = true}) {

    const [form] = Form.useForm();

    const theme = useThemeContext();

    const [formStatus, setFormStatus] = useState({error: '', text: ''}); 
  
    const router = useRouter();

    const [sectionMinHeigth, setSectionMinHeigth] = useState(''); 

   
    const onFinish = async (values) => {

        if (values.password !== values.passwordConfirmation) {
            setFormStatus({error: 'error', text: 'Пароли не совпадают!'});
            return;
        }
        
        values.code = router.query.code;

        axios
        .post(`${process.env.NEXT_PUBLIC_UPLOADS_API}/api/auth/reset-password`, values)
        .then(response => {
            console.log("Your user's password has been reset.");
            router.replace('/login?resetpassword=true');
        })
        .catch(error => {
            console.log('An error occurred due to reset password:', error.response);
        });
   
    };
        
        const onCloseBtn = () => {
                router.push('/');
        }

        useEffect(() => {
            if (typeof window !== 'undefined') {
                setSectionMinHeigth(`${document.documentElement.clientHeight-200}px`);
            }
        }, []);
         
    return(
        <div className={styles.sectionEnter} style={{minHeight: sectionMinHeigth}}>

            
            <div className={styles.blockMain}>

                <div className={styles.closeBtn} onClick={onCloseBtn}><CloseOutlined /></div>
            
                <h3 className={styles.title}>Восстановление пароля</h3>
                    
                    <Form
                        style={{width: '100%'}}
                        form={form}
                        name="changePass"
                        layout = 'vertical'
                        onFinish={onFinish}
                        validateTrigger='onSubmit'
                        scrollToFirstError
                        >
                        <Form.Item
                            name="password"
                            /* style={{
                                marginBottom: '10px'}} */
                            validateFirst={true}
                           
                          rules={[
                            {
                                required: true,
                                message: 'Введите пароль!!',
                            },
                            ]}
                        
                        >
                            <Input.Password
                                size={theme?.size}
                                placeholder={'Новый пароль'}
                                status={formStatus.error}
                                onChange = {() => setFormStatus(false)}
                            />
                        </Form.Item>
                        <Form.Item
                            name="passwordConfirmation"
                            style={{
                                marginTop: '20px'}}
                            validateFirst={true}
                           
                          rules={[
                            {
                                required: true,
                                message: 'Повторите пароль!',
                            },
                            ]}
                        
                        >
                            <Input.Password
                                size={theme?.size}
                                placeholder={'Повторите пароль'}
                                status={formStatus.error}
                                onChange = {() => setFormStatus(false)}
                            />
                        </Form.Item>
                        
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
                            Сменить пароль
                            </Button>
                                       
                        </Form.Item>

                    

                        
                    </Form>
            </div>                    

        </div>
    )
}
