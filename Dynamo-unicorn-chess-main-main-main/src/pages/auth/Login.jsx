import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toastSuccess, toastWarn } from "../../utils/notifyCustom";
import { loginSchema } from "../../utils/zodSchemas";
import { z } from "zod";
import { postApiWithFormdata } from "../../utils/api";
import { v4 as uuidv4 } from "uuid";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        deviceId: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Generate or retrieve the device ID via setFormData (never mutate state directly!)
    useEffect(() => {
        let id = localStorage.getItem("device_id");
        if (!id) {
            id = uuidv4();
            localStorage.setItem("device_id", id);
        }
        setFormData((prev) => ({
            ...prev,
            deviceId: id,
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_LOGIN}`;
        try {
            setLoading(true);
            // Validate form data against the schema
            const validatedData = loginSchema.parse(formData);

            // Ensure required fields for backend
            if (
                !validatedData.email ||
                !validatedData.password ||
                !validatedData.deviceId
            ) {
                toastWarn("Please fill all required fields.");
                setLoading(false);
                return;
            }

            const res = await postApiWithFormdata(url, validatedData);

            if (res.data.success) {
                toastSuccess("Login Successful");
                localStorage.setItem(
                    "chess-user-token",
                    JSON.stringify(res.data.data.token)
                );
                localStorage.setItem(
                    "User Detail",
                    JSON.stringify(res.data.data)
                );
                window.location.reload(false);
                navigate("/");
            } else {
                toastWarn(res.data.message || "Login failed.");
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                (error instanceof z.ZodError
                    ? error.errors[0]?.message
                    : "Login failed.");
            toastWarn(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        const url = `${import.meta.env.VITE_URL}${
            import.meta.env.VITE_GOOGLE_AUTH
        }`;
        window.open(url, "_self");
    };

    return (
        <div className="flex justify-center py-3 lg:px-12 bg-black">
            <div className="w-full p-6 sm:w-2/3 lg:w-5/12 md:w-2/3 sm:my-16 max-sm:mx-5 max-md:mx-8 rounded-md bg-zinc-800">
                <h1 className="text-white text-5xl font-light pt-4 pl-4 opacity-75">
                    Sign in
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="mt-6 px-4 max-[375px]:mt-4 max-[375px]:px-2 opacity-75">
                        <label className="text-white">Email</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-12 max-[375px]:h-8 max-[640px]:h-10 text-white bg-black rounded-md border border-green-600 pl-2 mt-2"
                        />
                    </div>
                    <div className="mt-6 px-4 max-[375px]:mt-4 max-[375px]:px-2 opacity-75">
                        <label className="text-white">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full h-12 max-[375px]:h-8 max-[640px]:h-10 text-white bg-black rounded-md border border-green-600 pl-2 mt-2"
                        />
                    </div>
                    <div className="mt-10 px-4 max-[375px]:mt-6 max-[375px]:px-2 max-[640px]:mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 max-[375px]:h-8 max-[640px]:h-10 text-white bg-green-700 hover:bg-green-500 active:bg-green-600 rounded-md opacity-85 font-bold"
                        >
                            {loading ? "Loading..." : "SIGN IN"}
                        </button>
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="flex mt-4 text-white items-center justify-center w-full h-12 bg-green-700 hover:bg-green-600 rounded-md font-semibold transition duration-200"
                        >
                            <FaGoogle className="w-5 h-5 mr-3" />
                            Sign in with Google
                        </button>

                        <div className="mt-3 opacity-75">
                            <input type="checkbox" id="keepLoggedIn" />
                            <label
                                className="pl-2 text-sm text-white"
                                htmlFor="keepLoggedIn"
                            >
                                Keep me logged in
                            </label>
                        </div>
                    </div>
                </form>
                <div className="mt-6 flex space-x-20 max-sm:space-x-12 max-md:space-x-8 max-md:mt-4 opacity-75">
                    {/* <Link to={"/register"} className='text-green-600 hover:text-green-400 text-sm max-sm:text-xs pl-5'>Register</Link> */}
                    {/* <Link to={"/forget"} className='text-green-600 hover:text-green-400 text-sm max-sm:text-xs '>Password reset</Link> */}
                    {/* <Link to={"/loginbyemail"} className='text-green-600 hover:text-green-400 text-sm max-sm:text-xs '>Login by email</Link> */}
                </div>
            </div>
        </div>
    );
};

export default Login;
