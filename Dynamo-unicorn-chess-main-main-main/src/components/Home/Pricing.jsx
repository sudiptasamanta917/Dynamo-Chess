import React from "react";
import banner1 from "../../assets/banner/banner1.jpg";
import banner2 from "../../assets/banner/banner2.jpg";
import banner3 from "../../assets/banner2.jpg";
import { postApiWithToken } from "../../utils/api";
import { data } from "autoprefixer";
import { getUserdata } from "../../utils/getuserdata";
import { toastError, toastSuccess } from "../../utils/notifyCustom";

function Pricing() {
    const handleWithdrawal = async (amount) => {
        try {
            const url = `${import.meta.env.VITE_URL}${
                import.meta.env.VITE_GET_WALLET_WITHDRAW
            }`;
            const raw = {
                dynamoCoin: amount,
                type: "plan",
            };
            const walletWithdraw = await postApiWithToken(url, raw);
            if (walletWithdraw?.status == 200) {
                toastSuccess(walletWithdraw?.data?.message);
            } else {
                toastError(walletWithdraw);
            }
            // console.log(walletWithdraw, "walletWithdraw=>>>>>>><<<")
        } catch (error) {
            console.log(error, "walletWithdraw");
        }
    };

    return (
        <div className="">
            <section className="h-full rounded py-5 px-2 my-5 bg-[#262522] pr-2">
                <h1 className="text-center font-bold capitalize text-green-600 text-3xl ">
                    Choose your Plans
                </h1>
                <p className="text-center text-xl font-semibold text-[#fade47] mt-2 mb-5">
                    Pay Once, use Forever
                </p>

                <div className="container">
                    <div className="mt-1 grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                        <div
                            className="rounded-lg shadow-md shadow-[#C95201] overflow-hidden "
                            style={{
                                background: `url(${banner2}) center/cover no-repeat`,
                            }}
                        >
                            <div className="transform hover:scale-105 h-full transition duration-300   bg-[#C95201] bg-opacity-80     px-6 py-4 ">
                                <p className="text-lg font-medium text-white dark:text-gray-100">
                                    Intro
                                </p>
                                <h4 className="mt-1 text-4xl font-semibold text-white dark:text-gray-100">
                                    Dynamo Coin 19{" "}
                                    <span className="text-base font-normal text-gray-800 ">
                                        / Month
                                    </span>
                                </h4>
                                <p className="mt-2 text-white ">
                                    For most businesses that want to optimaize
                                    web queries.
                                </p>
                                <div className="mt-3 space-y-3">
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="mx-4 text-white ">
                                            All limited links
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="mx-4 text-white ">
                                            Own analytics platform
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="mx-4 text-white ">
                                            Chat support
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="mx-4 text-white ">
                                            Optimize hashtags
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="mx-4 text-white ">
                                            Unlimited users
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleWithdrawal(19)}
                                    className="mt-5 w-full transform rounded-md bg-green-500 px-4 py-2 font-medium capitalize tracking-wide text-white transition-colors duration-200 hover:bg-green-600 focus:bg-green-600 focus:outline-none"
                                >
                                    Bronze plan
                                </button>
                            </div>
                        </div>
                        <div
                            className="rounded-lg shadow-md shadow-[#9DB9DB]  overflow-hidden"
                            style={{
                                background: `url(${banner3}) center/cover no-repeat`,
                            }}
                        >
                            <div className=" bg-[#9DB9DB] bg-opacity-80 hover:scale-105 transition duration-300  transform rounded-lg  px-6 py-4 ">
                                <p className="text-lg font-medium text-gray-100">
                                    Popular
                                </p>
                                <h4 className="mt-1 text-4xl font-semibold text-gray-100">
                                    Dynamo Coin 99{" "}
                                    <span className="text-base font-normal text-gray-800">
                                        / Month
                                    </span>
                                </h4>
                                <p className="mt-2 text-white">
                                    For most businesses that want to optimaize
                                    web queries.
                                </p>
                                <div className="mt-3 space-y-3">
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="mx-4 text-white">
                                            All limited links
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="mx-4 text-white">
                                            Own analytics platform
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="mx-4 text-white">
                                            Chat support
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="mx-4 text-white">
                                            Optimize hashtags
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="mx-4 text-white">
                                            Unlimited users
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleWithdrawal(99)}
                                    className="mt-5 w-full transform rounded-md bg-green-500 px-4 py-2 font-medium capitalize tracking-wide text-white transition-colors duration-200 hover:bg-green-600 focus:bg-green-600 focus:outline-none"
                                >
                                    Silver plan
                                </button>
                            </div>
                        </div>
                        <div
                            className="rounded-lg shadow-md shadow-[#DAA520]  overflow-hidden"
                            style={{
                                background: `url(${banner1}) center/cover no-repeat`,
                            }}
                        >
                            <div className="transform hover:scale-105 transition duration-300 bg-[#DAA520] bg-opacity-80  rounded-lg  px-6 py-4">
                                <p className="text-lg font-medium text-white dark:text-gray-100">
                                    Exterprise
                                </p>
                                <h4 className="mt-1 text-4xl font-semibold text-white dark:text-gray-100">
                                    Dynamo Coin 199{" "}
                                    <span className="text-base font-normal text-gray-800 ">
                                        / Month
                                    </span>
                                </h4>
                                <p className="mt-2 text-white ">
                                    For most businesses that want to optimaize
                                    web queries.
                                </p>
                                <div className="mt-3 space-y-3">
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="mx-4 text-white ">
                                            All limited links
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="mx-4 text-white ">
                                            Own analytics platform
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="mx-4 text-white">
                                            Chat support
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="mx-4 text-white ">
                                            Optimize hashtags
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="mx-4 text-white">
                                            Unlimited users
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleWithdrawal(199)}
                                    className="mt-5 w-full transform rounded-md bg-green-500 px-4 py-2 font-medium capitalize tracking-wide text-white transition-colors duration-200 hover:bg-green-600 focus:bg-green-600 focus:outline-none"
                                >
                                    Gold plan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Pricing;
