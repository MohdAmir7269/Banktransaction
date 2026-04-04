import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // Nav Item Style Logic
    const getLinkStyle = (path) => {
        const isActive = location.pathname === path;
        return {
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
            padding: '10px 20px',
            borderRadius: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: isActive ? '#fff' : '#64748b',
            background: isActive ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' : 'transparent',
            boxShadow: isActive ? '0 10px 15px -3px rgba(79, 70, 229, 0.4)' : 'none',
        };
    };

    return (
        <div style={{ padding: '20px 40px', position: 'sticky', top: 0, zIndex: 1000 }}>
            <nav style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)',
                borderRadius: '24px',
                padding: '10px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
            }}>
                {/* 1. BRAND LOGO */}
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                    <div style={{
                        width: '42px',
                        height: '42px',
                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.5)',
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: '800'
                    }}>
                        B
                    </div>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.5px' }}>
                        Bank<span style={{ color: '#4F46E5' }}>Dash</span>
                    </span>
                </Link>

                {/* 2. NAVIGATION LINKS */}
                <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '6px', borderRadius: '16px' }}>
                    <Link to="/dashboard" style={getLinkStyle('/dashboard')}>
                        🏠 Dashboard
                    </Link>
                    <Link to="/transfer" style={getLinkStyle('/transfer')}>
                        💸 Transactions
                    </Link>
                </div>

                {/* 3. USER ACTIONS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right', display: 'md-block' }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                            {user?.name?.split(' ')[0] || 'User'}
                        </p>
                        <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600', textTransform: 'uppercase' }}>
                            ● Active
                        </span>
                    </div>

                    {/* Avatar circle */}
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#4F46E5',
                        border: '2px solid #fff',
                        boxShadow: '0 0 0 2px #4F46E5'
                    }}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>

                    <button 
                        onClick={handleLogout}
                        style={{
                            padding: '10px 18px',
                            background: '#f1f5f9',
                            color: '#ef4444',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: '700',
                            fontSize: '13px',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.target.style.background = '#fee2e2' }}
                        onMouseLeave={(e) => { e.target.style.background = '#f1f5f9' }}
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;