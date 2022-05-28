//This component tracks revenue for the org.

//imports
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ProfitsTable from './ProfitsTable';


const Profits = () => {
    return (
       <>
        
       <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <div className="revenue-section">
       <h1 id="revenue-title">Revenue</h1>
        <div>
                <form className='revenue-form'>
                    <label>Start date :</label>
                    <input typeof="date"></input>    
                
                    <label>End date :</label>
                    <input typeof="date"></input>
                    <button id='reload-btn'>Reload</button>
                </form>
                <form className='export-section'>
                    <label>Export:</label>
                    <button>Excel</button>
                    <button>PDF</button>
                </form>
            
        </div>
       </div>
       <ProfitsTable/>
                </Paper>
              </Grid>
             
       </>
    )
}

export default Profits;