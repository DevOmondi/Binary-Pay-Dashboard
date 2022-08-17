import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const Purchase = () => {
    return(
     <>
        <Grid item xs={12}>
             <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                 <div className="purchase-section">
                    <h1 id="purchase-title">Manual purchase</h1>
                       <div>
                          <form className='purchase-form'>
                             <label>Phone number :</label>
                             <input typeof="number"></input> 

                             <label htmlFor='services'>Type of Service:</label>
                               <select id="services">
                                 <option selected value="" hidden disabled>--select service--</option>
                                 <option value="Safaricom Airtime">SAFCOM</option>
                                 <option value="Airtel Airtime">AIRTEL</option>
                                 <option value="Telkom Airtime">TELKOM</option>
                               </select>

                             <label id="amount-txt">Amount :</label>
                             <input typeof="number"></input>
                             <button id='purchase-btn'>Purchase</button>
                          </form>
                        </div>
                 </div>
            </Paper>
        </Grid>     
     </>
    )
};
  export default Purchase;