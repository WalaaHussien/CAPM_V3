import React from 'react';
import { Phone, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const HotlineBar: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-destructive/5 border-y border-destructive/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-destructive animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t('hotline.label')}</p>
              <a href="tel:16999" className="text-xl font-bold text-destructive hover:text-destructive/80 transition-colors">
                16999
              </a>
            </div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-border" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{t('hotline.available')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotlineBar;
