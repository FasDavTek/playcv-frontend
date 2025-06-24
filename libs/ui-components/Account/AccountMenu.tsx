import React, { useState } from 'react';
import { 
  Avatar, 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Typography,
  Box,
  Modal
} from '@mui/material';
import { 
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
  SwapHoriz as SwapHorizIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoutModal from '../Layout/LogoutModal';
import { SESSION_STORAGE_KEYS } from '../../../libs/utils/sessionStorage';
import { useTokenExpiration } from '../../utils/helpers/useTokenExpiration';

interface Account {
  id: string;
  name: string;
  email: string;
  avatar: string;
  userType: string;
}

interface AccountMenuProps {
  currentAccount: Account;
  accounts: Account[];
  onSwitchAccount: (account: Account) => void;
  onSignOut?: () => void;
}

const AccountPreview: React.FC<{ account: Account }> = ({ account }) => (
  <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
    <Avatar src={account.avatar} alt={account.name} />
    <Box>
      <Typography variant="subtitle1" className='text-neutral-300'>{account.name}</Typography>
      <Typography variant="body2" className='text-neutral-300'>{account.email}</Typography>
    </Box>
  </Box>
);

export const AccountMenu: React.FC<AccountMenuProps> = ({
  accounts,
  onSwitchAccount,
  onSignOut,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { authState, logout } = useAuth();

  useTokenExpiration();

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
  const isAuthenticated = authState.isAuthenticated && token;

  const currentUser = authState.user;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const viewProfile = () => {
    handleClose();
    const currentPath = location.pathname;
    const baseRoute = currentPath.split('/').slice(0, 2).join('/');
    if (baseRoute !== '/admin') {
      navigate(`${baseRoute}/profile`);
    }
  };


  const handleLogout = () => {
    setIsLogoutModalOpen(true);
    handleClose();
  };

  const confirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/auth/login');
  };


  if (!isAuthenticated || !currentUser) {
    navigate('/');
    return null;
  };


  const currentAccount: Account = {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email || '',
    avatar: '/path/to/default/avatar.png',
    userType: currentUser.userTypeId === 1 ? 'Admin' : currentUser.userTypeId === 2 ? 'Employer' : 'Professional'
  };



  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'left',
          gap: 2,
          py: { xs: 0.3, md: 1 },
          px: { xs: 0.3, md: 2 },
          borderRadius: { xs: 100, md: 3 },
          backgroundColor: theme.palette.background.paper,
          minWidth: 'auto',
        //   '&:hover': {
        //     backgroundColor: theme.palette.action.hover,
        //   },
        }}
      >
        <Avatar src={currentAccount.avatar} alt={currentAccount.name} />
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Typography variant="subtitle2" className='text-neutral-300 capitalize'>{currentAccount.name}</Typography>
          <Typography variant="subtitle2" className='text-neutral-300 capitalize'>{currentAccount.userType}</Typography>
        </Box>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.32))',
            mt: 1,
            borderRadius: 3,
            '& .MuiAvatar-root': {
              width: 32,
              height: { xs: 40, md: 32 },
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <AccountPreview account={currentAccount} />
        <Divider />
        <MenuItem 
          onClick={viewProfile}
          sx={{
            '&:hover': {
              backgroundColor: 'grey',
              '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: 'common.white',
              },
              marginX: 0.35,
              borderRadius: 1,
            },
            py: 1,
            mt: 0.5,
          }}
        >
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText className='text-neutral-300'>Profile</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem 
            onClick={handleLogout}
            sx={{
                '&:hover': {
                  backgroundColor: 'grey',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: 'common.white',
                  },
                  marginX: 0.35,
                  borderRadius: 1,
                },
              }}
        >
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText className='text-neutral-300'>Sign out</ListItemText>
        </MenuItem>
      </Menu>
      <Modal open={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)}>
        <>
          <LogoutModal onClose={() => setIsLogoutModalOpen(false)} onLogout={confirmLogout} />
        </>
      </Modal>
    </>
  );
};