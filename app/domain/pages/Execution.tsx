import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { projectsService } from '../../service/projects.service';
import type { IProjectGetSimpleOutputDto } from '../../types/models';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ParameterRow {
  name: string;
  type: string;
  value: string;
}

export default function Execution() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<IProjectGetSimpleOutputDto[]>([]);
  const [selectedProject, setSelectedProject] = useState<number>(0);
  const [parameterRows, setParameterRows] = useState<ParameterRow[]>([
    { name: '', type: '', value: '' }
  ]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const result = await projectsService.getProjects();
      setProjects(result);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const addLine = () => {
    setParameterRows([...parameterRows, { name: '', type: '', value: '' }]);
  };

  const removeLine = (index: number) => {
    if (parameterRows.length > 1) {
      setParameterRows(parameterRows.filter((_, i) => i !== index));
    }
  };

  const updateRow = (index: number, field: keyof ParameterRow, value: string) => {
    const newRows = [...parameterRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setParameterRows(newRows);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de execução
    console.log('Executar projeto:', selectedProject, parameterRows);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mb-6">
        <button
          onClick={() => navigate('/automation')}
          className="text-primary hover:text-primary/80 mb-4 flex items-center gap-2"
        >
          ← Voltar para Automation
        </button>
        <h1 className="text-4xl font-semibold text-text-primary">Execution</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-card p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Project <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value={0}>Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Parameters
            </label>
            <button
              type="button"
              onClick={addLine}
              className="flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <PlusIcon className="w-5 h-5" />
              Add Parameter
            </button>
          </div>

          <div className="space-y-3">
            {parameterRows.map((row, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={row.name}
                    onChange={(e) => updateRow(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="col-span-3">
                  <select
                    value={row.type}
                    onChange={(e) => updateRow(index, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select type</option>
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                  </select>
                </div>
                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder="Value"
                    value={row.value}
                    onChange={(e) => updateRow(index, 'value', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="col-span-1">
                  {parameterRows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/automation')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Execute
          </button>
        </div>
      </form>
    </div>
  );
}
