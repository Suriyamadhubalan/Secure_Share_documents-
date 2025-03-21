import { useState } from "react";
import { supabase } from "../supabase"; // Import Supabase client
import { useAuth } from "../context/AuthContext"; // Import Auth Context
import { FaTimes } from "react-icons/fa"; // Import close icon
import AlertMessage from "../components/AlertMessage";

export default function Upload() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [alert, setAlert] = useState(null);

  const showAlert = (message, color) => {
    setAlert({ message, color });
    setTimeout(() => setAlert(null), 3000); // Auto-hide after 2s
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadToSupabase = async () => {
    if (!user || files.length === 0) return showAlert("Files uploaded successfully!", "green")
    setUploading(true);
    
    for (const file of files) {
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("documents").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });
      if (error) {
        // alert("Upload failed: " + error.message);
        showAlert("Files uploaded successfully!" + error.message, "red")
      }
    }
    showAlert("Files uploaded successfully!", "green")
    // alert("Files uploaded successfully!");
    setFiles([]);
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Upload Documents</h2>

      {/* Drag and Drop Area */}
      <div
        className={`w-200 h-90 flex items-center justify-center border-2 border-dashed rounded-lg mb-4 transition 
          ${isDragging ? "bg-gray-700 border-yellow-500" : "bg-gray-900 border-gray-500"}`}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const droppedFiles = Array.from(e.dataTransfer.files);
          setFiles([...files, ...droppedFiles]);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        <span className="text-gray-400">Drag & Drop Files Here</span>
      </div>

      {/* Select Files Button */}
      <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition">
        Select Files
        <input type="file" multiple onChange={handleFileChange} className="hidden" />
      </label>

      {/* Selected Files List */}
      <ul className="mt-4 w-80">
        {files.map((file, index) => (
          <li key={index} className="flex justify-between items-center bg-gray-800 p-2 rounded-lg mb-2">
            <span>{file.name}</span>
            <button onClick={() => removeFile(index)} className="text-red-400 hover:text-red-600">
              <FaTimes />
            </button>
          </li>
        ))}
      </ul>

      {/* Upload Button (Only Visible If Files Selected) */}
      {files.length > 0 && (
        <button
          onClick={uploadToSupabase}
          disabled={uploading}
          className="mt-4 bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-yellow-600 transition"
        >
          {uploading ? "Uploading..." : "Upload to Supabase"}
        </button>
      )}
      {alert && <AlertMessage {...alert} />}
    </div>
  );
}
