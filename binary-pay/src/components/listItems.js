import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MoneyIcon from  '@mui/icons-material/Money';
import AddBoxIcon from  '@mui/icons-material/AddBox';
import LogoutIcon from "@mui/icons-material/Logout"
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from '@mui/material';
import axios from 'axios';
import config from "../config";


/* TODO: Logout function */
const logOutHandler=()=>{
   axios
       .get(`${config.API_URL}/api/auth/logout`)
       .then(res => {
        console.log(res.data);
        /* return alert(res.data) */
       })
      }
export const mainListItems = (
  <React.Fragment>
   <Link id='Dashboard-link' href='#'>
      <ListItemButton>
      <ListItemIcon>
        <DashboardIcon className='icon'/>
      </ListItemIcon>
      <ListItemText 
      primary="Dashboard"
       />
      </ListItemButton>
    </Link>
    <Link id='Transactions-link' href='#'>
      <ListItemButton>
      <ListItemIcon>
        <MoneyIcon className='icon'/>
      </ListItemIcon>
      <ListItemText 
      primary="Transactions"
       />
      </ListItemButton>
    </Link>
    <Link id='RegisterUser-link' href='/admin-register'>
     <ListItemButton>
      <ListItemIcon>
        <AddBoxIcon className='icon'/>
      </ListItemIcon>
      <ListItemText 
      primary="Register User"
       />
     </ListItemButton>
    </Link>
    <Link id='Settings-link' href='/settings'>
     <ListItemButton>
      <ListItemIcon>
        <SettingsIcon className='icon'/>
      </ListItemIcon>
      <ListItemText 
      primary="Settings"
       />
     </ListItemButton>
    </Link>
    <Link id='Logout-link' onClick={logOutHandler}>
     <ListItemButton>
      <ListItemIcon>
        <LogoutIcon className='icon'/>
      </ListItemIcon>
      <ListItemText 
      primary="Log Out"
       />
     </ListItemButton>
    </Link>
  </React.Fragment>
);