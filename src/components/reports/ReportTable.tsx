import React from 'react';
import './ReportTable.css';

interface ReportTableProps {
  data: any[];
  columns: {
    key: string;
    header: string;
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  title?: string;
  emptyMessage?: string;
}

const ReportTable: React.FC<ReportTableProps> = ({ 
  data, 
  columns, 
  title,
  emptyMessage = 'Nenhum dado disponível'
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="report-table-container">
        {title && <h3 className="report-table-title">{title}</h3>}
        <div className="report-table-empty">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="report-table-container">
      {title && <h3 className="report-table-title">{title}</h3>}
      <div className="report-table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;
