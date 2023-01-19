import React from 'react';
import styles from './sideFilter.module.less';
import {useThemeContext} from '../../context/themeContext';
import { Button, Radio, Space, Divider, Checkbox } from 'antd';
import CityInput from '../cityInput/cityInput'; 
import InputSlider from '../input-slider/input-slider';
import { useRouter } from "next/router";
import { useTranslation } from 'react-i18next';

export default function  SideFilter({show = {
    city: false,
    budget: false,
    branch: true,
}}) {

    const {t} = useTranslation()
        const router = useRouter();
    const theme = useThemeContext();  
    const SPECS = theme.spec;
    const BRANCHES = theme.branches;

    const maxValues=[1000, 500000];
    
    const {branch, specialization, city, budgetmin, budgetmax, contractual} = router.query;
 
    const budget = !contractual && budgetmin !== null && budgetmax !==null  ? {inp1: budgetmin, inp2: budgetmax} : null; 

    /* const onParamChange = (param, value) => (sent) => {
        if (param === "contr") {
            router.query.contractual = e.target.checked;    
        }else
        {
            if (value) {
                router.query[param] = value;
            }else{
                router.query[param] = sent.target ? sent.target.value : sent;
            }
            
        }
        
        const url = {
          pathname: router.pathname,
          query: router.query
        }
        router.push(url, undefined, { shallow: true });
    }; */
       
    const onSpecChange = (e) => {
        
        router.query.specialization = e.target?.value?? e; 
        router.query.page = 1;
        const url = {
            pathname: router.pathname,
            query: router.query
          }
        router.push(url, undefined, { shallow: true });
    };

    const onSpecSelectChange = (value) => {
        onSpecChange(value);
    }

    const onBranchSelectChange =(e) => {
        router.query.branch = e.target.value; 
        router.query.page = 1;
        const url = {
            pathname: router.pathname,
            query: router.query
          }
        router.push(url, undefined, { shallow: true });    
    }

    const onBranchChange = (value) => {
        
        router.query.branch = value; 
        router.query.page = 1;
        const url = {
            pathname: router.pathname,
            query: router.query
          }
        router.push(url, undefined, { shallow: true });
    };

    const onCityChange = (value) => {
        
        router.query.city = value; 
        router.query.page = 1;
        const url = {
            pathname: router.pathname,
            query: router.query
          }
        router.push(url, undefined, { shallow: true });
    }

    const onBudgetChange = (value) => {

        router.query.budgetmin = value.inp1;
        router.query.budgetmax = value.inp2; 
        router.query.page = 1;
        const url = {
            pathname: router.pathname,
            query: router.query
          }
        router.push(url, undefined, { shallow: true });
    };

    const onCheckChange = (e) => {
                
        if (e.target.checked) {
            delete router.query.budgetmin
            delete router.query.budgetmax
        }
        router.query.contractual = e.target.checked;
        router.query.page = 1;

        const url = {
            pathname: router.pathname,
            query: router.query
          }
        router.push(url, undefined, { shallow: true });
    };



    const onResetParams = () => {

         delete router.query.city
         delete router.query.branch
         delete router.query.specialization
         delete router.query.contractual
         delete router.query.budgetmin
         delete router.query.budgetmax
         router.query.page = 1;
     
         const url = {
            pathname: router.pathname,
            query: router.query
          }
        router.push(url, undefined, { shallow: true });
            
        
    };


    const elements = SPECS?.map((item, i) => 
                
            <Radio 
                key = {item.id}
                value={String(item.id)}
                >
                {item.attributes.name}
            </Radio>
        
    );


    const branchs = BRANCHES?.map((item, i) => 
 
            <div 
                key = {item.id}
                className={String(item.id)===branch ? styles.arbitr + ' ' + styles.activeKatg : styles.arbitr}
                onClick={() => onBranchChange(item.id)}
               
                >
                    {item.attributes.name.toUpperCase()}
            </div>
        
    );

    const contr = contractual === 'true' ? true : false;



    const pad = `${theme?.gutters?.gorizontal[theme?.id]}px`;

      return (

        <div className={styles.specBlock} style= {{padding: !theme.isDesktop ? "20px" : pad, marginBottom: pad}}>
            {!theme.isDesktop && <div className={styles.flexCont}>
                <div className={styles.filterHeader}> Фильтр </div>
                <Button 
                    size={theme?.size} 
                    //style={{width: "100%", marginTop: "30px"}}
                    type="primary" 
                    htmlType="button"
                    onClick = {onResetParams}
                    
                    >
                       Сбросить
                </Button>
            </div>    }
            

            {show.city && <><div className={styles.specBlockHeader}> 
                {t('labels.city')}
              </div>
            <CityInput marker = "city" 
                       value = {city} 
                       onChange = {onCityChange} 
                       //placeholder={!theme.isDesktop ? "Город" : ""}
                        
            />
            {theme.isDesktop && <Divider/>}
            </>
            }
         
        
            <div className={styles.specBlockHeader}> 
                {t('headers.specialization')}
            </div>
            {!theme.isDesktop && 
                <CityInput 
                    marker="spec" 
                    value = {specialization} 
                    onChange = {onSpecSelectChange} 
                />}
            {theme.isDesktop && 
                <Radio.Group 
                    onChange={onSpecChange} 
                    value={specialization}>
                    
                    <Space direction="vertical">
                        {elements}
                    </Space>
                </Radio.Group>}
        
            {show.branch && <>
                { theme.isDesktop && <Divider/>}
                <div className={styles.specBlockHeader}> 
                    {t('headers.lawBranches')}
                </div>
                {!theme.isDesktop &&
                    <CityInput 
                        marker="branch" 
                        value = {branch} 
                        onChange = {onBranchSelectChange} 
                    />}
                {theme.isDesktop && branchs}
                
            </>}
            {show.budget && <>
                {theme.isDesktop && <Divider/>}
                <div className={styles.specBlockHeader}> 
                    {t('labels.budget')}
                </div>
                <InputSlider
                    maxValues={maxValues}
                    step={1000}
                    onChange = {onBudgetChange} 
                    value = {budget}
                    disabled={contr}
                />
                <Checkbox onChange={onCheckChange} 
                    checked={contr}
                    >По договоренности</Checkbox>  
            
            </>
            }

            {theme.isDesktop && <Button 
                size={theme?.size} 
                style={{
                 //   width: "100%", 
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "30px"
                }}
                type="primary" 
                htmlType="button"
                onClick = {onResetParams}
                
                >
                    {t('buttons.resetFilter')}
            </Button>}
                        
        </div>
       
      )

}
