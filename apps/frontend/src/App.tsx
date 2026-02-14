import { useDispatch, useSelector } from "react-redux";

import { Outlet } from "react-router";
import type { AppDispatch, RootState } from "./redux/store";
import useNetworkStatus from "./hooks/useNetworkStatus";
import { useEffect } from "react";
import { setByValue } from "./redux/features/theme.slice";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state?.theme.value);
  const isOnline=useNetworkStatus();
  useEffect(()=>{
      const lightModeMediaQuery= window.matchMedia("(prefers-color-scheme: light)")
      const darkModeMediaQuery= window.matchMedia("(prefers-color-scheme: dark)")
      if(lightModeMediaQuery.matches){
        dispatch(setByValue("light"))
      }else if(darkModeMediaQuery.matches){
        dispatch(setByValue("dark"))
      };
    },[])
  return (
    <>
      <div data-theme={theme}>
        {isOnline?"":"No network connection"}
        <Outlet />
      </div>
    </>
  );
}

export default App;
