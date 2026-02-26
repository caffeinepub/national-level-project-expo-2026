import type { Registration } from '../backend';

function formatTimestamp(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportRegistrationsToCSV(registrations: Registration[]): void {
  const headers = [
    'ID',
    'Full Name',
    'Email',
    'Phone Number',
    'College Name',
    'Department',
    'Project Title',
    'Category',
    'Abstract',
    'Registered At',
  ];

  const rows = registrations.map((reg) => [
    reg.id.toString(),
    escapeCSV(reg.fullName),
    escapeCSV(reg.email),
    escapeCSV(reg.phoneNumber),
    escapeCSV(reg.collegeName),
    escapeCSV(reg.department),
    escapeCSV(reg.projectTitle),
    escapeCSV(reg.category),
    escapeCSV(reg.abstract),
    escapeCSV(formatTimestamp(reg.timestamp)),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const today = new Date().toISOString().split('T')[0];
  link.href = url;
  link.download = `registrations_${today}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
