import { useState } from 'react';

interface CasinoSlotMachineProps {
  slots: string[];
  spinning: boolean;
  onSpin: () => void;
  disabled: boolean;
}

const CasinoSlotMachine = ({ slots, spinning, onSpin, disabled }: CasinoSlotMachineProps) => {
  const [leverPulled, setLeverPulled] = useState(false);

  const handleLeverPull = () => {
    if (disabled || spinning) return;
    
    setLeverPulled(true);
    onSpin();
    
    setTimeout(() => {
      setLeverPulled(false);
    }, 500);
  };

  return (
    <div className="relative">
      {/* Корпус автомата */}
      <div className="bg-gradient-to-b from-red-700 via-red-600 to-red-800 rounded-3xl p-8 shadow-2xl border-8 border-yellow-600">
        {/* Верхняя декоративная панель */}
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-t-2xl p-4 mb-6 text-center border-4 border-yellow-500 shadow-inner">
          <h2 className="text-3xl font-black text-red-800 tracking-wider">
            💎 JACKPOT 💎
          </h2>
        </div>

        {/* Экран с барабанами */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-6 mb-6 border-8 border-gray-700 shadow-inner">
          <div className="bg-black rounded-xl p-4 border-4 border-gray-600">
            <div className="flex justify-center gap-3">
              {slots.map((symbol, index) => (
                <div
                  key={index}
                  className={`relative w-28 h-32 bg-white rounded-lg flex items-center justify-center text-6xl shadow-lg border-4 border-gray-300 overflow-hidden ${
                    spinning ? 'animate-slot-spin' : ''
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none"></div>
                  {symbol}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Нижняя декоративная панель */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-3 text-center border-4 border-yellow-700 shadow-lg">
          <p className="text-red-900 font-bold text-sm">
            ⭐ ПОТЯНИТЕ РЫЧАГ ⭐
          </p>
        </div>
      </div>

      {/* Рычаг */}
      <div className="absolute -right-8 top-1/3 flex flex-col items-center">
        <button
          onClick={handleLeverPull}
          disabled={disabled || spinning}
          className={`relative transition-all duration-500 ${
            leverPulled ? 'translate-y-20' : 'translate-y-0'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:translate-y-2 cursor-pointer'}`}
        >
          {/* Шар рычага */}
          <div className="w-12 h-12 bg-gradient-to-b from-red-500 to-red-700 rounded-full border-4 border-red-900 shadow-xl mb-1 relative">
            <div className="absolute inset-2 bg-gradient-to-br from-red-300 to-transparent rounded-full"></div>
          </div>
          
          {/* Ручка рычага */}
          <div className="w-4 h-32 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-full border-2 border-gray-900 shadow-lg">
            <div className="absolute inset-0 w-1 bg-gradient-to-r from-gray-400 to-transparent rounded-full ml-1"></div>
          </div>
        </button>
      </div>

      {/* Световые эффекты при вращении */}
      {spinning && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping delay-75"></div>
          <div className="absolute bottom-4 left-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping delay-150"></div>
          <div className="absolute bottom-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping delay-200"></div>
        </div>
      )}
    </div>
  );
};

export default CasinoSlotMachine;
