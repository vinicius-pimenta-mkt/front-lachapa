import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  return (
    <div className="main-layout">
      <Sidebar />
      
      <div className="main-content">
        <Header title={title} />
        
        <div className="content-container">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
