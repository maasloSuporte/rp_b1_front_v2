import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: (result: { id: number; version: string } | null) => void;
  data: {
    versions: { id: number; version: string }[];
    title?: string;
  };
}

export default function DownloadModal({ isOpen, onClose, data }: DownloadModalProps) {
  const [selectedVersion, setSelectedVersion] = useState<{ id: number; version: string } | null>(
    data.versions.length > 0 ? data.versions[0] : null
  );

  useEffect(() => {
    if (isOpen && data.versions.length > 0) {
      setSelectedVersion(data.versions[0]);
    } else if (isOpen && data.versions.length === 0) {
      setSelectedVersion(null);
    }
  }, [isOpen, data.versions]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => onClose(null)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-col items-center text-center">
                  <ArrowDownTrayIcon className="h-12 w-12 text-primary mb-3" />
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                    {data.title || 'Select Version to Download'}
                  </Dialog.Title>
                  
                  <div className="w-full mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Version
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={selectedVersion?.id || ''}
                      onChange={(e) => {
                        const version = data.versions.find(v => v.id === Number(e.target.value));
                        setSelectedVersion(version || null);
                      }}
                    >
                      {data.versions.map((version) => (
                        <option key={version.id} value={version.id}>
                          {version.version}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={() => onClose(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => onClose(selectedVersion)}
                      disabled={!selectedVersion}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
