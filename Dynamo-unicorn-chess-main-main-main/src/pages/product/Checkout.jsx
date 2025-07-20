import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApi, getApiWithToken, postApiWithToken } from "../../utils/api";
import { useQuery } from "react-query";
import { toastSuccess, toastError } from "../../utils/notifyCustom";
import BillingDetailsCardCheckout from "./BillingDetailsCardCheckout";
import Pagination from "../../components/Pagination";
import { checkoutHandlerOrder } from "../../utils/razorpay";

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); // State for modal
    const [billingDetails, setBillingDetails] = useState({
        name: "",
        addressType: "",
        address: "",
        phone: "",
        email: "",
        apartment: "",
        city: "",
        state: "",
        postcode: "",
    });
    const [selectedBillingId, setSelectedBillingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const productUrl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_PRODUCT}${id}`;

    const { data: productData, isLoading, isError, error } = useQuery(
        ["product", id],
        () => getApi(productUrl)
    );

    const billingDetailsUserUrl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_billing_details_user}?page=${currentPage}&limit=${2}`;
    const { data: billingData, refetch } = useQuery(["billingDetailsUser", currentPage], () =>
        getApiWithToken(billingDetailsUserUrl)
    );

    const handleChange = (e) => {
        const { id, value } = e.target;
        setBillingDetails((prevDetails) => ({
            ...prevDetails,
            [id]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const billingDetailsUrl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_billing_details}`;
            const billingResponse = await postApiWithToken(billingDetailsUrl, billingDetails);

            if (billingResponse?.data?.success) {
                toastSuccess(billingResponse.data.message);
                refetch()
                setIsOpen(false); // Close the modal on success
            } else {
                toastError(billingResponse?.data?.message || "Failed to save billing details.");
            }
        } catch (err) {
            console.error("Error:", err);
            toastError("An error occurred while processing your billing details.");
        }
    };

  

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    const product = productData?.data?.product || {};
    const subtotal = product.price || 0;
    const discount = ((product.price - product.sellPrice) / product.price) * 100 || 0;
    const total = product.sellPrice || 0;
    const billingDetailsUser = billingData?.data?.billingDetails;

    const totalPages = billingData?.data?.totalPages || 1;
    const handleOrder = async () => {
        // Validate billing address, user ID, and total amount
        if (!id || !selectedBillingId || !total) {
          toastError("Please select a billing address and ensure total amount is valid.");
          return;
        }
        try {
          // Call checkout handler
          await checkoutHandlerOrder(total, id, selectedBillingId);
          // Provide feedback on successful payment initiation
        //   toastSuccess("Payment process initiated. Please complete the payment.");
        } catch (err) {
          console.error("Error while placing the order:", err.message || err);
          toastError(err.message || "An error occurred while placing the order.");
        }
      };
      
      
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handleCardSelect = (id) => {
        setSelectedBillingId(id); // Update the selected card ID
    };
    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center gap-10 my-2">
                <h1 className="text-2xl font-bold mb-4">Checkout</h1>
                <div
                    onClick={() => setIsOpen(true)}
                    className="w-full lg:w-auto bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center p-1 cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                    <p className="text-white font-bold text-sm md:text-base lg:text-lg">Add Billing Details</p>
                </div>

            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Billing Details Section */}
                <div>
                    <BillingDetailsCardCheckout
                        data={billingDetailsUser}
                        onCardSelect={handleCardSelect}
                        selectedId={selectedBillingId}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
                {/* Order Summary Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Your Order</h2>
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <div className="border-b pb-4 mb-4">
                            <div className="flex justify-between">
                                <span>Product</span>
                                <span>Total</span>
                            </div>
                            <div className="flex justify-between mt-4">
                                <span>{product.name}</span>
                                <span>₹{total}</span>
                            </div>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Discount</span>
                            <span>- ₹{discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleOrder}
                            className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600  text-white py-2 rounded-lg"
                            disabled={!selectedBillingId || !id}
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>
            </div>
            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="bg-white overflow-y-auto max-h-screen rounded-lg shadow-lg sm:w-[50%] w-full p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Billing Details</h2>
                        <form className="space-y-4">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={billingDetails.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                                    placeholder="Name"
                                />
                            </div>

                            {/* Address Type */}
                            <div>
                                <label htmlFor="addressType" className="block text-sm font-medium text-gray-700">
                                    Address Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="addressType"
                                    value={billingDetails.addressType}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                                >
                                    <option value="">Select...</option>
                                    <option value="Home">Home</option>
                                    <option value="Office">Office</option>
                                </select>
                            </div>

                            {/* Street Address */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    value={billingDetails.address}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                                    placeholder="Street address"
                                />
                            </div>

                            {/* Mobile and Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                                        Mobile <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="phone"
                                        value={billingDetails.mobile}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                                        placeholder="Enter mobile number"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={billingDetails.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                                        placeholder="Enter email address"
                                    />
                                </div>
                            </div>

                            {/* Apartment */}
                            <div>
                                <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
                                    Apartment, suite, unit etc. (optional)
                                </label>
                                <input
                                    type="text"
                                    id="apartment"
                                    value={billingDetails.apartment}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                                    placeholder="Apartment or suite"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                    Town / City <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    value={billingDetails.city}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                                    placeholder="Town / City"
                                />
                            </div>

                            {/* State and Zip Code */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                        State / County <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="state"
                                        value={billingDetails.state}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                                        placeholder="State / County"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
                                        Postcode / Zip <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="postcode"
                                        value={billingDetails.postcode}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
                                        placeholder="Postcode / Zip"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 justify-between">

                                <button
                                    type="button"
                                    className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg mt-2 hover:bg-gray-400 transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="w-full bg-green-500 text-white py-2 rounded-lg mt-2 hover:bg-green-600 transition"
                                    onClick={handleSubmit}
                                >
                                    Save Details
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Checkout;
