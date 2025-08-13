import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
  drawerWidth: number;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, drawerWidth }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = (): void => {
    setAnchorEl(null);
  };

  const handleLogout = (): void => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
        ml: isMobile ? 0 : `${drawerWidth}px`,
        background: 'linear-gradient(90deg, #1f1f1f 0%, #2a2a2a 100%)',
        borderBottom: '1px solid rgba(245, 197, 66, 0.2)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon size={20} />
          </IconButton>
        )}

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, color: '#ffffff' }}
        >
          Dashboard
        </Typography>

        {user && (
          <Box className="flex items-center space-x-2">
            <Typography
              variant="body2"
              className="text-gray-300 hidden sm:block mr-2"
            >
              Welcome, {user.firstName}
            </Typography>
            
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'linear-gradient(135deg, #f5c542 0%, #eab308 100%)',
                  color: '#0a0a0a',
                  fontSize: '0.875rem',
                }}
              >
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </Avatar>
            </IconButton>

            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleProfileMenuClose}
              onClick={handleProfileMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  mt: 1.5,
                  bgcolor: '#2a2a2a',
                  border: '1px solid rgba(245, 197, 66, 0.2)',
                  '& .MuiMenuItem-root': {
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: 'rgba(245, 197, 66, 0.1)',
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <User className="mr-2" size={16} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogOut color={'red'} className="mr-2" size={16} />
                <Typography color={'red'}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};