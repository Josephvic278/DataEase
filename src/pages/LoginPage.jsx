import { useState, useRef, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Lottie from 'lottie-react';
import authAxios from '@/api/authAxios';
import { createAuthAxios } from '@/api/authAxios';
import animationData from '../assets/Animation - 1728603847074.json';
import { toast } from 'react-toastify'; // For error handling and notifications

const LoginPage = () => {
  // const authAxios = createAuthAxios()
  const animationRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for button disabling

  const { loginUser, accessToken } = useContext(AuthContext); // Access login function and token from AuthContext
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Redirect if the user is already logged in
  // useEffect(() => {
  //   if (accessToken) {
  //     navigate('/dashboard'); // Redirect to dashboard if logged in
  //   }
  // }, [accessToken, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading on form submit
  
    try {
      // Call the user_activity endpoint
      const userActivityResponse = await authAxios.post('/user_activity/', {
        username: username,
      });   
  
      if (userActivityResponse.data.is_active === true) {
        // If user_activity is true, proceed to login
        await loginUser(username, password, "Login Successful");
      } else {
        // If user_activity is false, navigate to register page
        toast.error('Email verification failed or cancelled. Try signing up again.');
        navigate('/register/');
      }
    } catch (err) {
      console.log(err);
      toast.error('Login failed: Please check your username or your password.');
    } finally {
      setLoading(false); // Stop loading after the process completes
    }
  };
  

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-transparent lg:block">
        <Lottie
          lottieRef={animationRef}
          animationData={animationData}
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <form className="mx-auto grid w-[350px] gap-6" onSubmit={handleLogin}>
          <div className="grid gap-2 text-center">
            <h1 className="h3 text-[54px] font-bold text-vibrantGreen relative mb-3">Sign In</h1>
            <p className="text-gray small-1">Enter your credentials to Login to your account</p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username" className="small-1 text-gray font-semibold text-[16px]">Username</Label>
              <input
                id="username"
                type="text"
                className="task-input"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="small-1 text-gray font-semibold text-[16px]">Password</Label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  className="task-input"
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <i className="pi pi-eye"></i> : <i className="pi pi-eye-slash"></i>}
                </button>
              </div>
              <Link 
                to="/forgot-password" 
                className="ml-auto inline-block text-sm text-slate-900"
                onClick={(e) => e.stopPropagation()} // Prevent the form submit behavior
              >
                Forgot your password?
              </Link>
            </div>
            <Button
              type="submit"
              disabled={loading} // Disable button when loading
              className={`inline-flex h-12 animate-shimmer items-center justify-center rounded-md border-none bg-[linear-gradient(110deg,#00c158,45%,#7ad67f,55%,#00c158)] body-2 bg-[length:200%_100%] px-16 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-50 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm text-gray">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
