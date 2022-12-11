import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import useMediaQuery from '../../utils/useMediaQuery';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  let sharedState = {/* whatever you want */}

  let [spec, setSpec] = useState([]);
  let [branches, setBranch] = useState([]);
  let [cities, setCities] = useState([]);

  const gutters = {gorizontal: {xs: 10, sm: 10, md: 15, lg: 20, xl: 30,  xxl: 40},
  vertical: {xs: 10, sm: 10, md: 15, lg: 20, xl: 30,  xxl: 40}}


let sizes = [{ id: "xs",
query: '(max-width:575px)',
size: "middle",
elementHeight: 32,
gutters: gutters,

isDesktop: false,
appContainerPadding: 0
},
{ id: "sm",
query: '(min-width: 576px) and (max-width: 767px)',
size: "middle",
elementHeight: 32,
gutters: gutters,

isDesktop: false,
appContainerPadding: 0
},
{ id: "md",
query: '(min-width: 768px) and (max-width: 991px)',
size: "middle",
elementHeight: 32,
gutters: gutters,

isDesktop: true,
appContainerPadding: 20
},
{ id: "lg",
query: '(min-width: 992px) and (max-width: 1200px)',
size: "middle",
elementHeight: 32,
gutters: gutters,

isDesktop: true,
appContainerPadding: 30
},
{ id: "xl",
query: '(min-width: 1201px) and (max-width: 1600px)',
size: "large",
elementHeight: 40,
gutters: gutters,

isDesktop: true,
appContainerPadding: 50
},
{ id: "xxl",
query: '(min-width: 1601px)',
size: "large",
elementHeight: 40,
gutters: gutters,

isDesktop: true,
appContainerPadding: 50
},
];


const curr = sizes.filter(item => useMediaQuery(item.query));

  async function getSpec() {
     
      await axios.get(`${process.env.NEXT_PUBLIC_API}/specializations`)
      .then((res)=> res.data)
      .then((res) => {
        setSpec(res.data)
      })
      .catch((e) => console.log('ERROR spec from themeContext', e));
      
      
    }
    async function getBranches() {
      
      await axios.get(`${process.env.NEXT_PUBLIC_API}/branches`)
      .then((res)=> res.data)
      .then((res) => {
        setBranch(res.data)
      })
      .catch((e) => console.log('ERROR branches from themeContext', e));
     
         
    }

    async function getCities() {

      const way = `${process.env.NEXT_PUBLIC_UPLOADS_API}/uploads/russia_indexed_6713615a5a_8f47a8f68f.json`;

      await axios.get(way)
       .then((res) => {
        setCities(res.data)
      })
      .catch((e) => console.log('ERROR CANt get cities    themeContext', e));
      
    }  

    useEffect(() => {
      getSpec();
      getBranches();
      getCities();
    }, []); 


const theme = {...curr[0], branches, spec, cities};


return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}