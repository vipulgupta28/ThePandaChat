import { GlareCard } from "../ui/glare-card";
import axios from "axios";
import { CheckCircle } from "lucide-react";


export function PremiumCardDemo() {
  const handlePayment = async () => {
    try {
      const { data } = await axios.post("http://localhost:3000/api/v1/create-order", {
        amount: 100,
        currency: "INR",
      });

      const { id: order_id, currency, amount } = data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Just",
        description: "Upgrade to Premium",
        order_id,
        prefill: {
          name: "Test User",
          email: "vilulgupta2802@gmail.com",
        },
        theme: {
          color: "#121212",
        },
        // handler: async function (response: any) {
        //   const verifyRes = await axios.post("http://localhost:3000/verify-payment", {
        //     razorpay_order_id: response.razorpay_order_id,
        //     razorpay_payment_id: response.razorpay_payment_id,
        //     razorpay_signature: response.razorpay_signature,
        //   });

        //   if (verifyRes.data.message === "Payment verified successfully") {
        //     alert("You are now a premium user! 🎉");
        //   } else {
        //     alert("Payment verification failed.");
        //   }
        // },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <GlareCard className="flex h-full max-w-md w-full flex-col items-center justify-center rounded-2xl p-8 backdrop-blur-lg border border-white/10 shadow-xl text-white">
        <h3 className="text-3xl font-extrabold mb-6 text-center">Premium Plan</h3>

        <ul className="space-y-4 text-base text-left w-full">
          {[
            "Ad-free chatting",
            "Video Calling",
            "Faster performance",
            "Enhanced customization",
            "Priority notifications",
          ].map((feature, i) => (
            <li key={i} className="flex items-center space-x-2">
              <CheckCircle className="text-green-400 w-5 h-5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <div className="text-xl font-medium text-gray-300">Only</div>
          <div className="text-6xl font-bold text-white mt-1">120/-</div>
          <div className="text-sm text-gray-400 mt-1">per month</div>
        </div>
      </GlareCard>

      <button
        onClick={handlePayment}
        className="px-6 py-3 rounded-full font-semibold text-black bg-white hover:bg-gray-200 hover:cursor-pointer"
      >
        Upgrade Now
      </button>
    </div>
  );
}
