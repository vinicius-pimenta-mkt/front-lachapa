import React, { useState } from 'react';
import './PDV.css';
import '../../styles/theme.css';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';

// Tipos
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  notes: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
}

const PDV: React.FC = () => {
  // Estados
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [productNotes, setProductNotes] = useState<string>('');

  // Dados simulados
  const categories = [
    { id: 'all', name: 'Todos', icon: 'bi-grid' },
    { id: 'burgers', name: 'Hambúrgueres', icon: 'bi-egg-fried' },
    { id: 'drinks', name: 'Bebidas', icon: 'bi-cup-straw' },
    { id: 'sides', name: 'Acompanhamentos', icon: 'bi-basket' },
    { id: 'desserts', name: 'Sobremesas', icon: 'bi-cake' },
    { id: 'combos', name: 'Combos', icon: 'bi-box' }
  ];

  const products: Product[] = [
    { id: 1, name: 'X-Tudo', price: 25.90, image: '/products/x-tudo.jpg', category: 'burgers' },
    { id: 2, name: 'X-Salada', price: 18.90, image: '/products/x-salada.jpg', category: 'burgers' },
    { id: 3, name: 'X-Bacon', price: 22.90, image: '/products/x-bacon.jpg', category: 'burgers' },
    { id: 4, name: 'Refrigerante Lata', price: 6.00, image: '/products/refrigerante.jpg', category: 'drinks' },
    { id: 5, name: 'Suco Natural', price: 8.00, image: '/products/suco.jpg', category: 'drinks' },
    { id: 6, name: 'Batata Frita P', price: 10.00, image: '/products/batata-p.jpg', category: 'sides' },
    { id: 7, name: 'Batata Frita M', price: 15.00, image: '/products/batata-m.jpg', category: 'sides' },
    { id: 8, name: 'Batata Frita G', price: 20.00, image: '/products/batata-g.jpg', category: 'sides' },
    { id: 9, name: 'Sorvete', price: 8.00, image: '/products/sorvete.jpg', category: 'desserts' },
    { id: 10, name: 'Combo 1', price: 35.90, image: '/products/combo1.jpg', category: 'combos' },
    { id: 11, name: 'Combo 2', price: 45.90, image: '/products/combo2.jpg', category: 'combos' },
    { id: 12, name: 'Combo Família', price: 65.90, image: '/products/combo-familia.jpg', category: 'combos' }
  ];

  // Filtragem de produtos
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cálculos do pedido
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% de taxa
  const total = subtotal + tax;

  // Handlers
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setProductQuantity(1);
    setProductNotes('');
    setShowProductModal(true);
  };

  const handleAddToOrder = () => {
    if (!selectedProduct) return;
    
    const existingItemIndex = orderItems.findIndex(item => 
      item.productId === selectedProduct.id && item.notes === productNotes
    );
    
    if (existingItemIndex >= 0) {
      // Atualizar item existente
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += productQuantity;
      setOrderItems(updatedItems);
    } else {
      // Adicionar novo item
      const newItem: OrderItem = {
        id: Date.now(),
        productId: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: productQuantity,
        notes: productNotes
      };
      setOrderItems([...orderItems, newItem]);
    }
    
    setShowProductModal(false);
  };

  const handleRemoveItem = (itemId: number) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setOrderItems(orderItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleFinishOrder = () => {
    // Aqui seria a integração com a impressora e backend
    alert(`Pedido finalizado! Total: R$ ${total.toFixed(2)}`);
    setOrderItems([]);
    setSelectedCustomer(null);
    setPaymentMethod('');
    setNotes('');
  };

  return (
    <div className="pdv-container">
      <Sidebar />
      
      <div className="pdv-content">
        <Header title="PDV - Registro de Pedidos" />
        
        <div className="pdv-grid">
          {/* Coluna esquerda - Produtos */}
          <div className="pdv-products-column">
            {/* Busca de produtos */}
            <div className="pdv-search">
              <input 
                type="text" 
                placeholder="Buscar produto..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button><i className="bi bi-search"></i></button>
            </div>
            
            {/* Categorias */}
            <div className="pdv-categories">
              {categories.map(category => (
                <button 
                  key={category.id}
                  className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <i className={`bi ${category.icon}`}></i>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
            
            {/* Lista de produtos */}
            <div className="pdv-products-grid">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="product-card"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-price">R$ {product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Coluna direita - Pedido atual */}
          <div className="pdv-order-column">
            <div className="order-header">
              <h2>Pedido Atual</h2>
              <button className="btn-clear" onClick={() => setOrderItems([])}>
                <i className="bi bi-trash"></i> Limpar
              </button>
            </div>
            
            {/* Cliente */}
            <div className="order-customer">
              <h3>Cliente</h3>
              {selectedCustomer ? (
                <div className="selected-customer">
                  <div>
                    <p><strong>{selectedCustomer.name}</strong></p>
                    <p>{selectedCustomer.phone}</p>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)}>
                    <i className="bi bi-x-circle"></i>
                  </button>
                </div>
              ) : (
                <button className="btn-select-customer">
                  <i className="bi bi-person-plus"></i> Selecionar Cliente
                </button>
              )}
            </div>
            
            {/* Itens do pedido */}
            <div className="order-items">
              <h3>Itens</h3>
              {orderItems.length === 0 ? (
                <div className="empty-order">
                  <i className="bi bi-cart"></i>
                  <p>Nenhum item adicionado</p>
                </div>
              ) : (
                <ul className="order-items-list">
                  {orderItems.map(item => (
                    <li key={item.id} className="order-item">
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        {item.notes && <p className="item-notes">{item.notes}</p>}
                        <p className="item-price">R$ {item.price.toFixed(2)}</p>
                      </div>
                      <div className="item-actions">
                        <div className="quantity-control">
                          <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                        <p className="item-subtotal">R$ {(item.price * item.quantity).toFixed(2)}</p>
                        <button className="btn-remove" onClick={() => handleRemoveItem(item.id)}>
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Observações */}
            <div className="order-notes">
              <h3>Observações</h3>
              <textarea 
                placeholder="Observações gerais do pedido..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
            
            {/* Totais */}
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Taxa de serviço (5%)</span>
                <span>R$ {tax.toFixed(2)}</span>
              </div>
              <div className="total-row total">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Pagamento */}
            <div className="order-payment">
              <h3>Forma de Pagamento</h3>
              <div className="payment-options">
                <button 
                  className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <i className="bi bi-cash"></i>
                  <span>Dinheiro</span>
                </button>
                <button 
                  className={`payment-option ${paymentMethod === 'credit' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('credit')}
                >
                  <i className="bi bi-credit-card"></i>
                  <span>Crédito</span>
                </button>
                <button 
                  className={`payment-option ${paymentMethod === 'debit' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('debit')}
                >
                  <i className="bi bi-credit-card-2-front"></i>
                  <span>Débito</span>
                </button>
                <button 
                  className={`payment-option ${paymentMethod === 'pix' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('pix')}
                >
                  <i className="bi bi-qr-code"></i>
                  <span>PIX</span>
                </button>
              </div>
            </div>
            
            {/* Botões de ação */}
            <div className="order-actions">
              <button className="btn-save">
                <i className="bi bi-save"></i> Salvar Pedido
              </button>
              <button 
                className="btn-finish"
                disabled={orderItems.length === 0 || !paymentMethod}
                onClick={handleFinishOrder}
              >
                <i className="bi bi-check-circle"></i> Finalizar e Imprimir
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de adição de produto */}
      {showProductModal && selectedProduct && (
        <div className="product-modal-overlay">
          <div className="product-modal">
            <div className="modal-header">
              <h2>Adicionar Item</h2>
              <button onClick={() => setShowProductModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="product-details">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
                <div>
                  <h3>{selectedProduct.name}</h3>
                  <p className="product-price">R$ {selectedProduct.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="product-quantity">
                <h4>Quantidade</h4>
                <div className="quantity-control">
                  <button 
                    onClick={() => setProductQuantity(prev => Math.max(1, prev - 1))}
                  >-</button>
                  <span>{productQuantity}</span>
                  <button 
                    onClick={() => setProductQuantity(prev => prev + 1)}
                  >+</button>
                </div>
              </div>
              
              <div className="product-notes">
                <h4>Observações</h4>
                <textarea 
                  placeholder="Ex: Sem cebola, molho à parte..."
                  value={productNotes}
                  onChange={(e) => setProductNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowProductModal(false)}>
                Cancelar
              </button>
              <button className="btn-add" onClick={handleAddToOrder}>
                Adicionar - R$ {(selectedProduct.price * productQuantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDV;
