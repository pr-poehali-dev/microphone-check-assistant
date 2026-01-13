import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

type TestStatus = 'idle' | 'testing' | 'success' | 'error' | 'permission-denied';

interface MicrophoneTestProps {
  testStatus: TestStatus;
  audioLevel: number;
  microphoneName: string;
  monitorEnabled: boolean;
  onStartTest: () => void;
  onStopTest: () => void;
  onToggleMonitor: () => void;
}

const MicrophoneTest = ({ 
  testStatus, 
  audioLevel, 
  microphoneName, 
  monitorEnabled,
  onStartTest, 
  onStopTest,
  onToggleMonitor
}: MicrophoneTestProps) => {
  const getStatusColor = () => {
    switch (testStatus) {
      case 'success':
        return 'text-green-600';
      case 'error':
      case 'permission-denied':
        return 'text-red-600';
      case 'testing':
        return 'text-blue-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (testStatus) {
      case 'success':
        return 'CheckCircle2';
      case 'error':
      case 'permission-denied':
        return 'XCircle';
      case 'testing':
        return 'Radio';
      default:
        return 'Mic';
    }
  };

  const getStatusText = () => {
    switch (testStatus) {
      case 'success':
        return 'Микрофон работает отлично!';
      case 'error':
        return 'Ошибка подключения к микрофону';
      case 'permission-denied':
        return 'Доступ к микрофону запрещён';
      case 'testing':
        return 'Говорите в микрофон...';
      default:
        return 'Готов к проверке';
    }
  };

  const getVolumeStatus = () => {
    if (testStatus !== 'testing') {
      return { text: 'Микрофон не активен', color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
    }
    
    if (audioLevel === 0) {
      return { text: 'Нет звука', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    } else if (audioLevel < 20) {
      return { text: 'Очень слабо', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
    } else if (audioLevel < 40) {
      return { text: 'Слабо', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    } else if (audioLevel < 70) {
      return { text: 'Хорошо', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    } else {
      return { text: 'Микрофон работает отлично', color: 'text-green-700', bgColor: 'bg-green-100', borderColor: 'border-green-300' };
    }
  };

  const volumeStatus = getVolumeStatus();

  return (
    <Card className="mb-8 border-2 shadow-xl animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Icon name={getStatusIcon()} className={getStatusColor()} size={28} />
          Тестирование микрофона
        </CardTitle>
        <CardDescription>
          {microphoneName && <span className="font-semibold">Микрофон: {microphoneName}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mb-6 relative overflow-hidden">
            {testStatus === 'testing' && (
              <div 
                className="absolute inset-0 bg-primary/30 rounded-full transition-transform duration-100"
                style={{ 
                  transform: `scale(${0.3 + (audioLevel / 100) * 0.7})`,
                  opacity: audioLevel > 5 ? 0.8 : 0.3
                }}
              />
            )}
            <Icon 
              name="Mic" 
              className={`${getStatusColor()} relative z-10 transition-all duration-300`}
              size={60} 
            />
          </div>
          <p className={`text-2xl font-semibold mb-2 ${getStatusColor()}`}>
            {getStatusText()}
          </p>
          <p className="text-muted-foreground mb-6">
            {testStatus === 'testing' && 'Произнесите что-нибудь для проверки'}
            {testStatus === 'success' && 'Ваш микрофон готов к использованию'}
            {testStatus === 'idle' && 'Нажмите кнопку для начала теста'}
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Уровень сигнала</span>
                <span className="font-semibold">{Math.round(audioLevel)}%</span>
              </div>
              <Progress value={audioLevel} className="h-4" />
            </div>
            
            {volumeStatus && (
              <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-300 ${volumeStatus.bgColor} ${volumeStatus.borderColor}`}>
                <Icon 
                  name={testStatus !== 'testing' ? 'Mic' : audioLevel === 0 ? 'MicOff' : audioLevel < 40 ? 'Volume1' : 'Volume2'} 
                  className={volumeStatus.color} 
                  size={20} 
                />
                <span className={`font-bold ${volumeStatus.color}`}>
                  {volumeStatus.text}
                </span>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex gap-3 justify-center">
              {testStatus === 'idle' || testStatus === 'error' || testStatus === 'permission-denied' ? (
                <Button onClick={onStartTest} size="lg" className="px-8">
                  <Icon name="Play" className="mr-2" size={20} />
                  Начать проверку
                </Button>
              ) : (
                <Button onClick={onStopTest} variant="outline" size="lg" className="px-8">
                  <Icon name="StopCircle" className="mr-2" size={20} />
                  Остановить
                </Button>
              )}
            </div>
            
            {testStatus === 'testing' && (
              <div className="flex justify-center animate-fade-in">
                <Button 
                  onClick={onToggleMonitor}
                  variant={monitorEnabled ? 'default' : 'outline'}
                  size="sm"
                  className="px-6"
                >
                  <Icon name={monitorEnabled ? 'Volume2' : 'VolumeX'} className="mr-2" size={18} />
                  {monitorEnabled ? 'Прослушивание включено' : 'Слышать себя'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {testStatus === 'permission-denied' && (
          <Alert className="border-red-200 bg-red-50">
            <Icon name="AlertCircle" className="text-red-600" size={20} />
            <AlertTitle className="text-red-900">Доступ запрещён</AlertTitle>
            <AlertDescription className="text-red-800">
              Браузер не получил доступ к микрофону. Проверьте настройки разрешений в адресной строке браузера.
            </AlertDescription>
          </Alert>
        )}

        {testStatus === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <Icon name="AlertCircle" className="text-red-600" size={20} />
            <AlertTitle className="text-red-900">Ошибка подключения</AlertTitle>
            <AlertDescription className="text-red-800">
              Не удалось подключиться к микрофону. Убедитесь, что микрофон подключен и не используется другим приложением.
            </AlertDescription>
          </Alert>
        )}


      </CardContent>
    </Card>
  );
};

export default MicrophoneTest;