import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


// Generate Revenue Data
function createData(id, date,totalSales, Profit) {
  return { id, date, totalSales, Profit};
}

const rows = [
  createData(
    0,
    '16 Mar, 2019',
    "Ksh. 100,000",
    "Ksh. 6,000",
  ),
  createData(
    1,
    '16 Mar, 2020',
    'Ksh. 150,000',
    'Ksh. 10,000',
    866.99,
  )
];



export default function ProfitsTable() {
  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Total sales</TableCell>
            <TableCell>Profit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.totalSales}</TableCell>
              <TableCell>{row.Profit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
     
    </React.Fragment>
  );
}
