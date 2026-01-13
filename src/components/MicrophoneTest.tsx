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
  onStartTest: () => void;
  onStopTest: () => void;
}

const MicrophoneTest = ({ 
  testStatus, 
  audioLevel, 
  microphoneName, 
  onStartTest, 
  onStopTest 
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

          {testStatus === 'testing' && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Уровень сигнала</span>
                <span>{Math.round(audioLevel)}%</span>
              </div>
              <Progress value={audioLevel} className="h-3" />
            </div>
          )}

          <div className="mt-8">
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

        {testStatus === 'success' && audioLevel < 5 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <Icon name="AlertTriangle" className="text-yellow-600" size={20} />
            <AlertTitle className="text-yellow-900">Низкий уровень сигнала</AlertTitle>
            <AlertDescription className="text-yellow-800">
              Микрофон работает, но сигнал очень тихий. Попробуйте говорить громче или увеличьте чувствительность микрофона в настройках.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default MicrophoneTest;
