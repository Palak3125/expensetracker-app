import React, { useState, useEffect } from 'react';
import '../styles/Budget.css';

function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    month: new Date().toISOString().substr(0, 7) // YYYY-MM format
  });
  
  // For tracking actual spending against budget
  const [expenses, setExpenses] = useState([]);
  
  // Load data from localStorage
  useEffect(() => {
    const savedBudgets = localStorage.getItem('budgets');
    const savedExpenses = localStorage.getItem('expenses');
    
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);
  
  // Save budgets to localStorage
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBudget(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if budget for this category and month already exists
    const existingBudgetIndex = budgets.findIndex(
      budget => budget.category === newBudget.category && budget.month === newBudget.month
    );
    
    if (existingBudgetIndex >= 0) {
      // Update existing budget
      const updatedBudgets = [...budgets];
      updatedBudgets[existingBudgetIndex] = {
        ...updatedBudgets[existingBudgetIndex],
        limit: parseFloat(newBudget.limit)
      };
      setBudgets(updatedBudgets);
    } else {
      // Add new budget
      const budgetToAdd = {
        id: Date.now().toString(),
        ...newBudget,
        limit: parseFloat(newBudget.limit)
      };
      setBudgets(prev => [...prev, budgetToAdd]);
    }
    
    // Reset form
    setNewBudget({
      category: '',
      limit: '',
      month: new Date().toISOString().substr(0, 7)
    });
  };
  
  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
  };
  
  // Calculate spending for each budget
  const calculateSpending = (category, month) => {
    const monthStart = `${month}-01`;
    const monthEnd = `${month}-31`;
    
    return expenses
      .filter(expense => 
        expense.category === category && 
        expense.date >= monthStart && 
        expense.date <= monthEnd
      )
      .reduce((total, expense) => total + expense.amount, 0);
  };
  
  // Calculate progress percentage
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
                    <span className="budget-month" >{budget.month}</span>
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
                        backgroundColor: progress > 85 ? '#3cb371' : 
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