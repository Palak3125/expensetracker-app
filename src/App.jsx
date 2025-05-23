import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Page components
import Dashboard from './pages/Dashboard.jsx';
import MoneyLent from './pages/MoneyLent.jsx';
import Expenses from './pages/Expenses.jsx';
import Budget from './pages/Budget.jsx';
import logo from './assets/logo.jpeg';

function App() {

  return (
    <Router>
    <div className="app">
     <header className="app-header">
          <div className="navbar">
            <div className="nav-left">
              <img src={logo} alt="App Logo" className="logo-img" />
              <h1 className="header-title">Expense<span className="highlight">Track</span></h1>
            </div>
            
            <nav className="nav-links">
              <Link to="/">Dashboard</Link>
              <Link to="/money-lent">Money Lent</Link>
              <Link to="/expenses">Expenses</Link>
              <Link to="/budget">Budget</Link>
            </nav>
            
            <div className="nav-right">
              <button className="login-button">Login</button>
            </div>
          </div>
        </header>
        
        <main className="app-content" >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/money-lent" element={<MoneyLent />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/budget" element={<Budget />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>ExpenseTrack - Your Personal Finance Tracker</p>
        </footer>
    </div>
  </Router>
  );
}

export default App;