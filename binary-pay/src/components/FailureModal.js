import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#1B3B57',
  border: '1px solid #F3B500',
  boxShadow: 24,
  p: 4,
};

export default function FailureModal({openFailure,handleFailureClose}) {
 
  return (
    <div>
      
      <Modal
        open={openFailure}
        onClose={handleFailureClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color="white">
            Account Creation
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} color="white">
            Ooops!!! account not created, try a different username or check Passwords :(
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}