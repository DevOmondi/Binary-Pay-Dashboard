import * as React from "react";
import {TokenContext} from "../App";
import { useState,useContext} from "react";
import {useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "../Website_logo.svg";
import config from "../config";


function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Binary Pay
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

//Sign in component
export default function SignIn() {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const navigate = useNavigate();
  
  //context logic
  const tokenContext=useContext(TokenContext)
  console.log("some :", tokenContext);

  const signInHandler = (e) => {
    e.preventDefault();
    fetch
      (`${config.API_URL}/api/auth/login`,
       {
        method: "post",
        body:JSON.stringify( 
          {
            username: userName,
            password: passWord,
          }
        ),
        headers: {"Content-Type":"application/json"}
       }
      )
      .then((response) => {
        if (response) {
          console.log(response)
          console.log("token :",response?.headers.get("authorization"));
          if (response.data && response?.data?.errorMessage) {
            return alert(response?.data?.errorMessage);
          }
         /*  if (response.data){
            console.log(response.data.);
          } */
          //storing token in local storage
          const jwtToken=response?.headers?.get("authorization");
          // console.log(jwtToken)
          // localStorage.setItem("token",jwtToken);
          //  //retrieve stored token
          //  const storedToken=localStorage.getItem("token");
          //  if(storedToken){
          //   console.log(storedToken);
            tokenContext.setToken(jwtToken);
          //  }
           if(response.status===200){
            navigate("/dashboard", { replace: true });
            return alert("Welcome!! successfully logged in :)")
           }
           else{
            navigate("/", { replace: true });
            return alert("Sorry!! couldn't log you in :(")
           }
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        if (error?.response?.data) alert(error?.response?.data?.errorMessage);
      });
  };
  console.log(tokenContext);
 
  return (
    <>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img 
           src={Logo} 
           alt="binary-pay-logo"
           ></img>
          <Avatar sx={{ m: 1, bgcolor: "#F3B500", color: "#1B3B57" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={signInHandler}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(e) => setUserName(e.target.value)}
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
              onChange={(e) => setPassWord(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#1B3B57" }}
              onClick={signInHandler}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/forgot-password" variant="body2">
                  {"Forgot Password? Click here"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  </>
  )};



