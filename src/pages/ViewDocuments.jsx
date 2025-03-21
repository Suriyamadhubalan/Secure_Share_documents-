import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";
import DocumentCard from "../components/DocumentCard";

export default function ViewDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from("documents").list(user.id + "/");

    if (error) {
      console.error("Error fetching documents:", error.message);
    } else {
      setDocuments(data || []);
      setFilteredDocuments(data || []);
    }
    setLoading(false);
  };

  // Function to remove deleted document from UI
  const handleDocumentDelete = (deletedFileName) => {
    setDocuments((prevDocs) => prevDocs.filter((file) => file.name !== deletedFileName));
    setFilteredDocuments((prevDocs) => prevDocs.filter((file) => file.name !== deletedFileName));
  };

  // Handle search filtering and sorting
  useEffect(() => {
    let filtered = documents.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorting function that removes leading numbers before sorting
    const cleanFileName = (name) => name.replace(/^\d+-/, ""); // Remove numbers before sorting

    if (sortOption === "name-asc") {
      filtered.sort((a, b) => cleanFileName(a.name).localeCompare(cleanFileName(b.name)));
    } else if (sortOption === "name-desc") {
      filtered.sort((a, b) => cleanFileName(b.name).localeCompare(cleanFileName(a.name)));
    } else if (sortOption === "date-newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOption === "date-oldest") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    setFilteredDocuments(filtered);
  }, [searchQuery, documents, sortOption]);


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Documents</h2>
        <div className="flex space-x-4">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="" disabled>Sort By</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="date-newest">Date (Newest First)</option>
            <option value="date-oldest">Date (Oldest First)</option>
          </select>

          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded w-1/2"
          />
        </div>
      </div>
      
      {loading ? (
        <p>Loading documents...</p>
      ) : filteredDocuments.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDocuments.map((file) => {
            // Remove leading numbers (digits followed by a hyphen) using regex
            const cleanedName = file.name.replace(/^\d+-/, '');

            return (
              <DocumentCard
                key={file.name}
                file={{ name: cleanedName, path: `${user.id}/${file.name}` }}
                onDelete={handleDocumentDelete} // Pass function to remove from UI
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
