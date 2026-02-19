import type { RootState } from '../../redux/store';
import React from 'react'
import { useSelector } from 'react-redux';

function Home() {
    const theme = useSelector((state: RootState) => state.auth.value);
    console.log(theme);
  return (
    <div>Home</div>
  )
}

export default Home