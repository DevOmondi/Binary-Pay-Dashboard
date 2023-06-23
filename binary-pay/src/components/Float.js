import * as React from "react";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import axios from "axios";
import config from "../config";
import { useState, useEffect } from "react";

export default function Float() {
  //float state management
  const [float, setFloat] = useState("");

  //fetch float from db
  const getFloat = async () => {
    const authTkn = sessionStorage.getItem("tkn");
    try {
      await axios({
        method: "get",
        url: `${config.API_URL}/api/transaction/float`,
        headers: { Authorization: `${authTkn}` },
      }).then((response) => {
        const _response = response.data;
        setFloat(_response);
      });
    } catch (error) {
      setTimeout(function () {
        return alert("Fetched float successfully!!");
      }, 5000);
    }
  };
  // Fetch float on page load
  useEffect(() => {
    getFloat();
  }, []);
  return (
    <React.Fragment>
      <Title>Current Total Float</Title>
      <Typography component="p" variant="h4" sx={{ color: "#1B3B57" }}>
        {/* TODO:  update message format to collect numerical values only, use string.split */}
        {Number(float.balance)?.toFixed(2)}
        {console.log("float balance:", float.balance, float.balance?.toFixed(2))}
      </Typography>
    </React.Fragment>
  );
}
