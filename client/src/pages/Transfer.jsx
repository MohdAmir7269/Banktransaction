// import React, { useState, useEffect } from 'react';
// import API from '../services/api';
// import { useNavigate } from 'react-router-dom';

// const Transfer = () => {
//     const [formData, setFormData] = useState({ toAccount: '', amount: '' });
//     const [myAccount, setMyAccount] = useState(null); 
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchMyDetails = async () => {
//             try {
//                 const res = await API.get('/account/'); 
//                 console.log("Full Account Response:", res.data); // Debugging ke liye

//                 // Ye logic check karta hai ki data kis format mein aa raha hai
//                 let acc = null;
//                 if (res.data && res.data.accounts && res.data.accounts.length > 0) {
//                     acc = res.data.accounts[0]; // Agar array bhej raha hai
//                 } else if (res.data && res.data.account) {
//                     acc = res.data.account; // Agar object bhej raha hai
//                 } else if (res.data && res.data._id) {
//                     acc = res.data; // Agar direct user data hai
//                 }

//                 if (acc) {
//                     setMyAccount(acc);
//                 } else {
//                     console.error("No account found in response. Check MongoDB for this user.");
//                 }
//             } catch (err) {
//                 console.error("Error fetching account details:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchMyDetails();
//     }, []);

//     const handleTransfer = async (e) => {
//         e.preventDefault();
        
//         if (!myAccount) {
//             return alert("Error: Your account details are missing. Try logging out and in again.");
//         }

//         try {
//             const res = await API.post('/transactions/', {
//                 fromAccount: myAccount._id, 
//                 toAccount: formData.toAccount.trim(),
//                 amount: Number(formData.amount)
//             });
            
//             if (res.data.success) {
//                 alert("✅ Transfer Successful!");
//                 navigate('/dashboard');
//             }
//         } catch (err) {
//             console.error("Transfer Error Details:", err.response?.data);
//             alert(err.response?.data?.message || "Transfer Failed: Please check Balance or Receiver ID");
//         }
//     };

//     if (loading) {
//         return (
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//                 <h3>Loading Account Info...</h3>
//             </div>
//         );
//     }

//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9' }}>
//             <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
//                 <h2 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '5px' }}>Send Money</h2>
//                 <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Safe & Instant Transfer</p>

//                 {/* Account Details Card */}
//                 <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
//                     {!myAccount ? (
//                         <p style={{ color: 'red', fontSize: '12px', margin: 0 }}>⚠️ Account not linked. Check Database.</p>
//                     ) : (
//                         <>
//                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//                                 <span style={{ fontSize: '12px', color: '#64748b' }}>YOUR BALANCE</span>
//                                 <span style={{ fontWeight: 'bold', color: '#10B981' }}>₹{myAccount.balance}</span>
//                             </div>
//                             <div style={{ fontSize: '11px', color: '#94a3b8', wordBreak: 'break-all' }}>
//                                 Your ID: {myAccount._id}
//                             </div>
//                         </>
//                     )}
//                 </div>

//                 <form onSubmit={handleTransfer}>
//                     <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Receiver Account ID</label>
//                     <input 
//                         type="text" 
//                         placeholder="Enter Samir's Account ID" 
//                         value={formData.toAccount}
//                         onChange={(e) => setFormData({...formData, toAccount: e.target.value})} 
//                         style={{ width: '100%', padding: '12px', margin: '8px 0 15px 0', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} 
//                         required 
//                     />
                    
//                     <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Amount (INR)</label>
//                     <input 
//                         type="number" 
//                         placeholder="0.00" 
//                         value={formData.amount}
//                         onChange={(e) => setFormData({...formData, amount: e.target.value})} 
//                         style={{ width: '100%', padding: '12px', margin: '8px 0 20px 0', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} 
//                         required 
//                     />
                    
//                     <button 
//                         type="submit" 
//                         disabled={!myAccount}
//                         style={{ width: '100%', padding: '14px', background: myAccount ? '#10B981' : '#ccc', color: 'white', border: 'none', borderRadius: '10px', cursor: myAccount ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontSize: '16px' }}
//                     >
//                         Confirm & Send
//                     </button>
                    
//                     <button type="button" onClick={() => navigate('/dashboard')} style={{ width: '100%', marginTop: '15px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer' }}>
//                         Cancel & Go Back
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Transfer;



import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Transfer = () => {
    const [formData, setFormData] = useState({ toAccount: '', amount: '' });
    const [myAccount, setMyAccount] = useState(null); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyDetails = async () => {
            try {
                const res = await API.get('/account/');
                console.log("📦 Account API Response:", res.data); // Debug

                let acc = null;
                if (res.data?.accounts?.length > 0) {
                    acc = res.data.accounts[0];
                } else if (res.data?.account) {
                    acc = res.data.account;
                } else if (res.data?._id) {
                    acc = res.data;
                }

                console.log("✅ My Account Set:", acc); // Debug
                setMyAccount(acc);

            } catch (err) {
                console.error("❌ Error fetching account:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyDetails();
    }, []);

    const handleTransfer = async (e) => {
        e.preventDefault();

        // ✅ user field = User ka _id (Account model mein 'user' field hai)
        const fromUserId = myAccount?.user?._id  // agar populated ho
                        || myAccount?.user        // agar ObjectId ho (string/object)
                        || myAccount?._id;        // fallback

        console.log("🚀 Sending Transfer:", { fromUserId, toAccount: formData.toAccount, amount: formData.amount });

        if (!fromUserId) {
            return alert("❌ Account ID missing. Please refresh.");
        }

        try {
            const res = await API.post('/transactions', {
                fromAccount: fromUserId.toString(),
                toAccount: formData.toAccount.trim(),
                amount: Number(formData.amount)
            });

            if (res.data.success) {
                alert("✅ Transfer Successful!");
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("❌ Transfer Error:", err.response?.data);
            const errorMsg = err.response?.data?.message || "Transfer Failed";
            alert(`❌ Error: ${errorMsg}`);
        }
    };

    if (loading) return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            Loading Account Info...
        </div>
    );

    if (!myAccount) return (
        <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
            ❌ Account not found. Please contact support.
        </div>
    );

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '5px' }}>Send Money</h2>

                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>YOUR BALANCE</span>
                        <span style={{ fontWeight: 'bold', color: '#10B981' }}>
                            ₹{myAccount?.balance?.toLocaleString() ?? '0'}
                        </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {/* ✅ User ID display — receiver ko ye ID deni hai */}
                        Your User ID: {(myAccount?.user?._id || myAccount?.user || myAccount?._id)?.toString()}
                    </div>
                </div>

                <form onSubmit={handleTransfer}>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                        Receiver's User ID
                    </label>
                    <input
                        type="text"
                        placeholder="Paste Receiver's User ID here"
                        value={formData.toAccount}
                        onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                        style={{ width: '100%', padding: '12px', margin: '8px 0 15px 0', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                        required
                    />

                    <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                        Amount (INR)
                    </label>
                    <input
                        type="number"
                        placeholder="Enter Amount"
                        min="1"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        style={{ width: '100%', padding: '12px', margin: '8px 0 20px 0', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                        required
                    />

                    <button
                        type="submit"
                        style={{ width: '100%', padding: '14px', background: '#10B981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                    >
                        Confirm & Send
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        style={{ width: '100%', marginTop: '10px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer' }}
                    >
                        Back to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Transfer;