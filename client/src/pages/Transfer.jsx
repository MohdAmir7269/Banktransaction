import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Transfer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [receiver, setReceiver] = useState(null);
    const [amount, setAmount] = useState('');
    const [myAccount, setMyAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [sending, setSending] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyAccount = async () => {
            try {
                const res = await API.get('/api/account');
                const acc = res.data?.account || res.data?.accounts?.[0];
                setMyAccount(acc);
            } catch (err) {
                console.error("Account fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyAccount();
    }, []);

    // ✅ Email ya Account Number se receiver dhundho
 const handleSearch = async () => {
    if (!searchQuery.trim()) {
        alert("Email ya account number daalo");
        return;
    }

    setSearching(true);
    setReceiver(null);

    try {
        const res = await API.get(`/api/users/search?query=${searchQuery.trim()}`);

        console.log("🔍 RESPONSE:", res.data);

        if (res.data.success && res.data.user) {
            setReceiver(res.data.user);
        } else {
            alert("User nahi mila");
        }

    } catch (err) {
        console.error("Search Error:", err);
        alert(err.response?.data?.message || "User nahi mila");
    } finally {
        setSearching(false);
    }
};

    // ✅ Transfer
    const handleTransfer = async (e) => {
        e.preventDefault();

        if (!receiver) return alert("Pehle receiver dhundho");
        if (!amount || Number(amount) <= 0) return alert("Valid amount daalo");
        if (Number(amount) > myAccount?.balance) return alert("Insufficient balance");

        setSending(true);

        try {
            const res = await API.post('/api/transactions', {
              toAccount: receiver.accountId, // ✅ sirf userId
                amount: Number(amount)
                // fromAccount nahi chahiye — backend token se leta hai
            });

            if (res.data.success) {
                alert(`✅ ₹${amount} successfully bhej diye ${receiver.name} ko!`);
                navigate('/dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Transfer failed");
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            Loading...
        </div>
    );

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#f1f5f9',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '15px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '420px'
            }}>
                <h2 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '5px' }}>
                    💸 Send Money
                </h2>
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                    Safe & Instant Transfer
                </p>

                {/* My Balance */}
                <div style={{
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    color: 'white',
                    padding: '15px 20px',
                    borderRadius: '12px',
                    marginBottom: '24px'
                }}>
                    <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>YOUR BALANCE</p>
                    <h3 style={{ margin: '4px 0 0', fontSize: '24px' }}>
                        ₹{myAccount?.balance?.toLocaleString() ?? '0'}
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', opacity: 0.7 }}>
                        A/C: {myAccount?.accountNumber || '—'}
                    </p>
                </div>

                {/* Step 1 — Search */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                        Step 1 — Receiver dhundho
                    </label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <input
                            type="text"
                            placeholder="Email ya Account Number"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={searching}
                            style={{
                                padding: '12px 16px',
                                background: '#4F46E5',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {searching ? '...' : 'Search'}
                        </button>
                    </div>
                </div>

                {/* Receiver Card */}
                {receiver && (
                    <div style={{
                        background: '#f0fdf4',
                        border: '1px solid #86efac',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        marginBottom: '20px'
                    }}>
                        <p style={{ margin: 0, fontWeight: '700', color: '#166534' }}>
                            ✅ {receiver.name}
                        </p>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#16a34a' }}>
                            A/C: {receiver.accountNumber}
                        </p>
                    </div>
                )}

                {/* Step 2 — Amount */}
                <form onSubmit={handleTransfer}>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                        Step 2 — Amount daalo
                    </label>
                    <input
                        type="number"
                        placeholder="₹ Enter Amount"
                        min="1"
                        max={myAccount?.balance}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            margin: '8px 0 20px 0',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            boxSizing: 'border-box',
                            fontSize: '15px',
                            outline: 'none'
                        }}
                        required
                    />

                    <button
                        type="submit"
                        disabled={!receiver || sending}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: receiver ? '#10B981' : '#cbd5e1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: receiver ? 'pointer' : 'not-allowed',
                            fontWeight: 'bold',
                            fontSize: '16px'
                        }}
                    >
                        {sending ? 'Sending...' : `Confirm & Send ₹${amount || '0'}`}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        style={{
                            width: '100%',
                            marginTop: '10px',
                            background: 'transparent',
                            color: '#64748b',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        ← Back to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Transfer;