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

// import {validation} from '../../Utils/validation';

import { Link } from 'react-router-dom';

// import { Input, Space } from 'antd';
// import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import { useTranslation } from 'react-i18next';

// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import ruPhI from 'react-phone-input-2/lang/ru.json';
//import enPhI from 'react-phone-input-2/lang/en.json';


import { Form,
    Input,
    DatePicker,
    Button,
    Transfer
    } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { UserContext } from '../../Providers/UserContext';

import PassInput from '../passwordInput/passwordInput.js';

import TelPostInput from '../telPostInput/telPostInput';
import PasswordInfo from '../passwordInfo/passwordInfo';


export default function Enter ({logIn = true}) {

    const [form] = Form.useForm();

    const { t, i18n } = useTranslation();

    const {currentUser, setCurrentUser} = useContext(UserContext)

       
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

    let navigate = useNavigate();

  const location = useLocation();

  const theme = useThemeContext();
  
  

        // const history = useHistory();
                
        const onPassFocus = (i) => (e) => {
     
            let c = e.target.getBoundingClientRect();

            let str = i===1 ? t('labels.passwordInfo') : t('labels.codeInfo');
            

            setValues({...values, xPopup: c.left + 420, 
                           yPopup: c.top + window.pageXOffset-15,
                           showPassInfo: true,
                           passInfoText: str})
        }
 
        const onPassBlur = () => {

            setValues({...values, showPassInfo: false});
        }

  
        const onFinish = async (values) => {

            try {
                const response = await axios.post(`${process.env.REACT_APP_API}/auth/local/`, {...values});
                setCurrentUser(response.data);

                navigate(-1);
            } catch (error) {
                if (error.response) {
                    console.log('An error occurred:', error.response.data.message[0]?.messages[0].id);   
                    if (error.response.data.message[0]?.messages[0].id === 'Auth.form.error.invalid') {
                        console.log('неправильный логин пароль');
                        setFormStatus({error: 'error', text: 'Неправильно введены данные для авторизации!'});
                    }
                    

                }
                else {
                    alert("Ошибка сети!"); 
                }
                
            };
        };

 
    
    return(
        <div className={styles.sectionEnter}>
            
            <div className={styles.blockMain} ref={myRef}>

                <div className={styles.closeBtn} onClick={()=> navigate(-1)}><CloseOutlined /></div>
            
                <h3 className={styles.title}>{logIn ? t('headers.login') : t('headers.registration')}</h3>
                    
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
                                name="identifier"
                                label="E-mail"
                                style={{marginBottom: '15px'}}
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

                            >
                                <Input
                                    size={theme?.size}
                                    status={formStatus.error}
                                    style={{fontFamily: 'inherit'}}
                                />

                            </Form.Item>
                        {/* </div>     */}
                        <Form.Item
                            name="password"
                            label={t('labels.password')}
                            style={{marginBottom: '15px'}}
                            validateFirst={true}
                           
                          //  rules={Validation().password}
                        
                        >
                            <Input.Password
                                size={theme?.size}
                                onFocus={onPassFocus(1)}
                                onBlur={onPassBlur}
                                status={formStatus.error}
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
                                    width: '100%', marginTop: "30px"
                                }}
                            >
                            {t('buttons.login')}
                            </Button>
                                       
                        </Form.Item>

                        <Link to="/recovery" className={styles.recoveryLink}>{t('labels.forgotPassword')}</Link>
                        <div className={styles.divider}></div>
                        <h4 className={styles.socialTitle}>{t('labels.loginSocNW')}</h4>
                        <div className={styles.socialLinks}>
                            <a href="/" >
                              <Icons.Vk width = {"50px"} height = {"50px"}/>
                            </a>
                            <a href="/" >
                              <Icons.Odnoklassniki width = {"50px"} height = {"50px"}/>
                            </a>
                            <a href="/" className={styles.googleLink}><div className={styles.google}><img className={styles.googleImg} src={googleImg} alt="img"></img></div></a>
                        </div>

                        
                    </Form>
            </div>                    


                {/* <PasswordInfo
                    xCoord={values.xPopup}
                    yCoord={values.yPopup}
                    visible={values.showPassInfo}
                    labelText={values.passInfoText}
                /> */}


                <div className={styles.register}>
                    {`${t('labels.dontHaveAccount')}  `} 
                    <Link 
                        to="/registration" 
                        className={styles.registerLink}>
                            {t('links.register')}
                    </Link>
                </div>

                


        </div>
    )
}
