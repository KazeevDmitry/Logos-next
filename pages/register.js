import React, { useRef, useContext, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import styles from './logInForm.module.less';
import axios from 'axios';
import Icons from "Utils/icons";

import { useThemeContext } from '../../Providers/themeContext';

import {
    
    CloseOutlined,
    
  } from '@ant-design/icons';

import '../../Common/antd-theme.less';

import { Validation } from '../../Utils';


import vkImg from './icons/vk.svg'
import facebookImg from './icons/facebook.svg'
import googleImg from './icons/google.svg'

import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Form,
    Input,
    Button,
    Radio
    } from 'antd';

import { useUserContext } from '../../Providers/UserContext';

export default function Registration () {

    const [form] = Form.useForm();

    const { t, i18n } = useTranslation();

    const {setCurrentUser} = useUserContext();

       
    const [clientStatus, setClientStatus] = React.useState(1);

    const [formStatus, setFormStatus] = useState({error: '', text: ''});      

    const myRef = useRef(null);

    let navigate = useNavigate();

    const theme = useThemeContext();
  
    
        const onFinish = async (values) => {

            const sendValues = {...values, password: 'Default', username: values.email};

            try {
                const response = await axios.post(`${process.env.REACT_APP_API}/auth/local/register`, sendValues);
                setCurrentUser(response.data);

                navigate(-2);
            } catch (error) {
                if (error.response) {
                    console.log('An error occurred:', error.response.data.message[0]?.messages[0].id);   
                    if (error.response.data.message[0]?.messages[0].id === 'Auth.form.error.username.taken' || error.response.data.message[0]?.messages[0].id === 'Auth.form.error.email.taken') {
                        setFormStatus({error: 'error', text: 'Указанная почта уже зарегистрирована!'});
                    }
                    
                }
                else {
                    setFormStatus({error: 'error', text: 'ЧТО-ТО ПОШЛО НЕ ТАК!'});
                }
                
            };
        };

                
        const onFormCHnge = (e) => {

            console.log('clientStatus', e.target.value);
            
            setClientStatus(e.target.value);
       
        }

        const requiredSurname = clientStatus !== 1;

        
        
    
    return(
        <div className={styles.sectionEnter}>
            
            <div className={styles.blockMain} ref={myRef}>

                <div className={styles.closeBtn} onClick={()=> navigate(-2)}><CloseOutlined /></div>
            
                <h3 className={styles.title}>{t('headers.registration')}</h3>

                <div
                                    style={{display: 'flex', justifyContent: 'center', width: '100%'}}
                                >     
                                <Radio.Group  
                                    style={{marginBottom: "20px"}}
                                    value = {clientStatus}  
                                    onChange = {onFormCHnge}>
                               
                                    <Radio value={1}>Клиент</Radio>
                                    <Radio value={2}>Специалист</Radio>
                                    <Radio style={{marginRight:'0'}} value={3}>Компания</Radio>
                               
                                </Radio.Group>
                        </div>  
                    
                <Form
                        style={{width: "100%"}}
                        form={form}
                        name="Registration"
                        layout = 'vertical'
                        onFinish={onFinish}
                        validateTrigger='onSubmit'
                        scrollToFirstError
                        
                        >
                          

                        <Form.Item
                            name="name"
                            label= {t('labels.name')}
                            rules={[
                                {
                                    required: true,
                                    message: t('validation.required.name'),
                                },
                            ]}
                             style={{marginBottom: '15px'}}
                            >
                                <Input size={theme.size}/>

                        </Form.Item>
                        <Form.Item
                            name="surname"
                            label= {t('labels.surname')}
                            rules={[
                                {
                                    required: requiredSurname, //stateValues.clientStatus !==1,
                                    message: t('validation.required.surname'),
                                },
                            ]}
                             style={{marginBottom: '15px'}}
                            >
                                <Input size={theme.size} />

                        </Form.Item>
                        <Form.Item
                                name="email"
                                label="E-mail"
                                rules={[
                                {
                                    type: 'email',
                                    message: t('validation.e-mail'),
                                },
                                {
                                    required: true,
                                    message: t('validation.required.email'),
                                },
                                ]}
                                style={{marginBottom: '15px'}}
                            >
                                <Input size={theme.size}/>

                        </Form.Item>
                        
                        {formStatus.error === 'error' && <div
                            text-align = {'left'} 
                            style={{color: '#F44336', marginTop: '10pxs'}}
                        >
                             {formStatus.text}   
                        </div>}

                        <Form.Item >
                            <Button type="primary" 
                                htmlType="submit"
                                size={theme.size}
                                style={{
                                    width: '100%',
                                    marginTop: '30px'
                                }}
                            >
                            {t('buttons.registration')}
                            </Button>
                                       
                        </Form.Item>
                        
                    </Form>                    
            </div>                    

                <div className={styles.register}>
                    {`${t('labels.haveAccount')}  `} 
                    <Link 
                        to="/auth" 
                        className={styles.registerLink}>
                            {t('links.login')}
                    </Link>
                </div>

                


        </div>
    )
}
