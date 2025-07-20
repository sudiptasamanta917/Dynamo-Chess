import React from 'react'
import { FaLessThan } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { ImArrowDownRight, ImArrowUpRight } from "react-icons/im";
import { ImArrowDownLeft } from "react-icons/im";
const pieces = () => {
  return (
    <div>
    <div className='lg:px-24 max-sm:px-2 py-2 '>
    <div className='w-full  rounded-sm bg-gray-600'>
    <h1 className='lg:text-5xl max-sm:text-3xl text-white py-8 px-12 max-sm:px-6  flex font-light'><FaLessThan  className='mt-1 text-green-600'/><span>Bullet top 200</span></h1>
    <table className='w-full'>
        <tbody>
          <tr className='text-gray-100 '>
            <td className='px-8 max-sm:px-1 py-3 max-sm:text-base'>1</td>
            <td className='flex py-3'><FaRegCircle className='mt-1 pt-1 mx-1'/><span className='text-lg max-sm:text-base'>GM Zhigalko_Sergei</span></td>
            <td className='py-3 max-sm:text-base'>3250</td>
            <td className='flex py-3 text-green-600'><ImArrowUpRight  className='pt-1 mt-1 max-sm:text-base'/><span className='text-lg max-sm:text-base'>12</span></td>
          </tr>
          <tr className='text-gray-100 bg-gray-500'>
            <td className='px-8 max-sm:px-1 py-3 max-sm:text-base'>2</td>
            <td className='flex py-3'><FaRegCircle className='mt-1 pt-1 mx-1'/><span className='text-lg max-sm:text-base'>GM Zhigalko_Sergei</span></td>
            <td className='py-3 max-sm:text-base'>3250</td>
            <td className='flex py-3 text-green-600'><ImArrowUpRight  className='pt-1 mt-1 max-sm:text-base'/><span className='text-lg max-sm:text-base'>12</span></td>
          </tr>
          <tr className='text-gray-100 '>
            <td className='px-8 max-sm:px-1 py-3 max-sm:text-base'>3</td>
            <td className='flex py-3'><FaRegCircle className='mt-1 pt-1 mx-1'/><span className='text-lg max-sm:text-base'>GM Zhigalko_Sergei</span></td>
            <td className='py-3 max-sm:text-base'>3250</td>
            <td className='flex py-3 text-red-600'><ImArrowDownRight   className='pt-1 mt-1 max-sm:text-base'/><span className='text-lg max-sm:text-base'>12</span></td>
          </tr>
          <tr className='text-gray-100 bg-gray-500'>
            <td className='px-8 max-sm:px-1 py-3 max-sm:text-base'>4</td>
            <td className='flex py-3'><FaRegCircle className='mt-1 pt-1 mx-1'/><span className='text-lg max-sm:text-base'>GM Zhigalko_Sergei</span></td>
            <td className='py-3 max-sm:text-base'>3250</td>
            <td className='flex py-3 text-green-600'><ImArrowUpRight   className='pt-1 mt-1 max-sm:text-base'/><span className='text-lg max-sm:text-base'>12</span></td>
          </tr>
          <tr className='text-gray-100 '>
            <td className='px-8 max-sm:px-1 py-3 max-sm:text-base'>5</td>
            <td className='flex py-3'><FaRegCircle className='mt-1 pt-1 mx-1'/><span className='text-lg max-sm:text-base'>GM Zhigalko_Sergei</span></td>
            <td className='py-3 max-sm:text-base'>3250</td>
            <td className='flex py-3 text-green-600'><ImArrowUpRight   className='pt-1 mt-1 max-sm:text-base'/><span className='text-lg max-sm:text-base'>12</span></td>
          </tr>
          <tr className='text-gray-100 bg-gray-500'>
            <td className='px-8 max-sm:px-1 py-3 max-sm:text-base'>6</td>
            <td className='flex py-3'><FaRegCircle className='mt-1 pt-1 mx-1'/><span className='text-lg max-sm:text-base'>GM Zhigalko_Sergei</span></td>
            <td className='py-3 max-sm:text-base'>3250</td>
            <td className='flex py-3 text-green-600'><ImArrowUpRight   className='pt-1 mt-1 max-sm:text-base'/><span className='text-lg max-sm:text-base'>12</span></td>
          </tr>
          <tr className='text-gray-100 '>
            <td className='px-8 max-sm:px-1 py-3 max-sm:text-base'>7</td>
            <td className='flex py-3'><FaRegCircle className='mt-1 pt-1 mx-1'/><span className='text-lg max-sm:text-base'>GM Zhigalko_Sergei</span></td>
            <td className='py-3 max-sm:text-base'>3250</td>
            <td className='flex py-3 text-red-600'><ImArrowDownRight   className='pt-1 mt-1 max-sm:text-base'/><span className='text-lg max-sm:text-base'>12</span></td>
          </tr>
          <tr className='text-gray-100 bg-gray-500'>
            <td className='px-8 max-sm:px-1 py-3 max-sm:text-base'>8</td>
            <td className='flex py-3'><FaRegCircle className='mt-1 pt-1 mx-1'/><span className='text-lg max-sm:text-base'>GM Zhigalko_Sergei</span></td>
            <td className='py-3 max-sm:text-base'>3250</td>
            <td className='flex py-3 text-green-600'><ImArrowUpRight   className='pt-1 mt-1 max-sm:text-base'/><span className='text-lg max-sm:text-base'>12</span></td>
          </tr>
          <tr className='text-gray-100'>
            <td className='px-8 max-sm:px-1 py-3 max-sm:text-base'>9</td>
            <td className='flex py-3'><FaRegCircle className='mt-1 pt-1 mx-1'/><span className='text-lg max-sm:text-base'>GM Zhigalko_Sergei</span></td>
            <td className='py-3 max-sm:text-base'>3250</td>
            <td className='flex py-3 text-green-600'><ImArrowUpRight   className='pt-1 mt-1 max-sm:text-base'/><span className='text-lg max-sm:text-base'>12</span></td>
          </tr>
          <tr className='text-gray-100 bg-gray-500'>
            <td className='px-8 max-sm:px-1 py-3 max-sm:text-base'>10</td>
            <td className='flex py-3'><FaRegCircle className='mt-1 pt-1 mx-1'/><span className='text-lg max-sm:text-base'>GM Zhigalko_Sergei</span></td>
            <td className='py-3 max-sm:text-base'>3250</td>
            <td className='flex py-3 text-green-600'><ImArrowUpRight   className='pt-1 mt-1 max-sm:text-base'/><span className='text-lg max-sm:text-base'>12</span></td>
          </tr>       

          
        </tbody>
    </table>
    </div>
    </div>
      
    </div>
  )
}

export default pieces
