import React from 'react';
import styles from './sideFilter.module.less';
import {useThemeContext} from '../../context/themeContext';
import { Button, Radio, Space, Divider, Checkbox } from 'antd';
import CityInput from '../cityInput/cityInput'; 
import InputSlider from '../input-slider/input-slider';
import { useRouter } from "next/router";
import { useTranslation } from 'react-i18next';

export default function  NewsFilter({categoryArr}) {

    if (!categoryArr){
        return null;
    }


   // const {t} = useTranslation()
        const router = useRouter();
    const theme = useThemeContext();  
        
    const {category} = router.query;
 
    const onChange = (value) => {
        
        router.query.category = value; 
        router.query.page = 1;
        const url = {
            pathname: router.pathname,
            query: router.query
          }
        router.push(url, undefined, { shallow: true });
    };

    

    const onResetParams = () => {

         delete router.query.category
         router.query.page = 1;
     
         const url = {
            pathname: router.pathname,
            query: router.query
          }
        router.push(url, undefined, { shallow: true });
            
        
    };


    const categories = categoryArr.map((item, i) => {

        const slug = item.attributes.slug;

        return (
 
            <div 
                key = {item.id}
                className={slug===category ? styles.arbitr + ' ' + styles.activeKatg : styles.arbitr}
                onClick={() => onChange(slug)}
               
                >
                    {item.attributes.name.toUpperCase()}
            </div>
        )
    });

    const pad = `${theme?.gutters?.gorizontal[theme?.id]}px`;

      return (

        <div className={styles.specBlock} style= {{padding: !theme.isDesktop ? "20px" : pad, marginBottom: pad}}>
            {!theme.isDesktop && <div className={styles.flexCont}>
                <div className={styles.filterHeader}> Категории </div>
                <Button 
                    size={theme?.size} 
                    //style={{width: "100%", marginTop: "30px"}}
                    type="primary" 
                    htmlType="button"
                    onClick = {onResetParams}
                    
                    >
                       Все новости
                </Button>
            </div>    }
            
        
               {theme.isDesktop && <div className={styles.specBlockHeader}> 
                    Категории
                </div>}
               
               {categories}
            
            
            {theme.isDesktop && <Button 
                size={theme?.size} 
                style={{width: "100%", marginTop: "30px"}}
                type="primary" 
                htmlType="button"
                onClick = {onResetParams}
                
                >
                    Все новости
            </Button>}
                        
        </div>
       
      )

}
