import './Files.css'
import {getCharacter} from '../../../helper'

const Files = ({files}) => 
    <div className="flex justify-between absolute w-full uppercase px-12 max-md:px-9 max-md:text-sm font-extrabold text-xl">
        {files.map(file => <p key={file} className='text-center'>{getCharacter(file)}</p>)}
    </div>

export default Files