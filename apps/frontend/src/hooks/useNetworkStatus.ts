import React, { useEffect } from 'react'

function useNetworkStatus() {
  const [isOnline,setIsOnline]=React.useState(navigator.onLine);
  useEffect(()=>{
    const handelOnline=()=>setIsOnline(true);
    const handelOffline=()=>setIsOnline(false);

    window.addEventListener('online',handelOnline);
    window.addEventListener('offline',handelOffline);
    return ()=>{
        window.removeEventListener('online',handelOnline);
        window.removeEventListener('offline',handelOffline);
    }
  },[])
  return isOnline;
}

export default useNetworkStatus