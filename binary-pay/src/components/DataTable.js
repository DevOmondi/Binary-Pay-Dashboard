 import React from "react";
 import { DataGrid } from "@mui/x-data-grid";
 
 
 const DataTable = ({rows,columns})=> {
   const [pageSize, setPageSize] = React.useState(10);
           return(
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
               />
          )
 }

 export default DataTable;