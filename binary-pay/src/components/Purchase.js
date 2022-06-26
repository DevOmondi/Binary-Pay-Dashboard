import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import axios from "axios";

const Purchase = () => {
   const [accountNumber,setAccountNumber] = useState("");
   const [amountPaid, setAmountPaid] = useState("");
   const [serviceCode, setServiceCode] = useState("");

   

   const purchaseHandler = (e)=> {
      e.preventDefault();
      axios.post(
         `http://localhost:5000/api/transaction/purchase`,
         {
            accountNumber:accountNumber,
            amountPaid:amountPaid,
            serviceCode:serviceCode
         }
      )
      .then(response => {
         console.log(response)
       })
       .catch(error => {
         console.log(error)
       })
   };


    return(
     <>
        <Grid item xs={12}>
             <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                 <div className="purchase-section">
                    <h1 id="purchase-title">Manual purchase</h1>
                       <div>
                          <form className='purchase-form' onSubmit={purchaseHandler}>
                             <label>Phone number :</label>
                             <input typeof="number" onChange={(e) => setAccountNumber(e.target.value)}></input> 

                             <label htmlFor='services'>Type of Service:</label>
                               <select id="services" onChange={(e) => setServiceCode(e.target.value)}>
                                 <option selected value="" hidden disabled>--select service--</option>
                                 <option value="SAFCOM">SAFCOM</option>
                                 <option value="AIRTEL">AIRTEL</option>
                                 <option value="TELKOM">TELKOM</option>
                               </select>

                             <label id="amount-txt">Amount :</label>
                             <input typeof="number" onChange={(e) => setAmountPaid(e.target.value)}></input>
                             <button 
                             id='purchase-btn'
                             value = "submit"
                             >
                              Purchase
                             </button>
                          </form>
                        </div>
                 </div>
            </Paper>
        </Grid>     
     </>
    )
};
  export default Purchase;