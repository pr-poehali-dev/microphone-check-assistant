import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '💎', '⭐', '🎁'];
const INITIAL_BALANCE = 1000;
const JACKPOT_SYMBOL = '🎁';

const SecretCasino = () => {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [bet, setBet] = useState(10);
  const [slots, setSlots] = useState(['🍒', '🍋', '🍊']);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);
  const [totalSpins, setTotalSpins] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [jackpot, setJackpot] = useState(5000);
  const [bonusRounds, setBonusRounds] = useState(0);
  const [inBonusMode, setInBonusMode] = useState(false);
  const [winStreak, setWinStreak] = useState(0);
  const [showJackpotWin, setShowJackpotWin] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('casino-stats');
    if (saved) {
      const stats = JSON.parse(saved);
      setBalance(stats.balance || INITIAL_BALANCE);
      setTotalSpins(stats.totalSpins || 0);
      setTotalWins(stats.totalWins || 0);
      setJackpot(stats.jackpot || 5000);
      setBonusRounds(stats.bonusRounds || 0);
      setWinStreak(stats.winStreak || 0);
    }
  }, []);

  const saveStats = (newBalance: number, newSpins: number, newWins: number, newJackpot: number, newBonus: number, newStreak: number) => {
    localStorage.setItem('casino-stats', JSON.stringify({
      balance: newBalance,
      totalSpins: newSpins,
      totalWins: newWins,
      jackpot: newJackpot,
      bonusRounds: newBonus,
      winStreak: newStreak
    }));
  };

  const spin = () => {
    if (balance < bet || spinning) return;

    setSpinning(true);
    setLastWin(0);
    setShowJackpotWin(false);
    
    const newBalance = balance - bet;
    if (!inBonusMode) {
      setBalance(newBalance);
      const newJackpot = jackpot + Math.floor(bet * 0.1);
      setJackpot(newJackpot);
    }

    let spinCount = 0;
    const spinInterval = setInterval(() => {
      setSlots([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ]);
      spinCount++;

      if (spinCount >= 20) {
        clearInterval(spinInterval);
        const finalSlots = generateSlots();
        setSlots(finalSlots);
        checkWin(finalSlots, inBonusMode ? balance : newBalance);
        setSpinning(false);
      }
    }, 100);
  };

  const generateSlots = (): string[] => {
    const random = Math.random();
    
    if (random < 0.001) {
      return [JACKPOT_SYMBOL, JACKPOT_SYMBOL, JACKPOT_SYMBOL];
    }
    
    if (winStreak >= 3 && random < 0.05) {
      const bonusSymbol = SYMBOLS[Math.floor(Math.random() * 3)];
      return [bonusSymbol, bonusSymbol, bonusSymbol];
    }

    return [
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];
  };

  const checkWin = (finalSlots: string[], currentBalance: number) => {
    const newSpins = totalSpins + 1;
    setTotalSpins(newSpins);

    if (finalSlots[0] === JACKPOT_SYMBOL && finalSlots[1] === JACKPOT_SYMBOL && finalSlots[2] === JACKPOT_SYMBOL) {
      const winAmount = jackpot;
      setLastWin(winAmount);
      setShowJackpotWin(true);
      const newBalance = currentBalance + winAmount;
      setBalance(newBalance);
      const newWins = totalWins + winAmount;
      setTotalWins(newWins);
      setJackpot(5000);
      setBonusRounds(bonusRounds + 10);
      const newStreak = winStreak + 1;
      setWinStreak(newStreak);
      saveStats(newBalance, newSpins, newWins, 5000, bonusRounds + 10, newStreak);
      return;
    }

    if (finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2]) {
      let multiplier = 10;
      let bonusSpins = 0;

      if (finalSlots[0] === '💎') {
        multiplier = 50;
        bonusSpins = 5;
      } else if (finalSlots[0] === '⭐') {
        multiplier = 30;
        bonusSpins = 3;
      } else if (finalSlots[0] === '🍇') {
        multiplier = 20;
        bonusSpins = 2;
      }

      if (inBonusMode) {
        multiplier *= 2;
      }

      const winAmount = bet * multiplier;
      setLastWin(winAmount);
      const newBalance = currentBalance + winAmount;
      setBalance(newBalance);
      const newWins = totalWins + winAmount;
      setTotalWins(newWins);
      
      if (bonusSpins > 0) {
        setBonusRounds(bonusRounds + bonusSpins);
      }
      
      const newStreak = winStreak + 1;
      setWinStreak(newStreak);
      saveStats(newBalance, newSpins, newWins, jackpot, bonusRounds + bonusSpins, newStreak);
    } else if (finalSlots[0] === finalSlots[1] || finalSlots[1] === finalSlots[2] || finalSlots[0] === finalSlots[2]) {
      let multiplier = 2;
      if (inBonusMode) multiplier = 3;
      
      const winAmount = Math.floor(bet * multiplier);
      setLastWin(winAmount);
      const newBalance = currentBalance + winAmount;
      setBalance(newBalance);
      const newWins = totalWins + winAmount;
      setTotalWins(newWins);
      const newStreak = winStreak + 1;
      setWinStreak(newStreak);
      saveStats(newBalance, newSpins, newWins, jackpot, bonusRounds, newStreak);
    } else {
      setWinStreak(0);
      saveStats(currentBalance, newSpins, totalWins, jackpot, bonusRounds, 0);
    }

    if (inBonusMode) {
      const remaining = bonusRounds - 1;
      setBonusRounds(remaining);
      if (remaining === 0) {
        setInBonusMode(false);
      }
    }
  };

  const activateBonusMode = () => {
    if (bonusRounds > 0 && !inBonusMode) {
      setInBonusMode(true);
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
    setJackpot(5000);
    setBonusRounds(0);
    setInBonusMode(false);
    setWinStreak(0);
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
          {inBonusMode && (
            <div className="mt-2 animate-pulse">
              <span className="text-2xl font-bold text-yellow-300">🎁 БОНУС РЕЖИМ! 🎁</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
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
                <p className="text-sm text-blue-900 mb-1">Выиграно</p>
                <p className="text-3xl font-bold text-white">{totalWins}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-400 to-red-500 border-none shadow-xl animate-pulse">
            <CardContent className="pt-6">
              <div className="text-center">
                <Icon name="Sparkles" className="mx-auto mb-2 text-pink-900" size={32} />
                <p className="text-sm text-pink-900 mb-1">Джекпот</p>
                <p className="text-3xl font-bold text-white">{jackpot}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-400 to-teal-500 border-none shadow-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <Icon name="Gift" className="mx-auto mb-2 text-green-900" size={32} />
                <p className="text-sm text-green-900 mb-1">Бонусы</p>
                <p className="text-3xl font-bold text-white">{bonusRounds}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {winStreak >= 3 && (
          <Alert className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 border-none animate-bounce">
            <Icon name="Zap" className="text-orange-900" size={24} />
            <AlertDescription className="text-orange-900 font-bold">
              🔥 Серия побед: {winStreak}! Удача на вашей стороне! 🔥
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-6 bg-black/50 border-4 border-yellow-400 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-yellow-300 text-2xl flex items-center justify-center gap-2">
              {inBonusMode && <span className="animate-spin">🎁</span>}
              Слот-машина
              {inBonusMode && <span className="animate-spin">🎁</span>}
            </CardTitle>
            {inBonusMode && (
              <p className="text-center text-pink-300 text-lg font-bold">
                Бесплатных спинов: {bonusRounds} | Выплаты × 2!
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className={`bg-gradient-to-br ${inBonusMode ? 'from-yellow-600 to-orange-600' : 'from-purple-800 to-pink-800'} rounded-xl p-8 mb-6 transition-all duration-500`}>
              <div className="flex justify-center gap-4 mb-6">
                {slots.map((symbol, idx) => (
                  <div
                    key={idx}
                    className={`w-24 h-24 bg-white rounded-xl flex items-center justify-center text-6xl shadow-2xl border-4 ${
                      inBonusMode ? 'border-orange-400' : 'border-yellow-400'
                    } ${spinning ? 'animate-spin' : ''}`}
                  >
                    {symbol}
                  </div>
                ))}
              </div>

              {showJackpotWin && (
                <Alert className="bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 border-none mb-4 animate-bounce">
                  <Icon name="Trophy" className="text-purple-900" size={32} />
                  <AlertDescription className="text-purple-900 font-bold text-2xl">
                    💥💥💥 ДЖЕКПОТ! {jackpot} МОНЕТ! 💥💥💥
                  </AlertDescription>
                </Alert>
              )}

              {lastWin > 0 && !showJackpotWin && (
                <Alert className={`${inBonusMode ? 'bg-orange-400' : 'bg-yellow-400'} border-yellow-600 mb-4 animate-pulse`}>
                  <Icon name="Trophy" className="text-yellow-900" size={24} />
                  <AlertDescription className="text-yellow-900 font-bold text-xl">
                    🎉 Выигрыш: {lastWin} монет! {inBonusMode && '(× 2 бонус!)'} 🎉
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={() => changeBet(-10)}
                    disabled={bet <= 10 || spinning || inBonusMode}
                    size="lg"
                    variant="outline"
                    className="bg-purple-600 hover:bg-purple-700 text-white border-purple-400"
                  >
                    <Icon name="Minus" size={20} />
                  </Button>
                  
                  <div className="bg-purple-900 px-8 py-4 rounded-lg border-2 border-purple-400">
                    <p className="text-purple-200 text-sm mb-1 text-center">
                      {inBonusMode ? 'Бесплатно!' : 'Ставка'}
                    </p>
                    <p className="text-white text-3xl font-bold text-center">
                      {inBonusMode ? '🎁' : bet}
                    </p>
                  </div>

                  <Button
                    onClick={() => changeBet(10)}
                    disabled={bet >= balance || bet >= 500 || spinning || inBonusMode}
                    size="lg"
                    variant="outline"
                    className="bg-purple-600 hover:bg-purple-700 text-white border-purple-400"
                  >
                    <Icon name="Plus" size={20} />
                  </Button>
                </div>

                {!inBonusMode && (
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
                )}

                <Button
                  onClick={spin}
                  disabled={balance < bet || spinning || (!inBonusMode && balance < bet)}
                  size="lg"
                  className={`w-full ${
                    inBonusMode
                      ? 'bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600'
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600'
                  } text-black font-bold text-xl py-6 shadow-xl`}
                >
                  {spinning ? (
                    <>
                      <Icon name="Loader2" className="mr-2 animate-spin" size={24} />
                      Крутим...
                    </>
                  ) : (
                    <>
                      <Icon name="Play" className="mr-2" size={24} />
                      {inBonusMode ? 'БОНУС СПИН!' : 'КРУТИТЬ!'}
                    </>
                  )}
                </Button>

                {bonusRounds > 0 && !inBonusMode && (
                  <Button
                    onClick={activateBonusMode}
                    size="lg"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg py-4 animate-pulse"
                  >
                    <Icon name="Gift" className="mr-2" size={20} />
                    Активировать бонусные спины! ({bonusRounds})
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-purple-900/50 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-yellow-300 mb-2 flex items-center gap-2">
                <Icon name="Info" size={18} />
                Таблица выплат
              </h3>
              <div className="space-y-1 text-sm text-purple-200">
                <p className="text-pink-300 font-bold">🎁 🎁 🎁 = ДЖЕКПОТ ({jackpot}) + 10 бонусов!</p>
                <p>💎 💎 💎 = ставка × 50 + 5 бонусов</p>
                <p>⭐ ⭐ ⭐ = ставка × 30 + 3 бонуса</p>
                <p>🍇 🍇 🍇 = ставка × 20 + 2 бонуса</p>
                <p>Любые три одинаковых = ставка × 10</p>
                <p>Два одинаковых = ставка × 2</p>
                <p className="text-yellow-300 font-bold mt-2">В бонусном режиме все выплаты × 2!</p>
                <p className="text-orange-300">Серия из 3+ побед повышает шанс выигрыша!</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-purple-200 text-sm">Прогресс до джекпота</span>
                <span className="text-yellow-300 font-bold">{((jackpot / 10000) * 100).toFixed(0)}%</span>
              </div>
              <Progress value={(jackpot / 10000) * 100} className="h-3 bg-purple-950" />
              <p className="text-purple-300 text-xs mt-2">10% от каждой ставки идёт в джекпот!</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
              <div className="bg-blue-900/50 rounded p-2">
                <p className="text-blue-300">Винрейт</p>
                <p className="text-white font-bold">{winRate}%</p>
              </div>
              <div className="bg-green-900/50 rounded p-2">
                <p className="text-green-300">Спинов</p>
                <p className="text-white font-bold">{totalSpins}</p>
              </div>
              <div className="bg-orange-900/50 rounded p-2">
                <p className="text-orange-300">Серия</p>
                <p className="text-white font-bold">{winStreak}</p>
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
          <p>Игра сохраняется автоматически | Играйте ответственно! 🎰</p>
        </div>
      </div>
    </div>
  );
};

export default SecretCasino;
