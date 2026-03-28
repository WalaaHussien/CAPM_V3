import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ZoomIn, ZoomOut, Contrast, BookOpen, X, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const AccessibilityWidget: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [readingMode, setReadingMode] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (readingMode) {
      document.documentElement.classList.add('reading-mode');
    } else {
      document.documentElement.classList.remove('reading-mode');
    }
  }, [readingMode]);

  const resetAll = () => {
    setFontSize(100);
    setHighContrast(false);
    setReadingMode(false);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all duration-200 hover:scale-105"
        aria-label={t('accessibility.title')}
      >
        <Eye className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-40 right-4 z-50 w-72 bg-card rounded-xl shadow-xl border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">{t('accessibility.title')}</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Font Size */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  {t('accessibility.fontSize')}
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                    disabled={fontSize <= 80}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 text-center text-sm font-medium">{fontSize}%</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={() => setFontSize(Math.min(150, fontSize + 10))}
                    disabled={fontSize >= 150}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* High Contrast */}
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 text-left ${
                  highContrast
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-border hover:bg-muted/50 text-foreground'
                }`}
              >
                <Contrast className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{t('accessibility.highContrast')}</p>
                  <p className="text-xs text-muted-foreground">{t('accessibility.highContrast.desc')}</p>
                </div>
              </button>

              {/* Reading Mode */}
              <button
                onClick={() => setReadingMode(!readingMode)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 text-left ${
                  readingMode
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-border hover:bg-muted/50 text-foreground'
                }`}
              >
                <BookOpen className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{t('accessibility.readingMode')}</p>
                  <p className="text-xs text-muted-foreground">{t('accessibility.readingMode.desc')}</p>
                </div>
              </button>

              {/* Reset */}
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={resetAll}>
                <RotateCcw className="w-3.5 h-3.5 mr-2" />
                {t('accessibility.reset')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityWidget;
