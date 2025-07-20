import React, { useEffect, useState } from 'react';
import { BsFillInfoCircleFill } from "react-icons/bs";
import Switch from '../../components/Switch';
import { toastSuccess, toastWarn } from '../../utils/notifyCustom';
import axios from 'axios';
import { RegisterSchema } from '../../utils/zodSchemas';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { postApiWithFormdata } from '../../utils/api';
import { v4 as uuidv4 } from "uuid";
import { FaGoogle } from "react-icons/fa";

const Register = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    country: '',
    referalCode: '',
    deviceId: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // const handleGoogleSignIn = async () => {
  //   const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GOOGLE_AUTH}`;
  //   window.open(url, "_self");
  // };


  useEffect(() => {
    let id = localStorage.getItem("device_id");
    if (!id) {
      id = uuidv4(); // Generate a new device ID
      localStorage.setItem("device_id", id);
      formData.deviceId = id
    }
    formData.deviceId = id
  }, []);

  const handleSwitchChange = (name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: !prevData[name]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      // console.log(formData,"nnnnnnnnnnnnnnnnnnlll");
      const validatedData = RegisterSchema.parse(formData);
      // console.log(validatedData,"jjjjjjjjjjjjjj");
      // const formdata = new FormData();
      // formdata.append("name", validatedData.name);
      // formdata.append("email", validatedData.email);
      // formdata.append("password", validatedData.password);
      // // formdata.append("image", validatedData.img);
      // formdata.append("mobile", validatedData.phone);
      // console.log(validatedData,"vvvvvvvveeeeeeeee");
      const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_REGISTER}`
      const response = await postApiWithFormdata(url, validatedData)

      if (response.data.success) {
        toastSuccess("Register Successfull");
        localStorage.setItem("chess-user-token", JSON.stringify(response?.data?.data?.token));
        localStorage.setItem("User Detail", JSON.stringify(response?.data?.data));
        navigate('/');
        window.location.reload(false);
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        toastWarn(error.errors[0].message);
        // console.log(error, "ooooooooooooo");
      }
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <div>
      <div className='flex justify-center h-full py-4 bg-black'>
        <div className='w-full p-6 sm:w-2/3 lg:w-5/12 md:w-2/3 sm:my-16 max-sm:mx-5 max-md:mx-8 rounded-md bg-zinc-800'>
          <h1 className='text-white text-5xl max-ms:text-xl opacity-75 font-light pt-4 pl-4 max-[375px]:pt-4 max-[640px]:pt-4'>Register</h1>
          <form onSubmit={handleSubmit}>
            <div className='mt-6 px-4 max-[375px]:mt-4 max-[375px]:px-2 max-[640px]:px-3 max-[640px]:mt-4 opacity-75'>
              <label className='text-white '>User name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='w-full h-12 max-[375px]:h-8 max-[640px]:h-10 text-white bg-zinc-800 rounded-md border-solid border border-green-600 pl-2 mt-2'
              />
              <p className='text-white opacity-75 text-sm'>
                Be sure to choose a family-friendly username. You cannot change it later, and any accounts with inappropriate usernames will be closed!
              </p>
            </div>
            <div className='mt-6 px-4 max-[375px]:mt-4 max-[375px]:px-2 max-[640px]:px-3 max-[640px]:mt-4 opacity-75'>
              <label className='text-white '>Phone</label>
              <input
                type='text'
                name='mobile'
                value={formData.mobile}
                onChange={handleChange}
                className='w-full h-12 max-[375px]:h-8 max-[640px]:h-10 text-white bg-zinc-800 rounded-md border border-green-600 pl-2 mt-2'
              />
            </div>
            {/* <div className='mt-6 px-4 max-[375px]:mt-4 max-[375px]:px-2 max-[640px]:px-3 max-[640px]:mt-4 opacity-75'>
              <label className='text-white '>Country</label>
              <input
                type='text'
                name='country'
                // value={formData.mobile}
                // onChange={""}
                className='w-full h-12 max-[375px]:h-8 max-[640px]:h-10 text-white bg-zinc-800 rounded-md border border-green-600 pl-2 mt-2'
              />
            </div> */}
            <div className='mt-6 px-4 max-[375px]:mt-4 max-[375px]:px-2 max-[640px]:px-3 max-[640px]:mt-4 opacity-75'>
              <label className='text-white '>Country</label>
              <select
                className='w-full h-12 max-[375px]:h-8 max-[640px]:h-10 text-white bg-zinc-800 rounded-md border border-green-600 pl-2 mt-2'
                name="country"
                id="country"
                value={formData.country}
                onChange={handleChange}
              >
                <option value="">Select A Country</option>
                {/* Add a placeholder option */}
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="Brazil">Brazil</option>
                <option value="Germany">Germany</option>
                <option value="China">China</option>
                <option value="Australia">Australia</option>
                <option value="Japan">Japan</option>
                <option value="South Africa">South Africa</option>
              </select>
            </div>
            <div className='mt-6 px-4 max-[375px]:mt-4 max-[375px]:px-2 max-[640px]:px-3 max-[640px]:mt-4 opacity-75'>
              <label className='text-white '>Email</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='w-full h-12 max-[375px]:h-8 max-[640px]:h-10 text-white bg-zinc-800 rounded-md border border-green-600 pl-2 mt-2'
              />
              <p className='text-white opacity-75 text-xs'>We will only use it for password reset.</p>
            </div>
            <div className='mt-6 px-4 max-[375px]:mt-4 max-[375px]:px-2 max-[640px]:px-3 max-[640px]:mt-4 opacity-75'>
              <label className='text-white '>Password</label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                className='w-full h-12 max-[375px]:h-8 max-[640px]:h-10 text-white bg-zinc-800 rounded-md border border-green-600 pl-2 mt-2'
              />
            </div>
            <div className='mt-6 px-4 max-[375px]:mt-4 max-[375px]:px-2 max-[640px]:px-3 max-[640px]:mt-4 opacity-75'>
              <label className='text-white '>Referal Code</label>
              <input
                type='referalCode'
                name='referalCode'
                value={formData.referalCode}
                onChange={handleChange}
                className='w-full h-12 max-[375px]:h-8 max-[640px]:h-10 text-white bg-zinc-800 rounded-md border border-green-600 pl-2 mt-2'
              />
            </div>
            <div className='mt-4 px-4 max-[375px]:mt-4 max-[375px]:px-2 max-[640px]:px-3 max-[640px]:mt-4'>
              <label className='text-white opacity-75 text-xs'>Password strength</label>
              <div className='flex h-1 mt-1 gap-x-1'>
                <span className='bg-slate-400 w-1/4'></span>
                <span className='bg-slate-400 w-1/4'></span>
                <span className='bg-slate-400 w-1/4'></span>
                <span className='bg-slate-400 w-1/4'></span>
              </div>
            </div>

            {/* <div className='mt-8 px-4 max-[375px]:mt-4 max-[375px]:px-2 max-[640px]:px-3 max-[640px]:mt-4'>
              <div className='float-start mr-2'>
                <BsFillInfoCircleFill color='gray' />
              </div>
              <div>
                <p className='text-white opacity-75 text-sm'>
                  Computers and computer-assisted players are not allowed to play. Please do not get assistance from chess engines, databases, or from other players while playing. Also note that making multiple accounts is strongly discouraged and excessive multi-accounting will lead to being banned.
                </p>
                <p className='text-white text-sm opacity-75'>
                  By registering, you agree to be bound by our
                  <a href='#' className='text-blue-600 opacity-100 pl-1'>Terms of Service.</a>
                </p>
                <p className='text-white text-sm opacity-75'>
                  Read about our
                  <a href='#' className='text-blue-600 opacity-100 pl-1'>Privacy policy.</a>
                </p>
              </div>
            </div>
            <div className='flex mt-8 px-4 max-[375px]:mt-4 max-[375px]:px-2 max-[640px]:px-3 max-[640px]:mt-4'>
              <div>
                <Switch
                  checked={formData.agreeAssistance}
                  onChange={() => handleSwitchChange('agreeAssistance')}
                />
              </div>
              <div>
                <p className='text-white pl-1 opacity-75'>
                  I agree that I will at no time receive assistance during my games (from a chess computer, book, database or another person).
                </p>
              </div>
            </div>
            <div className='flex mt-8 px-4 max-[375px]:mt-4 max-[375px]:px-2 max-[640px]:px-3 max-[640px]:mt-4'>
              <div>
                <Switch
                  checked={formData.agreeNice}
                  onChange={() => handleSwitchChange('agreeNice')}
                />
              </div>
              <div>
                <p className='text-white pl-1 opacity-75'>I agree that I will always be nice to other players.</p>
              </div>
            </div>
            <div className='flex mt-8 px-4 max-[375px]:mt-4 max-[375px]:px-2 max-[640px]:px-3 max-[640px]:mt-4'>
              <div>
                <Switch
                  checked={formData.agreeMultiAccount}
                  onChange={() => handleSwitchChange('agreeMultiAccount')}
                />
              </div>
              <div>
                <p className='text-white pl-1 opacity-75'>
                  I agree that I will not create multiple accounts (except for the reasons stated in the <a href='#' className='text-blue-600'>Terms of Service</a>).
                </p>
              </div>
            </div>
            <div className='flex mt-8 px-4 max-[375px]:mt-4 max-[375px]:px-2 max-[640px]:px-3 max-[640px]:mt-4'>
              <div>
                <Switch
                  checked={formData.agreePolicies}
                  onChange={() => handleSwitchChange('agreePolicies')}
                />
              </div>
              <div>
                <p className='text-white pl-1 opacity-75'>I agree that I will follow all Lichess policies.</p>
              </div>
            </div> */}
            <div className='mt-6 pb-4 px-4 max-[375px]:mt-6 max-[375px]:px-2 max-[640px]:mt-6 text-white'>
              <button type='submit' disabled={loading} className='w-full h-12 max-[375px]:h-8 max-[640px]:h-10 bg-green-700 hover:bg-green-500 rounded-md opacity-85 font-bold'>
                {loading ? "Loading..." : "REGISTER"}
              </button>
            </div>

            {/* <div className="px-4 pb-4 text-white max-[640px]:px-2 max-[640px]:mt-4">
              <button onClick={handleGoogleSignIn} className="flex items-center justify-center w-full h-12 bg-green-700 hover:bg-green-600 rounded-md font-semibold transition duration-200">
                <FaGoogle className="w-5 h-5 mr-3" />
                Sign in with Google
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
