import React, { useState } from 'react';
import BlogCard from '../../components/blog/BlogCard';
import Pagination from '../../components/Pagination';
import bg from "../../assets/bg3.jpg"
import { MdNavigateNext } from "react-icons/md";
import { Link } from 'react-router-dom'

const blogs = [
  {
    date: 'May 21, 2024',
    title: '7th Sharjah Masters Round 7: Daneshvar and Shankland in Joint Lead',
    description: 'Bardiya Daneshvar and Sam Shankland are on 5.5/7 and in the joint lead with two more rounds to go; to...',
    // image: 'https://via.placeholder.com/500x500',
     image: `${bg}`,
    author: 'Lichess'
  },
  {
    date: 'May 20, 2024',
    title: '7th Sharjah Masters Round 6: Aravindh in Sole Lead, 6 Players Close Behind',
    description: 'Chithambaram Veerappan Aravindh is in the sole lead on 5/6, while Daneshvar, Tabatabaei, Sarana, Nie...',
    image: `${bg}`,
    author: 'Lichess'
  },
  {
    date: 'May 20, 2024',
    title: 'How To Overcome Chess Anxiety',
    description: 'Imagine facing a saber-tooth tiger that hasn’t eaten in days. Your body goes into fight-or-flight mo...',
    image: `${bg}`,
    author: 'GM NoelStuder'
  }
  
];

const recentBlogs = [
  {
    title: 'This is title',
    date: '2024-01-28',
    image: 'https://via.placeholder.com/50',
  },
  {
    title: 'Test Blog',
    date: '2024-01-27',
    image: 'https://via.placeholder.com/50',
  }
];

const BlogList = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 6;

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div className="">
      <div className='w-full px-6 py-1'>
        {/* <img src="https://via.placeholder.com/1380x300" alt="" /> */}
        <img src={bg} alt="" className='w-full h-[350px] rounded-md'/>
      </div>
      

      {/* <h1 className="text-3xl text-black mb-6">Community blogs</h1> */}
     
      <div className='p-6 bg-[#ffffff] min-h-screen'>
        <div className=' flex flex-wrap py-9'>
          <div className='w-full lg:w-[80%]'>
          <Link to='/blogdetails'>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
             
              {blogs.map((blog, index) => (
                <BlogCard
                  key={index}
                  date={blog.date}
                  title={blog.title}
                  description={blog.description}
                  image={blog.image}
                  author={blog.author}
                />
              ))}  
            </div>
            </Link>
          </div>

          <div className="p-4  w-full lg:w-[20%]">
            <div className="bg-white p-4 rounded-md shadow-md mb-6">
              <h2 className="text-lg font-bold mb-2">Search Here</h2>
              <div className="flex items-center border border-gray-300 rounded-md">
                <input
                  type="text"
                  placeholder="Search your keyword..."
                  className="p-2 w-full outline-none"
                />
                <button className="bg-yellow-400 p-2 rounded-r-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 10-14 0 7 7 0 0014 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-lg font-bold mb-4">Recent Blog</h2>
              {recentBlogs.map((blog, index) => (
                <div key={index} className="flex items-center mb-4">
                  <img src={blog.image} alt={blog.title} className="w-12 h-12 rounded-md mr-4" />
                  <div>
                    <h3 className="text-md font-semibold">{blog.title}</h3>
                    <div className="text-sm text-gray-500">{blog.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      <div className=" max-sm:px-6 flex justify-center items-center ">
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        
        />
    </div>
      </div>
      
    </div>
  );
}

export default BlogList;
