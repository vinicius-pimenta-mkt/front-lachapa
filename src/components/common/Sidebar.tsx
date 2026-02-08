import React from 'react';
import './Sidebar.css';
import '../../styles/theme.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="LaChapa PDV" className="sidebar-logo" />
        <h2>LaChapa PDV</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li className="active">
            <a href="/dashboard">
              <i className="bi bi-speedometer2"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
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
            <a href="/products">
              <i className="bi bi-box-seam"></i>
              <span>Produtos</span>
            </a>
          </li>
          <li>
            <a href="/customers">
              <i className="bi bi-people"></i>
              <span>Clientes</span>
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
  );
};

export default Sidebar;
