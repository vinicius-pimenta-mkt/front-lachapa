import React, { useState, useMemo } from 'react';
import './PDV.css';
import '../../styles/theme.css';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import { X, Plus, Minus, Trash2, ShoppingCart, Menu } from 'lucide-react';

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
  extras: OrderItemExtra[];
}

interface OrderItemExtra {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
}

interface Extra {
  id: number;
  name: string;
  price: number;
}

const PDV: React.FC = () => {
  // Estados
  const [activeCategory, setActiveCategory] = useState<string>('Tradicionais');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [productNotes, setProductNotes] = useState<string>('');
  const [productExtras, setProductExtras] = useState<OrderItemExtra[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showNewItemModal, setShowNewItemModal] = useState<boolean>(false);
  const [newItemData, setNewItemData] = useState({
    name: '',
    price: '',
    category: 'Tradicionais',
    description: '',
    image: null as File | null,
  });

  // Categorias ordenadas
  const categories = [
    { id: 'Tradicionais', name: 'Tradicionais', icon: 'bi-hamburger' },
    { id: 'Burgers Artesanais', name: 'Artesanais', icon: 'bi-egg-fried' },
    { id: 'Passaportes', name: 'Passaportes', icon: 'bi-box' },
    { id: 'Bebidas', name: 'Bebidas', icon: 'bi-cup-straw' }
  ];

  // Adicionais disponíveis
  const extrasAvailable: Record<string, Extra[]> = {
    'Tradicionais': [
      { id: 1, name: 'Bacon Extra', price: 3.00 },
      { id: 2, name: 'Queijo Extra', price: 2.00 },
      { id: 3, name: 'Ovo Extra', price: 2.50 },
      { id: 4, name: 'Calabresa Extra', price: 3.00 },
      { id: 5, name: 'Catupiry Extra', price: 2.50 },
    ],
    'Burgers Artesanais': [
      { id: 1, name: 'Bacon Extra', price: 3.50 },
      { id: 2, name: 'Queijo Extra', price: 2.50 },
      { id: 3, name: 'Ovo Extra', price: 3.00 },
      { id: 4, name: 'Presunto Extra', price: 3.00 },
    ],
    'Passaportes': [
      { id: 1, name: 'Frango Extra', price: 3.00 },
      { id: 2, name: 'Calabresa Extra', price: 3.50 },
      { id: 3, name: 'Catupiry Extra', price: 2.50 },
      { id: 4, name: 'Bacon Extra', price: 3.50 },
    ],
  };

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
      const matchesCategory = product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  // Handlers
  const handleAddProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductQuantity(1);
    setProductNotes('');
    setProductExtras([]);
    setShowProductModal(true);
  };

  const handleConfirmProduct = () => {
    if (!selectedProduct) return;

    const newOrderItem: OrderItem = {
      id: Date.now(),
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: productQuantity,
      notes: productNotes,
      extras: productExtras,
    };

    setOrderItems([...orderItems, newOrderItem]);
    setShowProductModal(false);
  };

  const handleRemoveOrderItem = (itemId: number) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveOrderItem(itemId);
      return;
    }
    setOrderItems(orderItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleAddExtra = (extra: Extra) => {
    const existingExtra = productExtras.find(e => e.id === extra.id);
    if (existingExtra) {
      setProductExtras(productExtras.map(e =>
        e.id === extra.id ? { ...e, quantity: e.quantity + 1 } : e
      ));
    } else {
      setProductExtras([...productExtras, { ...extra, quantity: 1 }]);
    }
  };

  const handleRemoveExtra = (extraId: number) => {
    setProductExtras(productExtras.filter(e => e.id !== extraId));
  };

  const handleCreateNewItem = async () => {
    if (!newItemData.name || !newItemData.price || !newItemData.image) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: newItemData.name,
      price: parseFloat(newItemData.price),
      category: newItemData.category,
      description: newItemData.description,
      image: URL.createObjectURL(newItemData.image),
    };

    console.log('Novo produto criado:', newProduct);
    
    setShowNewItemModal(false);
    setNewItemData({
      name: '',
      price: '',
      category: 'Tradicionais',
      description: '',
      image: null,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewItemData({
        ...newItemData,
        image: e.target.files[0],
      });
    }
  };

  const totalPrice = orderItems.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const extrasTotal = item.extras.reduce((extrasSum, extra) => extrasSum + (extra.price * extra.quantity), 0);
    return sum + itemTotal + extrasTotal;
  }, 0);

  return (
    <div className="pdv-container">
      {/* Sidebar Retrátil */}
      <div className={`pdv-sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar isOpen={isSidebarOpen} />
        {isSidebarOpen && (
          <div className="pdv-sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
        )}
      </div>

      <div className="pdv-content">
        {/* Header com Botão Hambúrguer */}
        <div className="pdv-header-wrapper">
          <button 
            className="pdv-hamburger-btn" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title="Abrir/Fechar Menu"
          >
            <Menu size={24} />
          </button>
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>
        
        <div className="pdv-main-layout">
          {/* Seção de Produtos */}
          <div className="pdv-products-section">
            <div className="pdv-controls">
              <div className="pdv-search-bar">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="pdv-categories-container">
                <div className="pdv-categories-scroll">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`category-chip ${activeCategory === category.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <i className={`bi ${category.icon}`}></i>
                      {category.name}
                    </button>
                  ))}
                </div>
                
                {/* Botão Novo Item */}
                <button
                  className="btn-new-item"
                  onClick={() => setShowNewItemModal(true)}
                  title="Criar novo item no cardápio"
                >
                  <Plus size={16} />
                  Novo
                </button>
              </div>
            </div>

            {/* Grid de Produtos */}
            <div className="pdv-products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card-modern">
                  <div className="product-card-image">
                    <img src={product.image} alt={product.name} />
                    <div className="product-card-category">{product.category}</div>
                  </div>
                  <div className="product-card-details">
                    <h3>{product.name}</h3>
                    <p className="product-card-desc">{product.description}</p>
                    <div className="product-card-footer">
                      <span className="product-card-price">R$ {product.price.toFixed(2)}</span>
                      <button
                        className="product-card-add"
                        onClick={() => handleAddProduct(product)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seção de Pedido */}
          <div className="pdv-order-section">
            <div className="order-card">
              <div className="order-card-header">
                <div>
                  <h2>Pedido</h2>
                  <span className="order-items-count">{orderItems.length} itens</span>
                </div>
                <button
                  className="btn-icon-clear"
                  onClick={() => setOrderItems([])}
                  disabled={orderItems.length === 0}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="order-card-body">
                {/* Cliente */}
                <div>
                  <div className="section-title">
                    <i className="bi bi-person"></i>
                    Cliente
                  </div>
                  {selectedCustomer ? (
                    <div className="customer-info-box">
                      <div>
                        <p className="customer-name">{selectedCustomer.name}</p>
                        <p className="customer-phone">{selectedCustomer.phone}</p>
                      </div>
                      <button
                        className="btn-icon-clear"
                        onClick={() => setSelectedCustomer(null)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button className="btn-add-customer">
                      <Plus size={16} />
                      Adicionar Cliente
                    </button>
                  )}
                </div>

                {/* Itens do Pedido */}
                <div className="order-items-container">
                  <div className="section-title">
                    <i className="bi bi-bag"></i>
                    Itens
                  </div>
                  {orderItems.length === 0 ? (
                    <div className="empty-order-state">
                      <div className="empty-icon">
                        <ShoppingCart size={40} />
                      </div>
                      <p>Nenhum item adicionado</p>
                    </div>
                  ) : (
                    <div className="order-items-scroll">
                      {orderItems.map(item => (
                        <div key={item.id} className="order-item-row">
                          <div className="item-main">
                            <span className="item-qty-badge">{item.quantity}x</span>
                            <div className="item-text">
                              <p className="item-name">{item.name}</p>
                              {item.notes && <p className="item-subtext">Obs: {item.notes}</p>}
                            </div>
                            <span className="item-price-total">R$ {(item.price * item.quantity).toFixed(2)}</span>
                          </div>

                          {item.extras.length > 0 && (
                            <div className="item-extras">
                              {item.extras.map(extra => (
                                <div key={extra.id} className="extra-badge">
                                  + {extra.quantity}x {extra.name}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="item-controls">
                            <div className="qty-stepper">
                              <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                                <Minus size={12} />
                              </button>
                              <span>{item.quantity}</span>
                              <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                                <Plus size={12} />
                              </button>
                            </div>
                            <button
                              className="btn-item-delete"
                              onClick={() => handleRemoveOrderItem(item.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="order-card-footer">
                <div className="payment-method-section">
                  <p>Forma de Pagamento</p>
                  <div className="payment-grid">
                    {['Dinheiro', 'Débito', 'Crédito'].map(method => (
                      <button
                        key={method}
                        className={`payment-btn ${paymentMethod === method ? 'active' : ''}`}
                        onClick={() => setPaymentMethod(method)}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="order-total">
                  <span>Total:</span>
                  <span className="total-value">R$ {totalPrice.toFixed(2)}</span>
                </div>

                <button className="btn-confirm-order">
                  <ShoppingCart size={16} />
                  Confirmar Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Produto */}
      {showProductModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedProduct.name}</h2>
              <button
                className="modal-close"
                onClick={() => setShowProductModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="modal-image" />
              <p className="modal-description">{selectedProduct.description}</p>

              {/* Quantidade */}
              <div className="modal-section">
                <label>Quantidade</label>
                <div className="qty-stepper-large">
                  <button onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}>
                    <Minus size={18} />
                  </button>
                  <span>{productQuantity}</span>
                  <button onClick={() => setProductQuantity(productQuantity + 1)}>
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Observações */}
              <div className="modal-section">
                <label>Observações</label>
                <textarea
                  value={productNotes}
                  onChange={(e) => setProductNotes(e.target.value)}
                  placeholder="Ex: Sem cebola, sem tomate..."
                  className="modal-textarea"
                />
              </div>

              {/* Adicionais */}
              {extrasAvailable[selectedProduct.category] && (
                <div className="modal-section">
                  <label>Adicionais</label>
                  <div className="extras-list">
                    {extrasAvailable[selectedProduct.category].map(extra => (
                      <div key={extra.id} className="extra-item">
                        <label className="extra-checkbox">
                          <input
                            type="checkbox"
                            checked={!!productExtras.find(e => e.id === extra.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleAddExtra(extra);
                              } else {
                                handleRemoveExtra(extra.id);
                              }
                            }}
                          />
                          <span className="extra-name">{extra.name}</span>
                        </label>
                        <span className="extra-price">R$ {extra.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowProductModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn-confirm"
                onClick={handleConfirmProduct}
              >
                Adicionar ao Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Novo Item */}
      {showNewItemModal && (
        <div className="modal-overlay" onClick={() => setShowNewItemModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Criar Novo Item</h2>
              <button
                className="modal-close"
                onClick={() => setShowNewItemModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Nome */}
              <div className="modal-section">
                <label>Nome do Item</label>
                <input
                  type="text"
                  value={newItemData.name}
                  onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                  placeholder="Ex: X-Burger Especial"
                  className="modal-input"
                />
              </div>

              {/* Preço */}
              <div className="modal-section">
                <label>Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItemData.price}
                  onChange={(e) => setNewItemData({ ...newItemData, price: e.target.value })}
                  placeholder="Ex: 25.00"
                  className="modal-input"
                />
              </div>

              {/* Categoria */}
              <div className="modal-section">
                <label>Categoria</label>
                <select
                  value={newItemData.category}
                  onChange={(e) => setNewItemData({ ...newItemData, category: e.target.value })}
                  className="modal-select"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Descrição */}
              <div className="modal-section">
                <label>Descrição</label>
                <textarea
                  value={newItemData.description}
                  onChange={(e) => setNewItemData({ ...newItemData, description: e.target.value })}
                  placeholder="Descreva os ingredientes e características do item"
                  className="modal-textarea"
                />
              </div>

              {/* Upload de Imagem */}
              <div className="modal-section">
                <label>Imagem do Item</label>
                <div className="image-upload-area">
                  {newItemData.image ? (
                    <div className="image-preview">
                      <img src={URL.createObjectURL(newItemData.image)} alt="Preview" />
                      <button
                        className="btn-remove-image"
                        onClick={() => setNewItemData({ ...newItemData, image: null })}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="image-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <div className="upload-placeholder">
                        <Plus size={28} />
                        <p>Clique para adicionar imagem</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowNewItemModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn-confirm"
                onClick={handleCreateNewItem}
              >
                Criar Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDV;
