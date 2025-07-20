import React from 'react';
// import contactUs from "../assets/contactUs.jpg";

const Contact = () => {
    return (
        <div className='relative h-screen mb-16'>
            <div className='banner'>
                <img className='w-full h-[350px] object-cover' src="https://www.liquiloans.com/images/bg-contactus.jpg" alt='Contact Us' />
                <div className='absolute  top-24   left-0 w-full h-full flex items-center justify-center '>
                    <div className='bg-gray-900 bg-opacity-90 p-4 max-sm:mb-8  lg:p-8  rounded-lg shadow-lg w-1/2 max-sm:w-full max-sm:mx-2'>
                        <h2 className='text-2xl font-bold mb-6 text-center text-white'>Contact Us</h2>
                        <form className='space-y-4'>
                            <div className='w-full flex flex-wrap'>
                                <div className='w-1/2 max-sm:w-full px-2'>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-100">Your Name</label>
                                    <input type="text" id="name" placeholder="userName" required className='w-full p-2 border border-gray-300 rounded' />
                                </div>
                                <div className='w-1/2 max-sm:w-full px-2'>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-100">Your Email</label>
                                    <input type="email" id="email" placeholder="name@example.com" required className='w-full p-2 border border-gray-300 rounded' />
                                </div>
                            </div>
                            <div className=' w-full flex flex-wrap'>
                                <div className='w-1/2 max-sm:w-full px-2'>
                                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-slate-100">Your Phone</label>
                                    <input type="tel" id="phone" placeholder="917002354" required className='w-full p-2 border border-gray-300 rounded' />
                                </div>
                                <div className='w-1/2 max-sm:w-full px-2'>
                                    <label htmlFor="subject" className="block mb-2 text-sm font-medium text-slate-100">Subject</label>
                                    <input type="text" id="subject" placeholder="Subject" required className='w-full p-2 border border-gray-300 rounded' />
                                </div>
                            </div>
                            <div className='px-2'>
                                <label htmlFor="inquiryType" className="block mb-2 text-sm font-medium text-slate-100">Type of Inquiry</label>
                                <select id="inquiryType" className="w-full p-2 border border-gray-300 rounded" required>
                                    <option value="">Select an option</option>
                                    <option value="buying">For Buying a Chess Set</option>
                                    <option value="academy">To Join the Academy or Training / Coaching</option>
                                    <option value="general">For General Enquiry</option>
                                </select>
                            </div>
                            <div className='px-2'>
                                <label htmlFor="message" className="block mb-2 text-sm font-medium text-slate-100">Your Message</label>
                                <textarea id="message" placeholder="Write your message here" required className='w-full p-2 border border-gray-300 rounded h-32'></textarea>
                            </div>
                            <div className='flex justify-center'>
                                <button type="submit" className='px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700'>Send Message</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
