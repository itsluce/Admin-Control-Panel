import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const DRAWER_WIDTH = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1f1f1f 50%, #0a0a0a 100%)',
      }}
    >
      <Header onMenuClick={handleDrawerToggle} drawerWidth={DRAWER_WIDTH} />
      
      <Sidebar
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        drawerWidth={DRAWER_WIDTH}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`,
          minHeight: '100vh',
          background: 'transparent',
        }}
      >

        <Box sx={{ height: 64 }} />

        <Box
          sx={{
            background: 'transparent',
            p: { xs: 2, sm: 4, md: 6 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};