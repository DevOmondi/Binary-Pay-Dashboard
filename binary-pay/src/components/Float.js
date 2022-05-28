import * as React from 'react';
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
}