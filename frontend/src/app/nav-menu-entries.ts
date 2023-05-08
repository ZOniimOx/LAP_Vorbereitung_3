import { HomeComponent } from './components/home/home.component';
import { OrderOverviewComponent } from './components/order-overview/order-overview.component';

export const navEntries: {
  text: string;
  icon: string;
  link: string;
  component: any;
}[] = [
  {
    text: 'Home',
    icon: 'k-i-home',
    link: '/home',
    component: HomeComponent,
  },
  {
    text: 'Order-Overview',
    icon: 'k-i-table',
    link: '/order-overview',
    component: OrderOverviewComponent,
  },
];
