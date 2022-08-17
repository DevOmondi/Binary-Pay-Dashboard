import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


// Generate Transactions Data
function createData(id,date,accountNo,Receipt,Amount,Commission) {
  return { id, date, accountNo, Receipt, Amount, Commission };
}

const rows = [
  createData(
    0,
    '16 Mar, 2019',
    "0796178227",
    'QTY45L3Y',
    'Ksh. 100',
    "Ksh. 50",
  ),
 
];



export default function Transactions() {
  return (
    <React.Fragment>
       <h1 id="transactions-title">Transactions</h1>
       <form className='transactions-form'>
             <label htmlFor='transactions'>Type of Transaction:</label>
             <select id="transactions">
               <option selected value="" hidden disabled>--select transaction--</option>
               <option value="Failed">Failed/Pending</option>
               <option value="Successful">Successful</option>
             </select>
             <label htmlFor='entries'>No. of Entries:</label>
             <select id="entries">
               <option selected value="" hidden disabled>20</option>
               <option value="10">10</option>
               <option value="20">20</option>
               <option value="100">100</option>
               <option value="1000">1000</option>
             </select>
       </form>
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
     
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Account Number</TableCell>
            <TableCell>Receipt</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell align="right">Commission</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.accountNo}</TableCell>
              <TableCell>{row.Receipt}</TableCell>
              <TableCell>{row.Amount}</TableCell>
              <TableCell align="right">{`$${row.Commission}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </React.Fragment>
  );
}
