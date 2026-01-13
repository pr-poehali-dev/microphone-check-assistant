import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Icon from '@/components/ui/icon';

type Theme = 'light' | 'dark' | 'green';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--background', '222 47% 11%');
      root.style.setProperty('--foreground', '210 40% 98%');
      root.style.setProperty('--card', '222 47% 11%');
      root.style.setProperty('--card-foreground', '210 40% 98%');
      root.style.setProperty('--primary', '199 89% 48%');
      root.style.setProperty('--primary-foreground', '0 0% 100%');
      root.style.setProperty('--muted', '217 33% 17%');
      root.style.setProperty('--muted-foreground', '215 20% 65%');
      root.style.setProperty('--border', '217 33% 25%');
    } else if (newTheme === 'green') {
      root.classList.add('dark');
      root.style.setProperty('--background', '140 40% 8%');
      root.style.setProperty('--foreground', '140 10% 95%');
      root.style.setProperty('--card', '140 30% 12%');
      root.style.setProperty('--card-foreground', '140 10% 95%');
      root.style.setProperty('--primary', '142 76% 36%');
      root.style.setProperty('--primary-foreground', '0 0% 100%');
      root.style.setProperty('--secondary', '142 50% 25%');
      root.style.setProperty('--secondary-foreground', '0 0% 100%');
      root.style.setProperty('--accent', '142 60% 45%');
      root.style.setProperty('--accent-foreground', '0 0% 100%');
      root.style.setProperty('--muted', '140 20% 18%');
      root.style.setProperty('--muted-foreground', '140 10% 65%');
      root.style.setProperty('--border', '140 30% 20%');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--background', '210 100% 98%');
      root.style.setProperty('--foreground', '222 47% 11%');
      root.style.setProperty('--card', '0 0% 100%');
      root.style.setProperty('--card-foreground', '222 47% 11%');
      root.style.setProperty('--primary', '199 89% 48%');
      root.style.setProperty('--primary-foreground', '0 0% 100%');
      root.style.setProperty('--secondary', '262 83% 58%');
      root.style.setProperty('--secondary-foreground', '0 0% 100%');
      root.style.setProperty('--accent', '25 95% 53%');
      root.style.setProperty('--accent-foreground', '0 0% 100%');
      root.style.setProperty('--muted', '210 40% 96%');
      root.style.setProperty('--muted-foreground', '215 16% 47%');
      root.style.setProperty('--border', '214 32% 91%');
    }
  };

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    setOpen(false);
  };

  const getThemeIcon = (themeType: Theme) => {
    switch (themeType) {
      case 'light':
        return 'Sun';
      case 'dark':
        return 'Moon';
      case 'green':
        return 'Leaf';
      default:
        return 'Sun';
    }
  };

  const getThemeLabel = (themeType: Theme) => {
    switch (themeType) {
      case 'light':
        return 'Светлая';
      case 'dark':
        return 'Тёмная';
      case 'green':
        return 'Зелёная';
      default:
        return 'Светлая';
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Icon name={getThemeIcon(theme)} size={24} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="end">
          <div className="space-y-1">
            <Button
              variant={theme === 'light' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => changeTheme('light')}
            >
              <Icon name="Sun" className="mr-2" size={18} />
              Светлая
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => changeTheme('dark')}
            >
              <Icon name="Moon" className="mr-2" size={18} />
              Тёмная
            </Button>
            <Button
              variant={theme === 'green' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => changeTheme('green')}
            >
              <Icon name="Leaf" className="mr-2" size={18} />
              Зелёная
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ThemeSwitcher;
