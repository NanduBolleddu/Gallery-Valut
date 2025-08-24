"use client";
import { useEffect, useState } from "react";
import {
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [customName, setCustomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [showModal, setShowModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For detailed view

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all", "jpg", "png", "gif", "webp", "svg"
  const [sortBy, setSortBy] = useState("newest"); // "newest", "oldest", "a-z", "z-a"

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".relative")) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch images
  const fetchImages = async () => {
    const res = await fetch("/api/gallery");
    const data = await res.json();
    setImages(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Upload handler
  const uploadHandler = async () => {
    if (!uploadFile) return alert("Select a file first");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", uploadFile, customName || uploadFile.name);

    await fetch("/api/gallery/upload", {
      method: "POST",
      body: formData,
    });

    setUploadFile(null);
    setCustomName("");
    setShowModal(false);
    await fetchImages();
    setLoading(false);
  };

  // Delete handler
  const deleteImage = async (key) => {
    setLoading(true);
    await fetch(`/api/gallery/delete?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
    });
    await fetchImages();
    setSelectedImage(null); // Close detailed view if open
    setLoading(false);
  };

  // Get file extension
  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  // Filter and search images
  const filteredImages = images.filter((image) => {
    const matchesSearch = image
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const extension = getFileExtension(image);
    const matchesFilter = filterType === "all" || extension === filterType;
    return matchesSearch && matchesFilter;
  });

  // Sort images
  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortBy === "a-z") {
      return a.localeCompare(b);
    } else if (sortBy === "z-a") {
      return b.localeCompare(a);
    } else if (sortBy === "newest") {
      return b.localeCompare(a);
    } else if (sortBy === "oldest") {
      return a.localeCompare(b);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                Gallery Vault
              </h1>
              <p className="text-slate-400 mt-1">
                Securely store, view, and manage your images in the cloud.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Upload Image
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          {/* Search Bar - Left Side */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filters - Right Side */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Image Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Images</option>
              <option value="jpg">JPG</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="gif">GIF</option>
              <option value="webp">WEBP</option>
              <option value="svg">SVG</option>
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
                title="Grid View"
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
                title="List View"
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-slate-400 text-sm">
            {searchTerm || filterType !== "all" ? (
              <>
                Showing {sortedImages.length} of {images.length} images
                {searchTerm && <span> matching "{searchTerm}"</span>}
                {filterType !== "all" && (
                  <span> • {filterType.toUpperCase()} only</span>
                )}
              </>
            ) : (
              `${images.length} images total`
            )}
          </p>
        </div>

        {/* Gallery Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-slate-400 mt-4">Loading...</p>
          </div>
        ) : sortedImages.length === 0 ? (
          searchTerm || filterType !== "all" ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-slate-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-slate-400 text-lg mb-4">
                No images match your search criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-slate-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-slate-400 text-lg mb-4">
                No images yet. Start building your gallery!
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
              >
                Upload Your First Image
              </button>
            </div>
          )
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sortedImages.map((image, index) => (
              <div
                key={image}
                className="group relative bg-slate-800/30 rounded-xl overflow-hidden hover:bg-slate-800/50 transition-all duration-200 border border-slate-700/30 hover:border-slate-600/50"
              >
                <div
                  className="aspect-square bg-slate-700/50 flex items-center justify-center cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={`/api/gallery/download?key=${encodeURIComponent(
                      image
                    )}`}
                    alt={image}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    style={{ display: "none" }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <svg
                      className="w-12 h-12 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="p-4">
                  <h3
                    className="text-sm font-medium text-white truncate"
                    title={image}
                  >
                    {image}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    .{getFileExtension(image).toUpperCase()}
                  </p>
                </div>

                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === index ? null : index);
                    }}
                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2  0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  {activeMenu === index && (
                    <div
                      className={`absolute right-0 w-48 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-xl z-50 ${
                        index >= sortedImages.length - 2
                          ? "bottom-full mb-2"
                          : "top-full mt-2"
                      }`}
                    >
                      <a
                        href={`/api/gallery/download?key=${encodeURIComponent(
                          image
                        )}`}
                        onClick={() => setActiveMenu(null)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 border-b border-slate-700/30"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download
                      </a>
                      <button
                        onClick={() => {
                          deleteImage(image);
                          setActiveMenu(null);
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200 w-full text-left"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-slate-800/30 rounded-xl overflow-hidden border border-slate-700/30">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Image Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                    Type
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {sortedImages.map((image, index) => (
                  <tr
                    key={image}
                    className="hover:bg-slate-800/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700/50 flex-shrink-0">
                          <img
                            src={`/api/gallery/download?key=${encodeURIComponent(
                              image
                            )}`}
                            alt={image}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div
                            style={{ display: "none" }}
                            className="w-full h-full flex items-center justify-center"
                          >
                            <svg
                              className="w-6 h-6 text-slate-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 

2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium">{image}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      .{getFileExtension(image).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/api/gallery/download?key=${encodeURIComponent(
                            image
                          )}`}
                          className="text-blue-400 hover:text-blue-300 p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                          title="Download"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </a>
                        <button
                          onClick={() => deleteImage(image)}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                          title="Delete"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Upload Image
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <p className="text-slate-400 text-sm mt-2">
                Select an image and optionally rename it before uploading
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-slate-500 transition-colors"
                >
                  <svg
                    className="w-8 h-8 text-slate-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm text-slate-300">
                    {uploadFile ? uploadFile.name : "Choose an image"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {uploadFile
                      ? `${(uploadFile.size / 1024 / 1024).toFixed(2)} MB`
                      : "JPG, PNG, GIF, WEBP, SVG supported"}
                  </p>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Custom Name (Optional)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Enter custom filename..."
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-700/50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={uploadHandler}
                disabled={!uploadFile || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-700/50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2
                  className="text-xl font-semibold text-white truncate"
                  title={selectedImage}
                >
                  {selectedImage}
                </h2>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <p className="text-slate-400 text-sm mt-2">
                Image Type: {getFileExtension(selectedImage).toUpperCase()}
              </p>
            </div>

            <div className="flex-grow overflow-auto p-6">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={`/api/gallery/download?key=${encodeURIComponent(
                    selectedImage
                  )}`}
                  alt={selectedImage}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  style={{ display: "none" }}
                  className="w-full h-64 flex items-center justify-center bg-slate-700/50 rounded-lg"
                >
                  <svg
                    className="w-16 h-16 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-700/50 flex justify-end gap-3 flex-shrink-0">
              <a
                href={`/api/gallery/download?key=${encodeURIComponent(
                  selectedImage
                )}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download
              </a>
              <button
                onClick={() => deleteImage(selectedImage)}
                className="bg-red-900/20 hover:bg-red-900/30 text-red-400 hover:text-red-300 px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
