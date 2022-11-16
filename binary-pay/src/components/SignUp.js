import * as React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "../Website_logo.svg";
import axios from "axios";
import config from "../config";
import { storeToken } from "../utilities/utilityFunctions";

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

export default function SignUp() {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  // console.log("loc: ", location);

  const signUpHandler = (e) => {
    e.preventDefault();

    axios
      .post(`${config.API_URL}/api/auth/register`, {
        username: registerUsername,
        password: registerPassword,
        cPassword: confirmPassword,
      })
      .then((response) => {
        if (response) {
          console.log(response);
          if (response.data && response.data.errorMessage) {
            return alert(response.data.errorMessage);
          }
          if (response.data) alert(response.data.message);
          if (response.headers) storeToken(response.headers.authorization);
          navigate("/dashboard", { replace: true });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data) alert(error.response.data.errorMessage);
      });
  };

  return (
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
          <img src={Logo} alt="binary-pay-logo"></img>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={signUpHandler}
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
              onChange={(e) => setRegisterUsername(e.target.value)}
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
              onChange={(e) => setRegisterPassword(e.target.value)}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#1B3B57" }}
              onClick={signUpHandler}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/" variant="body2">
                  {"Already have an account? Log In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
