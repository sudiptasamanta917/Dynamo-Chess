import './Ranks.css'

const Ranks = ({ranks}) => 
    <div className="absolute  left-[-25px] max-md:left-[-20px] h-full flex flex-col justify-between py-12 max-md:py-8 max-md:text-sm text-xl font-extrabold ">
        {ranks.map(rank => <p key={rank} className='text-center'>{rank}</p>)}
    </div>

export default Ranks