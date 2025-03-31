export default function GamesList({ games }) {
    if (!games || games.length === 0) {
      return <p className="text-gray-500">No hay datos de juegos disponibles.</p>
    }
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {games.map((game, index) => (
          <div key={index} className="bg-gray-100 rounded-lg p-3 text-gray-800 hover:bg-purple-100 transition-colors">
            <a href={`/games/${encodeURIComponent(game)}`} className="block">
              {game}
            </a>
          </div>
        ))}
      </div>
    )
  }
  
  