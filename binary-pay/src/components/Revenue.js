import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';



export default function Revenue() {
  return (
    <React.Fragment>
      <Title>Total Revenue today</Title>
      <Typography component="p" variant="h4" sx={{color: "#1B3B57"}}>
        Ksh. 3,000
      </Typography>
     
    </React.Fragment>
  );
}