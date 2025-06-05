// import bcrypt from 'bcrypt'
// import nodemailer from "nodemailer";
// import { createClient } from '@supabase/supabase-js'
// import admin from '../src/firebase'
// import dotenv from 'dotenv';

// import { razorpay } from './utils/razropay';
// import crypto from "crypto";

// dotenv.config();


// const supabaseUrl = process.env.SUPABASE_URL!
// const supabaseKey = process.env.SUPABASE_ANON_KEY!
// const supabase = createClient(supabaseUrl, supabaseKey)

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.GMAIL_USER!,
//         pass: process.env.GMAIL_PASS!,
//     }
// });

// const otpStorage: Record<string, number> = {};



// const sendOtpToEmail = async (userEmail: string, otp: number) => {
//     const mailOption = {
//         from: process.env.GMAIL_USER!,
//         to: userEmail,
//         subject: "Delta OTP Code",
//         text: `Your OTP is : ${otp}`,
//     };

//     try {
//         let info = await transporter.sendMail(mailOption);
//         console.log("Email Sent to", info.response);
//     } catch (error) {
//         console.log("Error sending mail", error);
//     }
// };



// app.post("/api/v1/getOTP", async(req,res)=>{

//   const email = req.body.email
//   const OTP = Math.floor(1000 + Math.random() * 9000);
//   console.log(`Generating OTP for ${email}: ${OTP}`);
//   otpStorage[email] = OTP;

//   try {
//         await sendOtpToEmail(email, OTP);
//         res.status(200).json({ message: "OTP sent to your email" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Failed to send OTP" });
//     }

// })

// app.post("/api/v1/verifyOTP",(req,res)=>{

//     const { otp, email } = req.body;

//     const storedOTP = otpStorage[email];


//     if (storedOTP && storedOTP.toString() === otp.toString()) {
//         res.status(200).json({ message: "OTP verified successfully", verified: true });
//     } else {
//         res.status(400).json({ message: "Invalid OTP" });
//     }

// })


// app.post("/api/v1/signup", async (req, res) => {
//   const { username, password, email } = req.body;


//   try {
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const { data, error } = await supabase
//       .from("users")
//       .insert([{ username, email, password: hashedPassword }])
//       .select("user_id")
//       .single();

//     if (error) throw error;

//     res.status(201).json({ user_id: data.user_id });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error inserting user" });
//   }
// });


// //@ts-ignore
// app.post("/api/v1/signin", async (req,res)=>{
//    const { username, password } = req.body;

//     try {
//         const { data: user, error } = await supabase
//             .from('users')
//             .select('password')
//             .eq('username', username)
//             .single();

//         if (error || !user) {
//             return res.status(400).json({ message: "Invalid username or password" });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         res.status(200).json({ message: "Login successful" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }

// })

// //@ts-ignore
// app.post("/api/v1/googleAuth", async (req, res) => {
//   const { token } = req.body;

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     const { name, email } = decodedToken;

//     if (!email) {
//       return res.status(400).json({ error: "Email not found in token" });
//     }

//     const { data: existingUser, error: userCheckError } = await supabase
//       .from("users")
//       .select("*")
//       .eq("email", email)
//       .single();

//     if (userCheckError && userCheckError.code !== "PGRST116") {
//       throw userCheckError;
//     }

//     let user = existingUser;

//     if (!existingUser) {
//       const { data: newUser, error: insertError } = await supabase
//         .from("users")
//         .insert([
//           {
//             username: name || email.split("@")[0],
//             email,
//             password: "google-auth",
//           },
//         ])
//         .select()
//         .single();

//       if (insertError) throw insertError;
//       user = newUser;
//     }

//     res.status(200).json({
//       message: "User authenticated successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Google auth error:", error);
//     res.status(500).json({ error: "Authentication failed" });
//   }
// });






// app.post("/api/v1/create-order", async (req, res) => {
//   try {
//     const { amount, currency = "INR", receipt } = req.body;

//     const options = {
//       amount: 100, // amount in paise
//       currency: "INR",
//       receipt: receipt || `receipt_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create order" });
//   }
// });


// //@ts-ignore
// app.post("/verify-payment", async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user_id } = req.body;

//   const body = razorpay_order_id + "|" + razorpay_payment_id;
//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_SECRET!)
//     .update(body)
//     .digest("hex");

//   const isAuthentic = expectedSignature === razorpay_signature;

//   if (!isAuthentic) {
//     return res.status(400).json({ error: "Invalid signature" });
//   }

//   const expiresAt = new Date();
//   expiresAt.setDate(expiresAt.getDate() + 30); // Plan valid for 30 days

//   const { data, error } = await supabase.from("subscriptions").insert([
//     {
//       user_id,
//       plan: "premium",
//       status: "active",
//       expires_at: expiresAt.toISOString()
//     }
//   ]);

//   if (error) {
//     console.error("Supabase Insert Error:", error);
//     return res.status(500).json({ error: "Payment verified, but failed to save subscription." });
//   }

//   return res.status(200).json({ message: "Payment verified and subscription saved.", subscription: data });
// });



// //@ts-ignore
// app.post("/api/check-subscription", async (req, res) => {
//   const { user_id } = req.body;

//   if (!user_id) return res.status(400).json({ message: "Missing user ID" });

//   const { data, error } = await supabase
//     .from("subscriptions")
//     .select("id") // or whatever field
//     .eq("user_id", user_id)
//     .maybeSingle(); // returns null if not found

//   if (error) {
//     console.error("Supabase error:", error.message);
//     return res.status(500).json({ message: "Server error" });
//   }

//   if (!data) {
//     return res.json({ isSubscribed: false });
//   }

//   return res.json({ isSubscribed: true });
// });




//   app.post("/api/v1/update-password", async (req, res) => {
//     const { email, newPassword } = req.body;
//     try {
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//       const { data, error } = await supabase
//         .from("users")
//         .update({ password: hashedPassword })
//         .eq("email", email);
  
//       if (error) throw error;
//       res.status(200).json({ message: "Password updated successfully" });
//     } catch (err) {
//       res.status(500).json({ message: "Error updating password" });
//     }
//   });
  