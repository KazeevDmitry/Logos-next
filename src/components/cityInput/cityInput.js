import { useThemeContext } from "../../context/themeContext";
import { Select } from "antd";



export default function CityInput({value, onChange, marker="city", width="100%", placeholder}) {
   
    const theme = useThemeContext();
 
    
 
    const SPECIALIZATION = theme?.spec?? [];
    const CITYOBJ = theme?.cities?? [];
    const BRANCHES = theme?.branches?? [];
    const PAYMENTS = theme?.payments?? [];
 

   const onThisChange = (newvalue) => {
 
      onChange?.(newvalue);
   };
 
   const elements = marker === "spec" ? 
   SPECIALIZATION.map((item) => 
       <Select.Option key={item.id} value={+item.id}>{item.attributes.name}</Select.Option>
     ) : (marker ===  "city" ? 
     CITYOBJ.map(( item, index) => {
       const { region, city } = item;
       const cityStr = `${city}  ${region}`;
       return(
        <Select.Option key={index} value={+item.id} title ={cityStr}>{city}</Select.Option>
       );
     }
     ) : (marker === "payment" ? PAYMENTS.map((item) => {
        return <Select.Option key={item.id} value={+item.id}>{item.attributes.name}</Select.Option>;
      }) : 
      BRANCHES.map((item) => {
        
        return <Select.Option key={item.id} value={+item.id}>{item.attributes.name}</Select.Option>;
       }))
     );
 
   return (
     <Select
       showSearch
       style = {{width: width}}
       placeholder={placeholder?? ''}
       optionFilterProp="children"
       value={value ? +value : null}
       onChange={onThisChange}
       size={theme?.size}
       filterOption={(input, option) =>
         option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
       }
       filterSort={(optionA, optionB) =>
         optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
       }
     
     >
       { elements }
     </Select>
   );
 }