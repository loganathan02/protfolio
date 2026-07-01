import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Code, 
  Server, 
  Database, 
  Wrench, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Menu, 
  X, 
  Terminal, 
  Zap,
  CreditCard,
  Globe,
  AlertTriangle,
  Info
} from 'lucide-react';

function App() {
  // Mobile drawer menu state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Active section track
  const [activeSection, setActiveSection] = useState('about');

  // Skill category filter states
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('all');
  const [highlightedSkill, setHighlightedSkill] = useState(null);

  // Toast Notification State
  const [toasts, setToasts] = useState([]);

  // Toast trigger helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Billing & Inventory Sandbox State
  const [billingSimTab, setBillingSimTab] = useState('invoice'); // invoice | latency | jwt
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [razorpayMethod, setRazorpayMethod] = useState('card');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Inventory items with live stock counts
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, name: 'SaaS Dashboard Template', stock: 12, price: 250, selected: true },
    { id: 2, name: 'REST API Standard License', stock: 4, price: 500, selected: false }
  ]);

  // Track unpaid invoice selection state
  const [invoicePaid, setInvoicePaid] = useState(false);
  const [billingLogs, setBillingLogs] = useState([
    'System status: Live and Operational',
    'Payment gateway connected: Razorpay Sandbox API v2',
    'Waiting for checkout initialization...'
  ]);
  const [dbOptimized, setDbOptimized] = useState(false);
  const [jwtStep, setJwtStep] = useState(0);
  const [jwtLogs, setJwtLogs] = useState([]);

  // School Portal Sandbox State
  const [schoolRole, setSchoolRole] = useState('admin');
  const [schoolTerminalLogs, setSchoolTerminalLogs] = useState([]);

  // Hero interactive terminal state
  const [heroLogs, setHeroLogs] = useState([]);

  // Track active inventory item
  const activeItem = inventoryItems.find((item) => item.selected) || inventoryItems[0];

  // Intersection Observer for section tracking
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -55% 0px',
      threshold: 0.1
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          const id = entry.target.getAttribute('id');
          if (id) setActiveSection(id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    document.querySelectorAll('section[id]').forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  // Simulate Hero terminal logs
  useEffect(() => {
    const lines = [
      'Booting developer_stack_env...',
      'Allocating React 18 frontend runtime... Loaded',
      'Configuring Node.js & Express API routing... OK',
      'Initializing connection pools for MySQL & MongoDB... OK',
      'Mounting Razorpay payment gateway SDK... Online 💳',
      'Enabling real-time inventory socket synchronizer... Active',
      'Full Stack Developer system ready. Status: Operational 🟢'
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        setHeroLogs((prev) => [...prev, lines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 700);

    return () => clearInterval(interval);
  }, []);

  // School Management simulated access log updates
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    let accessLog = '';
    if (schoolRole === 'admin') {
      accessLog = `[${timestamp}] GET /api/admin/financials - 200 OK (Access: Admin Token Verified)`;
    } else {
      accessLog = `[${timestamp}] GET /api/admin/financials - 403 Forbidden (RBAC Block: Role "${schoolRole}" unauthorized)`;
    }
    setSchoolTerminalLogs((prev) => [accessLog, ...prev.slice(0, 4)]);
  }, [schoolRole]);

  // Razorpay Checkout flow triggers
  const handlePayClick = () => {
    if (invoicePaid) return;
    if (activeItem.stock <= 0) {
      addToast('Cannot checkout: Selected item is out of stock!', 'warning');
      return;
    }
    setShowRazorpay(true);
    addToast('Opening Razorpay Payment Modal...', 'info');
  };

  const handleExecutePayment = () => {
    setPaymentProcessing(true);
    
    // Simulate API round-trip delay
    setTimeout(() => {
      setPaymentProcessing(false);
      setShowRazorpay(false);
      setInvoicePaid(true);
      
      // Deduct inventory stock
      setInventoryItems(prevItems => 
        prevItems.map(item => 
          item.id === activeItem.id 
            ? { ...item, stock: Math.max(0, item.stock - 1) } 
            : item
        )
      );

      const paymentId = 'pay_razor_' + Math.random().toString(36).substring(2, 12);
      const timestamp = new Date().toLocaleTimeString();

      // Trigger alerts
      addToast(`Razorpay payment successful! ID: ${paymentId}`, 'success');
      
      const newStock = Math.max(0, activeItem.stock - 1);
      if (newStock <= 0) {
        addToast(`Product "${activeItem.name}" is now OUT OF STOCK!`, 'warning');
      } else if (newStock < 5) {
        addToast(`Product "${activeItem.name}" stock is LOW (${newStock} remaining).`, 'warning');
      } else {
        addToast(`Inventory stock updated successfully! (${newStock} items remaining)`, 'info');
      }

      setBillingLogs([
        `[${timestamp}] WebHook: razorpay.payment.captured payload received.`,
        `[${timestamp}] Razorpay: Verified signature for transaction ${paymentId}.`,
        `[${timestamp}] DB Queue: UPDATE invoices SET status = 'paid', payment_ref = '${paymentId}' WHERE id = 104`,
        `[${timestamp}] DB Queue: UPDATE inventory SET stock = stock - 1 WHERE id = ${activeItem.id}`,
        `[${timestamp}] Inventory: Deducted item "${activeItem.name}". New stock level: ${newStock}`,
        `[${timestamp}] System: Razorpay Payment process resolved. Transaction Committed. ✅`
      ]);

    }, 2000);
  };

  const handleResetBilling = () => {
    setInvoicePaid(false);
    // Reset SaaS Dashboard stock back to 12 if it was depleted
    setInventoryItems([
      { id: 1, name: 'SaaS Dashboard Template', stock: 12, price: 250, selected: activeItem.id === 1 },
      { id: 2, name: 'REST API Standard License', stock: 4, price: 500, selected: activeItem.id === 2 }
    ]);
    setBillingLogs([
      'Billing & Inventory sandbox state reset.',
      'Waiting for checkout initialization...'
    ]);
    addToast('Simulation sandbox reset to default values.', 'info');
  };

  const selectInventoryItem = (id) => {
    if (invoicePaid) {
      addToast('Please reset the billing cycle to switch products.', 'warning');
      return;
    }
    setInventoryItems(prev => prev.map(item => ({ ...item, selected: item.id === id })));
    addToast(`Selected: ${inventoryItems.find(i => i.id === id).name}`, 'info');
  };

  // SQL Latency Toggles
  const handleToggleSqlIndex = () => {
    const nextVal = !dbOptimized;
    setDbOptimized(nextVal);
    if (nextVal) {
      addToast('MySQL indexes enabled! Report latency dropped from 120ms to 8ms.', 'success');
    } else {
      addToast('MySQL indexes disabled. Reverted to Full Table Scans.', 'info');
    }
  };

  // JWT Steps trigger
  const runJwtCycle = () => {
    setJwtStep(1);
    setJwtLogs([]);
    const logs = [
      'Browser packed JWT token inside header: Authorization: Bearer eyJhb...',
      'Express Router caught request, verifying JWT middleware...',
      'Middleware decrypted header payload: role: "student", id: 42',
      'Cryptographic signature matched process.env.JWT_SECRET!',
      'Database controller parsed query scope, allowing students table view',
      'API returned status code 200 OK. Dynamic dashboard loaded.'
    ];

    let step = 1;
    const interval = setInterval(() => {
      if (step <= 6) {
        setJwtStep(step);
        setJwtLogs((prev) => [...prev, `[JWT Verification Step ${step}] ${logs[step - 1]}`]);
        step++;
      } else {
        clearInterval(interval);
        addToast('JWT Auth Cycle Simulation completed.', 'success');
      }
    }, 900);
  };

  // Skills tag lists
  const skillsData = [
    { name: 'React.js', category: 'frontend', level: 'Expert (2+ Yrs)' },
    { name: 'Angular', category: 'frontend', level: 'Intermediate' },
    { name: 'TypeScript', category: 'frontend', level: 'Advanced' },
    { name: 'JavaScript', category: 'frontend', level: 'Expert (3+ Yrs)' },
    { name: 'HTML5 & CSS3', category: 'frontend', level: 'Expert' },
    { name: 'Tailwind CSS', category: 'frontend', level: 'Advanced' },
    { name: 'Material UI', category: 'frontend', level: 'Advanced' },
    { name: 'Styled Components', category: 'frontend', level: 'Advanced' },
    { name: 'Node.js', category: 'backend', level: 'Expert (2+ Yrs)' },
    { name: 'Express.js', category: 'backend', level: 'Expert (2+ Yrs)' },
    { name: 'RESTful APIs', category: 'backend', level: 'Expert' },
    { name: 'JWT Security', category: 'database', level: 'Advanced' },
    { name: 'CodeIgniter 4', category: 'backend', level: 'Advanced' },
    { name: 'PHP (Core)', category: 'backend', level: 'Intermediate' },
    { name: 'MySQL', category: 'database', level: 'Expert (2+ Yrs)' },
    { name: 'MongoDB', category: 'database', level: 'Expert (2+ Yrs)' },
    { name: 'PostgreSQL', category: 'database', level: 'Advanced' },
    { name: 'Git & GitHub', category: 'tools', level: 'Expert' },
    { name: 'Docker', category: 'tools', level: 'Intermediate' },
    { name: 'CI/CD Pipelines', category: 'tools', level: 'Intermediate' },
    { name: 'Firebase Hosting', category: 'tools', level: 'Advanced' },
    { name: 'Postman & Swagger', category: 'tools', level: 'Expert' },
    { name: 'Cloudways & Plesk', category: 'tools', level: 'Advanced' }
  ];

  const filteredSkills = selectedSkillCategory === 'all' 
    ? skillsData 
    : skillsData.filter(s => s.category === selectedSkillCategory);

  return (
    <>
      {/* Floating Toast Notification Containers */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card ${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} color="var(--accent-emerald)" />}
            {toast.type === 'info' && <Info size={18} color="var(--accent-cyan)" />}
            {toast.type === 'warning' && <AlertTriangle size={18} color="#f59e0b" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Cyber Grid Background */}
      <div className="cyber-grid"></div>

      {/* Backdrop decorative blobs */}
      <div className="blob blob-indigo"></div>
      <div className="blob blob-cyan"></div>
      <div className="blob blob-purple"></div>

      {/* Razorpay Sandbox Dialog Overlay */}
      {showRazorpay && (
        <div className="razorpay-overlay">
          <div className="razorpay-modal">
            <div className="razorpay-header">
              <div className="razorpay-header-left">
                <div className="razorpay-logo-img">R</div>
                <span className="razorpay-title">Razorpay Checkout Sandbox</span>
              </div>
              <button className="razorpay-close" onClick={() => setShowRazorpay(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="razorpay-body">
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                MERCHANT: <strong>LOGANATHAN WEB SOLUTIONS</strong>
              </div>

              <div className="razorpay-amount-box">
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>PURCHASE ITEM</span>
                  <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>{activeItem.name}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textAlign: 'right' }}>AMOUNT DUE</span>
                  <strong style={{ fontSize: '1.25rem', color: '#1e293b' }}>${activeItem.price}.00</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#475569' }}>Select Sandbox Payment Method:</span>

                <div 
                  className={`razorpay-method-option ${razorpayMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setRazorpayMethod('card')}
                >
                  <div className="razorpay-icon-box">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem' }}>Mock Credit / Debit Card</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Simulate VISA / MasterCard capture</span>
                  </div>
                </div>

                <div 
                  className={`razorpay-method-option ${razorpayMethod === 'netbanking' ? 'selected' : ''}`}
                  onClick={() => setRazorpayMethod('netbanking')}
                >
                  <div className="razorpay-icon-box">
                    <Globe size={18} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem' }}>Mock Net Banking</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Simulate secure banking routing API</span>
                  </div>
                </div>
              </div>

              {razorpayMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ color: '#64748b' }}>Card Number</span>
                    <input type="text" readOnly value="4111 2222 3333 4444" style={{ padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#e2e8f0', color: '#475569' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ color: '#64748b' }}>Expiry</span>
                      <input type="text" readOnly value="12 / 2029" style={{ padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#e2e8f0', color: '#475569' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ color: '#64748b' }}>CVV</span>
                      <input type="password" readOnly value="123" style={{ padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#e2e8f0', color: '#475569' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="razorpay-footer">
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>🔒 SSL Encrypted Checkout</span>
              <button 
                onClick={handleExecutePayment} 
                disabled={paymentProcessing}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {paymentProcessing ? 'Processing Transaction...' : `Pay $${activeItem.price}.00`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Sticky Navigation Navbar */}
      <nav>
        <div className="container nav-container">
          <a href="#about" className="logo">
            LOGANATHAN<span className="logo-dot"></span>
          </a>
          
          <ul className="nav-links">
            <li><a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>About</a></li>
            <li><a href="#projects" className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}>Projects Sandbox</a></li>
            <li><a href="#skills" className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}>Skills Matrix</a></li>
            <li><a href="#experience" className={`nav-link ${activeSection === 'experience' ? 'active' : ''}`}>Experience</a></li>
            <li><a href="#education" className={`nav-link ${activeSection === 'education' ? 'active' : ''}`}>Education</a></li>
            <li><a href="#contact" className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}>Contact</a></li>
          </ul>

          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileDrawerOpen(true)}
            aria-label="Open Navigation menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Slide-out Mobile Sidebar Navigation Drawer (Requested: mobile view layout) */}
      <div 
        className="mobile-drawer-overlay" 
        style={{ display: isMobileDrawerOpen ? 'block' : 'none' }}
        onClick={() => setIsMobileDrawerOpen(false)}
      ></div>
      <div className={`mobile-drawer ${isMobileDrawerOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <span style={{ fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>NAVIGATION MENU</span>
          <button style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => setIsMobileDrawerOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <ul className="mobile-drawer-links">
          <li>
            <a 
              href="#about" 
              className={`mobile-drawer-link ${activeSection === 'about' ? 'active' : ''}`}
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="#projects" 
              className={`mobile-drawer-link ${activeSection === 'projects' ? 'active' : ''}`}
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              Projects Sandbox
            </a>
          </li>
          <li>
            <a 
              href="#skills" 
              className={`mobile-drawer-link ${activeSection === 'skills' ? 'active' : ''}`}
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              Skills Matrix
            </a>
          </li>
          <li>
            <a 
              href="#experience" 
              className={`mobile-drawer-link ${activeSection === 'experience' ? 'active' : ''}`}
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              Experience
            </a>
          </li>
          <li>
            <a 
              href="#education" 
              className={`mobile-drawer-link ${activeSection === 'education' ? 'active' : ''}`}
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              Education
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              className={`mobile-drawer-link ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              Contact
            </a>
          </li>
        </ul>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div>Loganathan • Full Stack Developer</div>
          <div>Chennai, India</div>
        </div>
      </div>

      <main>
        {/* Hero Section */}
        <section id="about" className="hero">
          <div className="container">
            <div className="hero-layout">
              <div>
                <span className="hero-tag">Active Full Stack Developer</span>
                <h1 className="hero-title">
                  Hi, I'm <br />
                  <span className="gradient-text">Loganathan</span>
                </h1>
                
                {/* Immediate Contact Details */}
                <div style={{
                  display: 'flex',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                  marginBottom: '1.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)'
                }}>
                  <a 
                    href="mailto:loganathanmvit@gmail.com" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                  >
                    <Mail size={15} />
                    <span>loganathanmvit@gmail.com</span>
                  </a>
                  <a 
                    href="tel:+919514402841" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                  >
                    <Phone size={15} />
                    <span>+91 9514402841</span>
                  </a>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={15} color="var(--accent-purple)" />
                    <span>Chennai</span>
                  </div>
                </div>

                <h2 className="hero-roles">
                  Full Stack Developer
                </h2>
                
                <p className="hero-desc">
                  I specialize in building production-grade <strong>React + Node.js (MERN)</strong> web applications backed by optimized <strong>SQL</strong> and <strong>MongoDB</strong> database solutions. I engineer highly secure role-based portals (RBAC) and optimize backend database systems for speed and efficiency.
                </p>

                <div className="hero-actions">
                  <a href="#projects" className="btn btn-primary">
                    View Live Simulators <Zap size={16} />
                  </a>
                  <a href="mailto:loganathanmvit@gmail.com" className="btn btn-secondary">
                    Get In Touch
                  </a>
                </div>
              </div>

              {/* Rotating interactive badge */}
              <div className="hero-visual">
                <div className="hero-badge-container">
                  <svg viewBox="0 0 400 400" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--accent-indigo)" />
                        <stop offset="50%" stopColor="var(--accent-purple)" />
                        <stop offset="100%" stopColor="var(--accent-cyan)" />
                      </linearGradient>
                      <filter id="neonFilter" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="var(--accent-cyan)" floodOpacity="0.4" />
                      </filter>
                    </defs>
                    
                    <circle cx="200" cy="200" r="170" stroke="url(#cyberGrad)" strokeWidth="1" strokeDasharray="10, 15" opacity="0.4">
                      <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="20s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="200" cy="200" r="150" stroke="var(--accent-cyan)" strokeWidth="2" strokeDasharray="200, 40" opacity="0.7" filter="url(#neonFilter)">
                      <animateTransform attributeName="transform" type="rotate" from="360 200 200" to="0 200 200" dur="15s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="200" cy="200" r="130" stroke="var(--accent-purple)" strokeWidth="1" strokeDasharray="5, 5" opacity="0.3" />

                    <g transform="translate(135, 135)">
                      <rect width="130" height="130" rx="20" fill="rgba(12, 10, 36, 0.9)" stroke="url(#cyberGrad)" strokeWidth="2" />
                      <text x="65" y="55" fill="var(--accent-cyan)" fontSize="24" fontFamily="monospace" fontWeight="bold" textAnchor="middle">&lt; / &gt;</text>
                      <text x="65" y="85" fill="#ffffff" fontSize="14" fontFamily="sans-serif" fontWeight="600" textAnchor="middle">MERN &amp; SQL</text>
                      <text x="65" y="102" fill="var(--text-muted)" fontSize="10" fontFamily="monospace" textAnchor="middle">Node.js + MySQL</text>
                    </g>
                    
                    <circle cx="200" cy="50" r="8" fill="var(--accent-cyan)" filter="url(#neonFilter)">
                      <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="200" cy="350" r="10" fill="var(--accent-indigo)">
                      <animateTransform attributeName="transform" type="rotate" from="360 200 200" to="0 200 200" dur="12s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick Metrics stats dashboard */}
            <div className="glass-panel" style={{
              marginTop: '5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem',
              padding: '2.5rem 3rem'
            }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  2.1<span style={{ fontSize: '1.5rem', color: '#fff' }}>Yrs</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Production MERN Experience</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-indigo)' }}>
                  100%
                </div>
                <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Razorpay &amp; JWT Secure Integrations</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  8<span style={{ fontSize: '1.5rem', color: '#fff' }}>ms</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>SQL Database Query Performance</div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Showcase section */}
        <section id="projects">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">PROJECTS SANDBOX</span>
              <h2 className="section-title">Interactive Engineering Demos</h2>
              <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                Test drive the core functional modules I built. Toggle query indexes, trigger role logins, or see JWT auth workflows in real-time.
              </p>
            </div>

            <div className="projects-layout">
              
              {/* Project 1: Billing & Inventory App (Expanded as requested) */}
              <div className="project-card">
                <div className="project-info">
                  <span className="project-meta">FULL STACK DEVELOPER • MERN STACK &amp; SQL</span>
                  <h3 className="project-header-title">Billing &amp; Inventory Management Application</h3>
                  
                  <div className="project-desc-bubble">
                    A secure billing and real-time inventory management tool. Features Razorpay payments, dynamic stock alerts, automated webhook verification, and automated customer transaction auditing queries.
                  </div>

                  <div className="project-tags">
                    <span className="project-tag" style={{
                      borderColor: highlightedSkill === 'React.js' ? 'var(--accent-cyan)' : 'var(--border-color)',
                      color: highlightedSkill === 'React.js' ? '#fff' : 'var(--text-secondary)'
                    }}>React.js</span>
                    <span className="project-tag" style={{
                      borderColor: highlightedSkill === 'Node.js' ? 'var(--accent-cyan)' : 'var(--border-color)',
                      color: highlightedSkill === 'Node.js' ? '#fff' : 'var(--text-secondary)'
                    }}>Node.js</span>
                    <span className="project-tag" style={{
                      borderColor: highlightedSkill === 'MySQL' ? 'var(--accent-cyan)' : 'var(--border-color)',
                      color: highlightedSkill === 'MySQL' ? '#fff' : 'var(--text-secondary)'
                    }}>MySQL Database</span>
                    <span className="project-tag" style={{
                      borderColor: highlightedSkill === 'JWT Security' ? 'var(--accent-cyan)' : 'var(--border-color)',
                      color: highlightedSkill === 'JWT Security' ? '#fff' : 'var(--text-secondary)'
                    }}>Razorpay API</span>
                    <span className="project-tag" style={{
                      borderColor: highlightedSkill === 'Git & GitHub' ? 'var(--accent-cyan)' : 'var(--border-color)',
                      color: highlightedSkill === 'Git & GitHub' ? '#fff' : 'var(--text-secondary)'
                    }}>Inventory Stock Sync</span>
                  </div>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <CheckCircle2 size={16} color="var(--accent-emerald)" />
                      <span>Razorpay payment gateway checkout integration with custom webhooks</span>
                    </li>
                    <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <CheckCircle2 size={16} color="var(--accent-emerald)" />
                      <span>Inventory synchronizer: automated stock deducts and Low Stock warning flags</span>
                    </li>
                    <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <CheckCircle2 size={16} color="var(--accent-emerald)" />
                      <span>Optimized composite index queries avoiding full table scans in MySQL</span>
                    </li>
                  </ul>
                </div>

                {/* Billing & Inventory interactive Simulator */}
                <div className="simulator-panel">
                  <div className="simulator-header">
                    <div className="simulator-title-bar">
                      <div className="simulator-status-dot"></div>
                      <span className="simulator-title">billing_inventory_sandbox.exe</span>
                    </div>

                    <div className="simulator-controls">
                      <button 
                        className={`simulator-tab ${billingSimTab === 'invoice' ? 'active' : ''}`}
                        onClick={() => setBillingSimTab('invoice')}
                      >
                        Razorpay Checkout
                      </button>
                      <button 
                        className={`simulator-tab ${billingSimTab === 'latency' ? 'active' : ''}`}
                        onClick={() => setBillingSimTab('latency')}
                      >
                        MySQL Index Optimizer
                      </button>
                      <button 
                        className={`simulator-tab ${billingSimTab === 'jwt' ? 'active' : ''}`}
                        onClick={() => setBillingSimTab('jwt')}
                      >
                        JWT Auth Cycles
                      </button>
                    </div>
                  </div>

                  <div className="simulator-content">
                    
                    {/* Invoice & Inventory Sandbox tab */}
                    {billingSimTab === 'invoice' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
                        
                        {/* Selectable Inventory lists */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          {inventoryItems.map((item) => (
                            <div 
                              key={item.id}
                              onClick={() => selectInventoryItem(item.id)}
                              style={{
                                background: item.selected ? 'rgba(0, 242, 254, 0.08)' : 'rgba(255,255,255,0.02)',
                                border: item.selected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                                borderRadius: '10px',
                                padding: '0.75rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem'
                              }}
                            >
                              <strong style={{ fontSize: '0.8rem', color: '#fff' }}>{item.name}</strong>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>${item.price}.00</span>
                                
                                <span className={`stock-tag ${
                                  item.stock <= 0 ? 'out-of-stock' : item.stock < 5 ? 'low-stock' : 'in-stock'
                                }`}>
                                  {item.stock <= 0 ? 'Out of Stock' : `${item.stock} Left`}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Visual invoice document inside card */}
                        <div className="billing-invoice-mock">
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>
                            <span>INV-2026-104</span>
                            <span>Date: 2026-07-01</span>
                          </div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <h4 style={{ color: '#1e293b', fontSize: '0.9rem', fontWeight: 800 }}>Loganathan Web Solutions</h4>
                            <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Customer Ref: #9812</p>
                          </div>
                          
                          <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '0.4rem 0', margin: '0.4rem 0', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>{activeItem.name}</span>
                              <span style={{ fontWeight: 600 }}>${activeItem.price}.00</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                            <span style={{
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.65rem',
                              fontWeight: 'bold',
                              background: invoicePaid ? '#d1fae5' : '#fee2e2',
                              color: invoicePaid ? '#065f46' : '#991b1b'
                            }}>
                              {invoicePaid ? 'PAID via Razorpay' : 'UNPAID'}
                            </span>
                            <span style={{ fontSize: '1rem', fontWeight: 800 }}>${activeItem.price}.00</span>
                          </div>
                        </div>

                        {/* Pay Buttons */}
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                          <button 
                            className="btn btn-primary" 
                            style={{ fontSize: '0.8rem', padding: '0.5rem 1.2rem', borderRadius: '8px' }}
                            onClick={handlePayClick}
                            disabled={invoicePaid || activeItem.stock <= 0}
                          >
                            {invoicePaid ? 'Transaction Succeeded ✓' : 'Pay with Razorpay 💳'}
                          </button>
                          {invoicePaid && (
                            <button 
                              className="btn btn-secondary" 
                              style={{ fontSize: '0.8rem', padding: '0.5rem 1.2rem', borderRadius: '8px' }}
                              onClick={handleResetBilling}
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        {/* Real-time server simulation logs */}
                        <div style={{
                          background: '#04020f',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '8px',
                          padding: '0.65rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          flex: 1,
                          overflowY: 'auto',
                          color: '#a5f3fc'
                        }}>
                          <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.2rem' }}>NODE.JS SERVER STACKS &amp; WEBHOOK LOGS</div>
                          {billingLogs.map((log, i) => (
                            <div key={i} style={{ marginBottom: '0.15rem' }}>{log}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SQL Optimization tab */}
                    {billingSimTab === 'latency' && (
                      <div className="db-chart-container">
                        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                          <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>Query Execution Latency Optimizer</h4>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Toggle SQL indexes configuration to witness transaction query speeds drop.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          <div className="chart-bar-container">
                            <div className="chart-bar-label">
                              <span>Full Table Scan (Standard Query)</span>
                              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>120 ms</span>
                            </div>
                            <div className="chart-bar-track">
                              <div className="chart-bar-fill red" style={{ width: '100%' }}>
                                <span style={{ color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>Slow (Scanned 84,200 Rows)</span>
                              </div>
                            </div>
                          </div>

                          <div className="chart-bar-container">
                            <div className="chart-bar-label">
                              <span>Composite Key Index Query</span>
                              <span style={{ color: '#00f5a0', fontWeight: 'bold' }}>8 ms</span>
                            </div>
                            <div className="chart-bar-track">
                              <div className="chart-bar-fill emerald" style={{ width: dbOptimized ? '8%' : '0%' }}>
                                {dbOptimized && <span style={{ paddingLeft: '0.5rem' }}>8ms</span>}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <strong>Index status:</strong> {dbOptimized ? 'Index (idx_customer_status) ENABLED ✓' : 'Index DISABLED (Using Full Scans)'}
                          </div>
                          <button 
                            className="btn btn-primary" 
                            style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', borderRadius: '6px', minWidth: '130px' }}
                            onClick={handleToggleSqlIndex}
                          >
                            {dbOptimized ? 'Disable Index' : 'Optimize SQL'}
                          </button>
                        </div>

                        <div style={{
                          background: '#04020f',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          color: '#a5f3fc'
                        }}>
                          <strong>SQL Statement:</strong> <br />
                          {dbOptimized 
                            ? 'EXPLAIN SELECT * FROM invoices FORCE INDEX(idx_customer_status) WHERE customer_id = 9812; -- Speed: 8ms (12 rows scanned)'
                            : 'SELECT * FROM invoices WHERE customer_id = 9812; -- Speed: 120ms (84,200 rows scanned)'
                          }
                        </div>
                      </div>
                    )}

                    {/* JWT verification tab */}
                    {billingSimTab === 'jwt' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Step-by-Step Security Validator</span>
                          <button 
                            className="btn btn-outline-cyan" 
                            style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem', borderRadius: '6px' }}
                            onClick={runJwtCycle}
                            disabled={jwtStep > 0 && jwtStep < 6}
                          >
                            Run Flow
                          </button>
                        </div>

                        {/* JWT Steps visual */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                          <div style={{
                            padding: '0.5rem 0.25rem',
                            borderRadius: '6px',
                            background: jwtStep >= 1 ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.02)',
                            border: jwtStep >= 1 ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                            fontSize: '0.7rem'
                          }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.2rem' }}>1. Client</div>
                            <span style={{ color: jwtStep >= 1 ? '#fff' : 'var(--text-muted)' }}>Send JWT Token</span>
                          </div>
                          <div style={{
                            padding: '0.5rem 0.25rem',
                            borderRadius: '6px',
                            background: jwtStep >= 2 ? 'rgba(127, 0, 255, 0.15)' : 'rgba(255,255,255,0.02)',
                            border: jwtStep >= 2 ? '1px solid var(--accent-indigo)' : '1px solid var(--border-color)',
                            fontSize: '0.7rem'
                          }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.2rem' }}>2. Server</div>
                            <span style={{ color: jwtStep >= 2 ? '#fff' : 'var(--text-muted)' }}>Intercept Header</span>
                          </div>
                          <div style={{
                            padding: '0.5rem 0.25rem',
                            borderRadius: '6px',
                            background: jwtStep >= 4 ? 'rgba(189, 0, 255, 0.15)' : 'rgba(255,255,255,0.02)',
                            border: jwtStep >= 4 ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
                            fontSize: '0.7rem'
                          }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.2rem' }}>3. Crypt</div>
                            <span style={{ color: jwtStep >= 4 ? '#fff' : 'var(--text-muted)' }}>Verify Key Secret</span>
                          </div>
                          <div style={{
                            padding: '0.5rem 0.25rem',
                            borderRadius: '6px',
                            background: jwtStep >= 6 ? 'rgba(0, 245, 160, 0.15)' : 'rgba(255,255,255,0.02)',
                            border: jwtStep >= 6 ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                            fontSize: '0.7rem'
                          }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.2rem' }}>4. Data</div>
                            <span style={{ color: jwtStep >= 6 ? '#fff' : 'var(--text-muted)' }}>Return payload</span>
                          </div>
                        </div>

                        {/* JWT Output Console */}
                        <div style={{
                          background: '#04020f',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          flex: 1,
                          overflowY: 'auto',
                          color: '#00f5a0'
                        }}>
                          {jwtLogs.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Logs will print here step-by-step...</span>}
                          {jwtLogs.map((log, index) => (
                            <div key={index} style={{ marginBottom: '0.2rem' }}>{log}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Project 2: School Management System & Parent Portal */}
              <div className="project-card reverse">
                
                {/* School RBAC simulator */}
                <div className="simulator-panel">
                  <div className="simulator-header">
                    <div className="simulator-title-bar">
                      <div className="simulator-status-dot"></div>
                      <span className="simulator-title">school_management_rbac.auth</span>
                    </div>

                    <div className="simulator-controls" style={{ display: 'flex', gap: '0.25rem' }}>
                      {['admin', 'staff', 'parent', 'student'].map((role) => (
                        <button
                          key={role}
                          className={`simulator-tab ${schoolRole === role ? 'active' : ''}`}
                          style={{ textTransform: 'capitalize' }}
                          onClick={() => {
                            setSchoolRole(role);
                            addToast(`Logged in as Role: ${role}`, 'info');
                          }}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="simulator-content" style={{ background: '#0b0f19', color: '#e2e8f0', fontSize: '0.9rem' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.65rem', fontWeight: 'bold', color: '#fff', padding: '0.2rem 0.35rem' }}>SCH</div>
                        <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>OneSchool Management</span>
                      </div>
                      
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', background: 'rgba(0, 242, 254, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        JWT Scope: {schoolRole}
                      </div>
                    </div>

                    {schoolRole === 'admin' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h4 style={{ color: '#fff', fontSize: '1rem' }}>Administrator Hub Dashboard</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>SCHOOL ENROLLMENT</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>1,420 Students</div>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>FEES REVENUE</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-emerald)' }}>$92,450.00</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(127, 0, 255, 0.2)', border: '1px solid var(--accent-indigo)', borderRadius: '4px' }}>✓ Student Records CRUD</span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(127, 0, 255, 0.2)', border: '1px solid var(--accent-indigo)', borderRadius: '4px' }}>✓ Academic Calendars</span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(127, 0, 255, 0.2)', border: '1px solid var(--accent-indigo)', borderRadius: '4px' }}>✓ Financial Master Log</span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(127, 0, 255, 0.2)', border: '1px solid var(--accent-indigo)', borderRadius: '4px' }}>✓ User Permissions Manager</span>
                        </div>
                      </div>
                    )}

                    {schoolRole === 'staff' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h4 style={{ color: '#fff', fontSize: '1rem' }}>Staff &amp; Teacher Portal</h4>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>MY CURRENT CLASS</span>
                          <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>Grade 10B Homeroom (38 Pupils)</span>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem' }}>Mark Attendance: <strong>July 1</strong></span>
                          <button className="btn btn-outline-cyan" style={{ fontSize: '0.7rem', padding: '0.25rem 0.75rem', borderRadius: '4px' }} onClick={() => addToast('Homeroom attendance marks saved.', 'success')}>Submit (35/38 Present)</button>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}>✓ Mark Attendance</span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}>✓ Input Test Scores</span>
                          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '4px', color: '#fda4af' }}>✗ Financial Logs (Blocked)</span>
                        </div>
                      </div>
                    )}

                    {schoolRole === 'parent' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h4 style={{ color: '#fff', fontSize: '1rem' }}>Parent Portal (Secure Child Tracking)</h4>
                        
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>STUDENT: LOGANATHAN JR.</span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>Grade 10B • Roll #21</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>ATTENDANCE</span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--accent-emerald)' }}>98.2% Present</span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '0.75rem' }}>
                          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TERMLY EXAM</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>7.9 CGPA</div>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.15rem' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PENDING DUES</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f87171' }}>$150.00 Library Fee</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {schoolRole === 'student' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h4 style={{ color: '#fff', fontSize: '1rem' }}>Student Portal</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>TODAY'S SCHEDULE</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>4 Classes Scheduled</span>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>HOMEWORK DUE</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-purple)' }}>2 Assignments</span>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.8rem', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                          📌 <strong>Announcements:</strong> Science lab examinations scheduled on July 8.
                        </div>
                      </div>
                    )}

                    {/* School access control logs */}
                    <div style={{
                      marginTop: '1.25rem',
                      background: '#04020f',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      color: '#a5f3fc',
                      minHeight: '100px',
                      maxHeight: '120px',
                      overflowY: 'auto'
                    }}>
                      <div style={{ color: 'var(--text-muted)', paddingBottom: '0.2rem', marginBottom: '0.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>SECURITY GATEWAY LOGS (EXPRESS API / JWT / RBAC)</div>
                      {schoolTerminalLogs.map((log, i) => (
                        <div key={i} style={{ marginBottom: '0.15rem', color: log.includes('200 OK') ? '#34d399' : '#f87171' }}>{log}</div>
                      ))}
                    </div>

                  </div>
                </div>

                {/* School portal info */}
                <div className="project-info">
                  <span className="project-meta">FULL STACK DEVELOPER • VERSION TECHNOLOGY</span>
                  <h3 className="project-header-title">School Management System</h3>
                  
                  <div className="project-desc-bubble">
                    A multi-role administrative system featuring student record structures, parent portals, and grading pipelines. Implemented granular JWT role-based security layers preventing cross-role access.
                  </div>

                  <div className="project-tags">
                    <span className="project-tag" style={{
                      borderColor: highlightedSkill === 'React.js' ? 'var(--accent-cyan)' : 'var(--border-color)',
                      color: highlightedSkill === 'React.js' ? '#fff' : 'var(--text-secondary)'
                    }}>React.js</span>
                    <span className="project-tag" style={{
                      borderColor: highlightedSkill === 'Node.js' ? 'var(--accent-cyan)' : 'var(--border-color)',
                      color: highlightedSkill === 'Node.js' ? '#fff' : 'var(--text-secondary)'
                    }}>Node.js</span>
                    <span className="project-tag" style={{
                      borderColor: highlightedSkill === 'Express.js' ? 'var(--accent-cyan)' : 'var(--border-color)',
                      color: highlightedSkill === 'Express.js' ? '#fff' : 'var(--text-secondary)'
                    }}>Express.js</span>
                    <span className="project-tag" style={{
                      borderColor: highlightedSkill === 'PostgreSQL' ? 'var(--accent-cyan)' : 'var(--border-color)',
                      color: highlightedSkill === 'PostgreSQL' ? '#fff' : 'var(--text-secondary)'
                    }}>PostgreSQL</span>
                    <span className="project-tag" style={{
                      borderColor: highlightedSkill === 'JWT Security' ? 'var(--accent-cyan)' : 'var(--border-color)',
                      color: highlightedSkill === 'JWT Security' ? '#fff' : 'var(--text-secondary)'
                    }}>RBAC Layer</span>
                  </div>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <CheckCircle2 size={16} color="var(--accent-emerald)" />
                      <span>Built unified dashboard matching 4 distinct user groups (Admin, Staff, Parent, Student)</span>
                    </li>
                    <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <CheckCircle2 size={16} color="var(--accent-emerald)" />
                      <span>Secured APIs with JWT and role middleware validating token scopes before execution</span>
                    </li>
                    <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <CheckCircle2 size={16} color="var(--accent-emerald)" />
                      <span>Replaced paper registers and spreadsheets with high-throughput online attendance systems</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Project 3: PHP Legacy Migration (Shrunk Footprint as requested) */}
              <div className="glass-panel" style={{
                padding: '2.5rem',
                gridColumn: '1 / -1',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '2rem'
              }}>
                <div style={{ flex: '1', minWidth: '280px' }}>
                  <span className="project-meta">PRODUCTION INFRASTRUCTURE modernization</span>
                  <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>PHP Legacy Codebase Migration</h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Upgraded active, live enterprise software modules from PHP 7 (CodeIgniter 2) to PHP 8 (CodeIgniter 4.4.6) and modernized database connection schemes. Standardized on PSR-4 autoload autoload namespaces and parameterized query builders with 100% test coverage post-launch.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', maxWidth: '400px' }}>
                  <span style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: '#fff' }}>PHP 7 ➔ 8</span>
                  <span style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: '#fff' }}>CodeIgniter 2 ➔ 4.4.6</span>
                  <span style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: '#fff' }}>50+ Legacy Modules Upgraded</span>
                  <span style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(0, 245, 160, 0.1)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)' }}>0 production incidents</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">MY TOOLKIT</span>
              <h2 className="section-title">Skills &amp; Technology Matrix</h2>
              <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                Filter skills by category. Hover or tap on a skill to highlight which project cards on this page utilized that technology.
              </p>
            </div>

            <div className="skills-container">
              
              <div className="skills-sidebar">
                {[
                  { id: 'all', label: 'All Technologies' },
                  { id: 'frontend', label: 'Frontend & UI' },
                  { id: 'backend', label: 'Backend & APIs' },
                  { id: 'database', label: 'Databases & Auth' },
                  { id: 'tools', label: 'Tools & DevOps' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    className={`skill-category-btn ${selectedSkillCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedSkillCategory(cat.id)}
                  >
                    <span>{cat.label}</span>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>

              <div className="skills-grid-active">
                {filteredSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="glass-panel skill-card"
                    onMouseEnter={() => setHighlightedSkill(skill.name)}
                    onMouseLeave={() => setHighlightedSkill(null)}
                    onClick={() => setHighlightedSkill(skill.name)}
                    style={{
                      borderColor: highlightedSkill === skill.name ? 'var(--accent-cyan)' : 'var(--border-color)',
                      boxShadow: highlightedSkill === skill.name ? 'var(--neon-cyan-glow)' : 'none'
                    }}
                  >
                    <div className="skill-icon-wrap">
                      {skill.category === 'frontend' && <Code size={20} />}
                      {skill.category === 'backend' && <Server size={20} />}
                      {skill.category === 'database' && <Database size={20} />}
                      {skill.category === 'tools' && <Wrench size={20} />}
                    </div>
                    <h3 className="skill-card-title">{skill.name}</h3>
                    <span className="skill-card-level">{skill.level}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">PROFESSIONAL CAREER</span>
              <h2 className="section-title">Where I've Worked</h2>
            </div>

            <div className="exp-timeline">
              
              <div className="exp-item">
                <div className="exp-dot">
                  <Terminal size={14} color="var(--accent-cyan)" />
                </div>

                <div className="glass-panel" style={{ padding: '2.5rem' }}>
                  <div className="exp-card-header">
                    <div className="exp-company-block">
                      <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.25rem' }}>Full Stack Developer</h3>
                      <a href="#" className="exp-company-link">Version Technology</a>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}> • Chennai, Tamil Nadu (On-site)</span>
                    </div>

                    <span className="exp-time-tag">May 2024 – Present</span>
                  </div>

                  <ul className="exp-highlights-list">
                    <li className="exp-highlight-item">
                      <span className="exp-highlight-bullet">▸</span>
                      <span>Built full-stack billing and inventory applications utilizing React, Express, MySQL, MongoDB, and Razorpay APIs.</span>
                    </li>
                    <li className="exp-highlight-item">
                      <span className="exp-highlight-bullet">▸</span>
                      <span>Designed secure role-based access gateways ensuring students, parents, and administrative staff only retrieve authorized database entries.</span>
                    </li>
                    <li className="exp-highlight-item">
                      <span className="exp-highlight-bullet">▸</span>
                      <span>Optimized backend database architecture and indexing layouts, improving API endpoint query performance.</span>
                    </li>
                    <li className="exp-highlight-item">
                      <span className="exp-highlight-bullet">▸</span>
                      <span>Upgraded production environments from legacy PHP 7 and CodeIgniter 2 to robust PHP 8 and CodeIgniter 4 setups.</span>
                    </li>
                  </ul>

                  <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Key Projects Completed:</h4>
                    <div className="exp-subprojects">
                      
                      <div className="exp-subproject-card">
                        <h5 className="exp-subproject-title">Billing &amp; Inventory Sync</h5>
                        <p className="exp-subproject-desc">Replaced manual processes by generating automatic invoice cycles, Razorpay checkouts, and real-time inventory synchronizations.</p>
                      </div>

                      <div className="exp-subproject-card">
                        <h5 className="exp-subproject-title">Multi-Role Parent Portal</h5>
                        <p className="exp-subproject-desc">Unified student records, homeroom attendance registers, and termly exam result catalogs with a parent portal.</p>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Education & Academics Section */}
        <section id="education">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">ACADEMICS</span>
              <h2 className="section-title">Education &amp; Training</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              <div className="glass-panel" style={{ padding: '2.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', background: 'rgba(0,242,254,0.08)', padding: '0.3rem 0.8rem', borderRadius: '100px', display: 'inline-block', marginBottom: '1.5rem' }}>2019 - 2023</span>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>B.E. Information Technology</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Manakula Vinayagar Engineering College, Puducherry</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Graduated</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent-emerald)', fontSize: '1.1rem' }}>CGPA: 7.9 / 10</span>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '2.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-indigo)', background: 'rgba(127,0,255,0.08)', padding: '0.3rem 0.8rem', borderRadius: '100px', display: 'inline-block', marginBottom: '1.5rem' }}>Professional Training</span>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>Full Stack Development Course</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Accord Info Matrix, Chennai</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Specialization</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>React, Node, DB APIs</span>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '2.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)', background: 'rgba(189,0,255,0.08)', padding: '0.3rem 0.8rem', borderRadius: '100px', display: 'inline-block', marginBottom: '1.5rem' }}>Internship Experience</span>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>FlutterFlow Mobile Intern</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Askan Technology, Pondicherry</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Duration</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent-purple)', fontSize: '0.95rem' }}>3 Months (2023)</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Contact section */}
        <section id="contact">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">GET IN TOUCH</span>
              <h2 className="section-title">Let's Build Something Together</h2>
              <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                I'm actively looking for new opportunities. Whether you have an open position, a project proposal, or just want to connect, feel free to drop me a line!
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
              marginTop: '3rem'
            }}>
              
              <a href="mailto:loganathanmvit@gmail.com" className="glass-panel contact-channel-card">
                <div className="contact-channel-icon-box">
                  <Mail size={24} />
                </div>
                <div className="contact-channel-info">
                  <h4>Email</h4>
                  <p>loganathanmvit@gmail.com</p>
                </div>
              </a>

              <a href="https://wa.me/919514402841?text=Hi%20Logan,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect." target="_blank" rel="noopener noreferrer" className="glass-panel contact-channel-card">
                <div className="contact-channel-icon-box" style={{ color: '#25d366' }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.458 4.887 1.459 5.43 0 9.844-4.414 9.847-9.847.002-2.63-1.023-5.101-2.887-6.967C16.63 1.933 14.155.91 11.533.91c-5.433 0-9.849 4.415-9.852 9.85-.001 1.83.479 3.618 1.39 5.196L1.934 22.07l6.3-1.654c1.558.85 3.09 1.272 4.413 1.273zm10.73-7.872c-.297-.148-1.758-.868-2.03-.967-.273-.099-.471-.148-.669.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.568-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                </div>
                <div className="contact-channel-info">
                  <h4>WhatsApp</h4>
                  <p>+91 9514402841</p>
                </div>
              </a>

              <a href="https://linkedin.com/in/loganathan-v" target="_blank" rel="noopener noreferrer" className="glass-panel contact-channel-card">
                <div className="contact-channel-icon-box">
                  <ExternalLink size={24} />
                </div>
                <div className="contact-channel-info">
                  <h4>LinkedIn</h4>
                  <p>linkedin.com/in/loganathan-v</p>
                </div>
              </a>

              <a href="tel:+919514402841" className="glass-panel contact-channel-card">
                <div className="contact-channel-icon-box">
                  <Phone size={24} />
                </div>
                <div className="contact-channel-info">
                  <h4>Phone</h4>
                  <p>+91 9514402841</p>
                </div>
              </a>

            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer>
        <div className="container">
          <ul className="footer-nav">
            <li><a href="#about" className="footer-nav-link">About</a></li>
            <li><a href="#projects" className="footer-nav-link">Projects</a></li>
            <li><a href="#skills" className="footer-nav-link">Skills</a></li>
            <li><a href="#experience" className="footer-nav-link">Experience</a></li>
            <li><a href="#contact" className="footer-nav-link">Contact</a></li>
          </ul>
          <p className="footer-copyright">
            Designed &amp; Engineered by <span>Loganathan</span> © 2026. Built with React and Custom Vanilla CSS.
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp Widget */}
      <a 
        href="https://wa.me/919514402841?text=Hi%20Logan,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect." 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 998,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#25d366',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          textDecoration: 'none',
          cursor: 'pointer',
          animation: 'pulse-glow-whatsapp 2s infinite',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 211, 102, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.4)';
        }}
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.458 4.887 1.459 5.43 0 9.844-4.414 9.847-9.847.002-2.63-1.023-5.101-2.887-6.967C16.63 1.933 14.155.91 11.533.91c-5.433 0-9.849 4.415-9.852 9.85-.001 1.83.479 3.618 1.39 5.196L1.934 22.07l6.3-1.654c1.558.85 3.09 1.272 4.413 1.273zm10.73-7.872c-.297-.148-1.758-.868-2.03-.967-.273-.099-.471-.148-.669.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.568-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        </svg>
      </a>
    </>
  );
}

export default App;
