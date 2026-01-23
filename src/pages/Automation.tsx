import { useEffect, useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsService } from '../services/projects.service';
import { useModalStore } from '../services/modal.service';
import { useNotificationStore } from '../services/notification.service';
import type { IPaginationOutputDto, IProjectGetAllOutputDto } from '../types/models';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface FolderNode {
  name: string;
  children?: FolderNode[];
  detalhes?: Detalhe[];
}

interface Detalhe {
  id: number;
  name: string;
  version: string;
  active: string;
  createdAt: string;
}

export default function Automation() {
  const navigate = useNavigate();
  const confirmDelete = useModalStore((state) => state.confirmDelete);
  const showToast = useNotificationStore((state) => state.showToast);
  const [projects, setProjects] = useState<IProjectGetAllOutputDto[]>([]);
  const [treeData, setTreeData] = useState<FolderNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadProjects();
  }, [pageNumber, pageSize]);

  const loadProjects = async () => {
    try {
      const result: IPaginationOutputDto<IProjectGetAllOutputDto> = 
        await projectsService.getAllProjects({ pageNumber, pageSize });
      setProjects(result.items);
      setTotalCount(result.totalItems);
      setTreeData(buildTreeFromPaths(result.items));
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const buildTreeFromPaths = (projects: IProjectGetAllOutputDto[]): FolderNode[] => {
    const root: FolderNode[] = [];

    projects.forEach(project => {
      const parts = project.name.includes('/') ? project.name.split('/') : ['/', project.name];
      const folders = parts.slice(0, -1);
      const finalProjectName = parts[parts.length - 1];

      let currentLevel = root;

      folders.forEach((folder) => {
        let existing = currentLevel.find((node) => node.name === folder);
        if (!existing) {
          existing = { name: folder, children: [] };
          currentLevel.push(existing);
        }
        currentLevel = existing.children || [];
      });

      let tableNode = currentLevel.find((node) => node.name === 'TABELA');
      if (!tableNode) {
        tableNode = { name: 'TABELA', detalhes: [] };
        currentLevel.push(tableNode);
      }

      if (!tableNode.detalhes) {
        tableNode.detalhes = [];
      }

      tableNode.detalhes.push({
        id: project.id,
        name: finalProjectName,
        version: String(project.packageVersionId),
        active: String(project.active),
        createdAt: String(project.createdAt)
      });
    });

    return root;
  };

  const toggleNode = (path: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderTree = (nodes: FolderNode[], level: number = 0, path: string = ''): JSX.Element[] => {
    return nodes.map((node, index) => {
      const nodePath = path ? `${path}-${index}` : `${index}`;
      const isExpanded = expandedNodes.has(nodePath);
      const hasChildren = node.children && node.children.length > 0;

      return (
        <div key={nodePath} className="select-none">
          <div
            className={`flex items-center py-2 px-4 hover:bg-gray-50 cursor-pointer ${
              level > 0 ? 'pl-8' : ''
            }`}
            onClick={() => hasChildren && toggleNode(nodePath)}
          >
            {hasChildren && (
              <span className="mr-2">
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4" />
                )}
              </span>
            )}
            {!hasChildren && <span className="w-4 mr-2" />}
            <span className="flex-1">{node.name}</span>
          </div>

          {isExpanded && hasChildren && (
            <div className="ml-4">
              {renderTree(node.children!, level + 1, nodePath)}
            </div>
          )}

          {node.detalhes && node.detalhes.length > 0 && (
            <div className="ml-8 bg-gray-50 rounded-lg p-4 my-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Version</th>
                    <th className="text-left p-2">Active</th>
                    <th className="text-left p-2">Created At</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {node.detalhes.map((detalhe) => (
                    <tr key={detalhe.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{detalhe.name}</td>
                      <td className="p-2">{detalhe.version}</td>
                      <td className="p-2">{detalhe.active}</td>
                      <td className="p-2">{detalhe.createdAt}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/project/${detalhe.id}`)}
                            className="text-primary hover:text-primary/80 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              const confirmed = await confirmDelete({
                                itemName: detalhe.name
                              });
                              if (confirmed) {
                                try {
                                  await projectsService.deleteProject({ id: detalhe.id });
                                  showToast('Sucess', 'Project deleted successfully', 'success');
                                  loadProjects();
                                } catch (error) {
                                  showToast('Error', 'Failed to delete project', 'error');
                                }
                              }
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-text-primary">Automation</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/project')}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Create Project
          </button>
          <button
            onClick={() => navigate('/execution')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Execute
          </button>
        </div>
      </div>

      <section className="bg-white rounded-lg shadow-card p-4">
        <div className="border rounded-lg">
          {renderTree(treeData)}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((pageNumber - 1) * pageSize) + 1} to {Math.min(pageNumber * pageSize, totalCount)} of {totalCount} projects
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPageNumber(pageNumber + 1)}
              disabled={pageNumber * pageSize >= totalCount}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
