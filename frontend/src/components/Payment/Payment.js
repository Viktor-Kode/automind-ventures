import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { paymentsAPI } from '../../services/api';
import './Payment.css';

const Payment = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('NGN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    const value = parseFloat(amount, 10);
    if (!value || value <= 0) {
      setError('Enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      const { data } = await paymentsAPI.initialize({ amount: value, currency });
      if (data.link) {
        window.location.href = data.link;
        return;
      }
      setError('Could not start checkout');
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed to start');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h1>Pay with Flutterwave</h1>
        <p className="payment-hint">
          You will be redirected to Flutterwave&apos;s secure checkout.
        </p>
        <form onSubmit={handlePay}>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 5000"
            required
          />
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="NGN">NGN</option>
            <option value="GHS">GHS</option>
            <option value="KES">KES</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
          {error && <p className="payment-error">{error}</p>}
          <button type="submit" className="payment-submit" disabled={loading}>
            {loading ? 'Starting…' : 'Continue to pay'}
          </button>
        </form>
        <Link to="/dashboard" className="payment-back">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
};

export default Payment;
