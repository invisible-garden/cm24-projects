const Toast = ({ message }: { message: string }) => {
  return (
    <div className="fixed top-0 left-0 w-full flex justify-center">
      <div className="bg-blue-500 text-white p-4 rounded-md">{message}</div>
    </div>
  );
};

export default Toast;
