/*import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';


export default function Float() {
  return (
    <React.Fragment>
      <Title>Current Total Float</Title>
      <Typography component="p" variant="h4" sx={{color: "#1B3B57"}}>
        Ksh. 10,000
      </Typography>
     
    </React.Fragment>
  );
}*/

import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import axios from "axios";
import config from '../config';
import { useState,useEffect } from 'react';



export default function Float() {
  //float state management
   const [float,setFloat] = useState(null)

  //fetch float from db
  const getFloat = async ()=>{
    try{
       await axios({
        method: "get",
        url: `${config.API_URL}/api/transaction/float`
       }
      )
       .then(response =>{
         const _response = response.data;
         setFloat(_response);
         return alert("Fetched float successfully!!")
       })
    }
    catch(error){
      return alert("Ooops!!! couldn't fetch float")
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