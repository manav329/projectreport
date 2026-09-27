import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Camera } from 'lucide-react';

const ImageUploader = ({ onImageSelected }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const inputBrowseRef = useRef(null);
  const inputCameraRef = useRef(null);

  // Cleanup object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFile = (file) => {
    setError(null);
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WEBP).');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB.');
      return;
    }

    // Pass validation
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    if (onImageSelected) {
      onImageSelected(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
    // Reset input value so the same file can be selected again if cleared
    e.target.value = '';
  };

  const onClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setError(null);
    
    if (onImageSelected) {
      onImageSelected(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-white p-2">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-auto max-h-96 object-cover rounded-md" 
          />
          <button
            onClick={onClear}
            className="absolute top-4 right-4 p-1.5 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full transition-colors"
            title="Clear image"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div 
          className={`relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors cursor-pointer ${
            dragActive ? "border-brand-500 bg-brand-50" : "border-slate-300 hover:bg-slate-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputBrowseRef.current?.click()}
        >
          <Upload className={`w-10 h-10 mb-4 ${dragActive ? "text-brand-500" : "text-slate-400"}`} />
          <p className="text-base font-medium text-slate-700 text-center mb-1">
            Drag and drop a leaf image, or click to browse
          </p>
          <p className="text-sm text-slate-500 text-center mb-5">
            JPEG, PNG, WEBP up to 10MB
          </p>
          
          <input
            ref={inputBrowseRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
          />
          <input
            ref={inputCameraRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            onChange={handleChange}
          />
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              inputCameraRef.current?.click();
            }}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors px-4 py-2 font-medium"
          >
            <Camera size={18} />
            Use Camera
          </button>
        </div>
      )}
      
      {error && (
        <p className="mt-3 text-sm text-red-600 font-medium text-center">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;
