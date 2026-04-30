import React, { useEffect, useState } from 'react';
import api from "../utils/api";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // ✅ Get User Account
                const accRes = await api.get('/api/account');
                console.log("📦 Account Response:", accRes.data);

                let activeAccount = null;

                // handle both response formats
                if (accRes.data?.accounts?.length > 0) {
                    activeAccount = accRes.data.accounts[0];
                } else if (accRes.data?.account) {
                    activeAccount = accRes.data.account;
                }

                if (activeAccount) {
                    setAccount(activeAccount);

                    // ✅ Get Transaction History
                    const historyRes = await api.get('/api/transactions/history');
                    console.log("📜 Transactions:", historyRes.data);

                    setTransactions(historyRes.data.transactions || []);
                }

            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            Loading Dashboard...
        </div>
    );

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>👋 Welcome, {user?.name}</h2>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => navigate('/transfer')}
                        style={{
                            cursor: 'pointer',
                            background: '#4F46E5',
                            color: 'white',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                        }}
                    >
                        Send Money
                    </button>

                    <button
                        onClick={handleLogout}
                        style={{
                            cursor: 'pointer',
                            border: '1px solid red',
                            color: 'red',
                            background: 'none',
                            padding: '8px 15px',
                            borderRadius: '8px'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Balance Card */}
            {account ? (
                <div style={{
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    color: 'white',
                    padding: '25px',
                    borderRadius: '16px',
                    marginBottom: '30px'
                }}>
                    <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>
                        CURRENT BALANCE
                    </p>

                    <h1 style={{ margin: '8px 0', fontSize: '36px' }}>
                        ₹{account.balance?.toLocaleString()}
                    </h1>

                    <small style={{ opacity: 0.7 }}>
                        Account: ...{account._id?.toString().slice(-8)}
                    </small>
                </div>
            ) : (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <p>No account found</p>
                </div>
            )}

            {/* Ledger Table */}
            <div style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #ddd'
            }}>
                <h3 style={{ marginTop: 0, marginBottom: '15px' }}>
                    📋 Recent Ledger Entries
                </h3>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={thStyle}>TYPE</th>
                                <th style={thStyle}>ACCOUNT INFO</th>
                                <th style={thStyle}>AMOUNT</th>
                                <th style={thStyle}>STATUS</th>
                                <th style={thStyle}>DATE</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((tx) => {

                                    // ✅ FIXED: compare with account._id (NOT user id)
                                    const isCredit = tx.toAccount?.toString() === account?._id?.toString();

                                    return (
                                        <tr key={tx._id}
                                            style={{ borderBottom: '1px solid #f1f5f9' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                        >
                                            {/* TYPE */}
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    background: isCredit ? '#D1FAE5' : '#FEE2E2',
                                                    color: isCredit ? '#065F46' : '#991B1B'
                                                }}>
                                                    {isCredit ? '⬇ CREDIT' : '⬆ DEBIT'}
                                                </span>
                                            </td>

                                            {/* ACCOUNT INFO */}
                                            <td style={tdStyle}>
                                                {isCredit
                                                    ? `From: ...${tx.fromAccount?.toString().slice(-8)}`
                                                    : `To: ...${tx.toAccount?.toString().slice(-8)}`
                                                }
                                            </td>

                                            {/* AMOUNT */}
                                            <td style={{
                                                ...tdStyle,
                                                fontWeight: 'bold',
                                                fontSize: '15px',
                                                color: isCredit ? '#10B981' : '#EF4444'
                                            }}>
                                                {isCredit
                                                    ? `+₹${tx.amount?.toLocaleString()}`
                                                    : `-₹${tx.amount?.toLocaleString()}`
                                                }
                                            </td>

                                            {/* STATUS */}
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    background: tx.status === 'COMPLETED' ? '#D1FAE5' : '#FEE2E2',
                                                    color: tx.status === 'COMPLETED' ? '#065F46' : '#991B1B'
                                                }}>
                                                    {tx.status || 'COMPLETED'}
                                                </span>
                                            </td>

                                            {/* DATE */}
                                            <td style={{
                                                ...tdStyle,
                                                fontSize: '12px',
                                                color: '#94a3b8'
                                            }}>
                                                {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{
                                        textAlign: 'center',
                                        padding: '50px',
                                        color: '#94a3b8'
                                    }}>
                                        No transactions yet. Send money to get started!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// styles
const thStyle = {
    padding: '12px',
    textAlign: 'left',
    fontSize: '13px',
    color: '#64748b',
    borderBottom: '2px solid #eee'
};

const tdStyle = {
    padding: '14px 12px',
    fontSize: '13px',
    color: '#475569'
};

export default Dashboard;