import React from 'react'
import bg from "../../assets/bg3.jpg"
import { FaCalendarAlt } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
const blogdetails = () => {
  return (
    <div>
       <div className='lg:px-24 py-3 max-sm:px-2 '>
   <div className='w-full flex flex-wrap'>
   
   <div className='w-full lg:w-3/4 px-2 max-sm:px-3 border-2 rounded-sm'>
   <div className='w-full pt-8 object-cover inline-flex items-center  justify-center'>
    <p className='flex lg:w-10/12'><FaCalendarAlt  className='mt-1'/><span className='font-semibold pl-2'>2024-01-27</span></p>
   </div>
<div className='w-full object-cover pb-8 pt-1  inline-flex items-center  justify-center'>
    <img src={bg} alt='' className=' lg:w-10/12 h-[450px] max-sm:h-[350px] rounded-sm '/>
</div>  
<div className='w-full py-6 inline-flex items-center  justify-center text-3xl font-light'>
    <h1 className='lg:w-10/12'>7th Sharjah Masters Round 7: Daneshvar and Shankland in Joint Lead</h1>
</div> 
<div className='w-full inline-flex items-center pb-6 justify-center'>
    <p className='lg:w-10/12 text-justify  text-lg font-light'>
    Do you know Sicilian Defense is the most popular chess opening against 1.e4? If you are an e4 player then you already know how frustrating it is to play against Sicilian Defense. Many of you want to go for mainline but somehow won’t work. Some players might have tried the sidelines but haven’t gotten many results. So what is the best option? In this article, we are going to see How to Play Against Sicilian Defense.
The best option to play against Sicilian Defense is to play Sidelines and play very aggressively. When you choose the sidelines, most of your opponents are unaware of that particular opening.
Once you get a better position after the opening, no one can stop you. The best opening to avoid main lines and play against Sicilian defense is to play Alapin Variation, Delayed Alapin Variation, and Moscow or Rossolimo Variation.
    </p>
</div>
    </div>
    <div className='w-full lg:px-2 lg:w-1/4  '>
        <div className='w-full border-2 max-sm:mt-8 rounded-sm p-4'>
            <h2 className=' text-lg py-3 font-semibold border-b-2'>Search Here</h2>
            <div className='flex py-6'>
                <input type='text' placeholder='Search' className='p-2 border rounded-l-sm'></input>
                <span className='bg-yellow-400 p-3 rounded-r-sm'><FaSearch className=''/></span>
            </div>
        </div>
        <div className='w-full border-2 mt-8 rounded-sm p-4'>
            <h2 className=' text-lg py-3 font-semibold border-b-2'>Related blog</h2>
            <div className=' w-full flex py-6'>
                <div className='w-5/12'>
                   <img src={bg}/>
                </div>
                <div className='w-7/12 pl-3'>
                    <h2 className='py-1 text-lg font-semibold'>This is blog</h2>
                    <p className='flex '><FaCalendarAlt  className='mt-1'/><span className=' pl-2'>2024-01-27</span></p>

                </div>
            </div>
            <div className=' w-full flex py-6'>
                <div className='w-5/12'>
                   <img src={bg}/>
                </div>
                <div className='w-7/12 pl-3'>
                    <h2 className='py-1 text-lg font-semibold'>This is blog</h2>
                    <p className='flex '><FaCalendarAlt  className='mt-1'/><span className=' pl-2'>2024-01-27</span></p>

                </div>
            </div>
            <div className=' w-full flex py-6'>
                <div className='w-5/12'>
                   <img src={bg}/>
                </div>
                <div className='w-7/12 pl-3'>
                    <h2 className='py-1 text-lg font-semibold'>This is blog</h2>
                    <p className='flex '><FaCalendarAlt  className='mt-1'/><span className=' pl-2'>2024-01-27</span></p>

                </div>
            </div>
            <div className=' w-full flex py-6'>
                <div className='w-5/12'>
                   <img src={bg}/>
                </div>
                <div className='w-7/12 pl-3'>
                    <h2 className='py-1 text-lg font-semibold'>This is blog</h2>
                    <p className='flex '><FaCalendarAlt  className='mt-1'/><span className=' pl-2'>2024-01-27</span></p>

                </div>
            </div>
        </div>
    </div>
   </div>
    </div>
    </div>
  )
}

export default blogdetails
