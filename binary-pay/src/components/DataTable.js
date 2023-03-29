 import React from "react";
 import {useState} from "react"
 import { DataGrid } from "@mui/x-data-grid";
  import config from "../config";


 const DataTable = ({rows,columns})=>{
  const [pageSize, setPageSize] = React.useState(10);
  const [purchaseArray, setPurchaseArray] = useState([])
  
  // Pick ids of selected rows
  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    console.log(selectedRowsData);
    selectedRowsData.map((selectedRowData)=> {
      const selectedRowId = selectedRowData.id;
      console.log(selectedRowId)
      setPurchaseArray([...purchaseArray,selectedRowId]);

    } )

  };

  const getFailedTransactions = ()=>{
    const failedTransactions= rows.filter(function(row){
      return row.statusComplete === false;
    })
    console.log(failedTransactions);
  }
 
 console.log(purchaseArray);
  const makeBulkPurchase = (selectedRowIds)=>{
    fetch(`${config.API_URL}/api/transaction/bulk-purchase`,
           {
            method:"post",
            body: JSON.stringify(
              {
                transactions:selectedRowIds
              }
            ),
            headers:{"Content-Type":"application/json"}
           }   
    )
     .then((response)=>{
      console.log("bulk", response)
     }
     )
     .catch((error)=>{
      console.log("bulk error", error)
     }
      
     )
   }
  return (
             <>
              <button onClick={getFailedTransactions}>Select Failed</button>
              <button onClick={makeBulkPurchase}>Purchase</button>
              <DataGrid
               autoHeight
               checkboxSelection={true}
               rows={rows}
               columns={columns}
               pageSize={pageSize}
               onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
               rowsPerPageOptions={[10, 20, 100, 1000]}
               pagination
               disableSelectionOnClick
               experimentalFeatures={{ newEditingApi: true }}
               getRowId= {row => row.id}
              //  onSelectionModelChange={item=> console.log(item)}
              onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
              />
             </>
         )
 }
 export default DataTable;