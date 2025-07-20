import React, { useState } from 'react'
const Switch = ({height,width,type}) => {
  const [isChecked, setIsChecked] = useState(false)
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }
  // console.log("sound",isChecked,type);
  // console.log("Navigation",isChecked,type);
  return (
    <>
     <label className="inline-flex items-center cursor-pointer">
  <input type="checkbox" defaultValue="" checked={isChecked}
            onChange={handleCheckboxChange} className="sr-only peer" />
  <div className={`relative w-7 h-4 bg-red-600 peer-focus:outline-none   dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-white peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-black  after:border after:rounded-full after:h-3 after:w-3 after:transition-all  peer-checked:bg-lime-500	`}>
    
  </div>
  
</label>












    </>
  )
}
export default Switch
