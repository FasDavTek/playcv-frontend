import { Button } from '@video-cv/ui-components';

const DeleteVideoConfirmationModal = ({
  onClose,
}: {
  onClose: (e?: any) => void;
}) => {
  return (
    <div className="bg-white p-10 lg:p-14 centered-modal-md rounded-lg">
      <p className="text-center text-gray-500 text-lg my-4">
        Are you sure you want to delete this video?
      </p>
      <div className="flex gap-4 justify-center mt-3">
        <Button
          className="text-white bg-red-500"
          label="Cancel"
          onClick={onClose}
        />
        <Button
          className="bg-green-500 text-white "
          label="Accept"
          onClick={() => {
            ('');
          }}
        />
      </div>
    </div>
  );
};

export default DeleteVideoConfirmationModal;
