/*import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [totalBalance, setTotalBalance] = useState(0);
  const [totalLent, setTotalLent] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [baseBalance, setBaseBalance] = useState(0);
  const [balanceInput, setBalanceInput] = useState('');
  const [lentActivities, setLentActivities] = useState([]);
  const [expenseActivities, setExpenseActivities] = useState([]);
  const [activities, setActivities] = useState([]);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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

  useEffect(() => {
    const qLent = query(collection(db, 'moneyLent'), orderBy('createdAt', 'desc'));
    const unsubscribeLent = onSnapshot(qLent, (snapshot) => {
      const lentActs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: `Lent to ${data.person} - ₹${data.amount?.toFixed(2) || '0.00'}`,
          createdAt: data.createdAt?.toDate() || new Date()
        };
      });
      setLentActivities(lentActs);
    });

    return () => unsubscribeLent();
  }, []);

  useEffect(() => {
    const qExpenses = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
    const unsubscribeExpenses = onSnapshot(qExpenses, (snapshot) => {
      const expenseActs = snapshot.docs.map(doc => {
        const data = doc.data();
        const label = data.title || data.description || 'Expense';
        return {
          id: doc.id,
          text: `${label} - ₹${data.amount?.toFixed(2) || '0.00'}`,
          createdAt: data.createdAt?.toDate() || new Date()
        };
      });
      setExpenseActivities(expenseActs);
    });

    return () => unsubscribeExpenses();
  }, []);

  useEffect(() => {
    const merged = [...lentActivities, ...expenseActivities]
      .sort((a, b) => b.createdAt - a.createdAt);
    setActivities(merged);
  }, [lentActivities, expenseActivities]);

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

  if (!user) return <p>Loading...</p>; // While checking auth

  return (
    <div className="dashboard">
      <h2 className="dashboard-heading">Dashboard</h2>

      <div className="dashboard-cards" style={{ width: '100%' }}>
        <div className="card">
          <h3>Current Balance</h3>
          <p className="amount">₹{totalBalance.toFixed(2)}</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
            <input
              type="number"
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value)}
              placeholder="Enter new balance"
              style={{ padding: '6px 10px', width: '140px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button
              onClick={handleBalanceSave}
              style={{ padding: '6px 12px', backgroundColor: '#4CAF50', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
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

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul>
          {activities.slice(0, 5).map((act) => (
            <li key={act.id}>{act.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;*/

import React, { useState, useEffect } from 'react';

import { collection, onSnapshot, doc, setDoc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Dashboard.css';

function Dashboard() {
 
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalLent, setTotalLent] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [baseBalance, setBaseBalance] = useState(0);
  const [balanceInput, setBalanceInput] = useState('');
  const [lentActivities, setLentActivities] = useState([]);
  const [expenseActivities, setExpenseActivities] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {

    const fetchBaseBalance = async () => {
      const docRef = doc(db, 'settings', 'balances');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBaseBalance(docSnap.data().value || 0);
      }else {
        setBaseBalance(0);
      }
    };
    fetchBaseBalance();
  }, []);

  useEffect(() => {

    let lentTotal = 0;
    let expensesTotal = 0;

    const unsubscribeLent = onSnapshot(collection(db,'moneyLent'), (snapshot) => {
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

  useEffect(() => {
  

    const qLent = query(collection(db, 'moneyLent'), orderBy('createdAt', 'desc'));
    const unsubscribeLent = onSnapshot(qLent, (snapshot) => {
      const lentActs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: `Lent to ${data.person} - ₹${data.amount?.toFixed(2) || '0.00'}`,
          createdAt: data.createdAt?.toDate() || new Date()
        };
      });
      setLentActivities(lentActs);
    });

    return () => unsubscribeLent();
  }, []);

  useEffect(() => {
    

    const qExpenses = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
    const unsubscribeExpenses = onSnapshot(qExpenses, (snapshot) => {
      const expenseActs = snapshot.docs.map(doc => {
        const data = doc.data();
        const label = data.title || data.description || 'Expense';
        return {
          id: doc.id,
          text: `${label} - ₹${data.amount?.toFixed(2) || '0.00'}`,
          createdAt: data.createdAt?.toDate() || new Date()
        };
      });
      setExpenseActivities(expenseActs);
    });

    return () => unsubscribeExpenses();
  }, []);

  useEffect(() => {
    const merged = [...lentActivities, ...expenseActivities]
      .sort((a, b) => b.createdAt - a.createdAt);
    setActivities(merged);
  }, [lentActivities, expenseActivities]);

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
        <div className="card">
          <h3>Current Balance</h3>
          <p className="amount">₹{totalBalance.toFixed(2)}</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
            <input
              type="number"
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value)}
              placeholder="Enter new balance"
              style={{ padding: '6px 10px', width: '140px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button
              onClick={handleBalanceSave}
              style={{ padding: '6px 12px', backgroundColor: '#4CAF50', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
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

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul>
          {activities.slice(0, 5).map((act) => (
            <li key={act.id}>{act.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
