import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface CasinoStatsProps {
  balance: number;
  bet: number;
  lastWin: number;
  totalSpins: number;
  totalWins: number;
  jackpot: number;
  bonusRounds: number;
  inBonusMode: boolean;
  winStreak: number;
  maxWinStreak: number;
  onBetChange: (newBet: number) => void;
  onReset: () => void;
  onShowAchievements: () => void;
  onHover: () => void;
  onClick: () => void;
}

const CasinoStats = ({
  balance,
  bet,
  lastWin,
  totalSpins,
  totalWins,
  jackpot,
  bonusRounds,
  inBonusMode,
  winStreak,
  maxWinStreak,
  onBetChange,
  onReset,
  onShowAchievements,
  onHover,
  onClick
}: CasinoStatsProps) => {
  return (
    <>
      <div className="mb-6 p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg">
        <div className="flex justify-between items-center text-white mb-4">
          <div>
            <p className="text-sm opacity-90">Баланс</p>
            <p className="text-3xl font-bold">💰 {balance}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Джекпот</p>
            <p className="text-2xl font-bold">🎁 {jackpot}</p>
          </div>
        </div>
        
        {bonusRounds > 0 && (
          <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-white text-center font-semibold">
              🎉 Бонусных спинов: {bonusRounds}
            </p>
          </div>
        )}

        {inBonusMode && (
          <div className="mt-3 bg-yellow-400/30 rounded-lg p-3 backdrop-blur-sm animate-pulse">
            <p className="text-white text-center font-bold">
              ⭐ БОНУСНЫЙ РЕЖИМ ⭐
            </p>
          </div>
        )}
      </div>

      <div className="mb-6 flex gap-2 justify-center">
        {[10, 25, 50, 100].map((amount) => (
          <button
            key={amount}
            onClick={() => {
              onClick();
              onBetChange(amount);
            }}
            onMouseEnter={onHover}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              bet === amount
                ? 'bg-blue-500 text-white shadow-lg scale-110'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {amount}
          </button>
        ))}
      </div>

      {lastWin > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg animate-bounce-in">
          <p className="text-white text-center text-xl font-bold">
            🎉 Выигрыш: +{lastWin} монет!
          </p>
        </div>
      )}

      {winStreak >= 3 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
          <p className="text-white text-center text-lg font-bold">
            🔥 Серия побед: {winStreak}x
          </p>
          <Progress value={(winStreak / 10) * 100} className="mt-2 h-2" />
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="BarChart3" size={24} />
            Статистика
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Всего спинов</p>
              <p className="text-2xl font-bold">{totalSpins}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Выиграно</p>
              <p className="text-2xl font-bold text-green-600">{totalWins}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Макс серия</p>
              <p className="text-2xl font-bold text-orange-600">{maxWinStreak}x</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Бонусы</p>
              <p className="text-2xl font-bold text-purple-600">{bonusRounds}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button 
          onClick={() => {
            onClick();
            onShowAchievements();
          }}
          onMouseEnter={onHover}
          variant="outline" 
          className="flex-1"
        >
          <Icon name="Trophy" className="mr-2" size={18} />
          Достижения
        </Button>
        <Button 
          onClick={() => {
            onClick();
            onReset();
          }}
          onMouseEnter={onHover}
          variant="destructive"
        >
          <Icon name="RotateCcw" size={18} />
        </Button>
      </div>
    </>
  );
};

export default CasinoStats;
