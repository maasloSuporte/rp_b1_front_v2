import DeleteModal from './DeleteModal';
import EnabledModal from './EnabledModal';
import DownloadModal from './DownloadModal';
import { useModalStore } from '../../services/modal.service';

export default function ModalProvider() {
  const deleteModal = useModalStore((state) => state.deleteModal);
  const enabledModal = useModalStore((state) => state.enabledModal);
  const downloadModal = useModalStore((state) => state.downloadModal);
  const closeDeleteModal = useModalStore((state) => state.closeDeleteModal);
  const closeEnabledModal = useModalStore((state) => state.closeEnabledModal);
  const closeDownloadModal = useModalStore((state) => state.closeDownloadModal);

  return (
    <>
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        data={deleteModal.data}
      />
      <EnabledModal
        isOpen={enabledModal.isOpen}
        onClose={closeEnabledModal}
        data={enabledModal.data}
      />
      <DownloadModal
        isOpen={downloadModal.isOpen}
        onClose={closeDownloadModal}
        data={downloadModal.data}
      />
    </>
  );
}
