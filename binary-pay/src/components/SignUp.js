import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SuccessModal from './SuccessModal';
import FailureModal from './FailureModal';
import Logo from "../Website_logo.svg";
import axios from "axios";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        Binary Pay
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {
  //form state management
  const [registerUsername,setRegisterUsername] = useState("");
  const [registerPassword,setRegisterPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  //modal state management
  const [showSuccessModal,setShowSuccessModal] = useState(false);
  const [showFailureModal,setShowFailureModal] = useState(false);
  //state setting functions
  const handleClose = () => setShowSuccessModal(false)
  const handleFailureClose = () => setShowFailureModal(false)
  //sign up handler
  const signUpHandler = (e) => {
    e.preventDefault();
  
   axios.post(
    `http://localhost:5000/auth/register`,
   {
    username:registerUsername,
    password:registerPassword,
    cPassword:confirmPassword
   })
   .then( response => {
    if (response.status === 201) {
      setShowSuccessModal(true)
    } 
    else if(response.status !== 201) {
    setShowFailureModal(true)
    }
   })
  .catch(error => {
    console.log(error)
  })
   
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >  
          <img src={Logo} alt= "binary-pay-logo"></img>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={signUpHandler} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={e => setRegisterUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={e => setRegisterPassword(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="cPassword"
              label="Confirm Password"
              type="password"
              id="cPassword"
              autoComplete="current-password"
              onChange={e => setConfirmPassword(e.target.value)}
            />
           
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#1B3B57" }}
             
            >
              Sign Up
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
        <SuccessModal open={showSuccessModal} handleClose={handleClose}/>
        <FailureModal openFailure={showFailureModal} handleFailureClose={handleFailureClose}/>
      </Container>
    </ThemeProvider>
    
  );
}