import React, {useEffect, useState} from 'react';
import styles from './sideFilter.module.less';
import {useThemeContext} from '../../context/themeContext';
import { Button, Radio, Space, Divider, Checkbox } from 'antd';
import CityInput from '../cityInput/cityInput'; 
import InputSlider from '../input-slider/input-slider';
import { useRouter } from "next/router";
import { useTranslation } from 'react-i18next';
import BranchSelect from '../branchSelect/branchSelect';


export default function  SideFilter({show = {
    city: false,
    budget: false,
    branch: true,
    spec: true,
    showreset: true,
}}) {

    const {t} = useTranslation()
        const router = useRouter();
    const theme = useThemeContext();  
    const SPECS = theme.spec;
    const BRANCHES = theme.branches;

    const [branchValue, setBranchValue] = useState();

    const maxValues=[1000, 500000];
    
    const {branch, specialization, city, budgetmin, budgetmax, contractual, subbranch} = router.query;
 
    const budget = !contractual && budgetmin && budgetmax ? {inp1: budgetmin, inp2: budgetmax} : null; 

    // BRANCHES.map((item) => {
    //     if()
    // } )

    useEffect(() => {
        const currBranch = BRANCHES.find(item => item.id === parseInt(branch));

        let currBranchValue = '';
        let cSub = null;
        
            if (currBranch) {
               currBranchValue = currBranch.attributes.name;
                if (subbranch) {
                    cSub = currBranch.attributes.subbranches.data.find(item => item.id === parseInt(subbranch));
            
                    if (cSub) {
                        currBranchValue=cSub.attributes.name;
                    }
                }
            }
        setBranchValue(currBranchValue);
        
      }, [theme]);


         
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

    const onBranchChange = (value) => {
        if (!value.branch_id)
            delete router.query.branch;
        else
            router.query.branch = value.branch_id;
        if (!value.subbranch_id)
            delete router.query.subbranch;    
        else
            router.query.subbranch = value.subbranch_id; 
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
         delete router.query.subbranch
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


    const contr = contractual === 'true' ? true : false;



    const pad = `${theme?.gutters?.gorizontal[theme?.id]}px`;

      return (

        <div className={styles.specBlock} style= {{padding: !theme.isDesktop ? "20px" : pad, marginBottom: pad}}>
            {!theme.isDesktop && <div className={styles.flexCont}>
                <div className={styles.filterHeader}> Фильтр </div>
                {<Button 
                    size={theme?.size} 
                    //style={{width: "100%", marginTop: "30px"}}
                    type="primary" 
                    htmlType="button"
                    onClick = {onResetParams}
                    ghost
                    >
                       Сбросить
                </Button>}
            </div>    }
            {theme.isDesktop &&
                <div style={{fontSize: "22px", lineHeight: "22px", fontWeight: "550", marginBottom: pad}}> Фильтр </div>
            }
            

            {show.city && <><div className={styles.specBlockHeader}> 
                {t('labels.city')}
              </div>
            <CityInput marker = "city" 
                       value = {city} 
                       onChange = {onCityChange} 
                       //placeholder={!theme.isDesktop ? "Город" : ""}
                        
            />
           {/*  {theme.isDesktop && <Divider/>} */}
            </>
            }
         
        
            {show.spec && <>
            <div className={styles.specBlockHeader}> 
                {t('headers.specialization')}
            </div>
           {/*  {!theme.isDesktop &&  */}
                <CityInput 
                    marker="spec" 
                    value = {specialization} 
                    onChange = {onSpecSelectChange} 
                />
            </>}
               

 {/* ВРЕМЕННО УБРАЛ---------------------------------------------------------------------------------------------------
             {theme.isDesktop && 
                <Radio.Group 
                    onChange={onSpecChange} 
                    value={specialization}>
                    
                    <Space direction="vertical">
                        {elements}
                    </Space>
                </Radio.Group>}
            </>}

 */}
            {show.branch && <>
                {/* { theme.isDesktop && <Divider/>} */}
                <div className={styles.specBlockHeader} 
                    style = {{
                        marginTop: "30px",
                        borderTop: "1px solid lightgrey",
                        paddingTop: "20px",
                        }}> 
                    Отрасль права
                </div>
                
                <BranchSelect
                      onChange={onBranchChange}
                      value={branchValue}
                      //value="налогообложение"
                      size={theme.size}
                    />  
                
            </>}
            {show.budget && <>
                {/* {theme.isDesktop && <Divider/>} */}
                <div className={styles.specBlockHeader} 
                     style = {{
                        marginTop: "30px",
                        borderTop: "1px solid lightgrey",
                        paddingTop: "20px",
                        }}> 
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

            {theme.isDesktop && show.showreset && 
            <Button 
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
                ghost
                >
                    {t('buttons.resetFilter')}
            </Button>}
                        
        </div>
       
      )

}


export function AskQuestionSideBlock ({style}) {

   const router = useRouter();
    const theme = useThemeContext();  
    
    return (
        
       <div className={styles.specBlock} style={style}> 
            <span style={{fontSize: "22px", lineHeight: "22px", fontWeight: "600",textAlign: "center"}}>
                Задайте бесплатный вопрос специалистам портала
            </span>
                
            <Button 
                type="primary"
                onClick={() => router.push("/addquestion")}
                size={theme.size}
                style={{marginTop : style?.padding, width: "100%"}}
            >
                Задать вопрос
            </Button>
        </div> 
    )
}