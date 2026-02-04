import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { jobService } from '../../service/job.service';
import type { IJobGetByIdOutputDto } from '../../types/models';
export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<IJobGetByIdOutputDto | null>(null);

  useEffect(() => {
    if (id) {
      loadJobById(Number(id));
    } else {
      navigate('/jobs');
    }
  }, [id]);

  const loadJobById = async (jobId: number) => {
    try {
      const result = await jobService.getByIdJob(jobId);
      setJob(result);
    } catch (error) {
      console.error('Erro ao carregar job:', error);
      navigate('/jobs');
    }
  };

  if (!job) {
    return (
      <div className="p-5 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes do job...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mb-6">
        <button
          onClick={() => navigate('/jobs')}
          className="text-primary hover:text-primary/80 mb-4 flex items-center gap-2"
        >
          ← Voltar para Jobs
        </button>
        <h1 className="text-4xl font-semibold text-text-primary">Job Details</h1>
      </div>

      <section className="bg-white rounded-lg shadow-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <p className="text-gray-900">{job.name || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hostname</label>
            <p className="text-gray-900">{job.hostname || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <p className="text-gray-900">{job.projectName || '-'}</p>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              job.state === 'Running' ? 'bg-green-100 text-green-800' :
              job.state === 'Completed' ? 'bg-blue-100 text-blue-800' :
              job.state === 'Failed' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {job.state || '-'}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <p className="text-gray-900">{job.priority || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Package Version</label>
            <p className="text-gray-900">{job.packageVersion || '-'}</p>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Robot</label>
            <p className="text-gray-900">{job.robot || '-'}</p>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Started At</label>
            <p className="text-gray-900">{job.started ? new Date(job.started).toLocaleString() : '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ended At</label>
            <p className="text-gray-900">{job.ended ? new Date(job.ended).toLocaleString() : '-'}</p>
          </div>
        </div>

        {/* {job.inputValues && job.inputValues.length > 0 && (
          <div className="mt-6 border-t pt-6">
            <button
              onClick={() => setIsInputValuesVisible(!isInputValuesVisible)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">Input Values</h3>
              {isInputValuesVisible ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>

            {isInputValuesVisible && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.inputValues.map((input, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{input.name || '-'}</td>
                        <td className="p-2">{input.type || '-'}</td>
                        <td className="p-2">{input.value || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )} */}
      </section>
    </div>
  );
}
