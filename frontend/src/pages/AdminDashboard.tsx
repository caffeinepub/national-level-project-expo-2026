import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  useGetAllRegistrations,
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
  ClipboardList,
  Phone,
  Mail,
  BookOpen,
  Building2,
} from 'lucide-react';
import AdminContentManagement from '../components/AdminContentManagement';
import type { RegistrationRecord } from '../backend';

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

  const { data: allRegistrations, isLoading: registrationsLoading } = useGetAllRegistrations();
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

  const filteredRegistrations = (allRegistrations || []).filter((reg: RegistrationRecord) => {
    const q = searchQuery.toLowerCase();
    return (
      reg.fullName.toLowerCase().includes(q) ||
      reg.email.toLowerCase().includes(q) ||
      reg.collegeName.toLowerCase().includes(q) ||
      reg.projectTitle.toLowerCase().includes(q) ||
      reg.category.toLowerCase().includes(q)
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
    const data = allRegistrations;
    if (!data || data.length === 0) return;
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'College', 'Department', 'Project Title', 'Category', 'Abstract', 'Registered On'];
    const rows = data.map((r: RegistrationRecord) => [
      r.id.toString(),
      `"${r.fullName.replace(/"/g, '""')}"`,
      r.email,
      r.phoneNumber,
      `"${r.collegeName.replace(/"/g, '""')}"`,
      `"${r.department.replace(/"/g, '""')}"`,
      `"${r.projectTitle.replace(/"/g, '""')}"`,
      r.category,
      `"${r.abstract.replace(/"/g, '""')}"`,
      new Date(Number(r.timestamp) / 1_000_000).toLocaleString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `registered-teams-${dateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    adminLogout();
    navigate({ to: '/admin' });
  };

  const analyticsCards = [
    {
      label: 'Total Registered Teams',
      value: registrationCount !== undefined ? Number(registrationCount) : '—',
      icon: Users,
      delay: 0,
    },
    {
      label: 'Gallery Images',
      value: galleryImages ? galleryImages.length : '—',
      icon: ImageIcon,
      delay: 100,
    },
    {
      label: 'Departments',
      value: allRegistrations ? new Set(allRegistrations.map((r: RegistrationRecord) => r.department)).size : '—',
      icon: BookOpen,
      delay: 200,
    },
    {
      label: 'Colleges',
      value: allRegistrations ? new Set(allRegistrations.map((r: RegistrationRecord) => r.collegeName)).size : '—',
      icon: Building2,
      delay: 300,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-xs text-muted-foreground">Innovative Link Expo — Content & Team Management</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="border-border text-foreground hover:bg-muted">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {analyticsCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.label}
                className={`bg-card border-border transition-all duration-500 ${
                  cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${card.delay}ms` }}
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
        <Tabs defaultValue="teams">
          <TabsList className="bg-muted border border-border mb-6 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="teams" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ClipboardList className="w-4 h-4 mr-2" />
              Registered Teams
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-4 h-4 mr-2" />
              Content Management
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ImageIcon className="w-4 h-4 mr-2" />
              Gallery
            </TabsTrigger>
          </TabsList>

          {/* Registered Teams Tab */}
          <TabsContent value="teams">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap pb-4">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-foreground">Registered Teams</CardTitle>
                  {!registrationsLoading && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 border">
                      {filteredRegistrations.length}
                      {searchQuery && ` of ${allRegistrations?.length ?? 0}`} teams
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, project..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-background border-border text-foreground w-64"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportCSV}
                    disabled={!allRegistrations || allRegistrations.length === 0}
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
                      <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))}
                  </div>
                ) : filteredRegistrations.length === 0 ? (
                  <div className="text-center py-16">
                    <ClipboardList className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">
                      {searchQuery ? 'No teams match your search.' : 'No registrations yet.'}
                    </p>
                    {searchQuery && (
                      <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="mt-2 text-primary">
                        Clear search
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground">
                            <th className="text-left py-3 px-3 font-medium">ID</th>
                            <th className="text-left py-3 px-3 font-medium">Team Leader</th>
                            <th className="text-left py-3 px-3 font-medium">Contact</th>
                            <th className="text-left py-3 px-3 font-medium">College / Dept</th>
                            <th className="text-left py-3 px-3 font-medium">Project Title</th>
                            <th className="text-left py-3 px-3 font-medium">Category</th>
                            <th className="text-left py-3 px-3 font-medium">Registered On</th>
                            <th className="text-left py-3 px-3 font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRegistrations.map((reg: RegistrationRecord) => (
                            <tr
                              key={reg.id.toString()}
                              className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                            >
                              <td className="py-3 px-3 text-muted-foreground font-mono text-xs">
                                #{reg.id.toString()}
                              </td>
                              <td className="py-3 px-3 font-medium text-foreground">
                                {reg.fullName}
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex flex-col gap-0.5">
                                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                                    <Mail className="w-3 h-3" />
                                    {reg.email}
                                  </span>
                                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                                    <Phone className="w-3 h-3" />
                                    {reg.phoneNumber}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-foreground text-xs font-medium">{reg.collegeName}</span>
                                  <span className="text-muted-foreground text-xs">{reg.department}</span>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-muted-foreground max-w-[180px]">
                                <span className="block truncate" title={reg.projectTitle}>
                                  {reg.projectTitle}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <Badge variant="outline" className="border-primary/50 text-primary text-xs whitespace-nowrap">
                                  {reg.category}
                                </Badge>
                              </td>
                              <td className="py-3 px-3 text-muted-foreground text-xs whitespace-nowrap">
                                {new Date(Number(reg.timestamp) / 1_000_000).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </td>
                              <td className="py-3 px-3">
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

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                      {filteredRegistrations.map((reg: RegistrationRecord) => (
                        <div
                          key={reg.id.toString()}
                          className="border border-border rounded-lg p-4 bg-muted/20 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-foreground">{reg.fullName}</p>
                              <p className="text-xs text-muted-foreground font-mono">#{reg.id.toString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                                {reg.category}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(reg.id)}
                                disabled={isDeleting && deletingId === reg.id}
                                className="text-destructive hover:bg-destructive/10 h-7 w-7"
                              >
                                {isDeleting && deletingId === reg.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3 h-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-1.5 text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{reg.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-3 h-3 flex-shrink-0" />
                              <span>{reg.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building2 className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{reg.collegeName} — {reg.department}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <BookOpen className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate font-medium text-foreground">{reg.projectTitle}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Registered:{' '}
                            {new Date(Number(reg.timestamp) / 1_000_000).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content">
            <AdminContentManagement />
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
                      {uploadFile
                        ? uploadFile.name.slice(0, 20) + (uploadFile.name.length > 20 ? '…' : '')
                        : 'Choose File'}
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
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{uploadProgress}% uploaded</p>
                  </div>
                )}
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
                      <div
                        key={image.id}
                        className="group relative rounded-lg overflow-hidden border border-border bg-muted aspect-square"
                      >
                        <img
                          src={image.imageBlob.getDirectURL()}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                          <p className="text-white text-xs text-center font-medium truncate w-full px-2">
                            {image.title}
                          </p>
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
        </Tabs>
      </div>
    </div>
  );
}
