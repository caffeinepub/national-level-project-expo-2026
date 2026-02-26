import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useGetRegistrations, useDeleteRegistration, useUpdateRegistration } from '../hooks/useQueries';
import type { Registration } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  LogOut,
  Search,
  Users,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import AdminContentManagement from '../components/AdminContentManagement';

const ITEMS_PER_PAGE = 10;

const CATEGORY_COLORS: Record<string, string> = {
  'IoT & Embedded Systems': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'AI / Machine Learning': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Robotics & Automation': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Software Development': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Electronics & VLSI': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Others / Interdisciplinary': 'bg-green-500/20 text-green-300 border-green-500/30',
};

function DetailField({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{label}</p>
      {children ? (
        children
      ) : (
        <p className="text-sm text-foreground bg-background/50 border border-border/40 rounded-lg px-3 py-2">
          {value || <span className="text-muted-foreground italic">—</span>}
        </p>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const { data: registrations = [], isLoading } = useGetRegistrations();
  const deleteRegistration = useDeleteRegistration();
  const updateRegistration = useUpdateRegistration();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [viewRegistration, setViewRegistration] = useState<Registration | null>(null);
  const [editRegistration, setEditRegistration] = useState<Registration | null>(null);
  const [editForm, setEditForm] = useState<Partial<Registration>>({});

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
      reg.department.toLowerCase().includes(q) ||
      reg.projectTitle.toLowerCase().includes(q) ||
      reg.category.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredRegistrations.length / ITEMS_PER_PAGE));
  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteRegistration.mutateAsync(deleteId);
      toast.success('Registration deleted successfully');
    } catch {
      toast.error('Failed to delete registration');
    } finally {
      setDeleteId(null);
    }
  };

  const openEdit = (reg: Registration) => {
    setEditRegistration(reg);
    setEditForm({ ...reg });
  };

  const handleEditSave = async () => {
    if (!editRegistration || !editForm) return;
    try {
      await updateRegistration.mutateAsync({
        id: editRegistration.id,
        fullName: editForm.fullName ?? '',
        email: editForm.email ?? '',
        phoneNumber: editForm.phoneNumber ?? '',
        collegeName: editForm.collegeName ?? '',
        department: editForm.department ?? '',
        projectTitle: editForm.projectTitle ?? '',
        category: editForm.category ?? '',
        abstract: editForm.abstract ?? '',
      });
      toast.success('Registration updated successfully');
      setEditRegistration(null);
    } catch {
      toast.error('Failed to update registration');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">EGS Pillay Expo 2026</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card/60 border-border/40">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{registrations.length}</p>
                  <p className="text-sm text-muted-foreground">Total Registrations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/60 border-border/40">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Search className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{filteredRegistrations.length}</p>
                  <p className="text-sm text-muted-foreground">Filtered Results</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/60 border-border/40">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {[...new Set(registrations.map((r) => r.category))].length}
                  </p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="registrations">
          <TabsList className="mb-6 bg-card/60 border border-border/40">
            <TabsTrigger value="registrations" className="gap-2">
              <Users className="w-4 h-4" />
              Registrations
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <FileText className="w-4 h-4" />
              Content Management
            </TabsTrigger>
          </TabsList>

          {/* Registrations Tab */}
          <TabsContent value="registrations">
            <Card className="bg-card/60 border-border/40">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="text-lg font-semibold">All Registrations</CardTitle>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, college..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-9 bg-background/50 border-border/40"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : filteredRegistrations.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No registrations found</p>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="w-full">
                      <div className="min-w-[900px]">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border/40 hover:bg-transparent">
                              <TableHead className="text-muted-foreground font-medium w-16">ID</TableHead>
                              <TableHead className="text-muted-foreground font-medium">Full Name</TableHead>
                              <TableHead className="text-muted-foreground font-medium">Email</TableHead>
                              <TableHead className="text-muted-foreground font-medium">Phone</TableHead>
                              <TableHead className="text-muted-foreground font-medium">College</TableHead>
                              <TableHead className="text-muted-foreground font-medium">Department</TableHead>
                              <TableHead className="text-muted-foreground font-medium">Project Title</TableHead>
                              <TableHead className="text-muted-foreground font-medium">Category</TableHead>
                              <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedRegistrations.map((reg) => (
                              <TableRow
                                key={reg.id.toString()}
                                className="border-border/40 hover:bg-muted/20"
                              >
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                  #{reg.id.toString()}
                                </TableCell>
                                <TableCell className="font-medium text-foreground whitespace-nowrap">
                                  {reg.fullName}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                  {reg.email}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                  {reg.phoneNumber}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm max-w-[160px] truncate">
                                  {reg.collegeName}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                  {reg.department}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm max-w-[160px] truncate">
                                  {reg.projectTitle}
                                </TableCell>
                                <TableCell>
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                                      CATEGORY_COLORS[reg.category] ??
                                      'bg-muted/30 text-muted-foreground border-border/40'
                                    }`}
                                  >
                                    {reg.category}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                                      onClick={() => setViewRegistration(reg)}
                                      title="View details"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                                      onClick={() => openEdit(reg)}
                                      title="Edit"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                      onClick={() => setDeleteId(reg.id)}
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </ScrollArea>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-border/40">
                      <p className="text-sm text-muted-foreground">
                        Showing{' '}
                        {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredRegistrations.length)}–
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredRegistrations.length)} of{' '}
                        {filteredRegistrations.length} registrations
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="h-8 gap-1 border-border/40"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Prev
                        </Button>
                        <span className="text-sm text-muted-foreground px-2">
                          {currentPage} / {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="h-8 gap-1 border-border/40"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
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
        </Tabs>
      </main>

      {/* View Details Dialog */}
      <Dialog open={!!viewRegistration} onOpenChange={(open) => !open && setViewRegistration(null)}>
        <DialogContent className="max-w-2xl bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Registration Details
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Full details for registration #{viewRegistration?.id.toString()}
            </DialogDescription>
          </DialogHeader>
          {viewRegistration && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-4 pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Registration ID" value={`#${viewRegistration.id.toString()}`} />
                  <DetailField label="Category">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        CATEGORY_COLORS[viewRegistration.category] ??
                        'bg-muted/30 text-muted-foreground border-border/40'
                      }`}
                    >
                      {viewRegistration.category}
                    </span>
                  </DetailField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Full Name" value={viewRegistration.fullName} />
                  <DetailField label="Phone Number" value={viewRegistration.phoneNumber} />
                </div>
                <DetailField label="Email Address" value={viewRegistration.email} />
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="College Name" value={viewRegistration.collegeName} />
                  <DetailField label="Department" value={viewRegistration.department} />
                </div>
                <DetailField label="Project Title" value={viewRegistration.projectTitle} />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Abstract
                  </p>
                  <div className="bg-background/50 border border-border/40 rounded-lg p-3 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {viewRegistration.abstract || (
                      <span className="text-muted-foreground italic">No abstract provided</span>
                    )}
                  </div>
                </div>
                <DetailField
                  label="Submitted At"
                  value={new Date(Number(viewRegistration.timestamp) / 1_000_000).toLocaleString()}
                />
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editRegistration} onOpenChange={(open) => !open && setEditRegistration(null)}>
        <DialogContent className="max-w-2xl bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              Edit Registration
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update registration #{editRegistration?.id.toString()}
            </DialogDescription>
          </DialogHeader>
          {editRegistration && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-4 pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Full Name</Label>
                    <Input
                      value={editForm.fullName ?? ''}
                      onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
                      className="bg-background/50 border-border/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Phone Number</Label>
                    <Input
                      value={editForm.phoneNumber ?? ''}
                      onChange={(e) => setEditForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                      className="bg-background/50 border-border/40"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email</Label>
                  <Input
                    value={editForm.email ?? ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    className="bg-background/50 border-border/40"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">College Name</Label>
                    <Input
                      value={editForm.collegeName ?? ''}
                      onChange={(e) => setEditForm((f) => ({ ...f, collegeName: e.target.value }))}
                      className="bg-background/50 border-border/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Department</Label>
                    <Input
                      value={editForm.department ?? ''}
                      onChange={(e) => setEditForm((f) => ({ ...f, department: e.target.value }))}
                      className="bg-background/50 border-border/40"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Project Title</Label>
                  <Input
                    value={editForm.projectTitle ?? ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, projectTitle: e.target.value }))}
                    className="bg-background/50 border-border/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Category</Label>
                  <Input
                    value={editForm.category ?? ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                    className="bg-background/50 border-border/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Abstract</Label>
                  <Textarea
                    value={editForm.abstract ?? ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, abstract: e.target.value }))}
                    rows={5}
                    className="bg-background/50 border-border/40 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditRegistration(null)}
                    className="border-border/40"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditSave}
                    disabled={updateRegistration.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {updateRegistration.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Registration</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this registration? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border/40">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteRegistration.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
