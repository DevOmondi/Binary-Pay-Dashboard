 import React from "react";
 import {useState} from "react"
 import { DataGrid } from "@mui/x-data-grid";
 import config from "../config";
 import Backdrop from "./BackDrop";

 const DataTable = ({rows,columns})=>{
  const [pageSize, setPageSize] = React.useState(10);
  const [isLoading, setIsLoading]= useState(false)
  const [failedList,setFailedList]= useState([])
  const [purchaseArray, setPurchaseArray] = useState([])

  // Pick ids of selected rows
  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    selectedRowsData.map((selectedRowData)=> {
      const selectedRowId = selectedRowData.id;
      setPurchaseArray([...purchaseArray,selectedRowId]);
    } )

  };
 //Filter Failed Transactions
  const getFailedTransactions = ()=>{
    const authTkn=sessionStorage.getItem("tkn");
    const failedTransactions= rows.filter(function(row){
      return row.statusComplete === false;
    })
    const failedTransactionsId=failedTransactions.map((failedTransaction)=> failedTransaction.id)
    setFailedList(failedTransactionsId);
    setIsLoading(true);
    fetch(`${config.API_URL}/api/transaction/bulk-purchase`,
    {
     method:"post",
     body: JSON.stringify(
       {
         transactions:failedTransactionsId
       }
     ),
     headers:{
      "Content-Type":"application/json",
      Authorization:`${authTkn}`
    }
    }  
   )
   .then((response)=>{
    if(response.status===200){
     setTimeout(function(){
      return alert("Purchase for selected numbers successful :)",handleAlertClick())
     },3000)
    }
    else{
      setTimeout(function(){
        return alert("Ow Snap!! looks like something went wrong :(",handleAlertClick())
       },3000)
   }
  }
)
   .catch((error)=>{
    // return alert("Sorry!! Looks like something went wrong :(",handleAlertClick() )
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
  //    }
  //    )
  //    .catch((error)=>{
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
              onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
              />
             </div>
         )
 }
 export default DataTable;