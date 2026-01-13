interface CasinoSlotMachineProps {
  slots: string[];
  spinning: boolean;
  onSpin: () => void;
  disabled: boolean;
}

const CasinoSlotMachine = ({ slots, spinning, onSpin, disabled }: CasinoSlotMachineProps) => {
  return (
    <div className="text-center">
      <div className="flex justify-center gap-4 mb-8">
        {slots.map((symbol, index) => (
          <div
            key={index}
            className={`w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-5xl shadow-lg border-4 border-yellow-300 ${
              spinning ? 'animate-spin-slow' : ''
            }`}
          >
            {symbol}
          </div>
        ))}
      </div>
      <button
        onClick={onSpin}
        disabled={disabled || spinning}
        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all text-xl"
      >
        {spinning ? '🎰 Крутим...' : '🎰 Крутить'}
      </button>
    </div>
  );
};

export default CasinoSlotMachine;
