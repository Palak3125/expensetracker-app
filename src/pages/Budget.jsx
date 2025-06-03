import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection, query, onSnapshot, addDoc,
  updateDoc, deleteDoc, doc, where, getDocs
} from 'firebase/firestore';

import '../styles/Budget.css';

function Budget() {
  
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    month: new Date().toISOString().substr(0, 7)
  });
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    
    const q = query(collection(db,'budgets'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBudgets(data);
    });

    const expQ = query(collection(db,'expenses'));
    const unsubscribeExp = onSnapshot(expQ, (snapshot) => {
      const expData = snapshot.docs.map(doc => doc.data());
      setExpenses(expData);
    });

    return () => {
      unsubscribe();
      unsubscribeExp();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBudget(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const q = query(
      collection(db, 'budgets'),
      where('category', '==', newBudget.category),
      where('month', '==', newBudget.month)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'budgets', existingDoc.id), {
        limit: parseFloat(newBudget.limit)
      });
    } else {
      await addDoc(collection(db, 'budgets'), {
        category: newBudget.category,
        limit: parseFloat(newBudget.limit),
        month: newBudget.month
      });
    }

    setNewBudget({
      category: '',
      limit: '',
      month: new Date().toISOString().substr(0, 7)
    });
  };

  const deleteBudget = async (id) => {
    await deleteDoc(doc(db, 'budgets', id));
  };

  const calculateSpending = (category, month) => {
    const start = `${month}-01`;
    const end = `${month}-31`;
    return expenses
      .filter(e => e.category === category && e.date >= start && e.date <= end)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const calculateProgress = (spent, limit) => {
    return Math.min((spent / limit) * 100, 100);
  };
  
  return (
    <div className="budget">
      <h2>Budget Planner</h2>
      <form onSubmit={handleSubmit} className="budget-form">
        <h3 className="head">Set Monthly Budget</h3>

        <div className="form-group">
          <label className="head">Category</label>
          <select
            name="category"
            value={newBudget.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Rent">Rent/Mortgage</option>
            <option value="Shopping">Shopping</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="head">Budget Limit (₹)</label>
          <input
            type="number"
            name="limit"
            value={newBudget.limit}
            onChange={handleChange}
            placeholder="Monthly limit"
            min="1"
            step="1"
            required
          />
        </div>

        <div className="form-group">
          <label className="head">Month</label>
          <input
            type="month"
            name="month"
            value={newBudget.month}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-add">Set Budget</button>
      </form>

      <div className="budgets-list">
        <h3>Current Budgets</h3>

        {budgets.length === 0 ? (
          <p>No budgets set yet.</p>
        ) : (
          <div className="budget-items">
            {budgets.map(budget => {
              const spent = calculateSpending(budget.category, budget.month);
              const progress = calculateProgress(spent, budget.limit);
              const remaining = budget.limit - spent;

              return (
                <div key={budget.id} className="budget-item">
                  <div className="budget-header">
                    <h4 className="head">{budget.category}</h4>
                    <span className="budget-month">{budget.month}</span>
                  </div>

                  <div className="budget-details">
                    <p className="head">Budget: ₹{budget.limit.toFixed(2)}</p>
                    <p className="head">Spent: ₹{spent.toFixed(2)}</p>
                    <p className="head">Remaining: ₹{remaining.toFixed(2)}</p>
                  </div>

                  <div className="budget-progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${progress}%`,
                        backgroundColor:
                          progress > 85 ? '#3cb371' :
                          progress > 65 ? '#f39c12' : '#27ae60'
                      }}
                    ></div>
                  </div>

                  <button
                    className="btn-delete"
                    onClick={() => deleteBudget(budget.id)}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Budget;
