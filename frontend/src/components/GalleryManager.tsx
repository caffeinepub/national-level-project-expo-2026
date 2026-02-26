import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, Trash2, Image, Loader2, X } from 'lucide-react';
import { useGetGalleryImages, useAddGalleryImage, useDeleteGalleryImage } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function GalleryManager() {
  const { data: images = [], isLoading } = useGetGalleryImages();
  const { mutate: addImage, isPending: isUploading } = useAddGalleryImage();
  const { mutate: deleteImage, isPending: isDeleting } = useDeleteGalleryImage();
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const buf = ev.target?.result as ArrayBuffer;
      setFileData(new Uint8Array(buf));
      setPreview(URL.createObjectURL(file));
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = () => {
    if (!fileData || !title.trim()) {
      toast.error('Please provide a title and select an image.');
      return;
    }
    addImage({ title: title.trim(), imageBlob: fileData }, {
      onSuccess: () => {
        toast.success('Image uploaded!');
        setTitle('');
        setPreview(null);
        setFileData(null);
        if (fileRef.current) fileRef.current.value = '';
      },
      onError: () => toast.error('Upload failed.'),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this image?')) {
      deleteImage(id, {
        onSuccess: () => toast.success('Image deleted.'),
        onError: () => toast.error('Delete failed.'),
      });
    }
  };

  return (
    <div className="rounded-2xl p-5"
      style={{ background: 'oklch(0.13 0.04 145)', border: '1px solid oklch(0.26 0.07 145)' }}>
      <h2 className="text-lg font-bold text-foreground mb-4">Gallery Management</h2>

      {/* Upload Form */}
      <div className="rounded-xl p-4 mb-6"
        style={{ background: 'oklch(0.16 0.05 145)', border: '1px solid oklch(0.3 0.09 145)' }}>
        <h3 className="text-sm font-semibold text-foreground mb-3">Upload New Image</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Image title..."
            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'oklch(0.18 0.05 145)', border: '1px solid oklch(0.32 0.09 145)', color: 'oklch(0.9 0.05 145)' }}
          />
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ background: 'oklch(0.22 0.07 145)', color: 'oklch(0.75 0.15 145)', border: '1px solid oklch(0.35 0.1 145)' }}>
            <Image className="w-4 h-4" />
            Choose Image
          </button>
          <button onClick={handleUpload} disabled={isUploading || !fileData || !title.trim()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            style={{ background: 'oklch(0.45 0.16 145)', color: 'oklch(0.95 0.02 145)' }}>
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {preview && (
          <div className="mt-3 relative inline-block">
            <img src={preview} alt="Preview" className="h-24 w-auto rounded-lg object-cover" />
            <button onClick={() => { setPreview(null); setFileData(null); if (fileRef.current) fileRef.current.value = ''; }}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'oklch(0.4 0.15 25)', color: 'white' }}>
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12">
          <Image className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: 'oklch(0.6 0.12 145)' }} />
          <p className="text-muted-foreground text-sm">No images uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map(img => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square"
              style={{ border: '1px solid oklch(0.28 0.08 145)' }}>
              <img src={img.imageBlob.getDirectURL()} alt={img.title}
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'oklch(0.1 0.04 145 / 0.85)' }}>
                <p className="text-xs text-foreground font-medium px-2 text-center mb-2">{img.title}</p>
                <button onClick={() => handleDelete(img.id)} disabled={isDeleting}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors"
                  style={{ background: 'oklch(0.35 0.15 25)', color: 'oklch(0.9 0.05 25)' }}>
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
