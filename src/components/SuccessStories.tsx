import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SuccessStories: React.FC = () => {
  const { t } = useLanguage();

  const stories = [
    { key: '1', rating: 5 },
    { key: '2', rating: 5 },
    { key: '3', rating: 5 },
  ];

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="section-label">{t('stories.label')}</p>
          <h2 className="section-title">{t('stories.title')}</h2>
          <p className="section-subtitle">{t('stories.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <motion.div
              key={story.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="premium-card p-7 relative"
            >
              <Quote className="w-8 h-8 text-accent/30 absolute top-6 right-6" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: story.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                "{t(`stories.${story.key}.quote`)}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {t(`stories.${story.key}.name`).charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t(`stories.${story.key}.name`)}</p>
                  <p className="text-xs text-muted-foreground">{t(`stories.${story.key}.treatment`)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
