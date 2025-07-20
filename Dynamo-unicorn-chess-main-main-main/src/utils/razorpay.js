import { postApiWithToken } from "./api";
import { getUserdata } from "./getuserdata";

export  const checkoutHandler = async (amount) => {
    const userData = await getUserdata()
    const raw = {
        balance: amount,
    }
    const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_PAYMENT_RAZORPAY}`;
    const order = await postApiWithToken(url,raw)
    // console.log("=???????=", order?.data?.data?.order?.amount);
    const options = {
        key:order?.data?.data?.key,
        amount:order?.data?.data?.order?.amount,
        currency: "INR",
        name: "Dynamo Unicorn Chess",
        description: "Dynamo Unicorn Chess of RazorPay",
        image: order?.data?.data?.image,
        order_id: order?.data?.data?.order?.id,
        callback_url: `${import.meta.env.VITE_URL}${import.meta.env.VITE_STATUS_RAZORPAY}/${userData?._id}/${amount}`,
        prefill: {
            name: order?.data?.data?.name,
            email: order?.data?.data?.email,
            contact: order?.data?.data?.mobile,
        },
        notes: {
            "address": "Razorpay Corporate Office"
        },
        theme: {
            "color": "#334155"
        }
    };
    const razor = new window.Razorpay(options);
    return razor.open();
}

export const checkoutHandlerOrder = async (amount, productId, billingDetailsId) => {
    try {
      // Fetch user data
      const userData = await getUserdata();
      if (!userData || !userData._id) {
        throw new Error("User data is missing or invalid.");
      }
  
      // Prepare request payload
      const raw = {
        balance: amount,
      };
  
      // Construct URL
      const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_PAYMENT_RAZORPAY}`;
  
      // Create Razorpay order
      const orderResponse = await postApiWithToken(url, raw);
      const orderData = orderResponse?.data?.data;
      if (!orderData || !orderData.order?.id || !orderData.key) {
        throw new Error("Failed to create Razorpay order.");
      }
  
      // Define Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: "INR",
        name: "Dynamo Unicorn Chess",
        description: "Dynamo Unicorn Chess of RazorPay",
        image: orderData.image || "https://via.placeholder.com/150",
        order_id: orderData.order.id,
        callback_url: `${import.meta.env.VITE_URL}${import.meta.env.VITE_STATUS_RAZORPAY_ORDER}/${userData._id}/${productId}/${billingDetailsId}`,
        prefill: {
          name: orderData.name || "User",
          email: orderData.email || "user@example.com",
          contact: orderData.mobile || "1234567890",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#334155",
        },
      };
  
      // Open Razorpay payment UI
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error during checkout:", error.message);
      // Optionally, handle error (e.g., show a toast notification)
    }
};
  