export default function StreamerCard({ streamer }) {
    return (
      <a
        href={`/streamer/${streamer.streamer_name}`}
        className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div className="p-5">
          <h3 className="text-xl font-bold text-purple-900 mb-2">{streamer.streamer_name}</h3>
          <div className="flex justify-between text-gray-600 mb-3">
            <span>{streamer.game || "Sin juego"}</span>
            <span className="font-semibold">{streamer.viewers_count?.toLocaleString()} viewers</span>
          </div>
          <p className="text-gray-500 truncate">{streamer.title || "Sin título"}</p>
        </div>
      </a>
    )
  }
  
  