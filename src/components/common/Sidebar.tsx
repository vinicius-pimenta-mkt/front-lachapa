import React from 'react';
import './Sidebar.css';
import '../../styles/theme.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay para mobile */}
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
            <li>
              <a href="/dashboard">
                <i className="bi bi-speedometer2"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li className="active">
              <a href="/pdv">
                <i className="bi bi-cart-plus"></i>
                <span>PDV</span>
              </a>
            </li>
            <li>
              <a href="/kanban">
                <i className="bi bi-kanban"></i>
                <span>Pedidos</span>
              </a>
            </li>
            <li>
              <a href="/reports">
                <i className="bi bi-graph-up"></i>
                <span>Relatórios</span>
              </a>
            </li>
            <li>
              <a href="/settings">
                <i className="bi bi-gear"></i>
                <span>Configurações</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <a href="/logout">
            <i className="bi bi-box-arrow-left"></i>
            <span>Sair</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
