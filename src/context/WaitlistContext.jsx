import {createContext,useContext,useState} from 'react';
const C=createContext();
export const WaitlistProvider=({children})=>{
const [open,setOpen]=useState(false);
return <C.Provider value={{open,setOpen}}>{children}</C.Provider>
};
export const useWaitlist=()=>useContext(C);
