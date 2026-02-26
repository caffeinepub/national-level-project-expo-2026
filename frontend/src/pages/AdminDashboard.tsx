import { useState, useEffect, useRef } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LogOut,
  Search,
  Download,
  Trash2,
  Users,
  ImageIcon,
  Settings,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import AdminContentManagement from '../components/AdminContentManagement';
import type { Registration } from '../backend';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdminAuthenticated, adminLogout } = useAdminAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: registrations, isLoading: registrationsLoading } = useGetRegistrations();
  const { data: registrationCount } = useGetRegistrationCount();
  const { data: galleryImages, isLoading: galleryLoading } = useGetGalleryImages();
  const { mutate: deleteRegistration, isPending: isDeleting } = useDeleteRegistration();
  const { mutate: addGalleryImage, isPending: isUploading } = useAddGalleryImage();
  const { mutate: deleteGalleryImage, isPending: isDeletingImage } = useDeleteGalleryImage();

  // Bounce-in animation state for analytics cards
  const [cardsVisible, setCardsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setCardsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate({ to: '/admin' });
    }
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) return null;

  const filteredRegistrations = (registrations || []).filter((reg: Registration) => {
    const q = searchQuery.toLowerCase();
    return (
      reg.fullName.toLowerCase().includes(q) ||
      reg.email.toLowerCase().includes(q) ||
      reg.collegeName.toLowerCase().includes(q) ||
      reg.projectTitle.toLowerCase().includes(q)
    );
  });

  const handleDelete = (id: bigint) => {
    setDeletingId(id);
    deleteRegistration(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  const handleDeleteImage = (id: string) => {
    setDeletingImageId(id);
    deleteGalleryImage(id, {
      onSettled: () => setDeletingImageId(null),
    });
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim()) return;
    const arrayBuffer = await uploadFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    addGalleryImage(
      { title: uploadTitle.trim(), imageData: uint8Array },
      {
        onSuccess: () => {
          setUploadTitle('');
          setUploadFile(null);
          setUploadProgress(0);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
      }
    );
  };

  const exportCSV = () => {
    if (!registrations || registrations.length === 0) return;
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'College', 'Department', 'Project Title', 'Category', 'Abstract', 'Timestamp'];
    const rows = registrations.map((r: Registration) => [
      r.id.toString(),
      r.fullName,
      r.email,
      r.phoneNumber,
      r.collegeName,
      r.department,
      r.projectTitle,
      r.category,
      `"${r.abstract.replace(/"/g, '""')}"`,
      new Date(Number(r.timestamp) / 1_000_000).toLocaleString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registrations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    adminLogout();
    navigate({ to: '/admin' });
  };

  const analyticsCards = [
    { label: 'Total Registrations', value: registrationCount !== undefined ? Number(registrationCount) : '—', icon: Users },
    { label: 'Gallery Images', value: galleryImages ? galleryImages.length : '—', icon: ImageIcon },
    { label: 'Departments', value: registrations ? new Set(registrations.map((r: Registration) => r.department)).size : '—', icon: Settings },
    { label: 'Colleges', value: registrations ? new Set(registrations.map((r: Registration) => r.collegeName)).size : '—', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-xs text-muted-foreground">Innovative Link Expo</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="border-border text-foreground hover:bg-muted">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {analyticsCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.label}
                className={`bg-card border-border transition-all duration-500 ${
                  cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{card.value}</p>
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="registrations">
          <TabsList className="bg-muted border border-border mb-6">
            <TabsTrigger value="registrations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Registrations
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ImageIcon className="w-4 h-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
          </TabsList>

          {/* Registrations Tab */}
          <TabsContent value="registrations">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                <CardTitle className="text-foreground">Registrations</CardTitle>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-background border-border text-foreground w-56"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportCSV}
                    className="border-border text-foreground hover:bg-muted"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {registrationsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                  </div>
                ) : filteredRegistrations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">No registrations found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="text-left py-3 px-2">Name</th>
                          <th className="text-left py-3 px-2">Email</th>
                          <th className="text-left py-3 px-2">College</th>
                          <th className="text-left py-3 px-2">Project</th>
                          <th className="text-left py-3 px-2">Category</th>
                          <th className="text-left py-3 px-2">Date</th>
                          <th className="text-left py-3 px-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRegistrations.map((reg: Registration) => (
                          <tr key={reg.id.toString()} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-2 font-medium text-foreground">{reg.fullName}</td>
                            <td className="py-3 px-2 text-muted-foreground">{reg.email}</td>
                            <td className="py-3 px-2 text-muted-foreground">{reg.collegeName}</td>
                            <td className="py-3 px-2 text-muted-foreground max-w-[150px] truncate">{reg.projectTitle}</td>
                            <td className="py-3 px-2">
                              <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                                {reg.category}
                              </Badge>
                            </td>
                            <td className="py-3 px-2 text-muted-foreground text-xs">
                              {new Date(Number(reg.timestamp) / 1_000_000).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(reg.id)}
                                disabled={isDeleting && deletingId === reg.id}
                                className="text-destructive hover:bg-destructive/10 h-8 w-8"
                              >
                                {isDeleting && deletingId === reg.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="text-foreground">Upload Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Image title"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-border text-foreground hover:bg-muted"
                    >
                      {uploadFile ? uploadFile.name.slice(0, 20) + (uploadFile.name.length > 20 ? '…' : '') : 'Choose File'}
                    </Button>
                    {uploadFile && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setUploadFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-muted-foreground hover:text-foreground h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading || !uploadFile || !uploadTitle.trim()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Gallery Images</CardTitle>
              </CardHeader>
              <CardContent>
                {galleryLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="aspect-square rounded-lg" />
                    ))}
                  </div>
                ) : !galleryImages || galleryImages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">No images uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {galleryImages.map((image) => (
                      <div key={image.id} className="group relative rounded-lg overflow-hidden border border-border bg-muted aspect-square">
                        <img
                          src={image.imageBlob.getDirectURL()}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                          <p className="text-white text-xs text-center font-medium truncate w-full px-2">{image.title}</p>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteImage(image.id)}
                            disabled={isDeletingImage && deletingImageId === image.id}
                            className="h-7 text-xs"
                          >
                            {isDeletingImage && deletingImageId === image.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3 mr-1" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <AdminContentManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
