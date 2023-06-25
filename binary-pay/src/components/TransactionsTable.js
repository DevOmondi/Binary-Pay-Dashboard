import * as React from "react";
import DataTable from "./DataTable";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Box from "@mui/material/Box";
import axios from "axios";
import config from "../config";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
var XLSX = require("xlsx");

const columns = [
  {
    field: "updatedAt",
    headerName: "DATE",
    valueGetter: ({ value }) => {
      // extract the date and time to display
      const dateObject = new Date(value.toString());
      const transYear = dateObject.getFullYear();
      const transMonth = dateObject.getMonth() + 1;
      const transDate = dateObject.getDate();
      const transHour = dateObject.getHours();
      const transMinute = dateObject.getMinutes();
      const fullTransDate = `${transDate}/${transMonth}/${transYear} at ${
        transHour > 12 ? transHour % 12 : transHour
      }:${transMinute < 10 ? "0" : ""}${transMinute} ${
        transHour >= 12 ? "PM" : "AM"
      }`;
      // console.log(fullTransDate);
      return fullTransDate;
    },
    width: 170,
  },
  {
    field: "ref",
    headerName: "REF",
    width: 140,
  },
  {
    field: "accountNumber",
    headerName: "Phone Number",
    width: 140,
    editable: true,
  },
  {
    field: "amount",
    headerName: "Amount",
    editable: true,
    maxWidth: 100,
  },
  {
    field: "statusComplete",
    headerName: "Purchase successful?",
    width: 160,
    editable: true,
  },
  {
    field: "response",
    headerName: "Message",
    width: 300,
    editable: true,
    valueGetter: ({ value }) => (value?.message ? value.message : ""),
  },
];

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [transactionDatesArray, setTransactionDatesArray] = useState([]);
  const [startDate, setStartDate] = useState(dayjs("2023-01-01T00:01"));
  const [endDate, setEndDate] = useState(dayjs("2023-12-31T23:59"));

  const getTransactions = async () => {
    const authTkn = sessionStorage.getItem("tkn");
    // console.log("session: ", authTkn);
    // e.preventDefault();
    try {
      const response = await axios.get(
        `${config.API_URL}/api/transaction/history`,
        { headers: { Authorization: `${authTkn}` } }
      );
      const _data = response.data;
      // console.log(_data);
      // getTimestamps();
      setTransactions(_data);
      setTimeout(function () {
        return alert("Fetched Transactions successfully :)");
      }, 3000);
    } catch (error) {
      console.log(error);
      setTimeout(function () {
        return alert("Ooops!! looks like something went wrong :(");
      }, 3000);
    }
  };

  // TODO: Fetch Transactions on page load
  useEffect(() => {
    getTransactions();
  }, []);

  //exporting to excel sheet
  const downloadExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(transactions);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "Transactions");
    //buffer
    XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });

    //binary
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    //download
    XLSX.writeFile(workBook, "TransactionsData.xlsx");
  };

  //exporting to pdf
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction Details", 20, 10);

    doc.autoTable({
      columns: columns.map((col) => ({ ...col, dataKey: col.id })),
      body: transactions,
    });
    doc.save("transactions.pdf");
  };

  function getFilteredTransactions(e) {
    e.preventDefault();
    const filteredTransactions = transactions.filter(
      (transaction) =>
        new Date(transaction.updatedAt.toString()).getTime() >=
          startDate.$d.getTime() &&
        new Date(transaction.updatedAt.toString()).getTime() <=
          endDate.$d.getTime()
      // console.log(new Date((transaction.updatedAt).toString()).getTime())
      // console.log(new Date((transaction.updatedAt)).getMilliseconds())
    );
    console.log(filteredTransactions);
    setTransactions(filteredTransactions);
    console.log("Start date:", startDate.$d);
    console.log("End date:", endDate.$d);
  }

  return (
    <Box sx={{ height: 800, width: "100%" }}>
      <h1 id="transactions-title">Transactions</h1>
      <form className="revenue-form">
        <label>Start date :</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
        </LocalizationProvider>

        <label>End date :</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
        </LocalizationProvider>

        <button id="reload-btn" onClick={getFilteredTransactions}>
          Reload
        </button>
      </form>
      <form className="export-section">
        <label>Export:</label>
        <button onClick={downloadExcel}>Excel</button>
        <button onClick={downloadPDF}>PDF</button>
      </form>
      <DataTable rows={transactions} columns={columns} />
    </Box>
  );
}
