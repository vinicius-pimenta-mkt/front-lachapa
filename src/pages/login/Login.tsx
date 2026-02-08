import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/theme.css';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulação de login - em produção, seria uma chamada à API
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulando credenciais para teste
      // Credenciais esperadas: admin@lachapa.com / 123456
      if (username === 'admin@lachapa.com' && password === '123456') {
        // Redirecionar para o dashboard
        navigate('/dashboard');
      } else {
        setError('Usuário ou senha inválidos');
      }
    } catch (err) {
      setError('Erro ao conectar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card animate-slide-up">
        <div className="login-logo">
          <img src="/logo.png" alt="LaChapa PDV" />
          <h1>LaChapa PDV</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <div className="input-with-icon">
              <i className="bi bi-person"></i>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-with-icon">
              <i className="bi bi-lock"></i>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                disabled={isLoading}
              />
              <label htmlFor="remember">Lembrar-me</label>
            </div>
            <a href="#" className="forgot-password">Esqueci minha senha</a>
          </div>
          
          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>© 2025 LaChapa PDV - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
