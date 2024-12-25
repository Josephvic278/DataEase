import React, { useState, useContext, useEffect } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import 'boxicons/css/boxicons.min.css';
import { Button } from 'primereact/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createAuthAxios } from '@/api/authAxios';
import { toast } from 'react-toastify';
import authAxios from '@/api/authAxios';

const SettingsPage = () => {
  const authAxios = createAuthAxios()
  const { user, updateGeneralInfo } = useContext(DashboardContext);
  const [activeTab, setActiveTab] = useState('main');
  const [selectedTab, setSelectedTab] = useState(null);
  const [showResetPin, setShowResetPin] = useState(false);

  // Form data state
  const [generalInfo, setGeneralInfo] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', user_pin: user?.pin });
  const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [pinData, setPinData] = useState({ old_pin: '', new_pin: '', confirm_pin: '' });
  const [resetPinData, setResetPinData] = useState({ password: '', new_pin: '' });

  useEffect(() => {
    if (user) {
      setGeneralInfo({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        phone_number: user.phone_number || '',
        email: user.email || '',
        user_pin: user.pin,
      });
    }
    
  }, [user]);

  const UserPin = () =>{
    authAxios.get('/pin/')
    .then((res)=>{
      console.log(res)
    }).catch((err)=>{
      console.log(err)
    })
  }

  const UpdatePassword = (e) => {
    authAxios.post('/users/auth/users/set_password/', { 'current_password': e.old_password, 'new_password': e.new_password })
      .then(res => {
        if (res.status === 204) {
          toast.success('Password updated successfully');
        }
      })
      .catch(err => {
        toast.error(err.response?.data.message || 'Server Error');
        console.error(err.response?.data || err.message);
      });
  };

  const UpdatePin = (e) => {
    if (generalInfo.user_pin == null) {
      authAxios.post('/pin/', { "action": "create", "new_pin": e.new_pin })
        .then(res => toast.success(res.data.message))
        .catch(err => toast.error(err.response?.data.message || err.message));
    } else {
      authAxios.post('/pin/', { "action": "change", "prev_pin": e.old_pin, "new_pin": e.new_pin })
        .then(res => toast.success(res.data.message))
        .catch(err => toast.error(err.response.data.message));
    }
  };

  const ResetPin = (e) => {
    e.preventDefault();
    authAxios.post('/pin/', {'action':'reset', 'password': resetPinData.password, 'new_pin': resetPinData.new_pin })
      .then(res => toast.success(res.data.message))
      .catch(err => toast.error(err.response.data.message || 'Server Error'));
  };

  const handleGeneralSubmit = (e) => { e.preventDefault(); updateGeneralInfo(generalInfo); };
  const handlePasswordSubmit = (e) => { e.preventDefault(); if (passwordData.new_password === passwordData.confirm_password) UpdatePassword(passwordData); };
  const handlePinSubmit = (e) => { e.preventDefault(); if (pinData.new_pin === pinData.confirm_pin) UpdatePin(pinData); };

  return (
    <div className="p-4">
      {activeTab === 'main' ? (
        <div className="grid lg:flex justify-center items-center w-full">
          {/* User Info Tab */}
          <div className="bg-blue-100 rounded-lg p-8 flex cursor-pointer w-full lg:max-w-[98%]" onClick={() => { setActiveTab('settings'); setSelectedTab('general'); }}>
            <div className="justify-center flex items-center w-14 bg-blue-300 rounded-md">
              <i className="bx bx-user text-2xl text-white"></i>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold">User Information</h1>
              <p>View your general information</p>
            </div>
          </div>

          {/* Change Password Tab */}
          <div className="bg-green-100 rounded-lg p-8 flex cursor-pointer w-full lg:max-w-[90%] mt-5 lg:mt-0 lg:ml-3" onClick={() => { setActiveTab('settings'); setSelectedTab('password'); }}>
            <div className="justify-center flex items-center w-14 bg-green-300 rounded-md">
              <i className="bx bx-lock text-2xl text-white"></i>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold">Change Password</h1>
              <p>Update your password</p>
            </div>
          </div>

          {/* Change PIN Tab */}
          <div className="bg-yellow-100 rounded-lg p-8 flex cursor-pointer w-full lg:max-w-[90%] mt-5 lg:mt-0 lg:ml-3" onClick={() => { setActiveTab('settings'); setSelectedTab('pin'); }}>
            <div className="justify-center flex items-center w-14 bg-yellow-300 rounded-md">
              <i className="bx bx-key text-2xl text-white"></i>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold">Manage PIN</h1>
              <p>Update or set your transaction PIN</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-9xl mx-auto p-5 bg-white border border-vibrantGreen border-opacity-30 rounded-lg">
          <button
            className="text-zinc-700 mb-4 flex items-center hover:scale-[1.1] transition-all duration-200"
            onClick={() => {
              if (showResetPin) setShowResetPin(false); // Return to Change PIN tab if in Reset PIN
              else setActiveTab('main'); // Return to main tab
            }}
          >
            <i className="bx bx-arrow-back text-2xl lg:text-4xl mr-2"></i>Go Back
          </button>

          {selectedTab === 'general' && (
            <form onSubmit={handleGeneralSubmit} className="space-y-6">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-4">User Information</h2>
              <div className="flex w-full gap-4 mb-10">
                <div className="w-1/2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input id="first_name" type="text" value={generalInfo.first_name} onChange={(e) => setGeneralInfo({ ...generalInfo, first_name: e.target.value })} required className="h-12" />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input id="last_name" type="text" value={generalInfo.last_name} onChange={(e) => setGeneralInfo({ ...generalInfo, last_name: e.target.value })} required className="h-12" />
                </div>
              </div>

              <div className="flex w-full gap-4">
                <div className="w-1/2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" type="text" value={generalInfo.username} onChange={(e) => setGeneralInfo({ ...generalInfo, username: e.target.value })} required className="h-12" />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input id="phone_number" type="text" value={generalInfo.phone_number} onChange={(e) => setGeneralInfo({ ...generalInfo, phone_number: e.target.value })} required className="h-12" />
                </div>
              </div>
              <div className="flex w-full gap-4">
                <div className="w-full lg:w-1/2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={generalInfo.email} onChange={(e) => setGeneralInfo({ ...generalInfo, email: e.target.value })} required className="h-12 w-full" />
                </div>
              </div>
            {/* <div className="w-full flex lg:justify-end">
              <button type="submit" className="w-full lg:w-72 flex items-center justify-center gap-2 h-14 rounded-lg bg-vibrantGreen text-white hover:bg-green-600">Save Changes <i className="bx bx-save text-xl"></i></button> 
            </div> */}
            
            </form>
          )}

          {selectedTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
              <Label htmlFor="old_password">Old Password</Label>
              <Input id="old_password" type="password" value={passwordData.old_password} onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })} required className="h-12" />
              <Label htmlFor="new_password">New Password</Label>
              <Input id="new_password" type="password" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} required className="h-12" />
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <Input id="confirm_password" type="password" value={passwordData.confirm_password} onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })} required className="h-12" />
              <Button label="Change Password" type="submit" className="w-full h-14 rounded-sm bg-vibrantGreen text-white hover:bg-green-600" />
            </form>
          )}

          {selectedTab === 'pin' && (
            !showResetPin ? (
              <form onSubmit={handlePinSubmit} className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">
                {user?.pin ? "Change PIN" : "Set PIN"}
              </h2>
                {/* <Label htmlFor="old_pin">Old PIN</Label> */}
                          {/* Conditionally render old_pin field */}
                {user?.pin && (
                  <Label htmlFor="old_pin">Old PIN</Label>
                )}
                {/* <Input maxLength='4' id="old_pin" type="password" value={pinData.old_pin} onChange={(e) => setPinData({ ...pinData, old_pin: e.target.value })} className="h-12" /> */}
                {user?.pin && (
                  <Input
                    maxLength="4"
                    id="old_pin"
                    type="password"
                    value={pinData.old_pin}
                    onChange={(e) => setPinData({ ...pinData, old_pin: e.target.value })}
                    className="h-12"
                    required={user?.pin} // Set required only if user has a pin
                  />
                )}
                
                <Label htmlFor="new_pin">New PIN</Label>
                <Input maxLength='4' id="new_pin" type="password" value={pinData.new_pin} required onChange={(e) => setPinData({ ...pinData, new_pin: e.target.value })} className="h-12" />
                <Label htmlFor="confirm_pin">Confirm New PIN</Label>
                <Input maxLength='4' id="confirm_pin" type="password" value={pinData.confirm_pin} required onChange={(e) => setPinData({ ...pinData, confirm_pin: e.target.value })} className="h-12" />
                <div className="flex justify-between">
                  <Button label="Set PIN" type="submit" className="w-full h-14 rounded-sm bg-vibrantGreen text-white hover:bg-green-600" />

                  {/* <Button label=""  className="w-48 h-11 rounded-sm bg-yellow-500 text-white hover:bg-yellow-600" type="button" /> */}
                </div>
                <p className='font-medium text-md text-right underline underline-offset-4 text-red-500' onClick={() => setShowResetPin(true)}>Reset PIN</p>
              </form>
            ) : (
              <form onSubmit={ResetPin} className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Reset PIN</h2>
                <Label htmlFor="reset_password">Current Password</Label>
                <Input id="reset_password" type="password" value={resetPinData.password} onChange={(e) => setResetPinData({ ...resetPinData, password: e.target.value })}  className="h-12" />
                <Label htmlFor="new_reset_pin">New PIN</Label>
                <Input id="new_reset_pin" type="password" value={resetPinData.new_pin} onChange={(e) => setResetPinData({ ...resetPinData, new_pin: e.target.value })} className="h-12"  maxLength='4' />
                
                <Button label="Reset PIN" type="submit" className="w-full h-11 rounded-sm bg-red-500 text-white hover:bg-red-600" />
              </form>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
