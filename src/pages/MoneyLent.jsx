import React, { useState, useEffect } from 'react';
import '../styles/MoneyLent.css';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function MoneyLent() {
  const [loans, setLoans] = useState([]);
  const [newLoan, setNewLoan] = useState({
    person: '',
    amount: '',
    date: '',
    dueDate: ''
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "moneyLent"), (snapshot) => {
      const loanData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLoans(loanData);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLoan(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newLoan.person || !newLoan.amount) return;

    const loanToAdd = {
      person: newLoan.person,
      amount: parseFloat(newLoan.amount),
      date: newLoan.date || new Date().toISOString().split('T')[0],
      dueDate: newLoan.dueDate || '',
      createdAt: serverTimestamp()  
    };

    try {
      await addDoc(collection(db, "moneyLent"), loanToAdd);
      setNewLoan({
        person: '',
        amount: '',
        date: '',
        dueDate: ''
      });
    } catch (error) {
      console.error("Error adding loan: ", error);
    }
  };

  const deleteLoan = async (id) => {
    try {
      await deleteDoc(doc(db, "moneyLent", id));
    } catch (error) {
      console.error("Error deleting loan: ", error);
    }
  };

  return (
    <div className="money-lent">
      <h2>Money Lent</h2>

      <form onSubmit={handleSubmit} className="loan-form">
        <div className="form-group">
          <label className="form-style">Person</label>
          <input
            type="text"
            name="person"
            value={newLoan.person}
            onChange={handleChange}
            placeholder="Who did you lend to?"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-style">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={newLoan.amount}
            onChange={handleChange}
            placeholder="Amount"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-style">Date Lent</label>
          <input
            type="date"
            name="date"
            value={newLoan.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-style">Due Date (Optional)</label>
          <input
            type="date"
            name="dueDate"
            value={newLoan.dueDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-add">Add Loan</button>
      </form>

      <div className="loans-list">
        <h3>Current Loans</h3>

        {loans.length === 0 ? (
          <p>No loans recorded yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Person</th>
                <th>Amount</th>
                <th>Date Lent</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map(loan => (
                <tr key={loan.id}>
                  <td>{loan.person}</td>
                  <td>₹{loan.amount.toFixed(2)}</td>
                  <td>{loan.date}</td>
                  <td>{loan.dueDate || 'Not specified'}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => deleteLoan(loan.id)}
                    >
                      Delete
                    </button>
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

export default MoneyLent;
