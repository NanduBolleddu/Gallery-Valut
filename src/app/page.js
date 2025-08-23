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
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-12 px-4">
      {/* Logo */}
      <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight text-center">
        Gallery Vault
      </h1>
      <p className="text-gray-400 text-lg mb-10 text-center">
        Securely store, view, and manage your files in the cloud.
      </p>

      {/* Files header + Upload */}
      <div className="w-full max-w-7xl mb-8">
        <div className="flex justify-between items-center p-6 bg-slate-800/30 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <svg
                className="w-6 h-6 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-300">Files</h1>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white font-medium rounded-xl hover:shadow-lg hover:shadow-slate-700/30 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-slate-600/50 group"
          >
            <span className="text-lg font-bold transition-transform duration-200 group-hover:rotate-90">
              +
            </span>
            Upload File
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-lg relative overflow-hidden transform animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Header */}
            <div className="relative bg-slate-800/50 border-b border-slate-700/50 px-6 py-4">
              <button
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors duration-200 p-1 hover:bg-slate-700/50 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
              <div className="pr-10">
                <h2 className="text-xl font-semibold text-white mb-1">
                  Upload File
                </h2>
                <p className="text-sm text-slate-400">
                  Select a file and optionally rename it before uploading
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-5">
              {/* File Input with Custom Styling */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Select Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    disabled={loading}
                  />
                  <div className="flex items-center justify-between w-full px-4 py-3 border-2 border-dashed border-slate-600 hover:border-blue-500/50 rounded-xl bg-slate-800/50 hover:bg-slate-800/80 transition-all duration-200 cursor-pointer group hover:shadow-lg hover:shadow-blue-500/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                        <svg
                          className="w-5 h-5 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-300">
                          {uploadFile ? uploadFile.name : "Choose an image"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {uploadFile
                            ? `${(uploadFile.size / 1024 / 1024).toFixed(2)} MB`
                            : "JPG, PNG, GIF, WEBP, SVG supported"}
                        </p>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-slate-400 group-hover:text-slate-300 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Custom Name Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  File Name <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter custom name..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 focus:shadow-lg focus:shadow-blue-500/10"
                />
              </div>

              {/* Upload Button */}
              <button
                onClick={uploadHandler}
                disabled={loading || !uploadFile}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Upload File
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-3xl relative overflow-hidden transform animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Header */}
            <div className="relative bg-slate-800/50 border-b border-slate-700/50 px-6 py-4 flex justify-between items-center">
              <h2
                className="text-xl font-semibold text-white truncate"
                title={selectedImage}
              >
                {selectedImage}
              </h2>
              <button
                className="text-slate-400 hover:text-white transition-colors duration-200 p-1 hover:bg-slate-700/50 rounded-lg"
                onClick={() => setSelectedImage(null)}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <img
                  src={`/api/gallery/download?key=${encodeURIComponent(
                    selectedImage
                  )}`}
                  alt={selectedImage}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/800x600?text=Image+Not+Found";
                  }}
                />
              </div>
              <div className="mt-4 flex gap-4">
                <a
                  href={`/api/gallery/download?key=${encodeURIComponent(
                    selectedImage
                  )}`}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium rounded-xl transition-all duration-200"
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  Download
                </a>
                <button
                  onClick={() => {
                    deleteImage(selectedImage);
                    setSelectedImage(null);
                  }}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      )}

      {/* Media section header */}
      <div className="w-full max-w-7xl flex justify-between items-center mb-6">
        <p className="text-sm text-slate-400 mt-1">
          Manage your uploaded images and media files
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 rounded-xl shadow-lg transition-all duration-200 ${
              viewMode === "grid"
                ? "bg-blue-600 text-white shadow-blue-500/20"
                : "bg-slate-800/50 text-slate-300 hover:bg-slate-800/80 hover:text-white hover:shadow-lg hover:shadow-blue-500/10"
            }`}
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2.5 rounded-xl shadow-lg transition-all duration-200 ${
              viewMode === "list"
                ? "bg-blue-600 text-white shadow-blue-500/20"
                : "bg-slate-800/50 text-slate-300 hover:bg-slate-800/80 hover:text-white hover:shadow-lg hover:shadow-blue-500/10"
            }`}
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="w-full max-w-7xl">
        {images.length === 0 ? (
          <p className="text-center text-lg text-gray-400 font-medium">
            No files yet. Click{" "}
            <span className="font-semibold text-blue-400">Upload File</span> to
            get started!
          </p>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((key, index) => (
              <div
                key={key}
                className="group relative rounded-2xl shadow-lg hover:shadow-xl hover:shadow-blue-500/10 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(key)}
              >
                {/* Image Preview - Takes most space */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={`/api/gallery/download?key=${encodeURIComponent(key)}`}
                    alt={key}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Image+Not+Found";
                    }}
                  />

                  {/* Stylish Three Dots Menu - Top Right */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === index ? null : index);
                        }}
                        className={`
                w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 
                flex items-center justify-center
                hover:bg-slate-800/90 hover:border-slate-600/70 
                hover:shadow-lg hover:shadow-blue-500/20 hover:scale-110
                active:scale-95 active:shadow-blue-500/30
                transition-all duration-200 shadow-lg group/btn
                ${
                  activeMenu === index
                    ? "bg-blue-600/80 border-blue-500/50 shadow-blue-500/30"
                    : ""
                }
              `}
                      >
                        <svg
                          className={`
                  w-4 h-4 transition-all duration-200
                  ${
                    activeMenu === index
                      ? "text-white rotate-90"
                      : "text-slate-300 group-hover/btn:text-white group-hover/btn:rotate-90"
                  }
                `}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01"
                          />
                        </svg>
                      </button>
                      {/* Dropdown Menu */}
                      {activeMenu === index && (
                        <div className="absolute top-full right-0 mt-2 w-40 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/20 z-10 overflow-hidden">
                          <a
                            href={`/api/gallery/download?key=${encodeURIComponent(
                              key
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
                                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                              />
                            </svg>
                            Download
                          </a>
                          <button
                            onClick={() => {
                              deleteImage(key);
                              setActiveMenu(null);
                            }}
                            disabled={loading}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
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
                </div>

                {/* Simplified Description Section */}
                <div className="p-4">
                  <h3
                    className="text-sm font-medium text-slate-300 truncate"
                    title={key}
                  >
                    {key}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-700/50">
                  <th className="py-4 px-6 text-left text-sm font-medium text-slate-300">
                    File Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {images.map((key, index) => (
                  <tr
                    key={key}
                    className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-all duration-200 group cursor-pointer"
                    onClick={() => setSelectedImage(key)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <span className="text-slate-300 font-medium">
                            {key}
                          </span>
                        </div>

                        {/* Three Dots Menu */}
                        <div className="relative opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(
                                activeMenu === index ? null : index
                              );
                            }}
                            className={`
                    w-8 h-8 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 
                    flex items-center justify-center
                    hover:bg-slate-700/90 hover:border-slate-600/70 
                    hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105
                    active:scale-95 active:shadow-blue-500/30
                    transition-all duration-200 shadow-md group/btn
                    ${
                      activeMenu === index
                        ? "bg-blue-600/80 border-blue-500/50 shadow-blue-500/30 opacity-100"
                        : ""
                    }
                  `}
                          >
                            <svg
                              className={`
                      w-4 h-4 transition-all duration-200
                      ${
                        activeMenu === index
                          ? "text-white rotate-90"
                          : "text-slate-400 group-hover/btn:text-white group-hover/btn:rotate-90"
                      }
                    `}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01"
                              />
                            </svg>
                          </button>

                          {/* Dropdown Menu with Smart Positioning */}
                          {activeMenu === index && (
                            <div
                              className={`
                    absolute right-0 w-40 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/20 z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in-0 duration-200
                    ${
                      index >= images.length - 2
                        ? "bottom-full mb-2"
                        : "top-full mt-2"
                    }
                  `}
                            >
                              <a
                                href={`/api/gallery/download?key=${encodeURIComponent(
                                  key
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
                                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                  />
                                </svg>
                                Download
                              </a>
                              <button
                                onClick={() => {
                                  deleteImage(key);
                                  setActiveMenu(null);
                                }}
                                disabled={loading}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
