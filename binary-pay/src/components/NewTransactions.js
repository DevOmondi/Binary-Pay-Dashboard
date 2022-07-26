import * as React from 'react';
import axios from 'axios';
import {jsPDF} from "jspdf";
import 'jspdf-autotable';
import {useState} from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
var XLSX = require("xlsx");

const columns = [
  { id: 'date', label: 'Date', minWidth: 170 },
  { id: 'accountNumber', label: 'AccountNo', minWidth: 100 },
  {
    id: 'ref_no',
    label: 'Receipt',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'amount',
    label: 'Amount',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  }
];

 

export default function NewTransactions() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows,setRows] = useState([])

  const getTransactions =  async (e) => {
    e.preventDefault();
    try{
      const response = await axios.get(`http://localhost:5000/api/transaction/history`);
      const _data = response.data;
    console.log(_data);
    setRows(_data)
    }
    catch(error){
       console.log(error)
    }  
   
  }
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //exporting to excel sheet
 const downloadExcel = ()=>{
  const workSheet = XLSX.utils.json_to_sheet(rows);
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
    body:rows
  })
  doc.save("transactions.pdf");
}

 
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                    <button onClick={downloadPDF}>PDF</button>
                </form>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 100, 1000]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
