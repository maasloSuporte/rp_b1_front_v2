import { useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading';

const Realtime = lazy(() => import('../../components/queues/Realtime'));
const Historical = lazy(() => import('../../components/queues/Historical'));

export default function Queues() {
  const { t } = useTranslation('translation');
  const [activeTab, setActiveTab] = useState<'realtime' | 'historical'>('realtime');

  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-4xl font-semibold text-text-primary mb-6">{t('pages.queues.title')}</h1>
      
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('realtime')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'realtime'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {t('pages.queues.realtime')}
        </button>
        <button
          onClick={() => setActiveTab('historical')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'historical'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {t('pages.queues.historical')}
        </button>
      </div>

      {activeTab === 'realtime' && (
        <Suspense fallback={<Loading />}>
          <Realtime />
        </Suspense>
      )}
      {activeTab === 'historical' && (
        <Suspense fallback={<Loading />}>
          <Historical />
        </Suspense>
      )}
    </div>
  );
}
