import {Package, ShoppingCart, TrendingUp, Users} from "lucide-react";

export const statsCards = [
  {
    title: 'Total Products',
    value: 156,
    change: '+12% from last month',
    iconComponent: <Package />,
    color: '#f5c542',
  },
  {
    title: 'Total Orders',
    value: 2847,
    change: '+18% from last month',
    iconComponent: <ShoppingCart />,
    color: '#10b981',
  },
  {
    title: 'Total Users',
    value: 1245,
    change: '+8% from last month',
    iconComponent: <Users />,
    color: '#3b82f6',
  },
  {
    title: 'Total Sales',
    value: 84126,
    change: '+23% from last month',
    iconComponent: <TrendingUp />,
    color: '#8b5cf6',
    prefix: '$',
  },
];