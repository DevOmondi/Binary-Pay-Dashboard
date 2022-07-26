import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import axios from "axios";
import { useState,useEffect } from 'react';


export default function Float() {
   const [float,setFloat] = useState(null)
  //fetch float from db
  const getFloat = async ()=>{
    try{
      const response = await axios.get(`http://localhost:5000/api/transaction/float`)
      const _data = response.data;
       console.log(_data);
       setFloat(_data)
    }
    catch(error){
      console.log(error)
    }
  }
  useEffect(()=>{
     getFloat();
  },[])
  return (
    <React.Fragment>
      <Title>Current Total Float</Title>
      <Typography component="p" variant="h4" sx={{color: "#1B3B57"}}>
        {float}
      </Typography>
     
    </React.Fragment>
  );
}