import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Importing CSS file

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [newUser, setNewUser] = useState({ firstName: "", lastName: "", email: "", department: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/users");
      setUsers(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch users.");
    }
  };

  const handleSearch = async () => {
    if (!searchId) {
      fetchUsers();
      return;
    }
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${searchId}`);
      setUsers([response.data]);
      setError(null);
    } catch (error) {
      setError("User not found.");
      setUsers([]);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.department) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/users", newUser);
      setUsers([...users, { 
        id: users.length + 1, 
        name: `${newUser.firstName} ${newUser.lastName}`, 
        email: newUser.email, 
        company: { name: newUser.department } 
      }]);
      setNewUser({ firstName: "", lastName: "", email: "", department: "" });
      setError(null);
    } catch (error) {
      setError("Failed to add user.");
    }
  };

  const handleEdit = (id) => {
    setEditingUserId(id);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`);
      setEditingUserId(null);
      setError(null);
    } catch (error) {
      setError("Failed to update user.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setError(null);
    } catch (error) {
      setError("Failed to delete user.");
    }
  };

  return (
    <div className="container">
      <h2>User Management</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                {editingUserId === user.id ? (
                  <>
                    <td>{user.id}</td>
                    <td>
                      <input type="text" defaultValue={user?.name?.split(" ")[0] || ""} />
                    </td>
                    <td>
                      <input
                        type="text"
                        defaultValue={user?.name?.includes(" ") ? user.name.split(" ")[1] : ""}
                      />
                    </td>
                    <td>
                      <input type="text" defaultValue={user.email} />
                    </td>
                    <td>
                      <input type="text" defaultValue={user?.company?.name || ""} />
                    </td>
                    <td>
                      <button className="update" onClick={() => handleUpdate(user.id)}>
                        Update
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.id}</td>
                    <td>{user?.name?.split(" ")[0] || "N/A"}</td>
                    <td>{user?.name?.includes(" ") ? user.name.split(" ")[1] : "N/A"}</td>
                    <td>{user.email}</td>
                    <td>{user?.company?.name || "N/A"}</td>
                    <td>
                      <button className="edit" onClick={() => handleEdit(user.id)}>
                        Edit
                      </button>
                      <button className="delete" onClick={() => handleDelete(user.id)}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Add New User</h3>
      <div className="add-user">
        <input
          type="text"
          placeholder="First Name"
          value={newUser.firstName}
          onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newUser.lastName}
          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Department"
          value={newUser.department}
          onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
        />
        <button className="add" onClick={handleAddUser}>
          Add
        </button>
      </div>
    </div>
  );
};

export default UsersTable;
