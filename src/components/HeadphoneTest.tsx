import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

interface HeadphoneTestProps {
  headphoneTestPlaying: 'none' | 'left' | 'right' | 'both';
  onPlayTest: (channel: 'left' | 'right' | 'both') => void;
  onStopTest: () => void;
}

const HeadphoneTest = ({ headphoneTestPlaying, onPlayTest, onStopTest }: HeadphoneTestProps) => {
  const handleButtonClick = (channel: 'left' | 'right' | 'both') => {
    if (headphoneTestPlaying === channel) {
      onStopTest();
    } else {
      onPlayTest(channel);
    }
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Headphones" className="text-secondary" size={24} />
          Тестирование наушников
        </CardTitle>
        <CardDescription>
          Проверьте, правильно ли работают левый и правый каналы
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-blue-200 bg-blue-50">
          <Icon name="Info" className="text-blue-600" size={20} />
          <AlertTitle className="text-blue-900">Как пользоваться</AlertTitle>
          <AlertDescription className="text-blue-800">
            Наденьте наушники и нажмите на кнопки ниже. Вы должны услышать звук в соответствующем канале.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4">
          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="ArrowLeft" className="text-primary" size={20} />
                <h4 className="text-lg font-semibold text-gray-900">Левый канал</h4>
              </div>
              <p className="text-sm text-muted-foreground">Звук должен быть слышен в левом наушнике</p>
            </div>
            <Button
              size="lg"
              onClick={() => handleButtonClick('left')}
              className={headphoneTestPlaying === 'left' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              <Icon name={headphoneTestPlaying === 'left' ? 'Square' : 'Volume2'} className="mr-2" size={20} />
              {headphoneTestPlaying === 'left' ? 'Стоп' : 'Тест'}
            </Button>
          </div>

          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="ArrowRight" className="text-secondary" size={20} />
                <h4 className="text-lg font-semibold text-gray-900">Правый канал</h4>
              </div>
              <p className="text-sm text-muted-foreground">Звук должен быть слышен в правом наушнике</p>
            </div>
            <Button
              size="lg"
              onClick={() => handleButtonClick('right')}
              className={headphoneTestPlaying === 'right' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              <Icon name={headphoneTestPlaying === 'right' ? 'Square' : 'Volume2'} className="mr-2" size={20} />
              {headphoneTestPlaying === 'right' ? 'Стоп' : 'Тест'}
            </Button>
          </div>

          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Music" className="text-accent" size={20} />
                <h4 className="text-lg font-semibold text-gray-900">Оба канала</h4>
              </div>
              <p className="text-sm text-muted-foreground">Звук должен быть слышен в обоих наушниках</p>
            </div>
            <Button
              size="lg"
              onClick={() => handleButtonClick('both')}
              className={headphoneTestPlaying === 'both' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              <Icon name={headphoneTestPlaying === 'both' ? 'Square' : 'Volume2'} className="mr-2" size={20} />
              {headphoneTestPlaying === 'both' ? 'Стоп' : 'Тест'}
            </Button>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-semibold flex items-center gap-2">
            <Icon name="HelpCircle" className="text-primary" size={20} />
            Что делать, если звук не слышен?
          </h4>
          <ul className="space-y-2 ml-6 list-disc text-sm text-muted-foreground">
            <li>Убедитесь, что наушники правильно подключены к компьютеру</li>
            <li>Проверьте уровень громкости в системе и на самих наушниках</li>
            <li>Посмотрите модель наушников и проверьте их спецификацию на поддерживаемые частоты</li>
            <li>Попробуйте другое аудио-устройство для вывода</li>
            <li>Перезапустите браузер и разрешите воспроизведение звука</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeadphoneTest;