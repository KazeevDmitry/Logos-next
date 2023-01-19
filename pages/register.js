import React, { useRef, useState, useEffect } from 'react';

import styles from '../styles/auth.module.less';
import axios from 'axios';

import { useRouter } from 'next/router';

import {useThemeContext} from '../src/context/themeContext';
import {useUserContext} from '../src/context/userContext';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';


import {
    
    CloseOutlined,
    SettingOutlined,
    
  } from '@ant-design/icons';


import{ Form,
    Input,
    Button,
    Radio,
    Tooltip,
    } from 'antd';
import { sendError } from 'next/dist/server/api-utils';



export default function Register () {

    const [form] = Form.useForm();

    const {setCurrentUser} = useUserContext();

       
    const [clientStatus, setClientStatus] = React.useState(1);

    const [formStatus, setFormStatus] = useState({error: '', text: ''});      

    const myRef = useRef(null);


    const [sectionMinHeigth, setSectionMinHeigth] = useState(''); 

    const theme = useThemeContext();
    const router = useRouter();
     
    
    const onFinish = async (values) => {

            const {email, password, confirmpassword} = values;

            if (password !== confirmpassword) {
                setFormStatus({error: 'error', text: 'Пароли не совпадают!'});
                return;
            }
             
           const sendValues = {...values, username: email, status: clientStatus};

            axios.post('/api/register', sendValues).then((res) => {
                setCurrentUser({...res.data.user, jwt: res.data.jwt});
                router.back();
              })
              .catch(error => {
                console.log('An error occurred:', error);   
                    if (error.response) 
                    {
                        if (error.response.status === 400) {
                            setFormStatus({error: 'error', text: 'УКАЗАННАЯ ПОЧТА УЖЕ ЗАРЕГИСТРИРОВАНА!'});
                        }else {
                            setFormStatus({error: 'error', text: 'ОШИБКА ПЕРЕДАЧИ ДАННЫХ!'});
                        }  
                    }
                    else {
                        setFormStatus({error: 'error', text: 'ОШИБКА ПЕРЕДАЧИ ДАННЫХ!'});
                    }
                });

        };

                
        const onFormCHnge = (e) => {

            setClientStatus(e.target.value);
       
        };

        const requiredSurname = clientStatus !== 1;

        const getRandomPass = () => {

            const randomstring = Math.random().toString(36).slice(-8);
            form.setFieldsValue({password: randomstring});

        }
        
        useEffect(() => {
            if (typeof window !== 'undefined') {
                setSectionMinHeigth(`${document.documentElement.clientHeight-200}px`);
            }
        }, []);
    
    return(
        <div className={styles.sectionEnter} style={{minHeight:sectionMinHeigth}}>
            
            <div className={styles.blockMain} ref={myRef}>

                <div className={styles.closeBtn} onClick={()=> router.back()}><CloseOutlined /></div>
            
                <h3 className={styles.title}>Регистрация</h3>

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
                            rules={[
                                {
                                    required: true,
                                    message: 'Имя обязательно!',
                                },
                            ]}
                             style={{marginBottom: '15px'}}
                            >
                                <Input 
                                    size={theme.size}
                                    placeholder="Имя"
                                    />

                        </Form.Item>
                        <Form.Item
                            name="surname"
                            rules={[
                                {
                                    required: requiredSurname, //stateValues.clientStatus !==1,
                                    message: 'Введите фамилию!',
                                },
                            ]}
                             style={{marginBottom: '15px'}}
                            >
                                <Input 
                                    placeholder='Фамилия'
                                    size={theme.size} />

                        </Form.Item>
                        <Form.Item
                                name="email"
                                rules={[
                                {
                                    type: 'email',
                                    message: 'Неверно введена почта!',
                                },
                                {
                                    required: true,
                                    message: 'Укажите вашу почту!',
                                },
                                ]}
                                style={{marginBottom: '15px'}}
                            >
                                <Input 
                                    placeholder='e-mail'
                                    size={theme.size}/>

                        </Form.Item>
                        <div
                            style={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}
                        >
                            <Tooltip 
                                title="Сгенерировать случайный пароль"
                                color='#2db7f5'
                               // overlayClassName={styles.tooltip}
                               // overlayInnerStyle = {styles.tooltip}
                                >
                                <Button 
                                    type="primary" 
                                    size={theme.size} 
                                    onClick={getRandomPass} 
                                    style={{marginRight:"15px", width: "60px"}}
                                    icon={<SettingOutlined 
                                        style={{color: "white"}}/>}>
                                
                                    </Button>    
                                </Tooltip>    
                            <div style={{width: "100%"}}>
                                    <Form.Item
                                        name="password"
                                        style={{
                                             marginBottom: '15px'}} 
                                        validateFirst={true}
                                    
                                        rules={[
                                        {
                                            required: true,
                                            message: 'Введите пароль!',
                                        },
                                        ]}
                                    
                                    >
                                        <Input.Password
                                            size={theme?.size}
                                            placeholder={'Пароль'}
                                            status={formStatus.error}
                                            onChange = {() => setFormStatus(false)}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="confirmpassword"
                                        style={{
                                             marginBottom: '15px'}} 
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
                                </div>    
                            </div>        
                        
                        
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
                                    marginTop: '15px'
                                }}
                            >
                            Зарегистрироваться
                            </Button>
                        </Form.Item>

                        <div className={styles.register} style={{marginTop:"30px", marginBottom: "0px"}}>

                            <Link 
                                href="/login" 
                                passHref={true}
                                replace={true}
                                >
                                <a className={styles.registerLink}>
                                    {"ВХОД >>"}
                                    </a>

                            </Link>
                        </div>

                        
                                       
                        
                        
                    </Form>                    
            </div>                    

                {/* <div className={styles.register}>
                    {`${t('labels.haveAccount')}  `} 
                    <Link 
                        href="/auth" 
                        className={styles.registerLink}>
                            {t('links.login')}
                    </Link>
                </div> */}

                


        </div>
    )
}
