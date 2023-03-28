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
    try {
      await axios({
        method: "get",
        url: `${config.API_URL}/api/transaction/float`,
      })
       .then((response) => {
        const _response=response.data;
        // console.log(_response)
        setFloat(_response);
        return alert("Fetched float successfully!!");
      });
    } 
      catch (error) {
      return alert("Ooops!!! couldn't fetch float");
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
        {float.message}
      </Typography>
    </React.Fragment>
  );
}
 