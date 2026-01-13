import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
}

interface DeviceInfoCardProps {
  deviceInfo: DeviceInfo;
}

const DeviceInfoCard = ({ deviceInfo }: DeviceInfoCardProps) => {
  return (
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
  );
};

export default DeviceInfoCard;
