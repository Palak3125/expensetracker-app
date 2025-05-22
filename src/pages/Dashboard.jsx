import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Dashboard.css';

function Dashboard() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalLent, setTotalLent] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [baseBalance, setBaseBalance] = useState(0);
  const [balanceInput, setBalanceInput] = useState('');

  useEffect(() => {
    const fetchBaseBalance = async () => {
      const docRef = doc(db, 'settings', 'balances');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBaseBalance(docSnap.data().value || 0);
      }
    };
    fetchBaseBalance();
  }, []);

  useEffect(() => {
    let lentTotal = 0;
    let expensesTotal = 0;

    const unsubscribeLent = onSnapshot(collection(db, 'moneyLent'), (snapshot) => {
      lentTotal = 0;
      snapshot.forEach(doc => {
        lentTotal += doc.data().amount || 0;
      });
      setTotalLent(lentTotal);
      setTotalBalance(baseBalance - expensesTotal - lentTotal);
    });

    const unsubscribeExpenses = onSnapshot(collection(db, 'expenses'), (snapshot) => {
      expensesTotal = 0;
      snapshot.forEach(doc => {
        expensesTotal += doc.data().amount || 0;
      });
      setMonthlyExpenses(expensesTotal);
      setTotalBalance(baseBalance - expensesTotal - lentTotal);
    });

    return () => {
      unsubscribeLent();
      unsubscribeExpenses();
    };
  }, [baseBalance]);

  const handleBalanceSave = async () => {
    const value = parseFloat(balanceInput);
    if (!isNaN(value)) {
      await setDoc(doc(db, 'settings', 'balances'), { value });
      setBaseBalance(value);
      setBalanceInput('');
    } else {
      alert('Please enter a valid number');
    }
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-heading">Dashboard</h2>

      <div className="dashboard-cards" style={{ width: '100%' }}>
        {/* Current Balance Card with Input and Save Button inside */}
        <div className="card">
          <h3>Current Balance</h3>
          <p className="amount">₹{totalBalance.toFixed(2)}</p>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
            <input
              type="number"
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value)}
              placeholder="Enter new balance"
              style={{
                padding: '6px 10px',
                width: '140px',
                borderRadius: '5px',
                border: '1px solid #ccc'
              }}
            />
            <button
              onClick={handleBalanceSave}
              style={{
                padding: '6px 12px',
                backgroundColor: '#4CAF50',
                border: 'none',
                color: 'white',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Money Lent</h3>
          <p className="amount">₹{totalLent.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Monthly Expenses</h3>
          <p className="amount">₹{monthlyExpenses.toFixed(2)}</p>
        </div>
      </div>

      {/* Removed standalone balance input section */}

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul>
          <li>Paid electricity bill - ₹85.50</li>
          <li>Grocery shopping - ₹120.75</li>
          <li>Lent to Alex - ₹50.00</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
