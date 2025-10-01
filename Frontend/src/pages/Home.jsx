
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const  backendurl=import.meta.env.VITE_BACKEND_URL;

const Home = () => {



  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [numToClassify, setNumToClassify] = useState(1);
  const [error, setError] = useState(null); // Added for error display
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log('Token in Home.js:', token); // Debug token
    if (!token) {
      console.log('No token found, redirecting to /');
      return navigate('/');
    }

    axios.get(`${backendurl}/emails`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log('Emails fetched:', res.data); // Debug response
        setEmails(res.data);
      })
      .catch(err => {
        console.error('Error fetching emails:', err.response?.data || err.message); // Debug error
        setError(err.response?.data?.error || 'Failed to fetch emails');
        navigate('/'); // Redirect on error
      });
  }, [navigate]);


  const classifyEmails = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token for classify, redirecting to /');
      return navigate('/');
    }

    axios.post(`${backendurl}/classify`, { numEmails: numToClassify }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log('Emails classified:', res.data.emails); // Debug response
        setEmails(res.data.emails);
        setError(null); // Clear any previous errors
      })
      .catch(err => {
        console.error('Error classifying emails:', err.response?.data || err.message); // Debug error
        setError(err.response?.data?.error || 'Failed to classify emails');
      });

    
  };
    const handleLogout = () => {
    axios.get(`${backendurl}/logout`, { withCredentials: true })
      .then(res => {
        console.log('Home.js: Logout response:', res.data); // Debug
        localStorage.removeItem('token');
        navigate('/');
      })
      .catch(err => {
        console.error('Home.js: Logout error:', err.response?.data || err.message); // Debug
        localStorage.removeItem('token'); // Clear token even if API fails
        navigate('/');
      });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Display error if present */}
      {error && (
        <div className="w-full p-4 bg-red-100 text-red-700">
          Error: {error}
        </div>
      )}
      {/* Left: Email List */}
      <div className="w-1/3 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-xl mb-4">Emails</h2>
        <button
            onClick={handleLogout}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>


        {emails.length === 0 && !error ? (
          <p className="text-gray-500">Loading emails...</p>
        ) : (
          emails.map((email, idx) => (
            <div
              key={idx}
              className="p-2 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedEmail(email)}
            >
              <p className="font-bold">{email.subject}</p>
              <p className="text-sm text-gray-600">{email.tag}</p>
            </div>
          ))
        )}
      </div>
      {/* Right: Email Preview */}
      <div className="w-2/3 p-4">
        <div className="mb-4 flex items-center">
          <select
            className="mr-2 p-2 border rounded"
            value={numToClassify}
            onChange={e => setNumToClassify(Number(e.target.value))}
          >
            {[1, 2, 3, 5, 10,15,20].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <button
            onClick={classifyEmails}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Classify
          </button>
        </div>
        {selectedEmail ? (
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">{selectedEmail.subject}</h3>
            <p>{selectedEmail.body}</p>
            <p className="text-sm text-gray-600">Tag: {selectedEmail.tag}</p>
          </div>
        ) : (
          <p className="text-center text-gray-500">Select an email to preview</p>
        )}
      </div>
    </div>
  );
};

export default Home;