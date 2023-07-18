import * as React from "react";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import PurchaseLoader from "./PurchaseLoader";
import axios from "axios";
import config from "../config";
import { useState, useEffect } from "react";

export default function Float() {
  //float state management
  const [float, setFloat] = useState("");
  // loading state management
  const [isLoading, setIsLoading] = useState(false);

  //fetch float from db
  const getFloat = async () => {
    const authTkn = sessionStorage.getItem("tkn");
    setIsLoading(true);
    try {
      await axios({
        method: "get",
        url: `${config.API_URL}/api/transaction/float`,
        headers: { Authorization: `${authTkn}` },
      }).then((response) => {
        const _response = response.data;
        setFloat(_response);
        setIsLoading(false);
      });
    } catch(error){
      setTimeout(function () {
        if (error) {
          return alert("Sorry!! couldn't fetch float :(");
          // console.log(error)
        }
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
      {isLoading ? (
        <PurchaseLoader />
      ) : (
        <Typography component="p" variant="h4" sx={{ color: "#1B3B57" }}>
          {/* TODO:  update message format to collect numerical values only, use string.split */}
          Ksh. {Number(float.balance || 0)?.toFixed(2)}
        </Typography>
      )}
    </React.Fragment>
  );
}
