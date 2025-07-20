import React from 'react'

const Passwordreset = () => {
  return (
    <div className='flex justify-center py-12    bg-black'>
    <div className='w-full p-6 sm:w-2/3 lg:w-5/12 md:w-2/3 sm:my-16 max-sm:mx-5 max-md:mx-8 rounded-md bg-zinc-800'>
    <h1 className='text-white text-5xl max-[375px]:text-xl opacity-75 font-light pt-4 pl-4 max-[375px]:pt-4 max-[640px]:pt-4'>Password reset</h1>
    <div className='mt-6 px-4 max-[375px]:mt-4 max-[375px]:px-2 max-[640px]:px-3 max-[640px]:mt-4'>
    <label className=' text-white opacity-75'>Email</label>
    <input type='text' className='w-full h-12 max-[375px]:h-8 max-[640px]:h-10 text-white bg-zinc-800 rounded-md border-solid border border-green-600 pl-2 mt-2'></input>
     <hr className='mt-10 opacity-25'></hr>
    </div>
    <div className='mt-6 pb-4 px-4 max-[375px]:mt-6 max-[375px]:px-2 max-[640px]:mt-6'>
    <button type='submit' className='w-full h-12 max-[375px]:h-8  max-[640px]:h-10 text-white bg-green-700 hover:bg-green-500 rounded-md opacity-85 font-bold	'>EMAIL ME A LINK</button>

    </div>
    </div>
      
    </div>
  )
}

export default Passwordreset
