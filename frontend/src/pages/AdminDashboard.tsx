import React, { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import AdminContentManagement from '../components/AdminContentManagement';
import {
  Users, Settings, LogOut, Search, Download, Image,
  RefreshCw, Trophy, Mail, Phone, Building, BookOpen,
  Tag, FileText, Calendar, Hash, ChevronDown, ChevronUp,
  BarChart3, Trash2
} from 'lucide-react';
import { useGetAllRegistrations, useGetRegistrationCount, useDeleteRegistration } from '../hooks/useQueries';
import { RegistrationRecord } from '../backend';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import GalleryManager from '../components/GalleryManager';

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function exportToCSV(records: RegistrationRecord[]) {
  const headers = [
    'ID', 'Full Name', 'Email', 'Phone', 'College', 'Department',
    'Project Title', 'Category', 'Abstract', 'Registered At'
  ];
  const rows = records.map(r => [
    r.id.toString(),
    r.fullName,
    r.email,
    r.phoneNumber,
    r.collegeName,
    r.department,
    r.projectTitle,
    r.category,
    r.abstract.replace(/,/g, ';'),
    formatTimestamp(r.timestamp),
  ]);
  const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function RegistrationCard({ record, onDelete }: { record: RegistrationRecord; onDelete: (id: bigint) => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl p-4 transition-all"
      style={{ background: 'oklch(0.14 0.04 145)', border: '1px solid oklch(0.28 0.08 145)' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground truncate">{record.fullName}</span>
            <Badge variant="outline" className="text-xs shrink-0"
              style={{ borderColor: 'oklch(0.45 0.15 145)', color: 'oklch(0.7 0.15 145)' }}>
              {record.category}
            </Badge>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Mail className="w-3 h-3" style={{ color: 'oklch(0.55 0.1 145)' }} />
            <span className="text-xs text-muted-foreground truncate">{record.email}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Building className="w-3 h-3" style={{ color: 'oklch(0.55 0.1 145)' }} />
            <span className="text-xs text-muted-foreground truncate">{record.collegeName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs" style={{ color: 'oklch(0.5 0.08 145)' }}>#{record.id.toString()}</span>
          <button onClick={() => setExpanded(!expanded)}
            className="p-1 rounded transition-colors hover:bg-white/5"
            style={{ color: 'oklch(0.6 0.12 145)' }}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={() => onDelete(record.id)}
            className="p-1 rounded transition-colors hover:bg-red-500/10"
            style={{ color: 'oklch(0.55 0.15 25)' }}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 space-y-2" style={{ borderTop: '1px solid oklch(0.25 0.06 145)' }}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Phone:</span>
              <span className="ml-1 text-foreground">{record.phoneNumber}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Department:</span>
              <span className="ml-1 text-foreground">{record.department}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Project:</span>
              <span className="ml-1 text-foreground">{record.projectTitle}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Abstract:</span>
              <p className="mt-1 text-foreground leading-relaxed">{record.abstract}</p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Registered:</span>
              <span className="ml-1 text-foreground">{formatTimestamp(record.timestamp)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('registrations');

  const { data: registrations = [], isLoading: regLoading, refetch: refetchReg } = useGetAllRegistrations();
  const { data: regCount = BigInt(0), isLoading: countLoading } = useGetRegistrationCount();
  const { mutate: deleteReg } = useDeleteRegistration();

  const filtered = useMemo(() => {
    if (!search.trim()) return registrations;
    const q = search.toLowerCase();
    return registrations.filter(r =>
      r.fullName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.collegeName.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.projectTitle.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q)
    );
  }, [registrations, search]);

  const handleLogout = () => {
    logout();
    navigate({ to: '/admin' });
  };

  const handleDelete = (id: bigint) => {
    if (confirm('Are you sure you want to delete this registration?')) {
      deleteReg(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{ background: 'oklch(0.12 0.04 145)', borderBottom: '1px solid oklch(0.25 0.07 145)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'oklch(0.3 0.12 145)' }}>
            <Trophy className="w-4 h-4" style={{ color: 'oklch(0.8 0.2 145)' }} />
          </div>
          <div>
            <h1 className="font-bold text-foreground text-sm leading-none">Admin Dashboard</h1>
            <p className="text-xs mt-0.5" style={{ color: 'oklch(0.55 0.1 145)' }}>InnovativeLink Expo 2K26</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
          style={{ background: 'oklch(0.2 0.06 25)', color: 'oklch(0.75 0.15 25)', border: '1px solid oklch(0.35 0.1 25)' }}>
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl p-5 flex items-center gap-4"
            style={{ background: 'oklch(0.16 0.06 145)', border: '1px solid oklch(0.32 0.12 145)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'oklch(0.25 0.1 145)' }}>
              <Users className="w-6 h-6" style={{ color: 'oklch(0.75 0.2 145)' }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Registrations</p>
              {countLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold" style={{ color: 'oklch(0.8 0.2 145)' }}>
                  {regCount.toString()}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl p-5 flex items-center gap-4"
            style={{ background: 'oklch(0.16 0.06 145)', border: '1px solid oklch(0.32 0.12 145)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'oklch(0.25 0.1 145)' }}>
              <BarChart3 className="w-6 h-6" style={{ color: 'oklch(0.75 0.2 145)' }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Filtered Results</p>
              <p className="text-3xl font-bold" style={{ color: 'oklch(0.8 0.2 145)' }}>
                {filtered.length}
              </p>
            </div>
          </div>

          <div className="rounded-xl p-5 flex items-center gap-4"
            style={{ background: 'oklch(0.16 0.06 145)', border: '1px solid oklch(0.32 0.12 145)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'oklch(0.25 0.1 145)' }}>
              <Tag className="w-6 h-6" style={{ color: 'oklch(0.75 0.2 145)' }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Admin Email</p>
              <p className="text-xs font-medium truncate" style={{ color: 'oklch(0.75 0.15 145)' }}>
                athiakash1977@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full sm:w-auto"
            style={{ background: 'oklch(0.14 0.04 145)', border: '1px solid oklch(0.28 0.08 145)' }}>
            <TabsTrigger value="registrations" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Registered Teams</span>
              {!regLoading && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {registrations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Content Management</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span>Gallery</span>
            </TabsTrigger>
          </TabsList>

          {/* Registrations Tab */}
          <TabsContent value="registrations">
            <div className="rounded-2xl p-5"
              style={{ background: 'oklch(0.13 0.04 145)', border: '1px solid oklch(0.26 0.07 145)' }}>
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: 'oklch(0.55 0.1 145)' }} />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, email, college, category..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'oklch(0.18 0.05 145)',
                      border: '1px solid oklch(0.32 0.09 145)',
                      color: 'oklch(0.9 0.05 145)',
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => refetchReg()}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors"
                    style={{ background: 'oklch(0.2 0.06 145)', color: 'oklch(0.7 0.15 145)', border: '1px solid oklch(0.32 0.09 145)' }}>
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                  <button onClick={() => exportToCSV(filtered)}
                    disabled={filtered.length === 0}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
                    style={{ background: 'oklch(0.3 0.12 145)', color: 'oklch(0.9 0.05 145)', border: '1px solid oklch(0.45 0.15 145)' }}>
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Table - Desktop */}
              <div className="hidden lg:block overflow-x-auto rounded-xl"
                style={{ border: '1px solid oklch(0.25 0.07 145)' }}>
                {regLoading ? (
                  <div className="p-6 space-y-3">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="p-12 text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: 'oklch(0.6 0.12 145)' }} />
                    <p className="text-muted-foreground">
                      {search ? 'No registrations match your search.' : 'No registrations yet.'}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'oklch(0.17 0.05 145)', borderBottom: '1px solid oklch(0.25 0.07 145)' }}>
                        {['#', 'Name', 'Email', 'Phone', 'College', 'Dept', 'Project', 'Category', 'Registered', 'Action'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider"
                            style={{ color: 'oklch(0.6 0.12 145)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r, i) => (
                        <tr key={r.id.toString()}
                          className="transition-colors hover:bg-white/5"
                          style={{ borderBottom: i < filtered.length - 1 ? '1px solid oklch(0.2 0.05 145)' : 'none' }}>
                          <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{r.id.toString()}</td>
                          <td className="px-4 py-3 font-medium text-foreground">{r.fullName}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.phoneNumber}</td>
                          <td className="px-4 py-3 text-muted-foreground max-w-[150px] truncate">{r.collegeName}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.department}</td>
                          <td className="px-4 py-3 text-muted-foreground max-w-[150px] truncate">{r.projectTitle}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-xs"
                              style={{ borderColor: 'oklch(0.45 0.15 145)', color: 'oklch(0.7 0.15 145)' }}>
                              {r.category}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{formatTimestamp(r.timestamp)}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleDelete(r.id)}
                              className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                              style={{ color: 'oklch(0.55 0.15 25)' }}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Cards - Mobile */}
              <div className="lg:hidden space-y-3">
                {regLoading ? (
                  [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
                ) : filtered.length === 0 ? (
                  <div className="p-12 text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: 'oklch(0.6 0.12 145)' }} />
                    <p className="text-muted-foreground">
                      {search ? 'No registrations match your search.' : 'No registrations yet.'}
                    </p>
                  </div>
                ) : (
                  filtered.map(r => (
                    <RegistrationCard key={r.id.toString()} record={r} onDelete={handleDelete} />
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content">
            <AdminContentManagement />
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <GalleryManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
