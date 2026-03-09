export default function PlayerSelectorModal({ players = [], onSelect, onClose, exclude = [] }) {

  const filtered = players.filter((p) => {
    const name = typeof p === "string" ? p : p.name;
    return !exclude.includes(name);
  });

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-[#020a08] border border-emerald-500/30 rounded-lg w-80 max-h-[400px] overflow-y-auto">

        <div className="p-3 border-b border-emerald-500/20 text-sm font-semibold">
          Select Player
        </div>

        {filtered.map((player, i) => {

          const name = typeof player === "string" ? player : player.name;
          const role = typeof player === "string" ? "" : player.role;

          return (
            <div
              key={i}
              onClick={() => {
                onSelect(player);
                onClose();
              }}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-emerald-500/10 border-b border-emerald-500/10"
            >
              {name}

              {role && (
                <span className="text-xs text-slate-400 ml-2">
                  ({role})
                </span>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}