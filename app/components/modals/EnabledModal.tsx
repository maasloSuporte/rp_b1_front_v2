import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface EnabledModalProps {
  isOpen: boolean;
  onClose: (confirmed: boolean) => void;
  data: {
    title?: string;
    description?: string;
    itemName?: string;
    buttonName?: string;
  };
}

export default function EnabledModal({ isOpen, onClose, data }: EnabledModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => onClose(false)}>
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
                  <CheckCircleIcon className="h-12 w-12 text-success mb-3" />
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-2">
                    {data.title?.trim() || 'Enable Item'}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {data.description?.trim() || 'Do you want to enable'}{' '}
                      <strong>{data.itemName}</strong>?
                    </p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={() => onClose(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2"
                      onClick={() => onClose(true)}
                    >
                      {data.buttonName?.trim() || 'Yes, Enable'}
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
