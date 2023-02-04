import React, { useRef, useEffect, useState } from 'react';


import {useThemeContext} from '../../context/themeContext';

import { TreeSelect } from 'antd';

export default function BranchSelect({onChange, errorStatus}) {

    
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


    

      const [value, setValue] = useState();

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
          value={value}
          dropdownStyle={{
            maxHeight: 400,
            overflow: 'auto',
          }}
          placeholder="Начните ввод для поиска"
          allowClear
          treeDefaultExpandAll
          treeData={treeData}
          size='large'
          onChange={onThisChange}
          status={errorStatus ? "error" : null}
        />
      
      );
    };
