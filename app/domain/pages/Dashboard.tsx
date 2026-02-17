import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { ApexOptions } from 'apexcharts';
import { dashboardService } from '../../service/dashboard.service';

interface StatCard {
  id: number;
  titleKey: keyof import('@/translate/translations').TranslationsType['pages']['dashboard'];
  value: string;
  icon: string;
  color: string;
  route?: string;
}

interface JobStatus {
  labelKey: keyof import('@/translate/translations').TranslationsType['common']['states'];
  value: number;
}

export default function Dashboard() {
  const { t } = useTranslation('translation');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ChartComponent, setChartComponent] = useState<any>(null);
  const [stats, setStats] = useState<StatCard[]>([
    { id: 1, titleKey: 'users', value: '0', icon: '/assets/images/svgs/icon-user-male.svg', color: 'primary', route: '/users' },
    { id: 2, titleKey: 'processes', value: '0', icon: '/assets/images/svgs/icon-briefcase.svg', color: 'warning', route: '/jobs' },
    { id: 3, titleKey: 'triggers', value: '0', icon: '/assets/images/svgs/icon-mailbox.svg', color: 'accent', route: '/scheduled' },
    { id: 4, titleKey: 'assets', value: '0', icon: '/assets/images/svgs/icon-favorites.svg', color: 'error', route: '/assets' },
    { id: 5, titleKey: 'queues', value: '0', icon: '/assets/images/svgs/icon-speech-bubble.svg', color: 'success', route: '/queues' },
    { id: 6, titleKey: 'machines', value: '0', icon: '/assets/images/svgs/icon-connect.svg', color: 'accent', route: '/machines' },
  ]);

  const [jobStatuses, setJobStatuses] = useState<JobStatus[]>([
    { labelKey: 'running', value: 0 },
    { labelKey: 'stopping', value: 0 },
    { labelKey: 'suspended', value: 0 },
    { labelKey: 'pending', value: 0 },
    { labelKey: 'terminating', value: 0 },
    { labelKey: 'resumed', value: 0 },
  ]);

  const [donutChartSeries, setDonutChartSeries] = useState<number[]>([0, 0, 0]);

  // Gráfico de rosca (Jobs History)
  const donutChartOptions: ApexOptions = {
    series: donutChartSeries,
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      height: 280,
      toolbar: {
        show: false,
      },
    },
    colors: ['#FB7F0D', '#2E186A', '#181717'],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  };

  // Gráfico de área (Revenue Updates)
  const areaChartOptions: ApexOptions = {
    series: [
      {
        name: 'Modernize',
        data: [0, 300, 100, 200, 1200, 100, 500, 100],
      },
      {
        name: 'Spike Admin',
        data: [0, 500, 600, 800, 2800, 900, 800, 2200],
      },
    ],
    chart: {
      fontFamily: 'inherit',
      foreColor: '#a1aab2',
      height: 300,
      type: 'area',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 3,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: ['#FB7F0D', '#13deb9'],
    legend: {
      show: false,
    },
    grid: {
      show: true,
      strokeDashArray: 0,
      borderColor: 'rgba(0,0,0,0.1)',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      type: 'category',
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    },
    tooltip: {
      theme: 'dark',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
  };

  const colorClasses = {
    primary: {
      bg: 'bg-[#ecf2ff]',
      text: 'text-[#5d87ff]',
    },
    warning: {
      bg: 'bg-[#fef5e5]',
      text: 'text-[#ffae1f]',
    },
    accent: {
      bg: 'bg-[#e8f7ff]',
      text: 'text-[#49beff]',
    },
    error: {
      bg: 'bg-[#fdede8]',
      text: 'text-[#fa896b]',
    },
    success: {
      bg: 'bg-[#e6fffa]',
      text: 'text-[#13deb9]',
    },
  };

  useEffect(() => {
    loadDashboardStats();
    // Carregar Chart apenas no cliente
    if (typeof window !== 'undefined') {
      import('react-apexcharts').then((module) => {
        setChartComponent(() => module.default);
      });
    }
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const dashboardData = await dashboardService.getDashboardData();

      // Atualizar estatísticas dos cards
      setStats([
        { id: 1, titleKey: 'users', value: formatNumber(dashboardData.stats.users), icon: '/assets/images/svgs/icon-user-male.svg', color: 'primary', route: '/users' },
        { id: 2, titleKey: 'processes', value: formatNumber(dashboardData.stats.processes), icon: '/assets/images/svgs/icon-briefcase.svg', color: 'warning', route: '/jobs' },
        { id: 3, titleKey: 'triggers', value: formatNumber(dashboardData.stats.triggers), icon: '/assets/images/svgs/icon-mailbox.svg', color: 'accent', route: '/scheduled' },
        { id: 4, titleKey: 'assets', value: formatNumber(dashboardData.stats.assets), icon: '/assets/images/svgs/icon-favorites.svg', color: 'error', route: '/assets' },
        { id: 5, titleKey: 'queues', value: formatNumber(dashboardData.stats.queues), icon: '/assets/images/svgs/icon-speech-bubble.svg', color: 'success', route: '/queues' },
        { id: 6, titleKey: 'machines', value: formatNumber(dashboardData.stats.machines), icon: '/assets/images/svgs/icon-connect.svg', color: 'accent', route: '/machines' },
      ]);

      setJobStatuses([
        { labelKey: 'running', value: dashboardData.jobStatuses.running },
        { labelKey: 'stopping', value: dashboardData.jobStatuses.stopping },
        { labelKey: 'suspended', value: dashboardData.jobStatuses.suspended },
        { labelKey: 'pending', value: dashboardData.jobStatuses.pending },
        { labelKey: 'terminating', value: dashboardData.jobStatuses.terminating },
        { labelKey: 'resumed', value: dashboardData.jobStatuses.resumed },
      ]);

      // Atualizar gráfico de rosca (Jobs History)
      setDonutChartSeries([
        dashboardData.jobHistory.successful,
        dashboardData.jobHistory.faulted,
        dashboardData.jobHistory.stopped,
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{t('pages.dashboard.loadingData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background min-w-0 max-w-full">
      {/* Top Cards - grid responsivo que evita overflow */}
      <section className="mb-8 min-w-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 min-w-0">
          {stats.map((stat) => {
            const colorClass = colorClasses[stat.color as keyof typeof colorClasses] || {
              bg: 'bg-gray-100',
              text: 'text-gray-500',
            };
            
            return (
              <div
                key={stat.id}
                onClick={() => stat.route && navigate(stat.route)}
                className={`min-w-0 ${colorClass.bg} rounded-lg shadow-none p-4 sm:p-6 lg:p-8 cursor-pointer hover:shadow-lg transition-all ${
                  stat.route ? 'hover:scale-105' : ''
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <img
                    src={stat.icon}
                    alt={t(`pages.dashboard.${stat.titleKey}`)}
                    width="40"
                    height="40"
                    className="mb-2 rounded-full"
                    style={{ objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <h4 className={`text-sm font-semibold mb-2 mt-2 ${colorClass.text}`} style={{ fontSize: '14px', fontWeight: 600 }}>
                    {t(`pages.dashboard.${stat.titleKey}`)}
                  </h4>
                  <h6 className={`text-xl font-semibold ${colorClass.text}`} style={{ fontSize: '21px', fontWeight: 600, marginTop: '4px' }}>
                    {stat.value}
                  </h6>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Job Status and Jobs History */}
      <section className="mb-8 min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
          {/* Job Status */}
          <div className="bg-white rounded-lg shadow-card p-6 min-w-0">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-900">{t('pages.dashboard.jobStatus')}</h2>
              <img
                src="/assets/images/svgs/dashboard-dwa/Ellipse 59.svg"
                alt=""
                className="w-3 h-3 ml-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 min-w-0">
              {jobStatuses.map((status, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 text-center flex flex-col justify-between min-w-0"
                  style={{ minHeight: '230px' }}
                >
                  <p className="text-gray-500 text-base font-normal" style={{ fontSize: '16.85px', lineHeight: '140%' }}>
                    {t(`common.states.${status.labelKey}`)}
                  </p>
                  <span className="text-gray-900 font-semibold" style={{ fontSize: '15.82px', lineHeight: '120%', marginBottom: '30px' }}>
                    {status.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Jobs History */}
          <div className="bg-white rounded-lg shadow-card p-6 min-w-0">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">{t('pages.dashboard.jobsHistory')}</h2>
            <div className="flex flex-col items-center">
              {/* Legend */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/images/svgs/dashboard-dwa/Ellipse 59.svg"
                    alt=""
                    className="w-4 h-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-gray-700">{t('pages.dashboard.successful')} ({donutChartSeries[0]})</span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/images/svgs/dashboard-dwa/Ellipse 73.svg"
                    alt=""
                    className="w-4 h-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-gray-700">{t('pages.dashboard.faulted')} ({donutChartSeries[1]})</span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/images/svgs/dashboard-dwa/Ellipse 72.svg"
                    alt=""
                    className="w-4 h-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-gray-700">{t('pages.dashboard.stopped')} ({donutChartSeries[2]})</span>
                </div>
              </div>
              {/* Donut Chart */}
              <div className="w-full">
                {ChartComponent ? (
                  <ChartComponent
                    options={donutChartOptions}
                    series={donutChartOptions.series}
                    type="donut"
                    height={280}
                  />
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-gray-500">
                    {t('pages.dashboard.loadingChart')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Updates */}
      <section className="min-w-0">
        <div className="bg-white rounded-lg shadow-card p-6 min-w-0">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">{t('pages.dashboard.revenueUpdates')}</h2>
            <p className="text-gray-600 text-sm">{t('pages.dashboard.overviewProfit')}</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/images/svgs/dashboard-dwa/Ellipse 59.svg"
                  alt=""
                  className="w-3 h-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="text-gray-700">{t('pages.dashboard.modernize')}</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="/assets/images/svgs/dashboard-dwa/Ellipse 73.svg"
                  alt=""
                  className="w-3 h-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="text-gray-700">{t('pages.dashboard.spikeAdmin')}</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            {ChartComponent ? (
              <ChartComponent
                options={areaChartOptions}
                series={areaChartOptions.series}
                type="area"
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                {t('pages.dashboard.loadingChart')}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
