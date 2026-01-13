import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import CasinoSlotMachine from './casino/CasinoSlotMachine';
import CasinoStats from './casino/CasinoStats';
import CasinoAchievements from './casino/CasinoAchievements';

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '💎', '⭐', '🎁'];
const INITIAL_BALANCE = 1000;
const JACKPOT_SYMBOL = '🎁';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  reward: number;
  unlocked: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'spins_10', title: 'Новичок', description: 'Сделать 10 спинов', icon: '🎰', requirement: 10, reward: 100, unlocked: false },
  { id: 'spins_50', title: 'Игрок', description: 'Сделать 50 спинов', icon: '🎲', requirement: 50, reward: 500, unlocked: false },
  { id: 'spins_100', title: 'Профи', description: 'Сделать 100 спинов', icon: '🎯', requirement: 100, reward: 1000, unlocked: false },
  { id: 'win_1000', title: 'Везунчик', description: 'Выиграть 1000 монет', icon: '🍀', requirement: 1000, reward: 500, unlocked: false },
  { id: 'win_5000', title: 'Богач', description: 'Выиграть 5000 монет', icon: '💰', requirement: 5000, reward: 2000, unlocked: false },
  { id: 'streak_5', title: 'Горячая серия', description: '5 побед подряд', icon: '🔥', requirement: 5, reward: 300, unlocked: false },
  { id: 'streak_10', title: 'Непобедимый', description: '10 побед подряд', icon: '⚡', requirement: 10, reward: 1000, unlocked: false },
  { id: 'jackpot_1', title: 'Счастливчик', description: 'Выиграть джекпот', icon: '🎁', requirement: 1, reward: 5000, unlocked: false },
  { id: 'balance_5000', title: 'Миллионер', description: 'Накопить 5000 монет', icon: '💎', requirement: 5000, reward: 1000, unlocked: false },
  { id: 'bonus_10', title: 'Бонус Мастер', description: 'Собрать 10 бонусных спинов', icon: '🎯', requirement: 10, reward: 500, unlocked: false },
];

interface SecretCasinoProps {
  onExit: () => void;
}

const SecretCasino = ({ onExit }: SecretCasinoProps) => {
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
  const [maxWinStreak, setMaxWinStreak] = useState(0);
  const [showJackpotWin, setShowJackpotWin] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [showAchievement, setShowAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [lastDailyReward, setLastDailyReward] = useState<string | null>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [jackpotWins, setJackpotWins] = useState(0);
  const [maxBonusCollected, setMaxBonusCollected] = useState(0);

  const playHoverSound = () => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const playClickSound = () => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  };

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
      setMaxWinStreak(stats.maxWinStreak || 0);
      setLastDailyReward(stats.lastDailyReward || null);
      setDailyStreak(stats.dailyStreak || 0);
      setJackpotWins(stats.jackpotWins || 0);
      setMaxBonusCollected(stats.maxBonusCollected || 0);
      
      if (stats.achievements) {
        setAchievements(stats.achievements);
      }
    }
    checkDailyReward();
  }, []);

  const checkDailyReward = () => {
    const today = new Date().toDateString();
    const lastReward = localStorage.getItem('last-daily-reward');
    
    if (lastReward !== today) {
      setShowDailyReward(true);
    }
  };

  const claimDailyReward = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let newStreak = 1;
    if (lastDailyReward === yesterday) {
      newStreak = dailyStreak + 1;
    }
    
    const reward = 100 + (newStreak - 1) * 50;
    const newBalance = balance + reward;
    
    setBalance(newBalance);
    setDailyStreak(newStreak);
    setLastDailyReward(today);
    setShowDailyReward(false);
    
    localStorage.setItem('last-daily-reward', today);
    saveStats(newBalance, totalSpins, totalWins, jackpot, bonusRounds, winStreak, maxWinStreak, today, newStreak, jackpotWins, maxBonusCollected);
  };

  const saveStats = (
    newBalance: number, 
    newSpins: number, 
    newWins: number, 
    newJackpot: number, 
    newBonus: number, 
    newStreak: number,
    newMaxStreak: number,
    lastDaily: string | null,
    newDailyStreak: number,
    newJackpotWins: number,
    newMaxBonus: number
  ) => {
    localStorage.setItem('casino-stats', JSON.stringify({
      balance: newBalance,
      totalSpins: newSpins,
      totalWins: newWins,
      jackpot: newJackpot,
      bonusRounds: newBonus,
      winStreak: newStreak,
      maxWinStreak: newMaxStreak,
      achievements: achievements,
      lastDailyReward: lastDaily,
      dailyStreak: newDailyStreak,
      jackpotWins: newJackpotWins,
      maxBonusCollected: newMaxBonus
    }));
  };

  const checkAchievements = (newBalance: number, newSpins: number, newWins: number, newStreak: number, newJackpotWins: number, currentBonus: number) => {
    const updatedAchievements = achievements.map(ach => {
      if (ach.unlocked) return ach;

      let shouldUnlock = false;

      if (ach.id === 'spins_10' && newSpins >= 10) shouldUnlock = true;
      if (ach.id === 'spins_50' && newSpins >= 50) shouldUnlock = true;
      if (ach.id === 'spins_100' && newSpins >= 100) shouldUnlock = true;
      if (ach.id === 'win_1000' && newWins >= 1000) shouldUnlock = true;
      if (ach.id === 'win_5000' && newWins >= 5000) shouldUnlock = true;
      if (ach.id === 'streak_5' && newStreak >= 5) shouldUnlock = true;
      if (ach.id === 'streak_10' && newStreak >= 10) shouldUnlock = true;
      if (ach.id === 'jackpot_1' && newJackpotWins >= 1) shouldUnlock = true;
      if (ach.id === 'balance_5000' && newBalance >= 5000) shouldUnlock = true;
      if (ach.id === 'bonus_10' && currentBonus >= 10) shouldUnlock = true;

      if (shouldUnlock) {
        setNewAchievement(ach);
        setShowAchievement(true);
        setBalance(prev => prev + ach.reward);
        return { ...ach, unlocked: true };
      }

      return ach;
    });

    setAchievements(updatedAchievements);
  };

  const spin = async () => {
    if (balance < bet && bonusRounds === 0) {
      return;
    }

    playClickSound();
    setSpinning(true);
    setLastWin(0);

    let currentBonusRounds = bonusRounds;
    let isUsingBonus = false;

    if (bonusRounds > 0) {
      currentBonusRounds = bonusRounds - 1;
      setBonusRounds(currentBonusRounds);
      isUsingBonus = true;
      setInBonusMode(true);
    } else {
      setBalance(balance - bet);
      setInBonusMode(false);
    }

    const spinDuration = 2000;
    const intervalTime = 100;
    let elapsed = 0;

    const spinInterval = setInterval(() => {
      setSlots([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
      elapsed += intervalTime;

      if (elapsed >= spinDuration) {
        clearInterval(spinInterval);
        const finalSlots = [
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        ];
        setSlots(finalSlots);
        setSpinning(false);
        checkWin(finalSlots, isUsingBonus, currentBonusRounds);
      }
    }, intervalTime);
  };

  const checkWin = (finalSlots: string[], wasUsingBonus: boolean, currentBonusRounds: number) => {
    const newSpins = totalSpins + 1;
    setTotalSpins(newSpins);

    let win = 0;
    let newJackpotValue = jackpot + Math.floor(bet * 0.1);
    let addBonusRounds = 0;
    let currentStreak = winStreak;
    let currentMaxStreak = maxWinStreak;
    let currentJackpotWins = jackpotWins;

    if (finalSlots[0] === JACKPOT_SYMBOL && finalSlots[1] === JACKPOT_SYMBOL && finalSlots[2] === JACKPOT_SYMBOL) {
      win = newJackpotValue;
      newJackpotValue = 5000;
      setShowJackpotWin(true);
      currentJackpotWins++;
      setJackpotWins(currentJackpotWins);
      currentStreak++;
    } else if (finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2]) {
      win = bet * 10;
      currentStreak++;
    } else if (finalSlots[0] === finalSlots[1] || finalSlots[1] === finalSlots[2] || finalSlots[0] === finalSlots[2]) {
      win = bet * 2;
      currentStreak++;
    } else {
      currentStreak = 0;
    }

    if (Math.random() < 0.15) {
      addBonusRounds = Math.floor(Math.random() * 3) + 1;
    }

    if (currentStreak > currentMaxStreak) {
      currentMaxStreak = currentStreak;
      setMaxWinStreak(currentMaxStreak);
    }

    setWinStreak(currentStreak);

    const newBonusRounds = currentBonusRounds + addBonusRounds;
    setBonusRounds(newBonusRounds);

    if (newBonusRounds > maxBonusCollected) {
      setMaxBonusCollected(newBonusRounds);
    }

    const newBalance = wasUsingBonus ? balance + win : (balance - bet) + win;
    const newTotalWins = totalWins + win;

    setBalance(newBalance);
    setTotalWins(newTotalWins);
    setLastWin(win);
    setJackpot(newJackpotValue);

    if (currentBonusRounds === 0) {
      setInBonusMode(false);
    }

    saveStats(newBalance, newSpins, newTotalWins, newJackpotValue, newBonusRounds, currentStreak, currentMaxStreak, lastDailyReward, dailyStreak, currentJackpotWins, newBonusRounds > maxBonusCollected ? newBonusRounds : maxBonusCollected);
    checkAchievements(newBalance, newSpins, newTotalWins, currentStreak, currentJackpotWins, newBonusRounds);
  };

  const resetGame = () => {
    playClickSound();
    setBalance(INITIAL_BALANCE);
    setTotalSpins(0);
    setTotalWins(0);
    setJackpot(5000);
    setBonusRounds(0);
    setWinStreak(0);
    setMaxWinStreak(0);
    setAchievements(ACHIEVEMENTS);
    setJackpotWins(0);
    setMaxBonusCollected(0);
    localStorage.removeItem('casino-stats');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <button
                onClick={onExit}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <Icon name="ArrowLeft" size={20} />
                Выход
              </button>
              <CardTitle className="text-4xl font-black flex items-center gap-3">
                <Icon name="Sparkles" size={40} />
                🎰 СЕКРЕТНОЕ КАЗИНО 🎰
                <Icon name="Sparkles" size={40} />
              </CardTitle>
              <div className="w-24"></div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-2xl">
              <CardContent className="p-8">
                <CasinoSlotMachine
                  slots={slots}
                  spinning={spinning}
                  onSpin={spin}
                  disabled={balance < bet && bonusRounds === 0}
                />

                {balance < bet && bonusRounds === 0 && (
                  <Alert className="mt-6 border-red-500 bg-red-50 dark:bg-red-950/20">
                    <Icon name="AlertCircle" className="text-red-600" size={20} />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      Недостаточно средств! Попробуйте уменьшить ставку или нажмите сброс для нового старта.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <CasinoStats
              balance={balance}
              bet={bet}
              lastWin={lastWin}
              totalSpins={totalSpins}
              totalWins={totalWins}
              jackpot={jackpot}
              bonusRounds={bonusRounds}
              inBonusMode={inBonusMode}
              winStreak={winStreak}
              maxWinStreak={maxWinStreak}
              onBetChange={setBet}
              onReset={resetGame}
              onShowAchievements={() => setShowAchievements(true)}
              onHover={playHoverSound}
              onClick={playClickSound}
            />
          </div>
        </div>

        <CasinoAchievements
          showAchievement={showAchievement}
          newAchievement={newAchievement}
          showAchievements={showAchievements}
          achievements={achievements}
          showJackpotWin={showJackpotWin}
          jackpot={jackpot}
          showDailyReward={showDailyReward}
          dailyStreak={dailyStreak}
          balance={balance}
          onCloseAchievement={() => setShowAchievement(false)}
          onCloseAchievementsList={() => setShowAchievements(false)}
          onCloseJackpot={() => setShowJackpotWin(false)}
          onClaimDaily={claimDailyReward}
        />
      </div>
    </div>
  );
};

export default SecretCasino;