import type { ReactNode } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './AppLayout.css';

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <Header />

      <div className="app-layout__body">
        <Sidebar />

        <main className="app-layout__content">{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;
