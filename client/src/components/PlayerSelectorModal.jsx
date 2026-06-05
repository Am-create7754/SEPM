export default function PlayerSelectorModal({ players = [], onSelect, onClose, exclude = [] }) {

  const filtered = players.filter((p) => {
    const name = typeof p === "string" ? p : p.name;
    return !exclude.includes(name);
  });

  return (
    <div className="fixed inset-0 bg-[#010806]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#062019] p-6 rounded-2xl border border-emerald-500/30 min-w-[320px] shadow-[0_0_40px_rgba(16,185,129,0.1)] relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-emerald-500/50 hover:text-emerald-400"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-emerald-400 mb-5 text-center">
          Select Player
        </h2>

        <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
          {filtered.map((player, i) => {
            const name = typeof player === "string" ? player : player.name;
            const role = typeof player === "string" ? "" : player.role;

            return (
              <button
                key={i}
                onClick={() => {
                  onSelect(player);
                  onClose();
                }}
                className="block w-full text-left p-4 bg-[#0a2a1f] border border-emerald-500/20 hover:border-emerald-500/60 hover:bg-emerald-500/10 rounded-xl transition-all text-emerald-50 font-medium"
              >
                {name}
                {role && (
                  <span className="text-xs text-slate-400 ml-2 font-normal">
                    ({role})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}