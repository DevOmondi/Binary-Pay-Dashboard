import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import PurchaseLoader from './PurchaseLoader';
// import Button from '@mui/material/Button';

export default function SimpleBackdrop() {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };
//   const handleToggle = () => {
//     setOpen(!open);
//   };

  return (
    <div>
      {/* <Button onClick={handleToggle}>Show backdrop</Button> */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <PurchaseLoader/>
      </Backdrop>
    </div>
  );
}