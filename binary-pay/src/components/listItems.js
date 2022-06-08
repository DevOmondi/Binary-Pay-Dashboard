import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MoneyIcon from '@mui/icons-material/Money';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from '@mui/material';

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
  </React.Fragment>
);