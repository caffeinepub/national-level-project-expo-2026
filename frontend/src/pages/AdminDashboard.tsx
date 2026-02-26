import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Download,
  Trash2,
  LogOut,
  Users,
  BarChart3,
  Loader2,
  Zap,
  RefreshCw,
  Pencil,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useGetRegistrations, useDeleteRegistration, useUpdateRegistration } from '../hooks/useQueries';
import { exportRegistrationsToCSV } from '../utils/csvExport';
import type { Registration } from '../backend';
import { toast } from 'sonner';

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  'IoT & Embedded Systems': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'AI / Machine Learning': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Robotics & Automation': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Software Development': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Electronics & VLSI': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Others / Interdisciplinary': 'bg-green-500/20 text-green-300 border-green-500/30',
};

const CATEGORIES = [
  'IoT & Embedded Systems',
  'AI / Machine Learning',
  'Robotics & Automation',
  'Software Development',
  'Electronics & VLSI',
  'Others / Interdisciplinary',
];

function DeleteButton({ registration, onDelete }: { registration: Registration; onDelete: () => void }) {
  const deleteMutation = useDeleteRegistration();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(registration.id);
    onDelete();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-expo-darker border border-white/10 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Delete Registration</AlertDialogTitle>
          <AlertDialogDescription className="text-white/50">
            Are you sure you want to delete the registration for{' '}
            <strong className="text-white">{registration.fullName}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white border-0"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface EditFormState {
  fullName: string;
  email: string;
  phoneNumber: string;
  collegeName: string;
  department: string;
  projectTitle: string;
  category: string;
  abstract: string;
}

function EditModal({
  registration,
  open,
  onClose,
}: {
  registration: Registration | null;
  open: boolean;
  onClose: () => void;
}) {
  const updateMutation = useUpdateRegistration();
  const [form, setForm] = useState<EditFormState>({
    fullName: '',
    email: '',
    phoneNumber: '',
    collegeName: '',
    department: '',
    projectTitle: '',
    category: '',
    abstract: '',
  });
  const [error, setError] = useState('');

  // Sync form when registration changes
  useState(() => {
    if (registration) {
      setForm({
        fullName: registration.fullName,
        email: registration.email,
        phoneNumber: registration.phoneNumber,
        collegeName: registration.collegeName,
        department: registration.department,
        projectTitle: registration.projectTitle,
        category: registration.category,
        abstract: registration.abstract,
      });
      setError('');
    }
  });

  // Reset form when modal opens with new registration
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && registration) {
      setForm({
        fullName: registration.fullName,
        email: registration.email,
        phoneNumber: registration.phoneNumber,
        collegeName: registration.collegeName,
        department: registration.department,
        projectTitle: registration.projectTitle,
        category: registration.category,
        abstract: registration.abstract,
      });
      setError('');
    }
    if (!isOpen) onClose();
  };

  const handleChange = (field: keyof EditFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registration) return;
    setError('');
    try {
      const success = await updateMutation.mutateAsync({
        id: registration.id,
        ...form,
      });
      if (success) {
        toast.success('Registration updated successfully!');
        onClose();
      } else {
        setError('Update failed: Registration not found.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
    }
  };

  if (!registration) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-expo-darker border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-expo-green-start to-expo-green-end flex items-center justify-center">
              <Pencil className="w-3.5 h-3.5 text-white" />
            </span>
            Edit Registration #{registration.id.toString()}
          </DialogTitle>
          <DialogDescription className="text-white/40">
            Update the details for <span className="text-white/70">{registration.fullName}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs uppercase tracking-wider">Full Name</Label>
              <Input
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs uppercase tracking-wider">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs uppercase tracking-wider">Phone Number</Label>
              <Input
                value={form.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60"
              />
            </div>

            {/* College */}
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs uppercase tracking-wider">College Name</Label>
              <Input
                value={form.collegeName}
                onChange={(e) => handleChange('collegeName', e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60"
              />
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs uppercase tracking-wider">Department</Label>
              <Input
                value={form.department}
                onChange={(e) => handleChange('department', e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60"
              />
            </div>

            {/* Project Title */}
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs uppercase tracking-wider">Project Title</Label>
              <Input
                value={form.projectTitle}
                onChange={(e) => handleChange('projectTitle', e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs uppercase tracking-wider">Category</Label>
            <select
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              required
              className="w-full rounded-md bg-white/5 border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-expo-green-start/60 focus:ring-1 focus:ring-expo-green-start/40"
            >
              <option value="" disabled className="bg-expo-darker">
                Select a category
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-expo-darker text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Abstract */}
          <div className="space-y-1.5">
            <Label className="text-white/60 text-xs uppercase tracking-wider">Abstract</Label>
            <Textarea
              value={form.abstract}
              onChange={(e) => handleChange('abstract', e.target.value)}
              required
              rows={4}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60 resize-none"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm flex items-start gap-2">
              <X className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <DialogFooter className="gap-2 pt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="bg-white/5 border border-white/10 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-gradient-to-r from-expo-green-start to-expo-green-end text-white font-semibold hover:shadow-lg hover:shadow-expo-green-start/30 transition-all border-0 gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAdminAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { data: registrations = [], isLoading, refetch } = useGetRegistrations();

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleEditOpen = (reg: Registration) => {
    setEditingRegistration(reg);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setTimeout(() => setEditingRegistration(null), 300);
  };

  const filteredRegistrations = useMemo(() => {
    if (!searchQuery.trim()) return registrations;
    const q = searchQuery.toLowerCase();
    return registrations.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.collegeName.toLowerCase().includes(q) ||
        r.projectTitle.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [registrations, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    registrations.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [registrations]);

  return (
    <div className="min-h-screen bg-expo-darkest text-white">
      {/* Header */}
      <header className="bg-expo-dark/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-expo-green-start to-expo-green-end flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Admin Dashboard</p>
              <p className="text-white/40 text-xs">Project Expo 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="text-white/50 hover:text-white hover:bg-white/5"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white/50 hover:text-red-400 hover:bg-red-500/10 gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-5 border border-white/10 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-expo-green-start/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-expo-green-end" />
              </div>
              <p className="text-white/50 text-sm">Total Registrations</p>
            </div>
            <p className="text-4xl font-extrabold text-white">{registrations.length}</p>
          </div>

          {categoryCounts.slice(0, 3).map(([cat, count]) => (
            <div key={cat} className="glass-card rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-expo-green-start/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-expo-green-end" />
                </div>
                <p className="text-white/50 text-xs leading-tight">{cat}</p>
              </div>
              <p className="text-3xl font-extrabold text-white">{count}</p>
            </div>
          ))}
        </div>

        {/* Category Breakdown */}
        {categoryCounts.length > 0 && (
          <div className="glass-card rounded-2xl p-5 border border-white/10 mb-6">
            <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-expo-green-end" />
              Registrations by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categoryCounts.map(([cat, count]) => (
                <span
                  key={cat}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    CATEGORY_COLORS[cat] || 'bg-white/10 text-white/60 border-white/20'
                  }`}
                >
                  {cat}: <strong>{count}</strong>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="Search by name, college, project, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-expo-green-start/60"
            />
          </div>
          <Button
            onClick={() => exportRegistrationsToCSV(registrations)}
            disabled={registrations.length === 0}
            className="bg-gradient-to-r from-expo-green-start to-expo-green-end text-white font-semibold hover:shadow-lg hover:shadow-expo-green-start/30 transition-all gap-2 border-0"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-expo-green-end animate-spin" />
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-20 text-white/30">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">
                {searchQuery ? 'No results found' : 'No registrations yet'}
              </p>
              <p className="text-sm mt-1">
                {searchQuery ? 'Try a different search term' : 'Registrations will appear here'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/50 text-xs uppercase tracking-wider">ID</TableHead>
                    <TableHead className="text-white/50 text-xs uppercase tracking-wider">Name</TableHead>
                    <TableHead className="text-white/50 text-xs uppercase tracking-wider">Email</TableHead>
                    <TableHead className="text-white/50 text-xs uppercase tracking-wider">Phone</TableHead>
                    <TableHead className="text-white/50 text-xs uppercase tracking-wider">College</TableHead>
                    <TableHead className="text-white/50 text-xs uppercase tracking-wider">Dept</TableHead>
                    <TableHead className="text-white/50 text-xs uppercase tracking-wider">Project</TableHead>
                    <TableHead className="text-white/50 text-xs uppercase tracking-wider">Category</TableHead>
                    <TableHead className="text-white/50 text-xs uppercase tracking-wider">Date</TableHead>
                    <TableHead className="text-white/50 text-xs uppercase tracking-wider w-20 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((reg) => (
                    <TableRow
                      key={reg.id.toString()}
                      className="border-white/5 hover:bg-white/3 transition-colors"
                    >
                      <TableCell className="text-white/40 text-xs font-mono">
                        #{reg.id.toString()}
                      </TableCell>
                      <TableCell className="text-white font-medium text-sm whitespace-nowrap">
                        {reg.fullName}
                      </TableCell>
                      <TableCell className="text-white/60 text-xs">{reg.email}</TableCell>
                      <TableCell className="text-white/60 text-xs whitespace-nowrap">
                        {reg.phoneNumber}
                      </TableCell>
                      <TableCell className="text-white/60 text-xs max-w-[150px] truncate">
                        {reg.collegeName}
                      </TableCell>
                      <TableCell className="text-white/60 text-xs">{reg.department}</TableCell>
                      <TableCell className="text-white/70 text-xs max-w-[150px] truncate">
                        {reg.projectTitle}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                            CATEGORY_COLORS[reg.category] || 'bg-white/10 text-white/60 border-white/20'
                          }`}
                        >
                          {reg.category.split(' ')[0]}
                        </span>
                      </TableCell>
                      <TableCell className="text-white/40 text-xs whitespace-nowrap">
                        {formatDate(reg.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditOpen(reg)}
                            className="text-white/30 hover:text-expo-green-end hover:bg-expo-green-start/10 transition-colors"
                            title="Edit registration"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <DeleteButton registration={reg} onDelete={() => {}} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {filteredRegistrations.length > 0 && (
          <p className="text-white/30 text-xs mt-3 text-right">
            Showing {filteredRegistrations.length} of {registrations.length} registrations
          </p>
        )}
      </main>

      {/* Edit Modal */}
      <EditModal
        registration={editingRegistration}
        open={editModalOpen}
        onClose={handleEditClose}
      />
    </div>
  );
}
