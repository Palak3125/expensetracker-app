import React, { useState, useEffect } from 'react';
import '../styles/Expenses.css';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";


function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "expenses"), (snapshot) => {
      const expenseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExpenses(expenseData);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount || !newExpense.category) return;
    
    const expenseToAdd = {
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
      createdAt: serverTimestamp()  
    };

    try {
      await addDoc(collection(db, "expenses"), expenseToAdd);
      setNewExpense({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error("Error adding expense: ", error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
    } catch (error) {
      console.error("Error deleting expense: ", error);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  return (
    <div className="expenses">
      <h2>Expenses Tracker</h2>

      <div className="expense-summary">
        <div className="card">
          <h3>Total Expenses</h3>
          <p className="amount">₹{totalExpenses.toFixed(2)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="expense-form">
        <h3 className="head">Add New Expense</h3>

        <div className="form-group">
          <label className="head">Description</label>
          <input
            type="text"
            name="description"
            value={newExpense.description}
            onChange={handleChange}
            placeholder="What did you spend on?"
            required
          />
        </div>

        <div className="form-group">
          <label className="head">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={newExpense.amount}
            onChange={handleChange}
            placeholder="How much?"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label className="head">Category</label>
          <select
            name="category"
            value={newExpense.category}
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
          <label className="head">Date</label>
          <input
            type="date"
            name="date"
            value={newExpense.date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-add">Add Expense</button>
      </form>

      <div className="expenses-list">
        <h3>Expense History</h3>
        {expenses.length === 0 ? (
          <p>No expenses recorded yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>₹{expense.amount.toFixed(2)}</td>
                  <td>{expense.category}</td>
                  <td>{expense.date}</td>
                  <td>
                    <button className="btn-delete" onClick={() => deleteExpense(expense.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Expenses;
/*
import React, { useState, useEffect } from 'react';
import '../styles/Expenses.css';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

function Expenses() {
  const [user, loading] = useAuthState(auth);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: ''
  });

  useEffect(() => {
    if (!user) return;

    const expensesCollection = collection(db, 'users', user.uid, 'expenses');
    const unsubscribe = onSnapshot(expensesCollection, (snapshot) => {
      const fetchedExpenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExpenses(fetchedExpenses);
    });

    return () => unsubscribe();
  }, [user]);

  const handleInputChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (newExpense.title.trim() === '' || newExpense.amount.trim() === '') {
      alert("Please fill in all fields");
      return;
    }
    const amountNum = parseFloat(newExpense.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }

    try {
      await addDoc(collection(db, 'users', user.uid, 'expenses'), {
        title: newExpense.title,
        amount: amountNum,
        createdAt: serverTimestamp()
      });
      setNewExpense({ title: '', amount: '' });
    } catch (error) {
      console.error("Error adding expense: ", error);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'expenses', id));
    } catch (error) {
      console.error("Error deleting expense: ", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="expenses-container">
      <h2>Expenses</h2>
      <form onSubmit={handleAddExpense}>
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={newExpense.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          name="amount"
          value={newExpense.amount}
          onChange={handleInputChange}
          required
          min="0.01"
          step="0.01"
        />
        <button type="submit">Add</button>
      </form>
      <ul className="expense-list">
        {expenses.map(({ id, title, amount }) => (
          <li key={id}>
            {title} - ₹{amount.toFixed(2)}
            <button className="delete-btn" onClick={() => handleDeleteExpense(id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Expenses;*/
