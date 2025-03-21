import { FaDownload, FaTrash, FaShareAlt, FaFilePdf, FaFileImage, FaFileWord, FaFileExcel, FaFileAlt, FaEdit, FaCheck } from "react-icons/fa";
import { useState } from "react";
import { supabase } from "../supabase"; // Import Supabase client
import AlertMessage from "./AlertMessage";

export default function DocumentCard({ file, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const [alert, setAlert] = useState(null);

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FaFilePdf size={40} className="text-red-500" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <FaFileImage size={40} className="text-yellow-500" />;
      case "doc":
      case "docx":
        return <FaFileWord size={40} className="text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FaFileExcel size={40} className="text-green-500" />;
      default:
        return <FaFileAlt size={40} className="text-gray-400" />;
    }
  };

  const showAlert = (message, color) => {
    setAlert({ message, color });
    setTimeout(() => setAlert(null), 3000); // Auto-hide after 2s
  };

  const handlePreview = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(file.path, 3600);

    if (error) {
      // alert("Preview failed: " + error.message);
      showAlert("Preview failed: " + error.message, "red");
    } else {
      window.open(data.signedUrl, "_blank"); // Open in a new tab
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(file.path, 60);

    if (error) {
      // alert("Download failed: " + error.message);
      showAlert("Download failed: " + error.message, "red");
    } else {
      const response = await fetch(data.signedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this document?");
    if (!confirmDelete) return;

    setLoading(true);
    const { error } = await supabase.storage.from("documents").remove([file.path]);

    if (error) {
      // alert("Delete failed: " + error.message);
      showAlert("Delete failed: " + error.message, "red");
    } else {
      // alert("File deleted successfully!");
      showAlert("File deleted successfully!", "green");
      onDelete(file.name); // Remove from UI after successful deletion
    }
    setLoading(false);
  };

  const handleShare = async () => {
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(file.path, 3600);

    if (error) {
      // alert("Error generating shareable link: " + error.message);
      showAlert("Error generating shareable link: " + error.message, "red");
    } else {
      navigator.clipboard.writeText(data.signedUrl);
      // alert("Shareable link copied to clipboard!");
      showAlert("Shareable link copied to clipboard!", "green");
    }
  };

  const handleRename = async () => {
    if (!newName.trim() || newName === file.name) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    
    const userId = file.path.split("/")[0]; // Extract user ID folder
    const newFilePath = `${userId}/${newName}`;
    
    // Copy file to new location
    const { data, error } = await supabase.storage.from("documents").move(file.path, newFilePath);

    if (error) {
      // alert("Rename failed: " + error.message);
      // showAlert("Rename failed: " + error.message, "red");
      console.log(error)
    } else {
      // alert("File renamed successfully!");
      showAlert("File renamed successfully!", "green");
      file.name = newName; // Update UI state
      file.path = newFilePath;
    }

    setLoading(false);
    setIsEditing(false);
  };

  return (
    <div 
      className="p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
      onDoubleClick={handlePreview} // Opens preview in a new tab
    >
      <div className="flex justify-center mb-2">
        {getFileIcon(file.name)}
      </div>
      <div className="flex items-center justify-center">
        {isEditing ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename} // Save on blur
            onKeyDown={(e) => e.key === "Enter" && handleRename()} // Save on Enter
            className="text-white bg-gray-700 p-1 rounded w-full text-center"
            autoFocus
          />
        ) : (
          <h3 className="text-white truncate text-center">{file.name}</h3>
        )}
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-gray-200 ml-2">
            <FaEdit size={16} />
          </button>
        ) : (
          <button onClick={handleRename} className="text-green-400 hover:text-green-200 ml-2">
            <FaCheck size={16} />
          </button>
        )}
      </div>
      <div className="flex justify-between items-center mt-3">
        <button onClick={handleDownload} disabled={loading} className="text-green-400 hover:text-green-600">
          <FaDownload size={20} />
        </button>
        <button onClick={handleShare} className="text-blue-400 hover:text-blue-600">
          <FaShareAlt size={20} />
        </button>
        <button onClick={handleDelete} disabled={loading} className="text-red-400 hover:text-red-600">
          <FaTrash size={20} />
        </button>
      </div>
      {alert && <AlertMessage {...alert} />}
    </div>
  );
}
