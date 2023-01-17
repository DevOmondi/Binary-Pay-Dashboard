import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import axios from "axios";
import config from "../config";

const Purchase = () => {
  const services = {
    "Safaricom Airtime": { serviceID: 101, serviceCode: "SAFCOM" },
    "Airtel Airtime": { serviceID: 102, serviceCode: "AIRTEL" },
    "Telkom Airtime": { serviceID: 103, serviceCode: "TELKOM" },
    "KPLC Postpaid": { serviceID: 104, serviceCode: "KPLCPOSTPAID" },
    "KPLC Prepaid": { serviceID: 105, serviceCode: " KPLCPREPAID" },
  };
  const [accountNumber, setAccountNumber] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [payload, setPayload] = useState({});

  const changeServiceFunc = (event) => {
    const _service = event.target.value;

    setPayload({
      serviceCode: services[_service].serviceCode,
      serviceID: services[_service].serviceID.toString(),
    });
  };

  const purchaseHandler = (e) => {
    e.preventDefault();
    axios
      .post(`${config.API_URL}/api/transaction/purchase`, {
        accountNumber: accountNumber,
        amountPaid: amountPaid,
        serviceCode: payload.serviceCode,
        serviceID: payload.serviceID,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        return alert("Ooops!!! looks like something went wrong");
      });
  };

  return (
    <>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <div className="purchase-section">
            <h1 id="purchase-title">Manual purchase</h1>
            <div>
              <form className="purchase-form" onSubmit={purchaseHandler}>
                <label>Phone number :</label>
                <input
                  typeof="number"
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="254xxxxxxxxx"
                ></input>

                <label htmlFor="services">Type of Service:</label>
                <select
                  id="services"
                  onChange={changeServiceFunc}
                  defaultValue=""
                >
                  <option value="" hidden disabled>
                    --select service--
                  </option>
                  {Object.keys(services).map((_service) => (
                    <option key={_service} value={_service}>
                      {_service}
                    </option>
                  ))}
                </select>

                <label id="amount-txt">Amount :</label>
                <input
                  typeof="number"
                  onChange={(e) => setAmountPaid(e.target.value)}
                ></input>
                <button id="purchase-btn" type="submit">
                  Purchase
                </button>
              </form>
            </div>
          </div>
        </Paper>
      </Grid>
    </>
  );
};
export default Purchase;
