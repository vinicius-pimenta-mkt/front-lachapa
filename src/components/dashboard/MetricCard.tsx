import React from 'react';
import './MetricCard.css';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  color = 'primary',
  isLoading = false
}) => {
  return (
    <div className={`metric-card ${color} ${isLoading ? 'loading' : ''}`}>
      <div className="metric-card-content">
        <div className="metric-card-header">
          <h3 className="metric-card-title">{title}</h3>
          {icon && <div className="metric-card-icon">{icon}</div>}
        </div>
        <div className="metric-card-value">{isLoading ? '...' : value}</div>
        {change && (
          <div className={`metric-card-change ${change.isPositive ? 'positive' : 'negative'}`}>
            {isLoading ? '...' : `${change.isPositive ? '↑' : '↓'} ${Math.abs(change.value)}%`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
