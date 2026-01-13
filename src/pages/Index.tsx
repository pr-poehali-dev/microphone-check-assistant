import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import DeviceInfoCard from '@/components/DeviceInfoCard';
import MicrophoneTest from '@/components/MicrophoneTest';
import HeadphoneTest from '@/components/HeadphoneTest';
import SettingsTabs from '@/components/SettingsTabs';
import SecretCasino from '@/components/SecretCasino';

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
  const [showCasino, setShowCasino] = useState(false);
  const [iconClickCount, setIconClickCount] = useState(0);
  const [monitorEnabled, setMonitorEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const monitorGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    detectDevice();
    return () => {
      stopTest();
    };
  }, []);

  useEffect(() => {
    if (iconClickCount >= 5) {
      setShowCasino(true);
      setIconClickCount(0);
    }
  }, [iconClickCount]);

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

      const monitorGain = audioContext.createGain();
      monitorGain.gain.setValueAtTime(0, audioContext.currentTime);
      monitorGainRef.current = monitorGain;
      source.connect(monitorGain);
      monitorGain.connect(audioContext.destination);

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
    monitorGainRef.current = null;
    setAudioLevel(0);
    setTestStatus('idle');
    setMonitorEnabled(false);
  };

  const toggleMonitor = () => {
    if (!monitorGainRef.current) return;
    
    const newState = !monitorEnabled;
    setMonitorEnabled(newState);
    
    if (newState) {
      monitorGainRef.current.gain.setValueAtTime(1, audioContextRef.current!.currentTime);
    } else {
      monitorGainRef.current.gain.setValueAtTime(0, audioContextRef.current!.currentTime);
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

  if (showCasino) {
    return <SecretCasino />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 dark:from-background dark:via-background dark:to-background">
      <ThemeSwitcher />
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-lg cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setIconClickCount(iconClickCount + 1)}
          >
            <Icon name="Mic" className="text-white" size={40} />
          </div>
          <h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
          >
            Проверка микрофона
          </h1>
          <p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Быстрая диагностика и настройка вашего микрофона онлайн
          </p>
        </div>

        <DeviceInfoCard deviceInfo={deviceInfo} />

        <Tabs defaultValue="microphone" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="microphone" className="text-base">
              <Icon name="Mic" className="mr-2" size={18} />
              Микрофон
            </TabsTrigger>
            <TabsTrigger value="headphones" className="text-base">
              <Icon name="Headphones" className="mr-2" size={18} />
              Наушники
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-base">
              <Icon name="Settings" className="mr-2" size={18} />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="microphone">
            <MicrophoneTest
              testStatus={testStatus}
              audioLevel={audioLevel}
              microphoneName={microphoneName}
              monitorEnabled={monitorEnabled}
              onStartTest={startTest}
              onStopTest={stopTest}
              onToggleMonitor={toggleMonitor}
            />
          </TabsContent>

          <TabsContent value="headphones" className="mt-6">
            <HeadphoneTest
              headphoneTestPlaying={headphoneTestPlaying}
              onPlayTest={playHeadphoneTest}
              onStopTest={stopHeadphoneTest}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SettingsTabs deviceOS={deviceInfo.os} />
          </TabsContent>
        </Tabs>

        <footer className="text-center text-muted-foreground text-sm mt-12 pb-8">
          <p>Все проверки выполняются локально в вашем браузере. Мы не записываем и не сохраняем никакие данные.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;