import React, { useState, useContext, useEffect, useRef } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from "axios";

import AskModal from "../askModal/askModal";
import Icons from "../../../utils/icons";
import { useTranslation } from 'react-i18next';


import styles from "./app-header.module.less";

import { Select, Button, Divider } from 'antd';

import {useThemeContext} from '../../context/themeContext';
import {UserContext} from '../../context/userContext';

import UserImage from "../userImage/userImage";

import { LogoutOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function AppHeader(props) 
{

  const [ userMenuOpen, setUserMenuOpen ] = useState(false);

  const [ askShow, setAskShow ] = useState(false);


  const {currentUser, setCurrentUser} = useContext(UserContext);

  const userJWT = currentUser?.jwt ?? '';
  
  const { t, i18n } = useTranslation();

  const router = useRouter();

  //const navigate = useNavigate();

  const theme=useThemeContext();

  // async function getUser() {
  //   axios.post('/api/user').then((user) => {

  //     if (user.data.strapiToken) {
  //       console.log('jwt from appHeader---------------', user.data.strapiToken);
  //       putUserToContext(user.data.strapiToken);

  //     }
  //     else {
  //       console.log('Not authenticated (AppHaeder)');
  //     }

  //     //setCurrentUser(user);
      
  //   })
  //   .catch(error => console.log(error))
  // }

  // useEffect(() => {
  //   getUser();
  // }, []); 
 


  const callUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const onUserLeave = () => {
    setAskShow(true);
  };

  const askHide = (value) => {

    if (value) {
      setUserMenuOpen(false);

      
      // props.onUserLeave();
      setCurrentUser({});
  }
  setAskShow(false);
  };

  const onOutClick = () => {
    setUserMenuOpen(false);
  };


  const LANGS = [
    {
      title: 'English',
      name: 'en'
    },
    {
      title: 'Русский',
      name: 'ru'
    },
  ]

  const PAGES = [
    {
      name: t('header.menu.0'),
      to: '/tasks',
      
    },
    {
      name: t('header.menu.1'),
      to: '/experts', 
    },
    {
      name: t('header.menu.2'), // Новости
      to: '/news'
    },
    {
      name: t('header.menu.3'), // Вопросы юристам
      to: '/questions'
    }
  ];

  const USER_MENU_ITEMS = [
    {
      name: t('menu.user.profile'),
      to: "/personalaccount",
    },
    {
      name: t('menu.user.projects'),
      to: '/mytasks', 
    },
    {
      name: t('menu.user.requests'), 
      to: '#/404'
    },
    {
      name: t('menu.user.messages'), 
      to: '#/404'
    },
    {
      name: t('menu.user.finance'), 
      to: '#/404'
    }
  ];
  

  const { changeLanguage} = props;

  const logoffStr = t('buttons.logoff');

  const userImage= currentUser?.user?.avatar?.url??  '';

  const username = currentUser?.user?.name?? '';
  

  //return (
    // <>  
      
    //      <header className={styles.mainHeader}>
    //         <div className={styles.menu}>
        
    //           <div className={styles.mainLogo}>
    //             <Link href="/">
    //             <a className={styles.logosHeader} style={{color: "#1890ff"}}>LogosEst</a>
              
    //             </Link>
    //           </div>  

    //           <div className={styles.navToolsBox}>

    //             <ul className={styles.menuBox}>
    //               {
    //                 PAGES.map(({ to, name }, i) => (
    //                   <li key={i}>
    //                     <NavLink
    //                       href={to}
    //                       style={{marginLeft: "50px"}}
    //                     >
    //                        {name}
    //                     </NavLink>
    //                   </li>
    //                 ))
    //               }
    //               </ul>
    //               <div className={styles.toolBar}>

    //                   <div className={styles.userBox}>
    //                     {userJWT && <div className={styles.imageClazz} onClick={callUserMenu}>
    //                         <UserImage
    //                             image= {userImage}
    //                             online={false}
    //                             width= {55}
    //                             username={username}
    //                           />
                        
    //                     </div>}

            

    //                     {theme?.id !== "md" && Object.keys(currentUser).length !== 0 && 
    //                       <span className={styles.userLink} onClick={callUserMenu}>
    //                         {currentUser?.user?.name}
    //                         <br></br>
    //                         {currentUser?.user?.surname}
    //                       </span>
    //                     }
    //           {/* {!props.userLogged && ( */}
    //           {Object.keys(currentUser).length === 0 && (
    //             <Button type="primary" ghost htmlType="button"
    //                     style={{
    //                             // width: '62%',
    //                             marginLeft: '20px'
    //                           }}
    //                     onClick={()=> router.push('/auth')}
    //                     >
    //                     {t('buttons.headerBtn')}
    //             </Button>
    //           )}
    //         </div>

    //         {/* {theme?.id !== "md" && <div className={styles.box}>
    //           <a
    //             href="#"
    //             className={styles.logOff}
    //             onClick={onUserLeave}
    //           >
    //             <Icons.logoffDoor color={blueForIcon} />
    //           </a>
    //         </div>} */}
    //       </div>
    //             </div>
    //         </div>   
    //         {theme?.id !== "xs" && <div className={styles.crumbBox}>
    //           <Breadcrumbs />
              
    //       </div>}
    //       </header>
    // </>
   //  )

   return (
    <>
        {!theme?.isDesktop && 
          <header className={styles.mobileHeader}>
            <div className={styles.mobileTopBox}>
               <div className={styles.burgerMenu} onClick={callUserMenu}>
                    <div className={styles.menuDash}></div>
                    <div className={styles.menuDash}></div>
                    <div className={styles.menuDash}></div>
               </div>

               <Link href='/'>
                 <a className={styles.logosHeader}>LogosEst</a>
                  </Link>
               {!props.userLogged && (
                  <Button  htmlType="button"
                          style={{
                                  height: "30px",
                                  fontSize: "12px",
                                  marginRight: "30px",
                                  borderRadius: "4px"
                                }}
                          onClick={()=> navigate('/auth')}
                          >
                          {t('buttons.mobileheaderBtn')}
                  </Button>
                )}
               {props.userLogged &&
                <div style={{marginRight: "30px"}}>
                  <UserImage
                      image= {userImage}
                      online={false}
                      width= {35}
                      username={currentUser.user?.name}
                    />
                  </div>  }
            </div>
            
          </header>}
          {/* //---------------------------------------------------------------------------------------------------------------------- */}

        {theme?.isDesktop &&
          <header className={styles.mainHeader}>
              <div className={styles.menu}>
                <div className={styles.mainLogo}>
                  <Link href="/" >
                    <a className={styles.logosHeader} style={{color: "#1890ff"}}> LogosEst </a>
                  </Link>
                </div>

                <div className={styles.navToolsBox}>

                  <ul className={styles.menuBox}>
                    {
                      PAGES.map(({ to, name }, i) => (
                        <li key={i}>
                          <NavLink
                            href={to}
                            style={{marginLeft: "50px"}}
                          >
                            { name }
                          </NavLink>
                        </li>
                      ))
                    }
                    </ul>
                  
                  <div className={styles.toolBar} style={{fontSize: '16px'}}>

                    <div className={styles.userBox}  style={{fontSize: '16px'}}>
                      {userJWT && <div className={styles.imageClazz} onClick={callUserMenu}>
                                        <UserImage
                                            image= {userImage}
                                            online={false}
                                            width= {45}
                                          />
                                    
                                  </div>}

                      {theme?.id !== "md" && currentUser && 
                      
                          <span className={styles.userLink} onClick={callUserMenu}>
                              {currentUser?.user?.name}
                              <br></br>
                              {currentUser?.user?.surname}
                          </span>
                          }
                    
                      {currentUser && 
                    
                      <Link href={'/login'}>
                        <Button type="primary" htmlType="button"
                                size = {theme.size}  
                                style={{
                                        // width: '62%',
                                        marginLeft: '20px',
                                        fontFamily: 'inherit'
                                      }}
                               
                                >
                                 Войти   
                                {/* {t('buttons.headerBtn')} */}
                        </Button>
                         </Link>
                   
                     }

                    </div>
                  </div>
                </div>  
              </div>

            </header>
}

      {userMenuOpen&&theme?.isDesktop && <UserMenu
        onOutClick={onOutClick}
        onUserLeave={onUserLeave}
        logoff = {logoffStr}
        items = {USER_MENU_ITEMS}
        onClick={callUserMenu}
      />}
       {userMenuOpen&&!theme?.isDesktop && <MobileUserMenu
        onOutClick={onOutClick}
        onUserLeave={onUserLeave}
        logoff = {logoffStr}
        items = {USER_MENU_ITEMS}
        mainItems = {PAGES}
        onClick={callUserMenu}
      />}
      <AskModal visible={askShow} setShow={askHide} />
    </>
  );

};



function NavLink({ children, href, style }) {
  const router = useRouter();
  let match = href === router.pathname;

  return (
    <Link href = {href}
        
      >
        <a style={style} className={styles.menuLink + ' '+ (match ? styles.activeMenu : '')}>
          {children}
        </a>
        
      </Link>
       
  );
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------






 
  
  


  




function MobileUserMenu (props) {
  let mainRef = useRef();

  const {setCurrentUser} = useContext(UserContext);

  useEffect(() => {

    const onOutSideClick = (e) => {
      if (mainRef.current && !mainRef.current.contains(e.target)) {
        props.onOutClick();
      }
    };

    document.addEventListener("mousedown", onOutSideClick);
        return () => {
          document.removeEventListener("mousedown", onOutSideClick);
        };
     },
  []);
  

  return (
      <div className={styles.mobileUserMenuBox} ref={mainRef}>
   
        <UserMenuItems items = {props.mainItems} onClick= {props.onClick}/>    

        <UserMenuItems items = {props.items} onClick= {props.onClick}/>

        <div className={styles.userMenuLine}></div>
        <div className={styles.userOutBox} onClick={(props.onUserLeave)}>
          <span className={styles.outLabel}> {props.logoff} </span>
          {/* <div className={styles.outIcon}>
            <Icons.logoffDoor color={'#0062FF'} />
          </div> */}
        
        </div>
      </div>
  )
}

class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.menuRef = React.createRef();
    this.onOutSideClick = (e) => {
      if (this.menuRef.current && !this.menuRef.current.contains(e.target)) {
        this.props.onOutClick();
      }
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.onOutSideClick);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.onOutSideClick);
  }

  render() {
  
    return (
 
      <div className={styles.userMenuBox} ref={this.menuRef}>
        <UserMenuItems items = {this.props.items} onClick={this.props.onClick}/>
        <div className={styles.userMenuLine}></div>
        <div className={styles.userOutBox} onClick={this.props.onUserLeave}>
          <span className={styles.outLabel}> {this.props.logoff} </span>
          <LogoutOutlined className={styles.logOutIcon} />
        </div>
      </div>
    );
  }
}

function UserMenuItems({items, onClick}){
  const { t } = useTranslation();

  return (
    <div className={styles.userLinkBox}>
      {
         items.map(({ to, name }) => (
                  <Link href={to}>
                    <a className={styles.menuLink} onClick={onClick}> { name } </a>
                  </Link>
              ))
            }
    </div>
  )
}
