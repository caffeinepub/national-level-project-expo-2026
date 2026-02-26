import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  useGetRegistrations,
  useDeleteRegistration,
  useGetGalleryImages,
  useAddGalleryImage,
  useDeleteGalleryImage,
  useGetRegistrationCount,
} from '../hooks/useQueries';
import { Registration } from '../backend';
import { ExternalBlob } from '../backend';
import AdminContentManagement from '../components/AdminContentManagement';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, LogOut, Users, FileText, Image, Search, Trash2, Upload, X } from 'lucide-react';

type TabType = 'registrations' | 'content' | 'gallery';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<TabType>('registrations');
  const [searchQuery, setSearchQuery] = useState('');
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);

  const { data: registrations = [], isLoading: regLoading } = useGetRegistrations();
  const { data: registrationCount } = useGetRegistrationCount();
  const { data: galleryImages = [], isLoading: galleryLoading } = useGetGalleryImages();
  const deleteRegistration = useDeleteRegistration();
  const addGalleryImage = useAddGalleryImage();
  const deleteGalleryImage = useDeleteGalleryImage();

  const handleLogout = () => {
    logout();
    navigate({ to: '/admin/login' });
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const q = searchQuery.toLowerCase();
    return (
      reg.fullName.toLowerCase().includes(q) ||
      reg.email.toLowerCase().includes(q) ||
      reg.collegeName.toLowerCase().includes(q) ||
      reg.projectTitle.toLowerCase().includes(q)
    );
  });

  const handleGalleryUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFile || !galleryTitle.trim()) return;

    const arrayBuffer = await galleryFile.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => setUploadProgress(pct));

    await addGalleryImage.mutateAsync({ title: galleryTitle.trim(), imageBlob: blob });
    setGalleryTitle('');
    setGalleryFile(null);
    setUploadProgress(null);
  };

  const analyticsCards = [
    {
      label: 'Total Registrations',
      value: registrationCount !== undefined ? Number(registrationCount) : '—',
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Gallery Images',
      value: galleryImages.length,
      icon: Image,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'Filtered Results',
      value: filteredRegistrations.length,
      icon: Search,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      label: 'Content Sections',
      value: 5,
      icon: FileText,
      color: 'text-success',
      bg: 'bg-success/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-foreground">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">Innovative Link Expo 2K26</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Analytics cards with staggered bounce-in */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {analyticsCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bounce-in bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-5 hover:border-primary/30 transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-black text-foreground tabular-nums">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-card/40 p-1 rounded-xl border border-border w-fit">
          {([
            { id: 'registrations', label: 'Registrations', icon: Users },
            { id: 'content', label: 'Content', icon: FileText },
            { id: 'gallery', label: 'Gallery', icon: Image },
          ] as { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search registrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card/60 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {regLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No registrations found</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-card/80 border-b border-border">
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Name</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Email</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">College</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Project</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">Category</th>
                      <th className="text-right px-4 py-3 text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map((reg, i) => (
                      <tr
                        key={String(reg.id)}
                        className="border-b border-border/50 hover:bg-card/40 transition-colors"
                      >
                        <td className="px-4 py-3 text-foreground font-medium">{reg.fullName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{reg.email}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{reg.collegeName}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell max-w-[200px] truncate">{reg.projectTitle}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                            {reg.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Registration</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the registration for <strong>{reg.fullName}</strong>? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteRegistration.mutate(reg.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && <AdminContentManagement />}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            {/* Upload form */}
            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Image
              </h3>
              <form onSubmit={handleGalleryUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Image Title</label>
                  <input
                    type="text"
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                    placeholder="Enter image title..."
                    className="w-full px-4 py-2.5 bg-background/60 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGalleryFile(e.target.files?.[0] ?? null)}
                    className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                    required
                  />
                </div>
                {uploadProgress !== null && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={addGalleryImage.isPending || !galleryFile || !galleryTitle.trim()}
                  className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {addGalleryImage.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Upload Image</>
                  )}
                </button>
              </form>
            </div>

            {/* Gallery grid */}
            {galleryLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Image className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No gallery images yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((img) => (
                  <div key={img.id} className="group relative rounded-xl overflow-hidden border border-border aspect-square bg-card/40">
                    <img
                      src={img.imageBlob.getDirectURL()}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3">
                      <p className="text-foreground text-xs font-medium text-center line-clamp-2">{img.title}</p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="flex items-center gap-1.5 bg-destructive/90 text-destructive-foreground text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-destructive transition-colors">
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Image</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "<strong>{img.title}</strong>"? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteGalleryImage.mutate(img.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
