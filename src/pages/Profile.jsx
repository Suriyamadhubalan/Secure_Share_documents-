import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Gravatar from "react-gravatar";
import { Camera } from "lucide-react"; // Import camera icon
import { useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    username: "",
    aadhaar: "",
    created_at: "",
    profile_picture: "",
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const showAlert = (message, color) => {
    setAlert({ message, color });
    setTimeout(() => setAlert(null), 3000); // Auto-hide after 2s
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.id) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      showAlert("Failed to fetch profile", "red");
      console.error(error);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("users")
      .update({
        full_name: profile.full_name,
        phone_number: profile.phone_number,
        username: profile.username,
      })
      .eq("id", user.id);

    if (error) {
      showAlert("Failed to update profile", "red");
      console.error(error);
    } else {
      showAlert("Profile updated successfully", "green");
      setEditing(false);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const filePath = `${user.id}/${uploadedFile.name}`; // Create a path inside user's folder
    const { data, error } = await supabase.storage
      .from("profile") // Use the correct bucket name
      .upload(filePath, uploadedFile, { upsert: true });

    if (error) {
      toast.error("Failed to upload image");
      console.error(error);
      return;
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage.from("profile").getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;

    // Update profile state
    setProfile({ ...profile, profile_picture: publicUrl });

    // Save the profile picture URL to the database
    const { error: updateError } = await supabase
      .from("users")
      .update({ profile_picture: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      toast.error("Failed to update profile picture in database");
      console.error(updateError);
    } else {
      toast.success("Profile picture updated successfully");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirect to the home page after logout
  };


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-4xl p-8 bg-gray-800 text-gray-100 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-3xl font-semibold text-yellow-400 mb-6">Profile</h2>
    
        {/* Profile Picture with Camera Icon */}
        <div className="relative flex flex-col items-center mb-6">
          <div className="relative">
            {profile.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt="Profile"
                className="w-32 h-32 rounded-full border-2 border-yellow-400 shadow-md"
              />
            ) : (
              <Gravatar
                email={profile.email}
                size={128}
                className="rounded-full border-2 border-yellow-400 shadow-md"
              />
            )}
    
            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="fileUpload"
            />
    
            {/* Camera Icon Overlay */}
            <label
              htmlFor="fileUpload"
              className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full cursor-pointer shadow-lg border-2 border-gray-800"
            >
              <Camera className="text-gray-900 w-5 h-5" />
            </label>
          </div>
        </div>
    
        {/* Profile Details in Two Columns */}
        <div className="grid grid-cols-2 gap-6 w-full">
          <div>
            <label className="block text-yellow-300 font-medium">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name}
              disabled={!editing}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>
    
          <div>
            <label className="block text-yellow-300 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              disabled
              className="w-full p-2 border rounded bg-gray-600 text-gray-300 cursor-not-allowed"
            />
          </div>
    
          <div>
            <label className="block text-yellow-300 font-medium">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={profile.phone_number}
              disabled={!editing}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>
    
          <div>
            <label className="block text-yellow-300 font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              disabled={!editing}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-700 text-gray-200 focus:ring-2 focus:ring-yellow-400"
            />
          </div>
    
          <div>
            <label className="block text-yellow-300 font-medium">Aadhaar Number</label>
            <input
              type="text"
              name="aadhaar_number"
              value={profile.aadhaar}
              disabled
              className="w-full p-2 border rounded bg-gray-600 text-gray-300 cursor-not-allowed"
            />
          </div>
    
          <div>
            <label className="block text-yellow-300 font-medium">Joined Date</label>
            <input
              type="text"
              name="joined_date"
              value={profile.created_at}
              disabled
              className="w-full p-2 border rounded bg-gray-600 text-gray-300 cursor-not-allowed"
            />
          </div>
        </div>
    
        {/* Buttons */}
        <div className="flex justify-between w-full mt-6">
          {editing ? (
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition shadow-md"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-yellow-500 text-gray-900 px-5 py-2 rounded-lg hover:bg-yellow-600 transition shadow-md"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition shadow-md"
          >
            Logout
          </button>
        </div>
      </div>
      {alert && <AlertMessage {...alert} />}
    </div>
  );  
  
}
