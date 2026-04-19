const RegisterModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 text-center">
        <h2 className="text-lg font-semibold mb-2">Welcome 👋</h2>
        <p className="mb-4">Please register to continue</p>

        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;