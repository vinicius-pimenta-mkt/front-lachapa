import React from 'react';
import './Header.css';
import '../../styles/theme.css';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="main-header">
      <div className="header-left">
        <button className="menu-toggle">
          <i className="bi bi-list"></i>
        </button>
        <h1>{title}</h1>
      </div>
      
      <div className="header-right">
        <div className="header-search">
          <input type="text" placeholder="Buscar..." />
          <button><i className="bi bi-search"></i></button>
        </div>
        
        <div className="header-actions">
          <button className="header-action-btn">
            <i className="bi bi-bell"></i>
            <span className="notification-badge">3</span>
          </button>
          
          <button className="header-action-btn">
            <i className="bi bi-printer"></i>
          </button>
          
          <div className="user-profile">
            <img src="/avatar.png" alt="Usuário" />
            <span>Admin</span>
            <i className="bi bi-chevron-down"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
