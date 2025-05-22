import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // adjust path if needed
import '../styles/Dashboard.css';

function Dashboard() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalLent, setTotalLent] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  useEffect(() => {
    let lentTotal = 0;
    let expensesTotal = 0;

    // Listen to changes in moneyLent collection
    const unsubscribeLent = onSnapshot(collection(db, 'moneyLent'), (snapshot) => {
      lentTotal = 0;
      snapshot.forEach(doc => {
        lentTotal += doc.data().amount || 0;
      });
      setTotalLent(lentTotal);
      setTotalBalance(5000 - expensesTotal - lentTotal);
    });

    // Listen to changes in expenses collection
    const unsubscribeExpenses = onSnapshot(collection(db, 'expenses'), (snapshot) => {
      expensesTotal = 0;
      snapshot.forEach(doc => {
        expensesTotal += doc.data().amount || 0;
      });
      setMonthlyExpenses(expensesTotal);
      setTotalBalance(5000 - expensesTotal - lentTotal);
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeLent();
      unsubscribeExpenses();
    };
  }, []);

  return (
    <div className="dashboard">
      <h2 className="dashboard-heading">Dashboard</h2>

      <div className="dashboard-cards" style={{ width: '100%' }}>
        <div className="card">
          <h3>Current Balance</h3>
          <p className="amount">₹{totalBalance.toFixed(2)}</p>
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
          <li>Paid electricity bill - ₹85.50</li>
          <li>Grocery shopping - ₹120.75</li>
          <li>Lent to Alex - ₹50.00</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
