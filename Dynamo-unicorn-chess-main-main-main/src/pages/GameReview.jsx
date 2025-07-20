import React, { useState } from 'react';

const GameReview = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate API call or handle data
    console.log('Form Data:', formData);

    // Reset form or show a success message
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });

    // Optionally revert submission state after a timeout
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className='relative h-screen mb-16'>
      <div className='banner'>
        <img className='w-full h-[350px] object-cover' src="https://www.liquiloans.com/images/bg-contactus.jpg" alt='Contact Us' />
        <div className='absolute top-24 left-0 w-full h-full flex items-center justify-center'>
          <div className='bg-gray-900 bg-opacity-90 p-4 max-sm:mb-8 lg:p-8 rounded-lg shadow-lg w-1/2 max-sm:w-full max-sm:mx-2'>
            <h2 className='text-2xl font-bold mb-6 text-center text-white'>Game Review</h2>
            {submitted && <p className="text-center text-green-400 font-semibold mb-4">Thank you for your feedback!</p>}
            <form className='space-y-4' onSubmit={handleSubmit}>
              <div className='w-full flex flex-wrap'>
                <div className='w-1/2 max-sm:w-full px-2'>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-100">Your Name</label>
                  <input type="text" id="name" value={formData.name} onChange={handleChange} placeholder="userName" required className='w-full p-2 border border-gray-300 rounded' />
                </div>
                <div className='w-1/2 max-sm:w-full px-2'>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-100">Your Email</label>
                  <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" required className='w-full p-2 border border-gray-300 rounded' />
                </div>
              </div>
              <div className='w-full flex flex-wrap'>
                <div className='w-1/2 max-sm:w-full px-2'>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-slate-100">Your Phone</label>
                  <input type="tel" id="phone" value={formData.phone} onChange={handleChange} placeholder="917002354" required className='w-full p-2 border border-gray-300 rounded' />
                </div>
                <div className='w-1/2 max-sm:w-full px-2'>
                  <label htmlFor="subject" className="block mb-2 text-sm font-medium text-slate-100">Subject</label>
                  <input type="text" id="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required className='w-full p-2 border border-gray-300 rounded' />
                </div>
              </div>
              <div className='px-2'>
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-slate-100">Your Message</label>
                <textarea id="message" value={formData.message} onChange={handleChange} placeholder="Write your message here" required className='w-full p-2 border border-gray-300 rounded h-32'></textarea>
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
};

export default GameReview;
