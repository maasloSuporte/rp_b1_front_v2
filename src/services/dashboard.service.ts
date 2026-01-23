import api from './api';
import { usersService } from './users.service';
import { jobService } from './job.service';
import { scheduleService } from './schedule.service';
import { assetsService } from './assets.service';
import { queuesService } from './queues.service';
import { devicesService } from './devices.service';

export interface DashboardStats {
  users: number;
  processes: number;
  triggers: number;
  assets: number;
  queues: number;
  machines: number;
}

export interface JobStatusCount {
  running: number;
  stopping: number;
  suspended: number;
  pending: number;
  terminating: number;
  resumed: number;
}

export interface JobHistoryCount {
  successful: number;
  faulted: number;
  stopped: number;
}

export interface DashboardData {
  stats: DashboardStats;
  jobStatuses: JobStatusCount;
  jobHistory: JobHistoryCount;
}

// Mapeamento de estados de job (state: number)
// NOTA: Os valores podem variar conforme a API. Ajuste conforme necessário.
// Valores comuns de RPA: 0=New, 1=Running, 2=Stopping, 3=Suspended, 4=Pending, 5=Terminating, 6=Resumed, 7=Successful, 8=Faulted, 9=Stopped
// Ou pode ser: 0=New, 1=Running, 2=Stopping, 3=Suspended, 4=Pending, 5=Terminating, 6=Resumed, 7=Successful, 8=Faulted, 9=Stopped
const JOB_STATE = {
  NEW: 0,
  RUNNING: 1,
  STOPPING: 2,
  SUSPENDED: 3,
  PENDING: 4,
  TERMINATING: 5,
  RESUMED: 6,
  SUCCESSFUL: 7,
  FAULTED: 8,
  STOPPED: 9,
} as const;

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    try {
      debugger
      // Buscar todos os dados em paralelo
      const [users, jobs, schedules, assets, queues, machines] = await Promise.all([
        usersService.getAllUsers(),
        jobService.getAllJobs('PageNumber=1&PageSize=100'), // Buscar todos os jobs
        scheduleService.getAllSchedule('PageNumber=1&PageSize=100'), // Buscar todos os schedules
        assetsService.getAllAssets('PageNumber=1&PageSize=100'), // Buscar todos os assets
        queuesService.getAllQueues({ pageNumber: 1, pageSize: 100 }), // Buscar todas as queues
        devicesService.getAllDevices('PageNumber=1&PageSize=100'), // Buscar todas as machines
      ]);

      // Contar estatísticas básicas
      const stats: DashboardStats = {
        users: users.length,
        processes: jobs.totalItems || jobs.items?.length || 0,
        triggers: schedules.totalItems || schedules.items?.length || 0,
        assets: assets.totalItems || assets.items?.length || 0,
        queues: queues.totalItems || queues.items?.length || 0,
        machines: machines.totalItems || machines.items?.length || 0,
      };

      // Contar status de jobs
      const jobStatuses: JobStatusCount = {
        running: 0,
        stopping: 0,
        suspended: 0,
        pending: 0,
        terminating: 0,
        resumed: 0,
      };

      // Contar histórico de jobs (estados finais)
      const jobHistory: JobHistoryCount = {
        successful: 0,
        faulted: 0,
        stopped: 0,
      };

      if (jobs.items) {
        jobs.items.forEach((job) => {
          const state = job.state;
          
          // Contar status ativos
          if (state === JOB_STATE.RUNNING) jobStatuses.running++;
          else if (state === JOB_STATE.STOPPING) jobStatuses.stopping++;
          else if (state === JOB_STATE.SUSPENDED) jobStatuses.suspended++;
          else if (state === JOB_STATE.PENDING) jobStatuses.pending++;
          else if (state === JOB_STATE.TERMINATING) jobStatuses.terminating++;
          else if (state === JOB_STATE.RESUMED) jobStatuses.resumed++;
          
          // Contar histórico (estados finais)
          if (state === JOB_STATE.SUCCESSFUL) jobHistory.successful++;
          else if (state === JOB_STATE.FAULTED) jobHistory.faulted++;
          else if (state === JOB_STATE.STOPPED) jobHistory.stopped++;
        });
      }

      return {
        stats,
        jobStatuses,
        jobHistory,
      };
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw error;
    }
  },
};
