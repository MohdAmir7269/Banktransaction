import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    background: 'radial-gradient(circle at top right, #EEF2FF, #F8FAFC, #E0E7FF)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    overflowY: 'auto',
  },
  wrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  leftPanel: {
    flex: 1,
    minWidth: '350px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '60px 80px',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.3)',
  },
  rightPanel: {
    flex: 1.2,
    minWidth: '350px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 40px',
  },
  glassCard: {
    width: '100%',
    maxWidth: '460px',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(15px)',
    borderRadius: '40px',
    padding: '50px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.7)',
  },
  inputField: {
    width: '100%',
    padding: '18px 20px',
    borderRadius: '20px',
    border: '1px solid #E2E8F0',
    backgroundColor: 'white',
    fontSize: '15px',
    color: '#1E293B',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    marginBottom: '15px',
  },
  primaryBtn: {
    width: '100%',
    padding: '18px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 10px 20px -5px rgba(79, 70, 229, 0.4)',
    marginTop: '10px'
  },
  badge: {
    display: 'inline-flex',
    padding: '8px 16px',
    borderRadius: '100px',
    background: 'rgba(79, 70, 229, 0.1)',
    color: '#4F46E5',
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '20px',
  }
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // ✅ name updated to match backend controller
  const [formData, setFormData] = useState({
    name: '', 
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin 
      ? 'http://localhost:5000/api/auth/login' 
      : 'http://localhost:5000/api/auth/register';

    try {
      const response = await axios.post(endpoint, formData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // ✅ CHANGE HERE: Pura user object save karein taaki dashboard pe naam dikhe
        localStorage.setItem('user', JSON.stringify(response.data.user)); 
        
        alert(isLogin ? "Welcome Back!" : "Account Created Successfully!");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Auth Error:", error);
      alert(error.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          input:focus { border-color: #6366F1 !important; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important; }
          .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 15px 25px -5px rgba(79, 70, 229, 0.5) !important; transition: 0.3s; }
          @media (max-width: 900px) {
            .main-wrapper { flex-direction: column !important; }
            .left-side { padding: 40px !important; order: 2; }
            .right-side { padding: 40px 20px !important; order: 1; }
          }
        `}
      </style>

      <div className="main-wrapper" style={styles.wrapper}>
        <div className="left-side" style={styles.leftPanel}>
          <div style={styles.badge}>✨ Secure Banking Portal</div>
          <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#1E293B', lineHeight: '1.2', margin: '0 0 20px 0' }}>
            Banking that<br /><span style={{ color: '#4F46E5' }}>moves with you.</span>
          </h1>
          <p style={{ fontSize: '17px', color: '#64748B', lineHeight: '1.6', marginBottom: '30px' }}>
            Seamlessly manage transactions and track expenses with our next-gen platform.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {['Instant Transfer', 'Secure Ledger', 'Priority Support'].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600', color: '#334155' }}>
                <span style={{ color: '#4F46E5' }}>●</span> {f}
              </div>
            ))}
          </div>
        </div>

        <div className="right-side" style={styles.rightPanel}>
          <div style={styles.glassCard}>
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '14px' }}>
                {isLogin ? 'Securely log in to your account.' : 'Join us to start your banking journey.'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <input 
                  name="name" // ✅ Matches Backend {name}
                  style={styles.inputField} 
                  type="text" 
                  placeholder="Full Name" 
                  onChange={handleChange}
                  required
                />
              )}
              <input 
                name="email"
                style={styles.inputField} 
                type="email" 
                placeholder="Email Address" 
                onChange={handleChange}
                required
              />
              <input 
                name="password"
                style={styles.inputField} 
                type="password" 
                placeholder="Password" 
                onChange={handleChange}
                required
              />
              
              <button 
                className="btn-hover" 
                style={{...styles.primaryBtn, opacity: loading ? 0.7 : 1}}
                disabled={loading}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <p style={{ fontSize: '14px', color: '#64748B' }}>
                {isLogin ? "New here?" : "Already a member?"}
                <span 
                  onClick={() => setIsLogin(!isLogin)}
                  style={{ color: '#4F46E5', fontWeight: '700', cursor: 'pointer', marginLeft: '8px' }}
                >
                  {isLogin ? 'Create Account' : 'Login Now'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;