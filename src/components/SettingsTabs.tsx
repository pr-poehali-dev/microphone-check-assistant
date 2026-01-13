import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

interface SettingsTabsProps {
  deviceOS: string;
}

const SettingsTabs = ({ deviceOS }: SettingsTabsProps) => {
  return (
    <>
      <Card className="border-2 shadow-lg mb-8">
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
                <h4 className="font-semibold mb-1">Проверьте громкость</h4>
                <p className="text-sm text-muted-foreground">
                  Убедитесь, что микрофон не отключен и уровень громкости установлен на подходящее значение.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Icon name="Headphones" className="text-secondary shrink-0" size={24} />
              <div>
                <h4 className="font-semibold mb-1">Проверьте подключение</h4>
                <p className="text-sm text-muted-foreground">
                  Если используете внешний микрофон, убедитесь, что он правильно подключен к компьютеру.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Icon name="RefreshCw" className="text-accent shrink-0" size={24} />
              <div>
                <h4 className="font-semibold mb-1">Перезапустите браузер</h4>
                <p className="text-sm text-muted-foreground">
                  Иногда простая перезагрузка браузера помогает решить проблемы с доступом к микрофону.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <Icon name="Shield" className="text-green-600 shrink-0" size={24} />
              <div>
                <h4 className="font-semibold mb-1">Проверьте разрешения</h4>
                <p className="text-sm text-muted-foreground">
                  Убедитесь, что сайту разрешён доступ к микрофону в настройках браузера.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Settings2" className="text-secondary" size={24} />
            Настройка микрофона
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Инструкции для вашей системы: <span className="font-semibold text-foreground">{deviceOS}</span>
          </p>
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
    </>
  );
};

export default SettingsTabs;
