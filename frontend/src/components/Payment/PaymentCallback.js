import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { paymentsAPI } from '../../services/api';
import './Payment.css';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Verifying your payment…');

  useEffect(() => {
    const transaction_id = searchParams.get('transaction_id');
    const flwStatus = searchParams.get('status');

    if (!transaction_id) {
      setStatus('error');
      setMessage('Missing transaction reference. Return to payment and try again.');
      return;
    }

    if (flwStatus && flwStatus !== 'successful') {
      setStatus('failed');
      setMessage(`Payment status: ${flwStatus}`);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { data } = await paymentsAPI.verify({ transaction_id });
        if (cancelled) return;
        setStatus(data.status === 'successful' ? 'success' : 'failed');
        setMessage(data.message || 'Done');
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <div className="payment-page">
      <div className="payment-card payment-callback">
        <h1>
          {status === 'checking' && 'Verifying…'}
          {status === 'success' && 'Payment successful'}
          {status === 'failed' && 'Payment not completed'}
          {status === 'error' && 'Something went wrong'}
        </h1>
        <p>{message}</p>
        <Link to="/dashboard" className="payment-back">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentCallback;
