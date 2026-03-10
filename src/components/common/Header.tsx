import React from 'react';
import './Header.css';
import '../../styles/theme.css';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="main-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
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
            <img src="https://via.placeholder.com/32?text=A" alt="Usuário" />
            <span>Admin</span>
            <i className="bi bi-chevron-down"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
