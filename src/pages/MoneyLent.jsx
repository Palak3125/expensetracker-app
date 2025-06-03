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
/*
import React, { useState, useEffect } from 'react';
import '../styles/MoneyLent.css';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

function MoneyLent() {
  const [user, loading] = useAuthState(auth);
  const [loans, setLoans] = useState([]);
  const [newLoan, setNewLoan] = useState({
    person: '',
    amount: ''
  });

  useEffect(() => {
    if (!user) return;

    const loansCollection = collection(db, 'users', user.uid, 'moneyLent');
    const unsubscribe = onSnapshot(loansCollection, (snapshot) => {
      const fetchedLoans = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLoans(fetchedLoans);
    });

    return () => unsubscribe();
  }, [user]);

  const handleInputChange = (e) => {
    setNewLoan({ ...newLoan, [e.target.name]: e.target.value });
  };

  const handleAddLoan = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (newLoan.person.trim() === '' || newLoan.amount.trim() === '') {
      alert("Please fill in all fields");
      return;
    }
    const amountNum = parseFloat(newLoan.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }

    try {
      await addDoc(collection(db, 'users', user.uid, 'moneyLent'), {
        person: newLoan.person,
        amount: amountNum,
        createdAt: serverTimestamp()
      });
      setNewLoan({ person: '', amount: '' });
    } catch (error) {
      console.error("Error adding loan: ", error);
    }
  };

  const handleDeleteLoan = async (id) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'moneyLent', id));
    } catch (error) {
      console.error("Error deleting loan: ", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="money-lent-container">
      <h2>Money Lent</h2>
      <form onSubmit={handleAddLoan}>
        <input
          type="text"
          placeholder="Person's Name"
          name="person"
          value={newLoan.person}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          name="amount"
          value={newLoan.amount}
          onChange={handleInputChange}
          required
          min="0.01"
          step="0.01"
        />
        <button type="submit">Add</button>
      </form>
      <ul className="loan-list">
        {loans.map(({ id, person, amount }) => (
          <li key={id}>
            {person} - ₹{amount.toFixed(2)}
            <button className="delete-btn" onClick={() => handleDeleteLoan(id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoneyLent;*/
