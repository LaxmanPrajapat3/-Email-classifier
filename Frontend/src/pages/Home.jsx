import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";

const backendurl = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [numToClassify, setNumToClassify] = useState(1);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/");
    }

    axios
      .get(`${backendurl}/emails`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEmails(res.data))
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to fetch emails");
        navigate("/");
      });
  }, [navigate]);

  const classifyEmails = () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    axios
      .post(
        `${backendurl}/classify`,
        { numEmails: numToClassify },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setEmails(res.data.emails);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to classify emails");
      });
  };

  const handleLogout = () => {
    axios
      .get(`${backendurl}/logout`, { withCredentials: true })
      .then(() => {
        localStorage.removeItem("token");
        navigate("/");
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full p-3 bg-red-100 text-red-700 text-center shadow-md"
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* Left Sidebar */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-1/3 bg-white border-r shadow-md p-4 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">📩 Emails</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md shadow transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>

        {emails.length === 0 && !error ? (
          <p className="text-gray-500 text-center">Loading emails...</p>
        ) : (
          emails.map((email, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition ${
                selectedEmail?.subject === email.subject
                  ? "bg-blue-100 border border-blue-400"
                  : "bg-gray-50 hover:bg-gray-100 border"
              }`}
              onClick={() => setSelectedEmail(email)}
            >
              <p className="font-semibold text-gray-800 truncate">
                {email.subject}
              </p>
              <p className="text-sm text-gray-600">{email.tag}</p>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Right Email Preview */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex-1 p-6 flex flex-col"
      >
        {/* Classify Controls */}
        <div className="flex items-center gap-2 mb-4">
          <select
            className="p-2 border rounded-md shadow-sm"
            value={numToClassify}
            onChange={(e) => setNumToClassify(Number(e.target.value))}
          >
            {[1, 2, 3, 5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={classifyEmails}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md transition"
          >
            Classify
          </motion.button>
        </div>

        {/* Email Preview */}
        {selectedEmail ? (
          <motion.div
            key={selectedEmail.subject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {selectedEmail.subject}
            </h3>
            <p className="text-gray-700 mb-4">{selectedEmail.body}</p>
            <p className="text-sm text-gray-500">
              📌 Tag: <span className="font-medium">{selectedEmail.tag}</span>
            </p>
          </motion.div>
        ) : (
          <p className="text-center text-gray-500 mt-20">
            Select an email to preview
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Home;
