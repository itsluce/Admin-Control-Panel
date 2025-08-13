import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    Avatar,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {Package, ShoppingCart, Users, LayoutDashboard} from 'lucide-react';
import {useNavigate, useLocation} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
    drawerWidth: number;
}

const menuItems = [
    {text: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/dashboard'},
    {text: 'Products', icon: <Package size={20}/>, path: '/products'},
    {text: 'Orders', icon: <ShoppingCart size={20}/>, path: '/orders'},
    {text: 'Users', icon: <Users size={20}/>, path: '/users'},
];

export const Sidebar: React.FC<SidebarProps> = ({open, onClose, drawerWidth}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {user} = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleMenuClick = (path: string): void => {
        navigate(path);
        if (isMobile) {
            onClose();
        }
    };

    const sidebarContent = (
        <Box
            sx={{
                height: '100%',
                background: 'linear-gradient(180deg, #1f1f1f 0%, #0a0a0a 100%)',
                borderRight: '1px solid rgba(245, 197, 66, 0.2)',
            }}
            className={'flex flex-col justify-between'}
        >
            <Box>
                <Box className="p-6 text-center border-b border-gray-700">
                    <Typography
                        variant="h5"
                        component="div"
                        className="font-bold"
                        sx={{
                            background: 'linear-gradient(135deg, #f5c542 0%, #eab308 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Admin Portal
                    </Typography>
                    <Typography variant="caption" className="text-gray-400 mt-4">
                        E-commerce Control Panel
                    </Typography>
                </Box>

                {/* User Profile Section */}
                {user && (
                    <Box className="p-4 border-b border-gray-700">
                        <Box className="flex items-center space-x-3">
                            <Avatar
                                sx={{
                                    bgcolor: 'linear-gradient(135deg, #f5c542 0%, #eab308 100%)',
                                    color: '#0a0a0a',
                                    width: 40,
                                    height: 40,
                                }}
                            >
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </Avatar>
                            <Box className="flex-1 min-w-0">
                                <Typography
                                    variant="subtitle2"
                                    className="text-white font-medium truncate"
                                >
                                    {user.firstName} {user.lastName}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    className="text-gray-400 truncate block"
                                >
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}

                {/* Navigation Menu */}
                <Box className="flex-1 py-4">
                    <List>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;

                            return (
                                <ListItem key={item.text} disablePadding className="px-2">
                                    <ListItemButton
                                        onClick={() => handleMenuClick(item.path)}
                                        className={`rounded-lg mx-2 mb-1 ${
                                            isActive ? 'bg-gold-500 bg-opacity-20' : 'hover:bg-gray-800'
                                        }`}
                                        sx={{
                                            minHeight: 48,
                                            color: isActive ? '#f5c542' : '#ffffff',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transform: 'translateX(0px)',
                                            '&:hover': {
                                                backgroundColor: isActive
                                                    ? 'rgba(245, 197, 66, 0.25)'
                                                    : 'rgba(255, 255, 255, 0.05)',
                                                transform: 'translateX(8px)',
                                                boxShadow: isActive
                                                    ? '0 4px 12px rgba(245, 197, 66, 0.3)'
                                                    : '0 4px 12px rgba(255, 255, 255, 0.1)',
                                            },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 40,
                                                color: isActive ? '#f5c542' : '#9ca3af',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                transform: 'scale(1)',
                                                '.MuiListItemButton-root:hover &': {
                                                    transform: 'scale(1.1)',
                                                    color: isActive ? '#f5c542' : '#ffffff',
                                                },
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                fontSize: '0.875rem',
                                                fontWeight: isActive ? 600 : 400,
                                            }}
                                            sx={{
                                                '& .MuiTypography-root': {
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                },
                                                '.MuiListItemButton-root:hover & .MuiTypography-root': {
                                                    fontWeight: isActive ? 600 : 500,
                                                },
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            </Box>
            {/* Footer */}
            <Box className="p-4 border-t border-gray-700 flex justify-center">
                <Typography variant="caption" className="text-gray-500 text-center block">
                    © 2024 Admin Portal
                </Typography>
            </Box>
        </Box>
    );

    return (
        <>
            {isMobile ? (
                <Drawer
                    variant="temporary"
                    anchor="left"
                    open={open}
                    onClose={onClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    {sidebarContent}
                </Drawer>
            ) : (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    {sidebarContent}
                </Drawer>
            )}
        </>
    );
};