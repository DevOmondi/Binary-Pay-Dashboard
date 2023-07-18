import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function PurchaseLoader() {
  return (
    <CircularProgress
      sx={{ mt: "6px", color: "#F3B500", mx: "auto", display: "block" }}
    />
  );
}
