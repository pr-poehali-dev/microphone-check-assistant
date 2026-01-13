import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  reward: number;
  unlocked: boolean;
}

interface CasinoAchievementsProps {
  showAchievement: boolean;
  newAchievement: Achievement | null;
  showAchievements: boolean;
  achievements: Achievement[];
  showJackpotWin: boolean;
  jackpot: number;
  showDailyReward: boolean;
  dailyStreak: number;
  balance: number;
  onCloseAchievement: () => void;
  onCloseAchievementsList: () => void;
  onCloseJackpot: () => void;
  onClaimDaily: () => void;
}

const CasinoAchievements = ({
  showAchievement,
  newAchievement,
  showAchievements,
  achievements,
  showJackpotWin,
  jackpot,
  showDailyReward,
  dailyStreak,
  balance,
  onCloseAchievement,
  onCloseAchievementsList,
  onCloseJackpot,
  onClaimDaily
}: CasinoAchievementsProps) => {
  return (
    <>
      <Dialog open={showAchievement} onOpenChange={onCloseAchievement}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">🎉 Достижение разблокировано!</DialogTitle>
          </DialogHeader>
          {newAchievement && (
            <div className="text-center py-6">
              <div className="text-6xl mb-4">{newAchievement.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{newAchievement.title}</h3>
              <p className="text-muted-foreground mb-4">{newAchievement.description}</p>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-6 rounded-lg inline-block">
                <p className="font-bold text-xl">+{newAchievement.reward} монет</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAchievements} onOpenChange={onCloseAchievementsList}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="Trophy" size={28} />
              Достижения
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {achievements.map((ach) => (
              <Card key={ach.id} className={ach.unlocked ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`text-4xl ${ach.unlocked ? '' : 'grayscale opacity-50'}`}>
                      {ach.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold">{ach.title}</h4>
                        {ach.unlocked && <span className="text-green-600 text-sm font-semibold">✓ Получено</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{ach.description}</p>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={ach.unlocked ? 100 : 0} 
                          className="h-2"
                        />
                        <span className="text-xs font-semibold text-yellow-600">
                          +{ach.reward}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showJackpotWin} onOpenChange={onCloseJackpot}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="text-8xl mb-4 animate-bounce">🎁</div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              ДЖЕКПОТ!
            </h2>
            <p className="text-2xl font-bold text-green-600 mb-2">
              +{jackpot} монет!
            </p>
            <p className="text-muted-foreground">
              Невероятная удача! 🍀
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDailyReward} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">🎁 Ежедневная награда!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-lg mb-4">
              Получите свою ежедневную награду!
            </p>
            {dailyStreak > 0 && (
              <div className="mb-4 p-3 bg-orange-100 dark:bg-orange-950/20 rounded-lg">
                <p className="font-bold">🔥 Серия дней: {dailyStreak}</p>
                <p className="text-sm text-muted-foreground">
                  Бонус увеличен на {(dailyStreak - 1) * 50} монет!
                </p>
              </div>
            )}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg inline-block mb-4">
              <p className="font-bold text-xl">
                +{100 + (dailyStreak) * 50} монет
              </p>
            </div>
            <button
              onClick={onClaimDaily}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all"
            >
              Забрать награду
            </button>
            <p className="text-sm text-muted-foreground mt-4">
              Текущий баланс: {balance} монет
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CasinoAchievements;
