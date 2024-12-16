import React, { useEffect, useState } from 'react';
import 'boxicons/css/boxicons.min.css';
import authAxios from '@/api/authAxios';
import Swal from 'sweetalert2';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardContext } from '@/context/DashboardContext';
import { createAuthAxios } from '@/api/authAxios';
import TransactionsSection from './TransactionsSection';

const AdminPage = () => {
  const authAxios = createAuthAxios()
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [userDetails, setUserDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, loading } = useContext(DashboardContext);
  const [searchTerm1, setSearchTerm1] = useState(""); // Track the search input
  const [info, setInfo] = useState('');


  const [expandedSection, setExpandedSection] = useState(null); // Track which section is open

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };
  
  useEffect(() => {
    // Fetch user details from the dashboard
    authAxios.get('/dashboard/')
      .then((res) => {
        setUserDetails(res.data);
        // console.log(res.data)
        if (user.is_superuser == false){
          navigate('/dashboard')
          // console.log(user.is_superuser)
        }
        
      }).catch((err) => {
        console.log(err);
      });
  }, []);
  // authAxios.get('/app_settings/')
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on the search term
  const filteredUsers = userDetails.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
    const closeUserDetails = () => setSelectedUser(null);

    const handleFundUser = () => {
      Swal.fire({
        title: 'Fund User Account',
        html: `
          <div>
            <label for="user-id" style="display: block; margin-bottom: 8px;">User ID</label>
            <input type="text" id="user-id" class="swal2-input" placeholder="Enter Reference ID">
          </div>
          <div>
            <label for="amount" style="display: block; margin-bottom: 8px;">Amount</label>
            <input type="number" id="amount" class="swal2-input" placeholder="Enter Amount">
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Next',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          const userId = document.getElementById('user-id').value.trim();
          const amount = parseFloat(document.getElementById('amount').value);
    
          if (!userId) {
            Swal.showValidationMessage('Please enter a valid User ID');
          } else if (!amount || amount <= 0) {
            Swal.showValidationMessage('Please enter a valid amount greater than 0');
          } else if (amount > 5000) {
            Swal.showValidationMessage('The maximum amount you can fund is 5000');
          } else {
            return { userId, amount }; // Return the validated User ID and Amount
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const { userId, amount } = result.value;
    
          // Show confirmation dialog
          Swal.fire({
            title: `Fund User ${selectedUser.username}?`,
            text: `Are you sure you want to fund User ID: ${selectedUser.username} with ₦${amount}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, fund!',
            cancelButtonText: 'No, cancel!',
          }).then((confirmationResult) => {
            if (confirmationResult.isConfirmed) {
              // Proceed with funding the user
              authAxios
                .post(`/dashboard/`, { amount:amount, action: 'fund', user_id: selectedUser.id, ref_id:userId})
                .then((res) => {
                  Swal.fire('Funded!', res.data.message || 'User successfully funded!', 'success');
                  closeUserDetails(); // Close the modal after funding
                })
                .catch((error) => {
                  console.error(error);
                  Swal.fire('Error!', error.response?.data?.message || 'Failed to fund the user.', 'error');
                });
            }
          });
        }
      }).catch(() => {
        Swal.fire('Error!', 'An unexpected error occurred.', 'error');
      });
    };     

  const handleAdminUser = () =>{
    Swal.fire({
      title: `Admin ${selectedUser.username}?`,
      text: 'Are you sure you want to add this user as an admin?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, add!',
      cancelButtonText: 'No, cancel!',
    }).then((result) =>{
      if (result.isConfirmed) {
        authAxios.post(`/dashboard/`, {action: 'admin', user_id:selectedUser.id})
          .then((res) => {
            Swal.fire('Make Admin!', res.data.message, 'success');
            closeUserDetails(); // Close the modal after suspension
            // setUserDetails((prev) => prev.filter(user => user.id !== selectedUser.id)); // Remove the suspended user from the list
          })
          .catch(() => {
            Swal.fire('Error!', 'Failed to add user as an admin.', 'error');
          });
      }
    })
  }

  const handleVerifyUser = () =>{
    Swal.fire({
      title: `Verify ${selectedUser.username}?`,
      text: 'Are you sure you want to verify this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, verify!',
      cancelButtonText: 'No, cancel!',
    }).then((result) =>{
      if (result.isConfirmed){
        authAxios.post(`/dashboard/`, {action: 'verify', user_id:selectedUser.id})
        .then((res) => {
          Swal.fire('User Verified!', res.data.message, 'success');
          closeUserDetails(); // Close the modal after suspension
          // setUserDetails((prev) => prev.filter(user => user.id !== selectedUser.id)); // Remove the suspended user from the list
        })
        .catch(() => {
          Swal.fire('Error!', 'Failed to verify user.', 'error');
        });
      }
    })
  }

  const handleSuspendUser = () => {
    Swal.fire({
      title: `Suspend ${selectedUser.username}?`,
      text: 'Are you sure you want to suspend this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, suspend!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        authAxios.post(`/suspend/${selectedUser.id}/`)
          .then(() => {
            Swal.fire('Suspended!', 'The user has been suspended.', 'success');
            closeUserDetails(); // Close the modal after suspension
            setUserDetails((prev) => prev.filter(user => user.id !== selectedUser.id)); // Remove the suspended user from the list
          })
          .catch(() => {
            Swal.fire('Error!', 'Failed to suspend the user.', 'error');
          });
      }
    });
  };

  const handleDeleteUser = () => {
    Swal.fire({
      title: `Delete ${selectedUser.username}?`,
      text: 'Are you sure you want to remove this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        authAxios.post(`/dashboard/`, {action:'remove', user_id:selectedUser.id})
          .then((res) => {
            Swal.fire('Deleted!', res.data.message, 'success');
            closeUserDetails(); // Close the modal after deletion
            setUserDetails((prev) => prev.filter(user => user.id !== selectedUser.id)); // Remove the deleted user from the list
          })
          .catch(() => {
            Swal.fire('Error!', 'Failed to remove the user.', 'error');
          });
      }
    });
  };
  // Other functions (handleFundUser, handleAdminUser, etc.) remain unchanged...
  const handleSearchChangeT = (event) => {
    setSearchTerm1(event.target.value.trim());
  };

  const handlePostInformation = async () => {
    if (!info.trim()) {
      alert('Please enter some information before posting.');
      return;
    }
    try {
      const response = await authAxios.post('/dashboard/', { action: 'set_information' , 'info':info});
      if (response.status === 200) {
        Swal.fire('Posted!', 'Your information has been successfully posted', 'success');
        setInfo(''); // Clear input field after successful submission
      }
    } catch (error) {
      console.error('Error posting information:', error);
      alert('Failed to post information. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </header>

      {/* Tab Navigation */}
      <nav className="flex flex-wrap gap-5 mb-8">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg text-lg font-semibold transition-colors duration-300 ${activeTab === 'users' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          <i className="bx bx-user mr-2"></i> Users
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg text-lg font-semibold transition-colors duration-300 ${activeTab === 'settings' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          <i className="bx bx-cog mr-2"></i> Settings
        </button>
      </nav>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 overflow-x-auto">
        {activeTab === 'users' && userDetails.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management</h2>
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-green-400  focus:border-green-400"
            />
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-b p-3 text-gray-600">Username</th>
                  <th className="border-b p-3 text-gray-600">Email</th>
                  <th className="border-b p-3 text-gray-600">Role</th>
                  <th className="border-b p-3 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.is_superuser ? 'Admin' : 'User'}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-green-600 hover:text-green-800 flex items-center"
                      >
                        <i className="bx bx-show-alt mr-1"></i> View
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="text-center p-3 text-gray-500">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
            <p className="text-gray-600">Manage admin settings here.</p>
            <div className="p-2 rounded-lg shadow-lg">
              <p className="text-xl font-bold">Post Information</p>
              <input
                type="text"
                className="h-10 border w-full rounded-md p-2 mt-2"
                value={info}
                onChange={(e) => setInfo(e.target.value)} // Update state on input change
                placeholder="Post information"
              />
              <button
                className="h-10 w-20 bg-vibrantGreen bg-opacity-450 outline-none rounded-sm text-white font-bold mt-3"
                onClick={handlePostInformation}
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
              {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 h-full overflow-y-auto">
          <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg transform transition-all duration-300 scale-90 opacity-100 animate-popup overflow-y-auto mt-60">
            <button
              onClick={closeUserDetails}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
            <h2 className="text-2xl font-semibold text-green-600 mb-4">User Details</h2>
            <div className="mb-3">
              <p className="font-semibold text-gray-700">ID:</p>
              <p className="text-gray-800">{selectedUser.id}</p>
            </div>
            <div className="mb-3">
              <p className="font-semibold text-gray-700">Username:</p>
              <p className="text-gray-800">{selectedUser.username}</p>
            </div>
            <div className="mb-3">
              <p className="font-semibold text-gray-700">Balance:</p>
              <p className="text-gray-800">{selectedUser.balance}</p>
            </div>
            <div className="mb-3">
              <p className="font-semibold text-gray-700">Email:</p>
              <p className="text-gray-800">{selectedUser.email}</p>
            </div>
            <div className="mb-3">
              <p className="font-semibold text-gray-700">Acount Number:</p>
              <p className="text-gray-800">{selectedUser.account_num}</p>
            </div>
            <div className="mb-3">
              <p className="font-semibold text-gray-700">Date Joined:</p>
              <p className="text-gray-800">{selectedUser.date_joined}</p>
            </div>
            <div className="mb-3">
              <p className="font-semibold text-gray-700">User Plan:</p>
              <p className="text-gray-800">{selectedUser.user_plan}</p>
            </div>
            <div className="mb-3">
              <p className="font-semibold text-gray-700">Verified:</p>
              <p className="text-gray-800">
              {selectedUser.is_active ? "Yes" : "No"}
            </p>
            </div>
            <p className="text-gray-600 mt-5">
              Manage user details such as role updates, activity logs, and permissions here.
            </p>

            {/* Action Tabs */}
            <div className="flex flex-wrap justify-around w-full items-center gap-3 lg:gap-4 mt-6 lg:flex-row mb-6">
                {/* First Row of Tabs */}
                <div
                  className="bg-green-100 rounded-lg p-3 lg:p-4 flex flex-col items-center cursor-pointer"
                  onClick={handleFundUser}
                  style={{ width: '55px', height: '55px' }}
                >
                  <i className="bx bx-money text-green-600 text-3xl mb-1"></i>
                  <p className="text-sm font-semibold text-green-600 mt-2">Fund</p>
                </div>
                <div
                  className="bg-blue-100 rounded-lg p-3 lg:p-4 flex flex-col items-center cursor-pointer"
                  onClick={handleAdminUser}
                  style={{ width: '55px', height: '55px' }}
                >
                  <i className="bx bxs-check-shield text-blue-600 text-3xl mb-1"></i>
                  <p className="text-sm font-semibold text-blue-600 mt-2">Admin</p>
                </div>
                <div
                  className="bg-yellow-100 rounded-lg p-3 lg:p-4 flex flex-col items-center cursor-pointer"
                  onClick={handleSuspendUser}
                  style={{ width: '55px', height: '55px' }}
                >
                  <i className="bx bx-block text-yellow-600 text-3xl mb-1"></i>
                  <p className="text-sm font-semibold text-yellow-600 mt-2">Suspend</p>
                </div>
                <div
                  className="bg-red-100 rounded-lg p-3 lg:p-4 flex flex-col items-center cursor-pointer"
                  onClick={handleDeleteUser}
                  style={{ width: '55px', height: '55px' }}
                >
                  <i className="bx bx-trash text-red-600 text-3xl mb-1"></i>
                  <p className="text-sm font-semibold text-red-600 mt-2">Remove</p>
                </div>
              </div>

              {/* Second Row for Verify Tab */}
              <div className="flex justify-start w-full items-center gap-3 mt-10 ml-2">
                <div
                  className="bg-purple-100 rounded-lg p-3 lg:p-4 flex flex-col items-center cursor-pointer"
                  onClick={handleVerifyUser}
                  style={{ width: '55px', height: '55px' }}
                >
                  <i className="bx bx-check-circle text-purple-600 text-3xl mb-1"></i>
                  <p className="text-sm font-semibold text-purple-600 mt-2">Verify</p>
                </div>
              </div>
          </div>
        </div>
      )}
      {/* User Details Modal remains unchanged... */}
      <div className="space-y-4 mt-7">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Reference ID"
          value={searchTerm1}
          onChange={handleSearchChangeT}
          className="w-full p-3 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Payment Transactions */}
      <div className="border rounded shadow">
        <button
          className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 font-bold"
          onClick={() => toggleSection("payments")}
        >
          Payment Transactions
        </button>
        {expandedSection === "payments" && (
          <div className="p-4">
            <TransactionsSection
              title="Payment Transactions"
              apiEndpoint="/payments/"
              requestType="POST"
              showPlan={false}
              searchTerm={searchTerm} // Pass the search term to filter transactions
            />
          </div>
        )}
      </div>

      {/* Data Transactions */}
      <div className="border rounded shadow">
        <button
          className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 font-bold"
          onClick={() => toggleSection("data")}
        >
          Data Transactions
        </button>
        {expandedSection === "data" && (
          <div className="p-4">
            <TransactionsSection
              title="Data Transactions"
              apiEndpoint="/purchases/"
              requestType="POST"
              requestBody={{ action: "data" , table: 'all'}}
              showPlan={true}
              searchTerm={searchTerm} // Pass the search term to filter transactions
            />
          </div>
        )}
      </div>

      {/* Airtime Transactions */}
      <div className="border rounded shadow">
        <button
          className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 font-bold"
          onClick={() => toggleSection("airtime")}
        >
          Airtime Transactions
        </button>
        {expandedSection === "airtime" && (
          <div className="p-4">
            <TransactionsSection
              title="Airtime Transactions"
              apiEndpoint="/purchases/"
              requestType="POST"
              requestBody={{ action: "airtime", table:'all' }}
              showPlan={false}
              searchTerm={searchTerm} // Pass the search term to filter transactions
            />
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default AdminPage;