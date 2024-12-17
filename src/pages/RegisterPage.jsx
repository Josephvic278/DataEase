import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../assets/Animation - 1728603847074.json';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAuthAxios } from '@/api/authAxios';
import authAxios from '@/api/authAxios';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const RegisterPage = () => {
  // const authAxios = createAuthAxios()
  const navigate = useNavigate();
  const { loginUser, register, otpSent, verifyOtp, resendOtp } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    full_name: '',
    username: '',
    phone_number: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(240);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [referal, setReferal] = useState('')
  // const [uri_username, setUriUsername] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search); // Get query parameters from the current URL
    const referralCode = urlParams.get('r'); // Get the value of 'r' parameter
    setReferal(referralCode);
    // console.log(referralCode);  // Log the referral code to console
  }, []);  // Ensure this runs only once when the component mounts  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle changes in input fields
  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevData) => {
      const newData = {
        ...prevData,
        [id]: value,
      };
      // console.log("Updated userData:", newData); // Debugging
      return newData;
    });
  
    if (id === 'password') {
      checkPasswordStrength(value);
    }
  };
  

    // Check password strength
    const checkPasswordStrength = (password) => {
      let strength = 0;
      if (/[a-zA-Z]/.test(password)) strength += 20; // Letters only
      if (/\d/.test(password) && /[a-zA-Z]/.test(password)) strength += 30; // Letters + Numbers
      if (/\d/.test(password) && /[a-zA-Z]/.test(password) && /[!@#$%^&*()_+~`|}{[\]:;.,<>/?-]/.test(password)) {
        strength += 50; // Letters + Numbers + Special Characters
      }
      setPasswordStrength(strength);
    };

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader for registration
  
    try {
      // Call the user_activity endpoint
      const userActivityResponse = await authAxios.post('/user_activity/', {
        username: userData.username,
      });
  
      if (userActivityResponse.data === false) {
        // Proceed to register if user_activity is successful
        await register({
          first_name: userData.full_name.split(' ')[0],
          last_name: userData.full_name.split(' ')[1] || '',
          phone_number: userData.phone_number,
          email: userData.email,
          username: userData.username,
          password: userData.password,
          is_active: false,
          referral: referal
        });
      } else {
        console.log('User activity validation failed.');
      }
    } catch (err) {
      console.error('Error in user_activity or registration:', err);
    } finally {
      await register({
        first_name: userData.full_name.split(' ')[0],
        last_name: userData.full_name.split(' ')[1] || '',
        phone_number: userData.phone_number,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        is_active: false,
        referral: referal
      });
      setLoading(false); // End loader after the process completes
    }
  };
  

  // OTP Verification handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setVerifying(true); // Start loader for OTP verification
    await verifyOtp(userData.email, otp);
    loginUser(userData.username, userData.password, 'Redirecting to dashboard...');
    setVerifying(false); // End loader after OTP verification
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setResendEnabled(true); // Enable resend button after 60 seconds
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  // Resend OTP handler
  const handleResendOtp = async () => {
    setCountdown(240); // Reset countdown
    setResendEnabled(false); // Disable resend button again
    // console.log(userData.username)
    await resendOtp(userData.email);
  };
  const manual_uri = `https://wa.me/+2349164661632?text=Hi%20Dataease!%20I%20am%20trying%20to%20manually%20verify%20my%20account.%20My%20username%20is%20${encodeURIComponent(userData.username)}.`
  return (
    <div>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="hidden bg-transparent lg:block">
          <Lottie animationData={animationData} className="h-full w-full object-cover" />
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-left">
              <h1 className="h4 font-bold text-vibrantGreen relative mb-3">
                {otpSent ? 'Enter OTP' : 'Create an Account'}
              </h1>
              <p className="text-gray small-1">
                {otpSent ? 'Check your email for the OTP.' : 'Create an account to explore VTU offers and rewards'}
              </p>
            </div>
            <div className="grid gap-4">
              {!otpSent ? (
                <>
                  {/* Registration Form */}
                  <div className="grid gap-2">
                    <Label htmlFor="full_name" className="small-1 text-gray font-semibold text-[16px]">Full Name</Label>
                    <input
                      id="full_name"
                      type="text"
                      value={userData.full_name}
                      onChange={handleChange}
                      className="task-input capitalize"
                      placeholder="Sam Smither"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username" className="small-1 text-gray font-semibold text-[16px]">Username</Label>
                    <input
                      id="username"
                      type="text"
                      value={userData.username}
                      onChange={handleChange}
                      className="task-input"
                      placeholder="Sterling"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone_number" className="small-1 text-gray font-semibold text-[16px]">Phone Number</Label>
                    <input
                      id="phone_number"
                      type="tel"
                      value={userData.phone_number}
                      onChange={handleChange}
                      className="task-input"
                      placeholder="09132347584"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email" className="small-1 text-gray font-semibold text-[16px]">Email</Label>
                    <input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={handleChange} // Should call handleChange
                      className="task-input"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
{/*
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="small-1 text-gray font-semibold text-[16px]">Password</Label>
                    <input
                      id="password"
                      type="password"
                      value={userData.password}
                      onChange={handleChange}
                      className="task-input"
                      placeholder="helloDataEase@1"
                      required
                    />
                  </div>*/}

                  <div className="grid gap-2">
		              <Label htmlFor="password" className="small-1 text-gray font-semibold text-[16px]">Password</Label>
		              <div className="relative">
		                <input
		                  type={showPassword ? 'text' : 'password'}
		                  id="password"
		                  value={userData.password}
		                  className="task-input"
		                  onChange={handleChange}
		                  placeholder="helloDataEase@1"
		                  required
		                />
		                <button
		                  type="button"
		                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray"
		                  onClick={togglePasswordVisibility}
		                >
		                  {showPassword ? <i className="pi pi-eye"></i> : <i className="pi pi-eye-slash"></i> }
		                </button>
		              </div>
		            </div>

                <div className="grid gap-2">
                    <Label htmlFor="referral" className="small-1 text-gray font-semibold text-[16px]">Referral Code</Label>
                    <input
                      id="referral"
                      type="text"
                      value={referal}
                      onChange={handleChange}
                      className="task-input"
                      placeholder="Referral Code"
                      disabled={true}
                    />
                  </div>
                {/* Password Strength Indicator */}
                <div className="mt-2">
                    <div className="relative w-full h-2 bg-gray-300 rounded">
                      <div
                        className={`h-2 rounded transition-all duration-300 ${
                          passwordStrength < 50
                            ? 'bg-red-500'
                            : passwordStrength < 80
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1">
                      {passwordStrength < 50
                        ? 'Password strength: Weak'
                        : passwordStrength < 80
                        ? 'Password strength: Medium'
                        : 'Password strength: Strong'}
                    </p>
                  </div>

                  <Label className="ml-auto inline-block text-sm leading-6 text-gray">
                    By registering, I agree to DataEase's <span className="font-bold text-black">Terms of Service</span> and <span className="font-bold text-black">Privacy policy</span>
                  </Label>
                  <button
                    onClick={handleRegister}
                    className={`inline-flex h-12 animate-shimmer items-center justify-center rounded-md border-none bg-[linear-gradient(110deg,#00c158,45%,#7ad67f,55%,#00c158)] body-2 bg-[length:200%_100%] px-16 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-50 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                    // disabled={loading} // Disable button while loading
                    disabled={loading || passwordStrength < 50} // Disable if loading or password strength is weak
                  >
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </button>
                </>
              ) : (
                <>
                  {/* OTP Verification Form */}
                  <div className="grid gap-2 place-content-center">
                    <InputOTP
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e)}
                      className="task-input mb-1"
                    >
                      <InputOTPGroup className="">
                      	<InputOTPGroup>
                        	<InputOTPSlot index={0} autoFocus={true} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                        	<InputOTPSlot index={1} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                        	<InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                        	<InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <button
                    onClick={handleVerifyOtp}
                    className="inline-flex h-16 animate-shimmer items-center justify-center rounded-2xl border-none bg-[linear-gradient(110deg,#00c158,45%,#7ad67f,55%,#00c158)] body-2 bg-[length:200%_100%] px-16 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-50 mt-4"
                    disabled={verifying} // Disable button while verifying OTP
                  >
                    {verifying ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <div>
                  <p className='text-sm'>Having issues with email verification? <a href={manual_uri} className='font-bold'>click here</a> to veify manually</p>
                </div>
                  {/* Countdown and Resend OTP Button */}
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray">Resend OTP in {countdown}s</span>
                    <button
                      onClick={handleResendOtp}
                      disabled={!resendEnabled} // Disable until countdown finishes
                      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 rounded-lg focus:ring-offset-2 ${
                        resendEnabled ? 'bg-green-600' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Resend OTP
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="text-center">
              <p className="text-gray text-sm">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
