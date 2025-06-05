// import React, { useState } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiEye, FiEyeOff } from "react-icons/fi";
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { auth } from "../../src/firebase";



// const LoginModal: React.FC = () => {

//   const [isLogin, setIsLogin] = useState(true);
//   const [showPass, setShowPass] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [verified, setVerified] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const togglePassword = () => {
//     setShowPass(!showPass);
//   };

//   const handleLogin = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:3000/api/v1/signin", {
//         username,
//         password,
//       });

//       if (response.status === 200) {
//         toast.success("Logged in successfully!");

//       }
//     } catch (error) {
//       toast.error("Invalid username or password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendOtp = async () => {
//     if (!email) return toast.error("Please enter your email.");
//     try {
//       const response = await axios.post("http://localhost:3000/api/v1/getOTP", { email });
//       if (response.status === 200) {
//         toast.success("OTP sent to your email.");
//       }
//     } catch {
//       toast.error("Failed to send OTP.");
//     }
//   };

//   const verifyOtp = async () => {
//     try {
//       const response = await axios.post("http://localhost:3000/api/v1/verifyOTP", { email, otp });
//       if (response.status === 200 && response.data.verified) {
//         toast.success("OTP Verified");
//         setVerified(true);
//       } else {
//         toast.error("Invalid OTP");
//       }
//     } catch {
//       toast.error("OTP verification failed");
//     }
//   };

//   const handleSignup = async () => {
//     if (!verified) return toast.error("Please verify OTP first.");
//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:3000/api/v1/signup", {
//         username,
//         password,
//         email,
//       });

//       if (response.status === 201) {
//         toast.success("Signup successful!");
//         setIsLogin(true);
//       }
//     } catch {
//       toast.error("Signup failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleAuth = async () => {
//   try {
//     // Step 1: Sign in with Google
//     const provider = new GoogleAuthProvider();
//     const result = await signInWithPopup(auth, provider);
//     const user = result.user;

//     // Step 2: Get Firebase ID token
//     const idToken = await user.getIdToken();

//     // Step 3: Send token to backend
//     const res = await axios.post("http://localhost:3000/api/v1/googleAuth", {
//       token: idToken,
//     });

//     if(res.status === 200){
//         console.log("User saved:", res.data);
//         navigate("/")
//     }

  
//   } catch (error) {
//     console.error("Auth error:", error);
//   }
// }
  
    





//   return (
//     <AnimatePresence>
//       <motion.div
//         className="fixed inset-0 bg-opacity-60 flex justify-center items-center z-50"
//         initial={{ opacity: 0, scale: 0 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.7, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
//         transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//       >
//         <div className="bg-white text-black rounded-xl p-8 w-full max-w-lg shadow-lg relative">
//           {/* Toggle Buttons */}
//           <div className="flex justify-between mb-6">
//             <button
//               className={`w-1/2 text-lg hover:cursor-pointer font-semibold py-2 rounded-l ${isLogin ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-200 duration-400'}`}
//               onClick={() => setIsLogin(true)}
//             >
//               Login
//             </button>
//             <button
//               className={`w-1/2 text-lg font-semibold hover:cursor-pointer py-2 rounded-r ${!isLogin ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-200 duration-400'}`}
//               onClick={() => setIsLogin(false)}
//             >
//               Signup
//             </button>
//           </div>

//           {/* Login Form */}
//           {isLogin && (
//             <>
//               <label className="block font-medium">Username</label>
//               <input
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="Enter username"
//                 className="w-full mb-4 p-3 mt-2 border border-gray-300 rounded"
//               />

//               <label className="block font-medium">Password</label>
//               <div className="relative">
//                 <input
//                   type={showPass ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter password"
//                   className="w-full mb-4 p-3 mt-2 border border-gray-300 rounded pr-10"
//                 />
//                 <span
//                   onClick={togglePassword}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl"
//                 >
//                   {showPass ? <FiEyeOff /> : <FiEye />}
//                 </span>
//               </div>

//             <div className='flex flex-col gap-5'>

          
//               <button
//                 className="w-full py-2 bg-black text-white rounded hover:bg-zinc-800 transition"
//                 onClick={handleLogin}
//                 disabled={loading}
//               >
//                 {loading ? "Logging in..." : "Login"}
//               </button>

//               <button
//                className="w-full py-2 bg-black text-white rounded hover:bg-zinc-800 transition"
//                onClick={handleGoogleAuth}
//               >
//                 Continue with google
//               </button>
//                 </div>
//             </>
//           )}

//           {/* Signup Form */}
//           {!isLogin && (
//             <>
//               <label className="block font-medium mb-2">Email</label>
//               <div className="flex items-center gap-3 mb-4">
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter email"
//                   className="flex-1 p-3 border border-gray-300 rounded"
//                 />
//                 <button
//                   className="px-4 py-2 bg-black text-white rounded hover:bg-zinc-800 transition"
//                   onClick={sendOtp}
//                 >
//                   Send OTP
//                 </button>
//               </div>

//               <label className="block font-medium mb-2">OTP</label>
//               <div className="flex items-center gap-3 mb-4">
//                 <input
//                   type="text"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   placeholder="Enter OTP"
//                   className="flex-1 p-3 border border-gray-300 rounded"
//                 />
//                 <button
//                   className="px-4 py-2 bg-black text-white rounded hover:bg-zinc-800 transition"
//                   onClick={verifyOtp}
//                 >
//                   Verify OTP
//                 </button>
//               </div>

//               <label className="block font-medium mb-2">Create Username</label>
//               <input
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="Choose a username"
//                 className="w-full p-3 mb-4 border border-gray-300 rounded"
//               />

//               <label className="block font-medium mb-2">Create Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Choose a password"
//                 className="w-full p-3 mb-6 border border-gray-300 rounded"
//               />

//               <button
//                 className="w-full py-2 bg-black text-white rounded hover:bg-zinc-800 transition"
//                 onClick={handleSignup}
//                 disabled={loading}
//               >
//                 {loading ? "Signing up..." : "Signup"}
//               </button>

//               <button
//                className="w-full py-2 bg-black text-white rounded hover:bg-zinc-800 transition"
//                onClick={handleGoogleAuth}
//               >
//                 COntinue with google
//               </button>
//             </>
//           )}

//           {/* Close Button */}
//           <button
          
//             className="absolute top-2 right-3 text-black text-xl font-bold"
//           >
//             &times;
//           </button>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default LoginModal;
