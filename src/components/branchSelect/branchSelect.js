import React, { useRef, useEffect, useState } from 'react';


import {useThemeContext} from '../../context/themeContext';

import { TreeSelect } from 'antd';

export default function BranchSelect({value, onChange, errorStatus, size}) {

    
const {branches} = useThemeContext();

let treeData = [];

   (branches || []).map(item => {
        
        const value=item.attributes.name;
        let children = [];
        item.attributes.subbranches.data.map(sub => {
                const subBr = {value: sub.attributes.name,  title: sub.attributes.name};
                children = [...children, subBr];
                })
        const itemData =  {
            value : value,
            title : value.toUpperCase(),
            children: children
        }       
        treeData=[...treeData, itemData]
        });


    

      const [thisValue, setValue] = useState(value);

      useEffect(() => {
        setValue(value)
      }, [value]);

      const onThisChange = (newValue) => {

        let brId = null;
        brId = branches.find(item => item.attributes.name === newValue)?.id?? null;
        let subID = null;
        if (!brId) {
            branches.map(item => {
                const bb = item.attributes.subbranches.data.find(sub => sub.attributes.name === newValue);
                if (bb) {
                    subID=bb.id;
                    brId=item.id;
                }
        }
            
        )};
       const res = {branch_id: brId, subbranch_id: subID};
       
       onChange(res);

        setValue(newValue);

     };



     return (
              
        <TreeSelect
          showSearch
          style={{
            width: '100%',
          }}
          value={thisValue}
          dropdownStyle={{
            maxHeight: 400,
            overflow: 'auto',
          }}
          placeholder="Начните ввод для поиска"
          treeDefaultExpandAll
          treeData={treeData}
          onChange={onThisChange}
          status={errorStatus ? "error" : null}
          allowClear
          size={size}
        />
      
      );
    };
