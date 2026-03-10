import React, { useState, useMemo } from 'react';
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
  description?: string;
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
  // const [notes, setNotes] = useState<string>('');
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [productNotes, setProductNotes] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Categorias baseadas no cardápio real
  const categories = [
    { id: 'all', name: 'Todos', icon: 'bi-grid' },
    { id: 'Burgers Artesanais', name: 'Artesanais', icon: 'bi-egg-fried' },
    { id: 'Tradicionais', name: 'Tradicionais', icon: 'bi-hamburger' },
    { id: 'Passaportes', name: 'Passaportes', icon: 'bi-box' },
    { id: 'Bebidas', name: 'Bebidas', icon: 'bi-cup-straw' }
  ];

  // Produtos extraídos do cardápio digital
  const products: Product[] = [
    // Burgers Artesanais
    { id: 1, name: 'La Costela', price: 24.00, image: 'https://lachapa-cardapio.vercel.app/images/la-costela.jpg', category: 'Burgers Artesanais', description: 'Pão brioche, hambúrguer de Costela 130g, presunto, queijo cheddar, bacon crocante, molho barbecue e salada.' },
    { id: 2, name: 'La Filé Bovino', price: 25.00, image: 'https://lachapa-cardapio.vercel.app/images/la-file.jpg', category: 'Burgers Artesanais', description: 'Pão brioche, 130g de filé Bovino, presunto, mussarela, molho especial e salada.' },
    { id: 3, name: 'La Alcatra', price: 25.00, image: 'https://lachapa-cardapio.vercel.app/images/la-alcatra.jpg', category: 'Burgers Artesanais', description: 'Pão brioche, hambúrguer de Alcatra 130g, presunto, mussarela, bacon crocante, molho barbecue e salada.' },
    { id: 4, name: 'La Cupim', price: 27.00, image: 'https://lachapa-cardapio.vercel.app/images/la-cupim.jpg', category: 'Burgers Artesanais', description: 'Pão brioche, hambúrguer de Cupim 130g, presunto, mussarela, bacon crocante, molho barbecue e salada.' },
    { id: 5, name: 'La Picanha', price: 30.00, image: 'https://lachapa-cardapio.vercel.app/images/la-picanha.jpg', category: 'Burgers Artesanais', description: 'Pão brioche, hambúrguer de Picanha 130g, presunto, mussarela, bacon crocante, molho barbecue e salada.' },
    { id: 6, name: 'La Costela Duplo', price: 34.00, image: 'https://lachapa-cardapio.vercel.app/images/la-costela-duplo.jpg', category: 'Burgers Artesanais', description: 'Pão brioche, 2x hambúrguer de Costela 130g, 2x queijo cheddar, molho barbecue e salada.' },
    { id: 7, name: 'La Alcatra Duplo', price: 35.00, image: 'https://lachapa-cardapio.vercel.app/images/la-alcatra-duplo.jpg', category: 'Burgers Artesanais', description: 'Pão brioche, 2x hambúrguer de Alcatra 130g, presunto, mussarela, bacon crocante, molho barbecue e salada.' },
    { id: 8, name: 'La Picanha Duplo', price: 40.00, image: 'https://lachapa-cardapio.vercel.app/images/la-picanha-duplo.jpg', category: 'Burgers Artesanais', description: 'Pão brioche, 2x hambúrguer de Picanha 130g, presunto, mussarela, bacon crocante, molho barbecue e salada.' },
    
    // Tradicionais
    { id: 9, name: 'Bauru', price: 15.00, image: 'https://lachapa-cardapio.vercel.app/images/bauru.jpg', category: 'Tradicionais', description: 'Pão brioche, hambúrguer, ovo, queijo mussarela, presunto, alface e tomate, molho da casa.' },
    { id: 10, name: 'Americano', price: 16.00, image: 'https://lachapa-cardapio.vercel.app/images/americano.jpg', category: 'Tradicionais', description: 'Pão brioche, hambúrguer, catupiry, ovo, queijo mussarela, presunto, alface tomate, molho da casa.' },
    { id: 11, name: 'X-Burguer', price: 14.00, image: 'https://lachapa-cardapio.vercel.app/images/x-burguer.jpg', category: 'Tradicionais', description: 'Pão brioche, hambúrguer, queijo mussarela, presunto, alface, tomate, molho da casa.' },
    { id: 12, name: 'X-Burguer Duplo', price: 20.00, image: 'https://lachapa-cardapio.vercel.app/images/x-burguer-duplo.jpg', category: 'Tradicionais', description: 'Pão brioche, 2 hambúrguer, queijo mussarela, presunto, alface e tomate, molho da casa.' },
    { id: 13, name: 'X-Bacon', price: 20.00, image: 'https://lachapa-cardapio.vercel.app/images/x-bacon.jpg', category: 'Tradicionais', description: 'Pão brioche, hambúrguer, bacon crocante, queijo mussarela, presunto, alface e tomate, molho da casa.' },
    { id: 14, name: 'X-Calabacon', price: 22.00, image: 'https://lachapa-cardapio.vercel.app/images/x-calabacon.jpg', category: 'Tradicionais', description: 'Pão brioche, hambúrguer, calabresa, bacon, queijo mussarela, presunto, alface, tomate, molho da casa.' },
    { id: 15, name: 'X-Calabresa Egg', price: 23.00, image: 'https://lachapa-cardapio.vercel.app/images/x-calabresa-egg.jpg', category: 'Tradicionais', description: 'Pão brioche, hambúrguer, calabresa, ovo, queijo mussarela, presunto, alface, tomate, molho da casa.' },
    { id: 16, name: 'La Calabresa', price: 20.00, image: 'https://lachapa-cardapio.vercel.app/images/la-calabresa.jpg', category: 'Tradicionais', description: 'Pão brioche, 130g de Calabresa defumada, mussarela, presunto, alface, tomate, molho da casa.' },
    { id: 17, name: 'La Frango Desfiado', price: 23.00, image: 'https://lachapa-cardapio.vercel.app/images/la-frango.jpg', category: 'Tradicionais', description: 'Pão brioche, 130g de Frango Desfiado, catupiry, presunto, mussarela, batata palha, molho da casa e salada.' },
    { id: 18, name: 'La Toscana', price: 22.00, image: 'https://lachapa-cardapio.vercel.app/images/la-toscana.jpg', category: 'Tradicionais', description: 'Pão brioche, hambúrguer de toscana 130g, presunto, mussarela, molho da casa e salada.' },
    { id: 19, name: 'X-Tudo', price: 28.00, image: 'https://lachapa-cardapio.vercel.app/images/x-tudo.jpg', category: 'Tradicionais', description: 'Pão brioche, hambúrguer, ovo, calabresa bacon, queijo mussarela presunto, cheddar, frango desfiado batata palha, catupiry, molho da casa.' },
    
    // Passaportes
    { id: 20, name: 'Passaporte de Frango', price: 16.00, image: 'https://lachapa-cardapio.vercel.app/images/passaporte-frango.jpg', category: 'Passaportes', description: 'Pão seda, 2 salsichas, frango desfiado, milho, ervilha, tomate, batata palha, queijo ralado e molho especial.' },
    { id: 21, name: 'Passaporte de Frango c/ Catupiry', price: 19.00, image: 'https://lachapa-cardapio.vercel.app/images/passaporte-frango-catupiry.jpg', category: 'Passaportes', description: 'Pão seda, 2 salsichas, frango desfiado, Catupiry, milho, ervilha, tomate, batata palha, queijo ralado e molho especial.' },
    { id: 22, name: 'Passaporte de Frango c/ Cheddar', price: 19.00, image: 'https://lachapa-cardapio.vercel.app/images/passaporte-frango-cheddar.jpg', category: 'Passaportes', description: 'Pão seda, 2 salsichas, frango desfiado, Cheddar, milho, ervilha, tomate, batata palha, queijo ralado e molho especial.' },
    { id: 23, name: 'Passaporte de Frango c/ Calabresa', price: 19.00, image: 'https://lachapa-cardapio.vercel.app/images/passaporte-frango-calabresa.jpg', category: 'Passaportes', description: 'Pão seda, 2 salsichas, frango desfiado, Calabresa, milho, ervilha, tomate, batata palha, queijo ralado e molho especial.' },
    { id: 24, name: 'Passaporte de Frango c/ Bacon', price: 20.00, image: 'https://lachapa-cardapio.vercel.app/images/passaporte-frango-bacon.jpg', category: 'Passaportes', description: 'Pão seda, 2 salsichas, frango desfiado, Bacon, milho, ervilha, tomate, batata palha, queijo ralado e molho especial.' },
    { id: 25, name: 'Passaporte de Toscana', price: 21.00, image: 'https://lachapa-cardapio.vercel.app/images/passaporte-toscana.jpg', category: 'Passaportes', description: 'Pão seda, 2 salsichas, linguiça toscana, milho, ervilha, tomate, batata palha, queijo ralado e molho especial.' },
    { id: 26, name: 'Passaporte de Carne', price: 20.00, image: 'https://lachapa-cardapio.vercel.app/images/passaporte-carne.jpg', category: 'Passaportes', description: 'Pão seda, 2 salsichas, carne moída, milho, ervilha, tomate, batata palha, queijo ralado e molho especial.' },
    { id: 27, name: 'Passaporte de Carne c/ Catupiry', price: 22.00, image: 'https://lachapa-cardapio.vercel.app/images/passaporte-carne-catupiry.jpg', category: 'Passaportes', description: 'Pão seda, 2 salsichas, carne moída, catupiry, milho, ervilha, tomate, batata palha, queijo ralado e molho especial.' },
    { id: 28, name: 'Passaporte de Carne c/ Cheddar', price: 22.00, image: 'https://lachapa-cardapio.vercel.app/images/passaporte-carne-cheddar.jpg', category: 'Passaportes', description: 'Pão seda, 2 salsichas, carne moída, Cheddar, milho, ervilha, tomate, batata palha, queijo ralado e molho especial.' },
    { id: 29, name: 'Passaporte de Carne de Sol', price: 28.00, image: 'https://lachapa-cardapio.vercel.app/images/passaporte-carne-sol.jpg', category: 'Passaportes', description: 'Pão seda, 2 salsichas, carne de sol desfiada, milho, ervilha, tomate, batata palha, queijo ralado e molho especial.' },
    { id: 30, name: 'Passaporte de Filé Bovino', price: 23.00, image: 'https://lachapa-cardapio.vercel.app/images/passaporte-file.jpg', category: 'Passaportes', description: 'Pão seda, 2 salsichas, filé bovino, milho, ervilha, tomate, batata palha, queijo ralado e molho especial.' },
    
    // Bebidas
    { id: 31, name: 'Coca-cola lata', price: 5.50, image: 'https://lachapa-cardapio.vercel.app/images/coca-lata.jpg', category: 'Bebidas', description: 'Refrigerante Coca-cola lata 350ml' },
    { id: 32, name: 'Coca-cola Zero lata', price: 5.50, image: 'https://lachapa-cardapio.vercel.app/images/coca-zero-lata.jpg', category: 'Bebidas', description: 'Refrigerante Coca-cola Zero lata 350ml' },
    { id: 33, name: 'Guaraná lata', price: 5.00, image: 'https://lachapa-cardapio.vercel.app/images/guarana-lata.jpg', category: 'Bebidas', description: 'Refrigerante Guaraná lata 350ml' },
    { id: 34, name: 'Guarana Zero lata', price: 5.50, image: 'https://lachapa-cardapio.vercel.app/images/guarana-zero-lata.jpg', category: 'Bebidas', description: 'Refrigerante Guarana Zero lata 350ml' },
    { id: 35, name: 'Fanta lata', price: 5.00, image: 'https://lachapa-cardapio.vercel.app/images/fanta-lata.jpg', category: 'Bebidas', description: 'Refrigerante Fanta lata 350ml' },
    { id: 36, name: 'Água mineral', price: 3.00, image: 'https://lachapa-cardapio.vercel.app/images/agua.jpg', category: 'Bebidas', description: 'Água mineral sem gás 500ml' },
    { id: 37, name: 'Água mineral c/ gás', price: 3.00, image: 'https://lachapa-cardapio.vercel.app/images/agua-gas.jpg', category: 'Bebidas', description: 'Água mineral com gás 500ml' },
    { id: 38, name: 'Guaraná 1 litro', price: 8.00, image: 'https://lachapa-cardapio.vercel.app/images/guarana-1l.jpg', category: 'Bebidas', description: 'Refrigerante Guaraná 1 litro' },
    { id: 39, name: 'Guaraná 2 litros', price: 12.00, image: 'https://lachapa-cardapio.vercel.app/images/guarana-2l.jpg', category: 'Bebidas', description: 'Refrigerante Guaraná 2 litros' },
    { id: 40, name: 'Coca-cola 1 litro', price: 10.00, image: 'https://lachapa-cardapio.vercel.app/images/coca-1l.jpg', category: 'Bebidas', description: 'Refrigerante Coca-cola 1 litro' },
    { id: 41, name: 'Coca-cola 2 litros', price: 14.00, image: 'https://lachapa-cardapio.vercel.app/images/coca-2l.jpg', category: 'Bebidas', description: 'Refrigerante Coca-cola 2 litros' },
    { id: 42, name: 'Fanta 1 litro', price: 8.00, image: 'https://lachapa-cardapio.vercel.app/images/fanta-1l.jpg', category: 'Bebidas', description: 'Refrigerante Fanta 1 litro' }
  ];

  // Filtragem de produtos
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  // Cálculos do pedido
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = 0; // Removido taxa de serviço por padrão
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
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += productQuantity;
      setOrderItems(updatedItems);
    } else {
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
    alert(`Pedido finalizado! Total: R$ ${total.toFixed(2)}`);
    setOrderItems([]);
    setSelectedCustomer(null);
    setPaymentMethod('');
    // setNotes('');
  };

  return (
    <div className="pdv-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="pdv-content">
        <Header 
          title="PDV LaChapa" 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        <div className="pdv-main-layout">
          {/* Coluna esquerda - Produtos */}
          <div className="pdv-products-section">
            <div className="pdv-controls">
              <div className="pdv-search-bar">
                <i className="bi bi-search"></i>
                <input 
                  type="text" 
                  placeholder="Buscar produto pelo nome..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="pdv-categories-scroll">
                {categories.map(category => (
                  <button 
                    key={category.id}
                    className={`category-chip ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <i className={`bi ${category.icon}`}></i>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pdv-products-grid">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="product-card-modern"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="product-card-image">
                    <img src={product.image} alt={product.name} onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=LaChapa';
                    }} />
                    <div className="product-card-category">{product.category}</div>
                  </div>
                  <div className="product-card-details">
                    <h3>{product.name}</h3>
                    <p className="product-card-desc">{product.description?.substring(0, 60)}...</p>
                    <div className="product-card-footer">
                      <span className="product-card-price">R$ {product.price.toFixed(2)}</span>
                      <button className="product-card-add">
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Coluna direita - Pedido atual */}
          <div className="pdv-order-section">
            <div className="order-card">
              <div className="order-card-header">
                <div>
                  <h2>Pedido Atual</h2>
                  <span className="order-items-count">{orderItems.length} itens</span>
                </div>
                <button className="btn-icon-clear" onClick={() => setOrderItems([])} title="Limpar Pedido">
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
              
              <div className="order-card-body">
                {/* Cliente */}
                <div className="order-section-block">
                  <div className="section-title">
                    <i className="bi bi-person"></i>
                    <span>Cliente</span>
                  </div>
                  {selectedCustomer ? (
                    <div className="customer-info-box">
                      <div className="customer-details">
                        <p className="customer-name">{selectedCustomer.name}</p>
                        <p className="customer-phone">{selectedCustomer.phone}</p>
                      </div>
                      <button className="btn-remove-customer" onClick={() => setSelectedCustomer(null)}>
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ) : (
                    <button className="btn-add-customer">
                      <i className="bi bi-plus-circle"></i>
                      <span>Vincular Cliente</span>
                    </button>
                  )}
                </div>
                
                {/* Itens do pedido */}
                <div className="order-items-container">
                  <div className="section-title">
                    <i className="bi bi-list-ul"></i>
                    <span>Itens do Pedido</span>
                  </div>
                  {orderItems.length === 0 ? (
                    <div className="empty-order-state">
                      <div className="empty-icon">
                        <i className="bi bi-cart-x"></i>
                      </div>
                      <p>Seu carrinho está vazio</p>
                      <span>Selecione produtos ao lado</span>
                    </div>
                  ) : (
                    <div className="order-items-scroll">
                      {orderItems.map(item => (
                        <div key={item.id} className="order-item-row">
                          <div className="item-main">
                            <div className="item-qty-badge">{item.quantity}x</div>
                            <div className="item-text">
                              <p className="item-name">{item.name}</p>
                              {item.notes && <p className="item-subtext">{item.notes}</p>}
                            </div>
                            <div className="item-price-total">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                          <div className="item-controls">
                            <div className="qty-stepper">
                              <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                              <span>{item.quantity}</span>
                              <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                            </div>
                            <button className="btn-item-delete" onClick={() => handleRemoveItem(item.id)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="order-card-footer">
                <div className="payment-method-section">
                  <p>Forma de Pagamento</p>
                  <div className="payment-grid">
                    {[
                      { id: 'pix', label: 'PIX', icon: 'bi-qr-code' },
                      { id: 'card', label: 'Cartão', icon: 'bi-credit-card' },
                      { id: 'cash', label: 'Dinheiro', icon: 'bi-cash-stack' }
                    ].map(method => (
                      <button 
                        key={method.id}
                        className={`payment-btn ${paymentMethod === method.id ? 'active' : ''}`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <i className={`bi ${method.icon}`}></i>
                        <span>{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total a Pagar</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  className="btn-checkout" 
                  disabled={orderItems.length === 0 || !paymentMethod}
                  onClick={handleFinishOrder}
                >
                  <i className="bi bi-check2-circle"></i>
                  <span>Finalizar Pedido</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Produto */}
      {showProductModal && selectedProduct && (
        <div className="modern-modal-overlay">
          <div className="modern-modal animate-slide-up">
            <div className="modal-banner">
              <img src={selectedProduct.image} alt={selectedProduct.name} onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=LaChapa';
              }} />
              <button className="modal-close-btn" onClick={() => setShowProductModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="modal-product-info">
                <h2>{selectedProduct.name}</h2>
                <p className="modal-product-price">R$ {selectedProduct.price.toFixed(2)}</p>
                <p className="modal-product-desc">{selectedProduct.description}</p>
              </div>
              
              <div className="modal-form-group">
                <label>Observações do Item</label>
                <textarea 
                  placeholder="Ex: Sem cebola, ponto da carne mal passado..."
                  value={productNotes}
                  onChange={(e) => setProductNotes(e.target.value)}
                ></textarea>
              </div>
              
              <div className="modal-footer">
                <div className="modal-qty-selector">
                  <button onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}>-</button>
                  <span>{productQuantity}</span>
                  <button onClick={() => setProductQuantity(productQuantity + 1)}>+</button>
                </div>
                <button className="btn-modal-add" onClick={handleAddToOrder}>
                  Adicionar ao Pedido • R$ {(selectedProduct.price * productQuantity).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDV;
