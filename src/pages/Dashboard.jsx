import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, getDoc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import '../styles/Dashboard.css';

function Dashboard() {
  const [user] = useAuthState(auth);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalLent, setTotalLent] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [baseBalance, setBaseBalance] = useState(0);
  const [balanceInput, setBalanceInput] = useState('');
  const [lentActivities, setLentActivities] = useState([]);
  const [expenseActivities, setExpenseActivities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchBaseBalance = async () => {
      const docRef = doc(db,'users',user.uid ,'settings', 'balances');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBaseBalance(docSnap.data().value || 0);
      }else {
        setBaseBalance(0);
      }
    };
    fetchBaseBalance();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let lentTotal = 0;
    let expensesTotal = 0;

    const unsubscribeLent = onSnapshot(collection(db,'users',user.uid ,'moneyLent'), (snapshot) => {
      lentTotal = 0;
      snapshot.forEach(doc => {
        lentTotal += doc.data().amount || 0;
      });
      setTotalLent(lentTotal);
      setTotalBalance(baseBalance - expensesTotal - lentTotal);
    });

    const unsubscribeExpenses = onSnapshot(collection(db,'users',user.uid , 'expenses'), (snapshot) => {
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
  }, [baseBalance,user]);

  useEffect(() => {
    if (!user) return;
    const qLent = query(collection(db,'users',user.uid , 'moneyLent'), orderBy('createdAt', 'desc'));
    const unsubscribeLent = onSnapshot(qLent, (snapshot) => {
      const lentActs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: `Lent to ${data.person} - ₹${data.amount?.toFixed(2) || '0.00'}`,
          createdAt: data.createdAt?.toDate() || new Date(),
          type: 'lent'
        };
      });
      setLentActivities(lentActs);
    });

    return () => unsubscribeLent();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const qExpenses = query(collection(db,'users',user.uid , 'expenses'), orderBy('createdAt', 'desc'));
    const unsubscribeExpenses = onSnapshot(qExpenses, (snapshot) => {
      const expenseActs = snapshot.docs.map(doc => {
        const data = doc.data();
        const label = data.title || data.description || 'Expense';
        return {
          id: doc.id,
          text: `${label} - ₹${data.amount?.toFixed(2) || '0.00'}`,
          createdAt: data.createdAt?.toDate() || new Date(),
          type: 'expense'
        };
      });
      setExpenseActivities(expenseActs);
    });

    return () => unsubscribeExpenses();
  }, [user]);

  useEffect(() => {
    const merged = [...lentActivities, ...expenseActivities]
      .sort((a, b) => b.createdAt - a.createdAt);
    setActivities(merged);
  }, [lentActivities, expenseActivities]);

  const handleBalanceSave = async () => {
    const value = parseFloat(balanceInput);
    if (!isNaN(value)) {
      setIsLoading(true);
      await setDoc(doc(db,'users',user.uid , 'settings', 'balances'), { value });
      setBaseBalance(value);
      setBalanceInput('');
      setTimeout(() => setIsLoading(false), 800);
    } else {
      alert('Please enter a valid number');
    }
  };

  const getBalanceColor = () => {
    if (totalBalance > baseBalance * 0.7) return '#4ade80';
    if (totalBalance > baseBalance * 0.3) return '#fbbf24';
    return '#ef4444';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!user) return (
    <div className="dashboard loading-state">
      <div className="loading-spinner"></div>
      <p>Loading User Data...</p>
    </div>
  );
 
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-heading">
          <span className="gradient-text">Financial Dashboard</span>
          <span className="dashboard-subtitle">Welcome back! Here's your overview</span>
        </h2>
        <div className="balance-toggle">
          <button 
            className="toggle-btn" 
            onClick={() => setShowBalance(!showBalance)}
            title={showBalance ? "Hide Balance" : "Show Balance"}
          >
            {showBalance ? '👁️' : '🙈'}
          </button>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="card balance-card">
          <div className="card-header">
            <div className="card-icon balance-icon">💰</div>
            <div className="card-title-section">
              <h3>Current Balance</h3>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.min((totalBalance / baseBalance) * 100, 100)}%`,
                    backgroundColor: getBalanceColor()
                  }}
                ></div>
              </div>
            </div>
          </div>
          <p className="amount" style={{ color: getBalanceColor() }}>
            {showBalance ? formatCurrency(totalBalance) : '₹••••••'}
          </p>
          <div className="balance-input-section">
            <input
              type="number"
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value)}
              placeholder="Enter new balance"
              className="balance-input"
            />
            <button
              onClick={handleBalanceSave}
              className={`save-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner"></span> : 'Save'}
            </button>
          </div>
        </div>

        <div className="card lent-card">
          <div className="card-header">
            <div className="card-icon lent-icon">📈</div>
            <div className="card-title-section">
              <h3>Money Lent</h3>
              <div className="card-subtitle">
                {((totalLent / baseBalance) * 100).toFixed(1)}% of base balance
              </div>
            </div>
          </div>
          <p className="amount lent-amount">{formatCurrency(totalLent)}</p>
          <div className="trend-indicator positive">
            <span className="trend-arrow">↗️</span>
            <span>Active loans</span>
          </div>
        </div>

        <div className="card expenses-card">
          <div className="card-header">
            <div className="card-icon expense-icon">📊</div>
            <div className="card-title-section">
              <h3>Monthly Expenses</h3>
              <div className="card-subtitle">
                {((monthlyExpenses / baseBalance) * 100).toFixed(1)}% of base balance
              </div>
            </div>
          </div>
          <p className="amount expense-amount">{formatCurrency(monthlyExpenses)}</p>
          <div className="trend-indicator negative">
            <span className="trend-arrow">📉</span>
            <span>This month</span>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <div className="activity-header">
          <h3>Recent Activity</h3>
          <div className="activity-count">{activities.length} transactions</div>
        </div>
        <ul className="activity-list">
          {activities.slice(0, 5).map((act, index) => (
            <li key={act.id} className={`activity-item ${act.type}`} style={{animationDelay: `${index * 0.1}s`}}>
              <div className="activity-icon">
                {act.type === 'lent' ? '💸' : '🛒'}
              </div>
              <div className="activity-content">
                <span className="activity-text">{act.text}</span>
                <span className="activity-time">
                  {act.createdAt ? act.createdAt.toLocaleDateString() : 'Recently'}
                </span>
              </div>
              <div className="activity-arrow">→</div>
            </li>
          ))}
        </ul>
        {activities.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p>No recent activities</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

