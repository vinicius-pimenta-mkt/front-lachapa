import React from 'react';
import { useLocation } from 'react-router-dom';
import './Sidebar.css';
import '../../styles/theme.css';
import { logout } from '../../config/api';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/pdv', icon: 'bi-cart-plus', label: 'PDV' },
    { path: '/kanban', icon: 'bi-kanban', label: 'Pedidos' },
    { path: '/reports', icon: 'bi-graph-up', label: 'Relatórios' },
    { path: '/settings', icon: 'bi-gear', label: 'Configurações' },
  ];

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src="/logo.png" alt="LaChapa PDV" className="sidebar-logo" onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=LC';
          }} />
          <h2>LaChapa PDV</h2>
          <button className="sidebar-close-mobile" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {navItems.map(item => (
              <li key={item.path} className={location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/') ? 'active' : ''}>
                <a href={item.path}>
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <a href="#" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left"></i>
            <span>Sair</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
