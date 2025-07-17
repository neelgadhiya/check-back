import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

const fetchUsers = async () => {
  try {
    const response = await axios.get('https://check-front.vercel.app/api/users', {
      timeout: 10000, // Increased to 10 seconds (10000ms)
    });
    console.log('Response:', response.data);
    setUsers(response.data);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    console.log('Error details:', {
      response: error.response,
      request: error.request,
      config: error.config,
    });
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out after 10 seconds');
    } else if (error.response) {
      console.error(`Server responded with status ${error.response.status}`);
    } else if (error.request) {
      console.error('No response received from server');
    }
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await axios.post('https://check-front.vercel.app/api/users', { name }); // ✅ CORRECT URL
      setName('');
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error adding user:', error.message);
    }
  };

  return (
    <div>
      <h1>Add User</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter user name"
        />
        <button type="submit">Add User</button>
      </form>
      <h2>Users ({users.length})</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
