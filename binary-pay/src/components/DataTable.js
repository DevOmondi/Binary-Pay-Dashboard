 import React from "react";
 import {useState} from "react"
 import { DataGrid } from "@mui/x-data-grid";
 import config from "../config";
import Backdrop from "./BackDrop";
//  import PurchaseLoader from "./PurchaseLoader";

 


 const DataTable = ({rows,columns})=>{
  const [pageSize, setPageSize] = React.useState(10);
  const [isLoading, setIsLoading]= useState(false)
  const [failedList,setFailedList]= useState([])
  const [purchaseArray, setPurchaseArray] = useState([])

  //Create loading conte
  
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
  console.log(purchaseArray); //log array of selected rows ids
 //Filter Failed Transactions
  const getFailedTransactions = ()=>{
    const failedTransactions= rows.filter(function(row){
      return row.statusComplete === false;
    })
    console.log(failedTransactions);
    const failedTransaction=failedTransactions.map((failedTransaction)=> failedTransaction.id)
    console.log(failedTransaction);
    setFailedList(failedTransaction);
    setIsLoading(true);
    fetch(`${config.API_URL}/api/transaction/bulk-purchase`,
    {
     method:"post",
     body: JSON.stringify(
       {
         transactions:failedTransaction
       }
     ),
     headers:{"Content-Type":"application/json"}
    }  
   )
   .then((response)=>{
    console.log("bulk", response)
    if(response.status===200){
      return alert("Purchase for selected numbers successful :)",handleAlertClick())
    }
   }
   )
   .catch((error)=>{
    console.log("bulk error", error)
    return alert("Sorry!! Looks like something went wrong :(",handleAlertClick() )
   }
    
   )
  //  TODO: func to stop loader
  const handleAlertClick = ()=>{
    setIsLoading(false)
    setFailedList([]);
  }
  }
 
  // const makeBulkPurchase = (selectedRowIds)=>{
  //   fetch(`${config.API_URL}/api/transaction/bulk-purchase`,
  //          {
  //           method:"post",
  //           body: JSON.stringify(
  //             {
  //               transactions:selectedRowIds
  //             }
  //           ),
  //           headers:{"Content-Type":"application/json"}
  //          }   
  //   )
  //    .then((response)=>{
  //     console.log("bulk", response)
  //    }
  //    )
  //    .catch((error)=>{
  //     console.log("bulk error", error)
  //    }
      
  //    )
  //  }
  return (
             <div>
              <button 
              onClick={getFailedTransactions} 
              id="bulk-purchase-btn">
                Select Failed & Purchase
              </button>
              {isLoading && <Backdrop/>}
              {/* <button onClick={makeBulkPurchase}>Purchase For Selected</button> */}
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
               selectionModel={failedList}
              //  onSelectionModelChange={item=> console.log(item)}
              onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
              />
             </div>
         )
 }
 export default DataTable;