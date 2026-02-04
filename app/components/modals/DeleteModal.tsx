import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: (confirmed: boolean) => void;
  data: {
    title?: string;
    description?: string;
    itemName?: string;
    buttonName?: string;
  };
}

export default function DeleteModal({ isOpen, onClose, data }: DeleteModalProps) {
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
          <div className="fixed inset-0 bg-black/85" />
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-12 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-col items-center text-center">
                  <ExclamationTriangleIcon className="h-24 w-24 text-error mb-6" />
                  <Dialog.Title as="h3" className="text-2xl font-semibold leading-8 text-gray-900 mb-4">
                    {data.title?.trim() || 'Tem certeza absoluta?'}
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-lg text-gray-500">
                      {data.description?.trim() || 'Esta ação excluirá permanentemente'}{' '}
                      <strong>{data.itemName}</strong>.
                    </p>
                  </div>

                  <div className="mt-10 flex gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={() => onClose(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-xl bg-error px-8 py-3.5 text-base font-medium text-white hover:bg-error/90 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
                      onClick={() => onClose(true)}
                    >
                      {data.buttonName?.trim() || 'Sim, excluir'}
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
