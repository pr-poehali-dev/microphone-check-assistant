import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '💎', '⭐'];
const INITIAL_BALANCE = 1000;

const SecretCasino = () => {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [bet, setBet] = useState(10);
  const [slots, setSlots] = useState(['🍒', '🍋', '🍊']);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);
  const [totalSpins, setTotalSpins] = useState(0);
  const [totalWins, setTotalWins] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('casino-stats');
    if (saved) {
      const stats = JSON.parse(saved);
      setBalance(stats.balance || INITIAL_BALANCE);
      setTotalSpins(stats.totalSpins || 0);
      setTotalWins(stats.totalWins || 0);
    }
  }, []);

  const saveStats = (newBalance: number, newSpins: number, newWins: number) => {
    localStorage.setItem('casino-stats', JSON.stringify({
      balance: newBalance,
      totalSpins: newSpins,
      totalWins: newWins
    }));
  };

  const spin = () => {
    if (balance < bet || spinning) return;

    setSpinning(true);
    setLastWin(0);
    const newBalance = balance - bet;
    setBalance(newBalance);

    let spinCount = 0;
    const spinInterval = setInterval(() => {
      setSlots([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ]);
      spinCount++;

      if (spinCount >= 15) {
        clearInterval(spinInterval);
        const finalSlots = [
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        ];
        setSlots(finalSlots);
        checkWin(finalSlots, newBalance);
        setSpinning(false);
      }
    }, 100);
  };

  const checkWin = (finalSlots: string[], currentBalance: number) => {
    const newSpins = totalSpins + 1;
    setTotalSpins(newSpins);

    if (finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2]) {
      let multiplier = 10;
      if (finalSlots[0] === '💎') multiplier = 50;
      else if (finalSlots[0] === '⭐') multiplier = 30;
      else if (finalSlots[0] === '🍇') multiplier = 20;

      const winAmount = bet * multiplier;
      setLastWin(winAmount);
      const newBalance = currentBalance + winAmount;
      setBalance(newBalance);
      const newWins = totalWins + winAmount;
      setTotalWins(newWins);
      saveStats(newBalance, newSpins, newWins);
    } else if (finalSlots[0] === finalSlots[1] || finalSlots[1] === finalSlots[2] || finalSlots[0] === finalSlots[2]) {
      const winAmount = Math.floor(bet * 2);
      setLastWin(winAmount);
      const newBalance = currentBalance + winAmount;
      setBalance(newBalance);
      const newWins = totalWins + winAmount;
      setTotalWins(newWins);
      saveStats(newBalance, newSpins, newWins);
    } else {
      saveStats(currentBalance, newSpins, totalWins);
    }
  };

  const changeBet = (amount: number) => {
    const newBet = bet + amount;
    if (newBet >= 10 && newBet <= balance && newBet <= 500) {
      setBet(newBet);
    }
  };

  const resetGame = () => {
    setBalance(INITIAL_BALANCE);
    setBet(10);
    setLastWin(0);
    setTotalSpins(0);
    setTotalWins(0);
    localStorage.removeItem('casino-stats');
  };

  const winRate = totalSpins > 0 ? ((totalWins / (totalSpins * bet)) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 overflow-auto">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
            🎰 Секретное Казино 🎰
          </h1>
          <p className="text-purple-200">Удача улыбается смелым!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 border-none shadow-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <Icon name="Coins" className="mx-auto mb-2 text-yellow-900" size={32} />
                <p className="text-sm text-yellow-900 mb-1">Баланс</p>
                <p className="text-3xl font-bold text-white">{balance}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-400 to-purple-500 border-none shadow-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <Icon name="TrendingUp" className="mx-auto mb-2 text-blue-900" size={32} />
                <p className="text-sm text-blue-900 mb-1">Всего выиграно</p>
                <p className="text-3xl font-bold text-white">{totalWins}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-400 to-teal-500 border-none shadow-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <Icon name="Target" className="mx-auto mb-2 text-green-900" size={32} />
                <p className="text-sm text-green-900 mb-1">Винрейт</p>
                <p className="text-3xl font-bold text-white">{winRate}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 bg-black/50 border-4 border-yellow-400 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-yellow-300 text-2xl">Слот-машина</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-purple-800 to-pink-800 rounded-xl p-8 mb-6">
              <div className="flex justify-center gap-4 mb-6">
                {slots.map((symbol, idx) => (
                  <div
                    key={idx}
                    className={`w-24 h-24 bg-white rounded-xl flex items-center justify-center text-6xl shadow-2xl border-4 border-yellow-400 ${
                      spinning ? 'animate-spin' : ''
                    }`}
                  >
                    {symbol}
                  </div>
                ))}
              </div>

              {lastWin > 0 && (
                <Alert className="bg-yellow-400 border-yellow-600 mb-4 animate-pulse">
                  <Icon name="Trophy" className="text-yellow-900" size={24} />
                  <AlertDescription className="text-yellow-900 font-bold text-xl">
                    🎉 Выигрыш: {lastWin} монет! 🎉
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={() => changeBet(-10)}
                    disabled={bet <= 10 || spinning}
                    size="lg"
                    variant="outline"
                    className="bg-purple-600 hover:bg-purple-700 text-white border-purple-400"
                  >
                    <Icon name="Minus" size={20} />
                  </Button>
                  
                  <div className="bg-purple-900 px-8 py-4 rounded-lg border-2 border-purple-400">
                    <p className="text-purple-200 text-sm mb-1 text-center">Ставка</p>
                    <p className="text-white text-3xl font-bold text-center">{bet}</p>
                  </div>

                  <Button
                    onClick={() => changeBet(10)}
                    disabled={bet >= balance || bet >= 500 || spinning}
                    size="lg"
                    variant="outline"
                    className="bg-purple-600 hover:bg-purple-700 text-white border-purple-400"
                  >
                    <Icon name="Plus" size={20} />
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <Button onClick={() => setBet(10)} disabled={spinning} className="bg-blue-600 hover:bg-blue-700">
                    10
                  </Button>
                  <Button onClick={() => setBet(50)} disabled={balance < 50 || spinning} className="bg-blue-600 hover:bg-blue-700">
                    50
                  </Button>
                  <Button onClick={() => setBet(100)} disabled={balance < 100 || spinning} className="bg-blue-600 hover:bg-blue-700">
                    100
                  </Button>
                  <Button onClick={() => setBet(Math.min(balance, 500))} disabled={balance < 50 || spinning} className="bg-red-600 hover:bg-red-700">
                    MAX
                  </Button>
                </div>

                <Button
                  onClick={spin}
                  disabled={balance < bet || spinning}
                  size="lg"
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-xl py-6 shadow-xl"
                >
                  {spinning ? (
                    <>
                      <Icon name="Loader2" className="mr-2 animate-spin" size={24} />
                      Крутим...
                    </>
                  ) : (
                    <>
                      <Icon name="Play" className="mr-2" size={24} />
                      КРУТИТЬ!
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-purple-900/50 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-yellow-300 mb-2 flex items-center gap-2">
                <Icon name="Info" size={18} />
                Таблица выплат
              </h3>
              <div className="space-y-1 text-sm text-purple-200">
                <p>💎 💎 💎 = ставка × 50</p>
                <p>⭐ ⭐ ⭐ = ставка × 30</p>
                <p>🍇 🍇 🍇 = ставка × 20</p>
                <p>🍒🍋🍊 (любые три одинаковых) = ставка × 10</p>
                <p>Два одинаковых = ставка × 2</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={resetGame}
                variant="outline"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-400"
              >
                <Icon name="RotateCcw" className="mr-2" size={18} />
                Сброс
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white border-purple-400"
              >
                <Icon name="X" className="mr-2" size={18} />
                Выход
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-purple-300 text-sm">
          <p>Всего спинов: {totalSpins} | Игра сохраняется автоматически</p>
        </div>
      </div>
    </div>
  );
};

export default SecretCasino;
