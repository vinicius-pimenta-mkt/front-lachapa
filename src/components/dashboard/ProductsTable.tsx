import React from 'react';
import './ProductsTable.css';

interface Product {
  id: number;
  name: string;
  quantity: number;
  revenue: number;
  percentage?: number;
}

interface ProductsTableProps {
  products: Product[];
  title?: string;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products, title = 'Produtos Mais Vendidos' }) => {
  return (
    <div className="products-table-container">
      <h3 className="products-table-title">{title}</h3>
      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Receita</th>
              {products.some(p => p.percentage !== undefined) && <th>%</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id || index}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.revenue)}</td>
                {product.percentage !== undefined && <td>{product.percentage}%</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;
