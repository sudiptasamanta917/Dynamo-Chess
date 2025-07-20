import './Files.css'
import {getCharacter} from '../../../helper'

const Files = ({files,tileSize}) => 
    <div className="files-container "   style={{
        // Dynamically set the height of the ranks based on tile size
        '--tile-size': `${tileSize}px`,
      }}>
        {files.map(file => <p key={file} className='file-text'>{getCharacter(file)}</p>)}
    </div>

export default Files