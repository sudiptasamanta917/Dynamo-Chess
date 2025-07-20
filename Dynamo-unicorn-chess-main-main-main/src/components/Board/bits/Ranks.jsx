import './Ranks.css'

const Ranks = ({ ranks, tileSize }) => (
  <div
    className="ranks-container"
    style={{
      // Dynamically set the height of the ranks based on tile size
      '--tile-size': `${tileSize}px`,
    }}
  >
    {ranks.map(rank => (
      <p key={rank} className="rank-text">
        {rank}
      </p>
    ))}
  </div>
)

export default Ranks;
