import { create } from 'zustand';

interface ModalState {
  deleteModal: {
    isOpen: boolean;
    data: {
      title?: string;
      description?: string;
      itemName?: string;
      buttonName?: string;
    };
  };
  enabledModal: {
    isOpen: boolean;
    data: {
      title?: string;
      description?: string;
      itemName?: string;
      buttonName?: string;
    };
  };
  downloadModal: {
    isOpen: boolean;
    data: {
      versions: { id: number; version: string }[];
      title?: string;
    };
  };
  confirmDelete: (data: {
    itemName?: string;
    title?: string;
    description?: string;
    buttonName?: string;
  }) => Promise<boolean>;
  confirmEnable: (data: {
    itemName?: string;
    title?: string;
    description?: string;
    buttonName?: string;
  }) => Promise<boolean>;
  confirmDownload: (data: {
    versions: { id: number; version: string }[];
    title?: string;
  }) => Promise<{ id: number; version: string } | null>;
  closeDeleteModal: (confirmed: boolean) => void;
  closeEnabledModal: (confirmed: boolean) => void;
  closeDownloadModal: (result: { id: number; version: string } | null) => void;
}

let deleteResolve: ((value: boolean) => void) | null = null;
let enabledResolve: ((value: boolean) => void) | null = null;
let downloadResolve: ((value: { id: number; version: string } | null) => void) | null = null;

export const useModalStore = create<ModalState>((set) => ({
  deleteModal: {
    isOpen: false,
    data: {},
  },
  enabledModal: {
    isOpen: false,
    data: {},
  },
  downloadModal: {
    isOpen: false,
    data: { versions: [] },
  },
  confirmDelete: (data) => {
    return new Promise<boolean>((resolve) => {
      deleteResolve = resolve;
      set({
        deleteModal: {
          isOpen: true,
          data,
        },
      });
    });
  },
  confirmEnable: (data) => {
    return new Promise<boolean>((resolve) => {
      enabledResolve = resolve;
      set({
        enabledModal: {
          isOpen: true,
          data,
        },
      });
    });
  },
  confirmDownload: (data) => {
    return new Promise<{ id: number; version: string } | null>((resolve) => {
      downloadResolve = resolve;
      set({
        downloadModal: {
          isOpen: true,
          data,
        },
      });
    });
  },
  closeDeleteModal: (confirmed: boolean) => {
    if (deleteResolve) {
      deleteResolve(confirmed);
      deleteResolve = null;
    }
    set({
      deleteModal: {
        isOpen: false,
        data: {},
      },
    });
  },
  closeEnabledModal: (confirmed: boolean) => {
    if (enabledResolve) {
      enabledResolve(confirmed);
      enabledResolve = null;
    }
    set({
      enabledModal: {
        isOpen: false,
        data: {},
      },
    });
  },
  closeDownloadModal: (result: { id: number; version: string } | null) => {
    if (downloadResolve) {
      downloadResolve(result);
      downloadResolve = null;
    }
    set({
      downloadModal: {
        isOpen: false,
        data: { versions: [] },
      },
    });
  },
}));
