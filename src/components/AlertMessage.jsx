export default function AlertMessage({ message, color }) {
  const colorClasses = {
    red: "bg-red-600",
    green: "bg-green-600"
  };

  return (
    <div
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 text-sm text-white ${
        colorClasses[color] || "bg-gray-600"
      } rounded-lg shadow-lg z-50`}
      role="alert"
    >
      <span className="font-medium">{message}</span>
    </div>
  );
}
