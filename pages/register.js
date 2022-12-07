import React, { useRef, useState } from 'react';

import styles from '../styles/auth.module.less';
import axios from 'axios';

import { useRouter } from 'next/router';

import {useThemeContext} from '../src/context/themeContext';
import {useUserContext} from '../src/context/userContext';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';


import {
    
    CloseOutlined,
    
  } from '@ant-design/icons';


import{ Form,
    Input,
    Button,
    Radio
    } from 'antd';
import { sendError } from 'next/dist/server/api-utils';



export default function Register () {

    const [form] = Form.useForm();

    const {setCurrentUser} = useUserContext();

       
    const [clientStatus, setClientStatus] = React.useState(1);

    const [formStatus, setFormStatus] = useState({error: '', text: ''});      

    const myRef = useRef(null);

    const theme = useThemeContext();
    const router = useRouter();
     
    
        const onFinish = async (values) => {

            const {email, name, surname} = values;
            const sendValues = {email, username: email, password: 'Default', name, surname};
           

            axios.post('/api/register', sendValues).then((res) => {
                console.log('Registered user ---------   ', res);
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

        
        
    
    return(
        <div className={styles.sectionEnter}>
            
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
                            label= "Имя"
                            rules={[
                                {
                                    required: true,
                                    message: 'Имя обязательно!',
                                },
                            ]}
                             style={{marginBottom: '15px'}}
                            >
                                <Input size={theme.size}/>

                        </Form.Item>
                        <Form.Item
                            name="surname"
                            label= "Фамилия"
                            rules={[
                                {
                                    required: requiredSurname, //stateValues.clientStatus !==1,
                                    message: 'Введите фамилию!',
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
                                    message: 'Неверно введена почта!',
                                },
                                {
                                    required: true,
                                    message: 'Укажите вашу почту!',
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

                        <div className={styles.register}>

                            <Link 
                                href="/login" 
                                passHref={true}
                                replace={true}
                                >
                                <a className={styles.registerLink}>
                                    {'Вход'}
                                    </a>

                            </Link>
                        </div>

                        <Form.Item >
                            <Button type="primary" 
                                htmlType="submit"
                                size={theme.size}
                                style={{
                                    width: '100%',
                                    marginTop: '30px'
                                }}
                            >
                            Зарегистрироваться
                            </Button>
                                       
                        </Form.Item>
                        
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
