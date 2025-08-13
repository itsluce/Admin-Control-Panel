import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar, 
  useMediaQuery, 
  useTheme,
} from '@mui/material';
import { NumberWidgetCounter } from "../components/dashboard/NumberWidgetCounter.tsx";
import { SalesAnalyticsChart, ProductCategoriesChart } from '../components/dashboard/charts';
import { statsCards } from '../data/dashboardData.tsx';

const StatsCard = ({ card, isSmallScreen }: { card: any; isSmallScreen: boolean }) => {
  const iconSize = isSmallScreen ? 20 : 24;

  return React.cloneElement(card.iconComponent, { size: iconSize });
};

export const DashboardPage: React.FC = () => {

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        className="text-white font-bold"
      >
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} className={'mt-8'}>
        {statsCards.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 6 }}>
            <Card
              className="backdrop-blur-sm shadow-dark-lg hover:shadow-gold"
              sx={{
                backgroundColor: 'rgba(31, 31, 31, 0.8)',
                border: '1px solid rgba(245, 197, 66, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  border: '1px solid rgba(245, 197, 66, 0.3)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent className="p-6">
                <Box className="flex items-center justify-between">
                  <Box className="flex-1">
                    <Typography
                      variant="h3"
                      component="div"
                      className="flex text-white font-bold mb-1"
                    >
                      {card.prefix && <span>{card.prefix}</span>}
                      <NumberWidgetCounter value={card.value}/>
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-gray-400 mb-2"
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-green-400 font-semibold"
                    >
                      {card.change}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: card.color,
                      width: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                      ml: 2,
                    }}
                  >
                    <StatsCard card={card} isSmallScreen={isSmallScreen} />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} className="mt-6">
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            className="backdrop-blur-sm shadow-dark-lg"
            sx={{
              backgroundColor: 'rgba(31, 31, 31, 0.8)',
              border: '1px solid rgba(245, 197, 66, 0.1)',
              height: 400,
            }}
          >
            <CardContent className="p-6">
              <Typography
                variant="h6"
                component="h2"
                className="text-white font-semibold mb-4"
              >
                Sales Analytics
              </Typography>
              <SalesAnalyticsChart />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            className="backdrop-blur-sm shadow-dark-lg"
            sx={{
              backgroundColor: 'rgba(31, 31, 31, 0.8)',
              border: '1px solid rgba(245, 197, 66, 0.1)',
              height: 400,
            }}
          >
            <CardContent className="p-6">
              <Typography
                variant="h6"
                component="h2"
                className="text-white font-semibold mb-4"
              >
                Product Categories
              </Typography>
              <ProductCategoriesChart />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};