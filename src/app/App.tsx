import { Outlet } from 'react-router-dom';
import AppProviders from './providers';
import AppLayout from '../components/layout/AppLayout/AppLayout';

function App() {
  return (
    <AppProviders>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AppProviders>
  );
}

export default App;
