import * as React from 'react';
import DataTable from './DataTable';
import Box from '@mui/material/Box';
import axios from 'axios';
import config from "../config";
import { Button } from '@mui/material';
import { useState } from 'react';
import {jsPDF} from "jspdf";
import 'jspdf-autotable';
var XLSX = require("xlsx");





const columns = [
  { field: '_id', headerName: 'ID', width: 220 },
  {
    field: 'accountNumber',
    headerName: 'Phone Number',
    width: 160,
    editable: true,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 110,
    editable: true,
  },
  {
    field: 'date',
    headerName: 'Date',
    type: 'date',
    width: 160,
    editable: true,
  },
  {
    field: 'Reverse',
    renderCell: (cellValues)=> {
      return (
        <Button
        variant='contained'
        color='primary'
        onClick={event => {
        //  handleClick(event,cellValues)
         }
       }
        >
         Reverse
        </Button>
      )
    },
    width:110
  },
  {
    field: 'Purchase',
    renderCell: (cellValues)=> {
      return (
        <Button
        variant='contained'
        color='primary'
        onClick={event => {
        //  handleClick(event,cellValues)
         }
       }
        >
         Purchase
        </Button>
      )
    }
  }
];


export default function TransactionsTable() {
  const [transactions,setTransactions] = useState([])

 const getTransactions =  async (e) => {
    e.preventDefault();
    try{
      const response = await axios.get(`${config.API_URL}/api/transaction/history`);
      const _data = response.data;
    console.log(_data);
    setTransactions(_data)
    }
    catch(error){
       console.log(error)
    }  
   
  }

   //exporting to excel sheet
 const downloadExcel = ()=>{
  const workSheet = XLSX.utils.json_to_sheet(transactions);
  const workBook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workBook,workSheet,"Transactions");
  //buffer
 XLSX.write(workBook,{bookType:"xlsx",type:"buffer"});

  //binary
  XLSX.write(workBook,{bookType:"xlsx", type:"binary"});
  //download
  XLSX.writeFile(workBook,"TransactionsData.xlsx")
}

//exporting to pdf
const downloadPDF = () => {
 const doc = new jsPDF();
 doc.text("Transaction Details",20,10);

 doc.autoTable({
    columns:columns.map(col => ({...col,dataKey:col.id})),
    body:transactions
  })
  doc.save("transactions.pdf");
}

  
  return (
    <Box sx={{ height: 800, width: '100%' }}>
      <h1 id="transactions-title">Transactions</h1>
       <form className='revenue-form'>
                    <label>Start date :</label>
                    <input typeof="date"></input>    
                
                    <label>End date :</label>
                    <input typeof="date"></input>
                    <button id='reload-btn' onClick={getTransactions}>Reload</button>
        </form>
        <form className='export-section'>
                    <label>Export:</label>
                    <button onClick={downloadExcel}>Excel</button>
                    <button  onClick={downloadPDF}>PDF</button>
                </form>
      <DataTable
        rows={transactions}
        columns={columns}
        
      />
    </Box>
  );
}
