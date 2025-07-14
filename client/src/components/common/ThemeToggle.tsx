
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="btn-ghost hover-lift focus-ring"
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-muted-foreground" />
      ) : (
        <Sun size={20} className="text-yellow-500" />
      )}
    </Button>
  );
};

export default ThemeToggle;
