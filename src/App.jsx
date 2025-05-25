/*import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';


import Dashboard from './pages/Dashboard.jsx';
import MoneyLent from './pages/MoneyLent.jsx';
import Expenses from './pages/Expenses.jsx';
import Budget from './pages/Budget.jsx';
import logo from './assets/logo.jpeg';
import Login from "./pages/login.jsx";

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
              <Link to="/login">
              <button className="login-button">Login</button>
              </Link>
            </div>
          </div>
        </header>
        
        <main className="app-content" >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/money-lent" element={<MoneyLent />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>ExpenseTrack - Your Personal Finance Tracker</p>
        </footer>
    </div>
  </Router>
  );
}

export default App;*/
/*import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import Dashboard from './pages/Dashboard.jsx';
import MoneyLent from './pages/MoneyLent.jsx';
import Expenses from './pages/Expenses.jsx';
import Budget from './pages/Budget.jsx';
import logo from './assets/logo.jpeg';
import Login from "./pages/login.jsx";

import PrivateRoute from './pages/PrivateRoute.jsx';
import PublicRoute from './pages/PublicRoute.jsx';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="navbar">
            <div className="nav-left">
              <img src={logo} alt="App Logo" className="logo-img" />
              <h1 className="header-title">
                Expense<span className="highlight">Track</span>
              </h1>
            </div>

            <nav className="nav-links">
              <Link to="/">Dashboard</Link>
              <Link to="/money-lent">Money Lent</Link>
              <Link to="/expenses">Expenses</Link>
              <Link to="/budget">Budget</Link>
            </nav>

            <div className="nav-right">
              <Link to="/login">
                <button className="login-button">Login</button>
                <button onClick={() => signOut(auth)}>Logout</button>
              </Link>
            </div>
          </div>
        </header>

        <main className="app-content">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/money-lent"
              element={
                <PrivateRoute>
                  <MoneyLent />
                </PrivateRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <PrivateRoute>
                  <Expenses />
                </PrivateRoute>
              }
            />
            <Route
              path="/budget"
              element={
                <PrivateRoute>
                  <Budget />
                </PrivateRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>ExpenseTrack - Your Personal Finance Tracker</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import Dashboard from './pages/Dashboard.jsx';
import MoneyLent from './pages/MoneyLent.jsx';
import Expenses from './pages/Expenses.jsx';
import Budget from './pages/Budget.jsx';
import logo from './assets/logo.jpeg';
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx"; 

import PrivateRoute from './pages/PrivateRoute.jsx';
import PublicRoute from './pages/PublicRoute.jsx';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="navbar">
            <div className="nav-left">
              <img src={logo} alt="App Logo" className="logo-img" />
              <h1 className="header-title">
                Expense<span className="highlight">Track</span>
              </h1>
            </div>

            <nav className="nav-links">
              <Link to="/">Dashboard</Link>
              <Link to="/money-lent">Money Lent</Link>
              <Link to="/expenses">Expenses</Link>
              <Link to="/budget">Budget</Link>
            </nav>

            <div className="nav-right">
              <Link to="/login">
                <button className="button">Login</button>
              </Link>
              <Link to="/register">
                <button className="button">Sign Up</button>
              </Link>
              <button onClick={() => signOut(auth)}  className="button">Logout</button>
            </div>
          </div>
        </header>

        <main className="app-content">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/money-lent"
              element={
                <PrivateRoute>
                  <MoneyLent />
                </PrivateRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <PrivateRoute>
                  <Expenses />
                </PrivateRoute>
              }
            />
            <Route
              path="/budget"
              element={
                <PrivateRoute>
                  <Budget />
                </PrivateRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
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
