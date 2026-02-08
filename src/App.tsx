import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/theme.css';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import PDV from './pages/pdv/PDV';
import Kanban from './pages/kanban/Kanban';
import Settings from './pages/settings/Settings';
import Reports from './pages/reports/Reports';

const App: React.FC = () => {
  // Simulação de autenticação - em um ambiente real, isso seria verificado com o backend
  // Desativado temporariamente para permitir acesso direto ao dashboard para testes locais

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        {/* Rota principal agora é o Dashboard para testes locais */
        /* <Route 
          path="/" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        /> */}
        <Route 
          path="/pdv" 
          element={<PDV />} 
        />
        <Route 
          path="/kanban" 
          element={<Kanban />} 
        />
        <Route 
          path="/settings" 
          element={<Settings />} 
        />
        <Route 
          path="/reports" 
          element={<Reports />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
        {/* Rotas de autenticação original:
        <Route 
          path="/" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/pdv" 
          element={isAuthenticated ? <PDV /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/kanban" 
          element={isAuthenticated ? <Kanban /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/settings" 
          element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/reports" 
          element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} 
        />
        */}
      </Routes>
    </Router>
  );
};

export default App;
