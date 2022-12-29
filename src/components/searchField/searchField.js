import React, {useState, useEffect}from 'react';
import { useRouter } from 'next/router';
import { Input} from 'antd';
import styles from "./searchField.module.less";
import { SearchOutlined } from '@ant-design/icons';

import {useThemeContext} from '../../context/themeContext'



export default function SearchField ({placeholder = '', style, resetPage=true}) {

    const router = useRouter();

    const [value, setValue] = useState();
    
    const {size, elementHeight} = useThemeContext();

    const search = router.search;
   
    const onInputChange = (e) => {
        const nV = e.target.value;
        setValue(nV);
        if (nV ==='') {
            delete router.query.search 
            router.query.page = 1
            const url = {
                pathname: router.pathname,
                query: router.query
              }
          router.push(url, undefined, { shallow: true })
          }
    };

    const onSearch = () => {
        if (value && value !== '') {
            router.query.search = encodeURI(value)
           if (resetPage) {
             router.query.page = 1;
           }
           const url = {
            pathname: router.pathname,
            query: router.query
          }
      router.push(url, undefined, { shallow: true })

        }
        
      };

      useEffect(() => {
        if (router.query.search) {
          setValue(decodeURI(router.query.search));
        }
      }, [router.query.search]); 


    return (
        < div className={styles.wrapper} style = {style}>
            <Input size = {size} 
                   style = {{width: '100%'}} 
                   onChange={onInputChange} 
                   onPressEnter={onSearch} 
                   value = {value} 
                   placeholder={placeholder} 
                 //  defaultValue={defaultValue ?? search}
                   bordered= {false}
                />
            <div 
                className = {value?.length>0 ? styles.blueIcon : ''}
                style={{width: elementHeight, 
                         height: elementHeight, 
                         display: 'flex', 
                         justifyContent: 'center', 
                         alignItems: 'center',
                         cursor: 'pointer'}}
                onClick={onSearch}        

                >
              <SearchOutlined 
                   style={{fontSize: '24px'}}
                    
                />
            </div>              
        </div>        
    )
}