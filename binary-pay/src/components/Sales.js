import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';



export default function Sales() {
  return (
    <React.Fragment>
      <Title>Total Sales today</Title>
      <Typography component="p" variant="h4" sx={{color: "#1B3B57"}}>
        Ksh. 50,000
      </Typography>
    </React.Fragment>
  );
}