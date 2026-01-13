import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import ThemeSwitcher from '@/components/ThemeSwitcher';

type TestStatus = 'idle' | 'testing' | 'success' | 'error' | 'permission-denied';

interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
}

const Index = () => {
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [audioLevel, setAudioLevel] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({ browser: '', os: '', device: '' });
  const [microphoneName, setMicrophoneName] = useState('');
  const [headphoneTestPlaying, setHeadphoneTestPlaying] = useState<'none' | 'left' | 'right' | 'both'>('none');
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    detectDevice();
    return () => {
      stopTest();
    };
  }, []);

  const detectDevice = () => {
    const userAgent = navigator.userAgent;
    let browser = 'Неизвестный браузер';
    let os = 'Неизвестная ОС';
    let device = 'Desktop';

    if (userAgent.includes('Chrome')) browser = 'Google Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Mozilla Firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Microsoft Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';

    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) device = 'Mobile';

    setDeviceInfo({ browser, os, device });
  };

  const startTest = async () => {
    try {
      setTestStatus('testing');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      if (audioInputs.length > 0) {
        setMicrophoneName(audioInputs[0].label || 'Микрофон');
      }

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const normalizedLevel = Math.min(100, (average / 255) * 200);
        
        setAudioLevel(normalizedLevel);
        
        if (normalizedLevel > 5) {
          setTestStatus('success');
        }

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (error) {
      console.error('Ошибка доступа к микрофону:', error);
      if ((error as Error).name === 'NotAllowedError' || (error as Error).name === 'PermissionDeniedError') {
        setTestStatus('permission-denied');
      } else {
        setTestStatus('error');
      }
    }
  };

  const stopTest = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setAudioLevel(0);
    setTestStatus('idle');
  };

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

  const playHeadphoneTest = (channel: 'left' | 'right' | 'both') => {
    stopHeadphoneTest();
    
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const panner = audioContext.createStereoPanner();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    
    if (channel === 'left') {
      panner.pan.setValueAtTime(-1, audioContext.currentTime);
    } else if (channel === 'right') {
      panner.pan.setValueAtTime(1, audioContext.currentTime);
    } else {
      panner.pan.setValueAtTime(0, audioContext.currentTime);
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    oscillator.connect(panner);
    panner.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    
    oscillatorRef.current = oscillator;
    pannerRef.current = panner;
    gainNodeRef.current = gainNode;
    audioContextRef.current = audioContext;
    
    setHeadphoneTestPlaying(channel);
  };

  const stopHeadphoneTest = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    pannerRef.current = null;
    gainNodeRef.current = null;
    setHeadphoneTestPlaying('none');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 dark:from-background dark:via-background dark:to-background">
      <ThemeSwitcher />
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-lg">
            <Icon name="Mic" className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Проверка микрофона
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Быстрая диагностика и настройка вашего микрофона онлайн
          </p>
        </div>

        <Card className="mb-8 border-2 shadow-xl animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Icon name="Laptop" className="text-primary" size={28} />
              Информация о системе
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Icon name="Monitor" className="text-secondary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Браузер</p>
                  <p className="font-semibold">{deviceInfo.browser}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Icon name="HardDrive" className="text-secondary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Операционная система</p>
                  <p className="font-semibold">{deviceInfo.os}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Icon name="Smartphone" className="text-secondary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Устройство</p>
                  <p className="font-semibold">{deviceInfo.device}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <Button onClick={startTest} size="lg" className="px-8">
                    <Icon name="Play" className="mr-2" size={20} />
                    Начать проверку
                  </Button>
                ) : (
                  <Button onClick={stopTest} variant="outline" size="lg" className="px-8">
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

        <Tabs defaultValue="headphones" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="headphones" className="text-base">
              <Icon name="Headphones" className="mr-2" size={18} />
              Наушники
            </TabsTrigger>
            <TabsTrigger value="tips" className="text-base">
              <Icon name="Lightbulb" className="mr-2" size={18} />
              Советы
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-base">
              <Icon name="Settings" className="mr-2" size={18} />
              Настройка по ОС
            </TabsTrigger>
          </TabsList>

          <TabsContent value="headphones" className="mt-6">
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
                        <h4 className="text-lg font-semibold">Левый канал</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Звук должен быть слышен в левом наушнике</p>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => headphoneTestPlaying === 'left' ? stopHeadphoneTest() : playHeadphoneTest('left')}
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
                        <h4 className="text-lg font-semibold">Правый канал</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Звук должен быть слышен в правом наушнике</p>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => headphoneTestPlaying === 'right' ? stopHeadphoneTest() : playHeadphoneTest('right')}
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
                        <h4 className="text-lg font-semibold">Оба канала</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Звук должен быть слышен в обоих наушниках</p>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => headphoneTestPlaying === 'both' ? stopHeadphoneTest() : playHeadphoneTest('both')}
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
                    <li>Попробуйте другое аудио-устройство для вывода</li>
                    <li>Перезапустите браузер и разрешите воспроизведение звука</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="mt-6">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Sparkles" className="text-accent" size={24} />
                  Общие рекомендации
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Icon name="Volume2" className="text-primary shrink-0" size={24} />
                    <div>
                      <h4 className="font-semibold mb-1 text-gray-900">Проверьте громкость</h4>
                      <p className="text-sm text-muted-foreground">
                        Убедитесь, что микрофон не отключен и уровень громкости установлен на подходящее значение.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <Icon name="Headphones" className="text-secondary shrink-0" size={24} />
                    <div>
                      <h4 className="font-semibold mb-1 text-gray-900">Проверьте подключение</h4>
                      <p className="text-sm text-muted-foreground">
                        Если используете внешний микрофон, убедитесь, что он правильно подключен к компьютеру.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <Icon name="RefreshCw" className="text-accent shrink-0" size={24} />
                    <div>
                      <h4 className="font-semibold mb-1 text-gray-900">Перезапустите браузер</h4>
                      <p className="text-sm text-muted-foreground">
                        Иногда простая перезагрузка браузера помогает решить проблемы с доступом к микрофону.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <Icon name="Shield" className="text-green-600 shrink-0" size={24} />
                    <div>
                      <h4 className="font-semibold mb-1 text-gray-900">Проверьте разрешения</h4>
                      <p className="text-sm text-muted-foreground">
                        Убедитесь, что сайту разрешён доступ к микрофону в настройках браузера.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Settings2" className="text-secondary" size={24} />
                  Настройка микрофона
                </CardTitle>
                <CardDescription>
                  Инструкции для вашей системы: <span className="font-semibold text-foreground">{deviceInfo.os}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="windows">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Icon name="Monitor" className="text-primary" size={20} />
                        Windows
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-base">
                      <ol className="list-decimal list-inside space-y-2 ml-2">
                        <li>Откройте <span className="font-semibold">Параметры</span> → <span className="font-semibold">Система</span> → <span className="font-semibold">Звук</span></li>
                        <li>В разделе "Ввод" выберите нужный микрофон</li>
                        <li>Нажмите на устройство и настройте громкость</li>
                        <li>Проверьте работу микрофона в разделе "Проверка микрофона"</li>
                      </ol>
                      <Alert className="mt-4">
                        <Icon name="Info" className="text-blue-600" size={18} />
                        <AlertDescription>
                          Также можно открыть настройки через поиск: нажмите Win + S и введите "Настройки микрофона"
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="macos">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Icon name="Apple" className="text-primary" size={20} fallback="Monitor" />
                        macOS
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-base">
                      <ol className="list-decimal list-inside space-y-2 ml-2">
                        <li>Откройте <span className="font-semibold">Системные настройки</span></li>
                        <li>Перейдите в раздел <span className="font-semibold">Звук</span></li>
                        <li>Выберите вкладку <span className="font-semibold">Ввод</span></li>
                        <li>Выберите микрофон из списка устройств</li>
                        <li>Настройте ползунок "Громкость входа"</li>
                      </ol>
                      <Alert className="mt-4">
                        <Icon name="Info" className="text-blue-600" size={18} />
                        <AlertDescription>
                          В macOS также проверьте Конфиденциальность → Микрофон, чтобы разрешить доступ нужным приложениям
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="linux">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Icon name="Terminal" className="text-primary" size={20} />
                        Linux
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-base">
                      <ol className="list-decimal list-inside space-y-2 ml-2">
                        <li>Откройте <span className="font-semibold">Настройки системы</span></li>
                        <li>Перейдите в раздел <span className="font-semibold">Звук</span></li>
                        <li>Выберите вкладку <span className="font-semibold">Ввод</span></li>
                        <li>Выберите нужное устройство ввода</li>
                        <li>Настройте уровень громкости</li>
                      </ol>
                      <Alert className="mt-4">
                        <Icon name="Info" className="text-blue-600" size={18} />
                        <AlertDescription>
                          Для продвинутых настроек можно использовать утилиту pavucontrol (для PulseAudio) или alsamixer (для ALSA)
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="browser">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Icon name="Globe" className="text-primary" size={20} />
                        Настройки браузера
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-base">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Chrome / Edge:</h4>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>Нажмите на иконку замка в адресной строке</li>
                            <li>Найдите "Микрофон" и разрешите доступ</li>
                            <li>Перезагрузите страницу</li>
                          </ol>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Firefox:</h4>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>Нажмите на иконку в адресной строке</li>
                            <li>Разрешите доступ к микрофону для этого сайта</li>
                            <li>Обновите страницу</li>
                          </ol>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Safari:</h4>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>Safari → Настройки → Веб-сайты</li>
                            <li>Выберите "Микрофон" в списке слева</li>
                            <li>Установите "Разрешить" для этого сайта</li>
                          </ol>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="text-center text-muted-foreground text-sm mt-12">
          <p>Инструмент работает полностью в вашем браузере. Аудио не записывается и не отправляется на сервер.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;