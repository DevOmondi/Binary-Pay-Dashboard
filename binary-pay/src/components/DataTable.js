 import React from "react";
 import { DataGrid } from "@mui/x-data-grid";
 import config from "../config";

 const DataTable = ({rows,columns})=>{
  const [pageSize, setPageSize] = React.useState(10);
  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    console.log(selectedRowsData);
    const selectedRowIds= selectedRowsData.map(selectedRowId => {
      console.log(selectedRowId.id);
    })
  };

  // const makeBulkPurchase = ()=>{
  //   fetch(`${config.API_URL}/api/transaction/bulk-purchase`,
  //          {
  //           method:"post",
  //           body: JSON.stringify(
  //             {
  //               transactions:selectedRowsData
  //             }
  //           )
  //          }   
  //   )
  // // }
  return (
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
         )
 }
 export default DataTable;