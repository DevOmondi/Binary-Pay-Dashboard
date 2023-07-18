import React from "react";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import config from "../config";
import Backdrop from "./BackDrop";

const DataTable = ({ rows, columns }) => {
  const [pageSize, setPageSize] = React.useState(10);
  const [isLoading, setIsLoading] = useState(false);
  // const [failedList,setFailedList]= useState([])
  const [purchaseArray, setPurchaseArray] = useState([]);

  // Pick ids of selected rows
  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    // console.log(selectedRowsData);
    const selectedRowsId = selectedRowsData.map(
      (selectedRowData) => selectedRowData.id
    );
    // console.log(selectedRowsId);
    selectedRowsId.map((_id) => {
      if (selectedRowsId.includes(_id)) {
        const newArray = purchaseArray.filter(
          (_purchaseId) => _purchaseId !== _id
        );
        setPurchaseArray(selectedRowsId);
      } else {
        setPurchaseArray([...new Set([...purchaseArray, _id])]);
      }
    });

    // console.log(selectedRowsId);
    // return selectedRowsId;
  };
  // console.log("purchase array:", purchaseArray);
  //Filter Failed Transactions
  //   const getFailedTransactions = ()=>{
  //     const authTkn=sessionStorage.getItem("tkn");
  //     const failedTransactions= rows.filter(function(row){
  //       return row.statusComplete === false;
  //     })
  //     const failedTransactionsId=failedTransactions.map((failedTransaction)=> failedTransaction.id)
  //     setFailedList(failedTransactionsId);
  //     setIsLoading(true);
  //     fetch(`${config.API_URL}/api/transaction/bulk-purchase`,
  //     {
  //      method:"post",
  //      body: JSON.stringify(
  //        {
  //          transactions:failedTransactionsId
  //        }
  //      ),
  //      headers:{
  //       "Content-Type":"application/json",
  //       Authorization:`${authTkn}`
  //     }
  //     }
  //    )
  //    .then((response)=>{
  //     if(response.status===200){
  //      setTimeout(function(){
  //       return alert("Purchase for selected numbers successful :)",handleAlertClick())
  //      },3000)
  //     }
  //     else{
  //       setTimeout(function(){
  //         return alert("Ow Snap!! looks like something went wrong :(",handleAlertClick())
  //        },3000)
  //    }
  //   }
  // )
  //    .catch((error)=>{
  //     // return alert("Sorry!! Looks like something went wrong :(",handleAlertClick() )
  //    }

  //    )
  //   //  TODO: func to stop loader
  //   const handleAlertClick = ()=>{
  //     setIsLoading(false)
  //     setFailedList([]);
  //   }
  //   }

  const makeBulkPurchase = () => {
    const authTkn = sessionStorage.getItem("tkn");
    setIsLoading(true);
    fetch(`${config.API_URL}/api/transaction/bulk-purchase`, {
      method: "post",
      body: JSON.stringify({
        transactions: purchaseArray,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authTkn}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setTimeout(function () {
            return alert(
              "Purchase for selected numbers successful :)",
              handleAlertClick()
            );
          }, 3000);
        } else {
          setTimeout(function () {
            return alert(
              "Ow Snap!! looks like something went wrong :(",
              handleAlertClick()
            );
          }, 3000);
        }
      })
      // .catch((error) => {console.log("bulk purchase error",error)});
      .catch((error) => {
        setTimeout(function () {
          return alert(
            "Ow Snap!!! looks like something went wrong :(",
            handleAlertClick()
          );
        }, 3000);
      });
    //  TODO: func to stop loader
    const handleAlertClick = () => {
      setPurchaseArray([]);
      setIsLoading(false);
      // setFailedList([]);
    };
  };
  console.log("purchase array:", purchaseArray);
  return (
    <div>
      {/* <button 
              // onClick={getFailedTransactions} 
              id="bulk-purchase-btn">
                Select Failed & Purchase
              </button> */}
      <button id="bulk-purchase-btn" onClick={makeBulkPurchase}>
        Purchase For Selected
      </button>
      {isLoading && <Backdrop />}
      <DataGrid
        autoHeight
        checkboxSelection={true}
        isRowSelectable={(params) => !params.row.statusComplete}
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 20, 100, 1000]}
        pagination
        //  disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        getRowId={(row) => row.id}
        //  selectionModel={failedList}
        onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
      />
    </div>
  );
};
export default DataTable;
