import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, Plus, Trash2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import {
  useGetHeroContent, useUpdateHeroContent,
  useGetAboutContent, useUpdateAboutContent,
  useGetEventDetailsContent, useUpdateEventDetailsContent,
  useGetCoordinatorsContent, useUpdateCoordinatorsContent,
  useGetContactContent, useUpdateContactContent,
} from '../hooks/useQueries';
import { HeroContent, AboutContent, EventDetailsContent, CoordinatorsContent, ContactContent, FeatureCard, Coordinator, TimelineMilestone } from '../backend';

function SectionCard({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl overflow-hidden mb-4"
      style={{ border: '1px solid oklch(0.28 0.08 145)', background: 'oklch(0.13 0.04 145)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/5"
      >
        <span className="font-semibold text-foreground">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1" style={{ borderTop: '1px solid oklch(0.22 0.06 145)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 rounded-lg text-sm outline-none transition-all";
const inputStyle = {
  background: 'oklch(0.18 0.05 145)',
  border: '1px solid oklch(0.32 0.09 145)',
  color: 'oklch(0.9 0.05 145)',
};

function SaveButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all mt-4 disabled:opacity-60"
      style={{ background: 'oklch(0.45 0.16 145)', color: 'oklch(0.95 0.02 145)' }}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {loading ? 'Saving...' : 'Save Changes'}
    </button>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const { data } = useGetHeroContent();
  const { mutate, isPending } = useUpdateHeroContent();
  const [form, setForm] = useState<HeroContent>({
    eventTitle: '', tagline: '', eventDate: '', collegeName: '',
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = () => {
    mutate(form, {
      onSuccess: () => toast.success('Hero content updated!'),
      onError: () => toast.error('Failed to update hero content.'),
    });
  };

  return (
    <SectionCard title="🎯 Hero Section" defaultOpen>
      <Field label="Event Title">
        <input className={inputCls} style={inputStyle} value={form.eventTitle}
          onChange={e => setForm({ ...form, eventTitle: e.target.value })} />
      </Field>
      <Field label="Tagline">
        <input className={inputCls} style={inputStyle} value={form.tagline}
          onChange={e => setForm({ ...form, tagline: e.target.value })} />
      </Field>
      <Field label="Event Date">
        <input className={inputCls} style={inputStyle} value={form.eventDate}
          onChange={e => setForm({ ...form, eventDate: e.target.value })} />
      </Field>
      <Field label="College Name">
        <input className={inputCls} style={inputStyle} value={form.collegeName}
          onChange={e => setForm({ ...form, collegeName: e.target.value })} />
      </Field>
      <SaveButton onClick={save} loading={isPending} />
    </SectionCard>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
function AboutSection() {
  const { data } = useGetAboutContent();
  const { mutate, isPending } = useUpdateAboutContent();
  const [desc, setDesc] = useState('');
  const [cards, setCards] = useState<FeatureCard[]>([]);

  useEffect(() => {
    if (data) {
      setDesc(data.sectionDescription);
      setCards(data.featureCards);
    }
  }, [data]);

  const save = () => {
    mutate({ sectionDescription: desc, featureCards: cards }, {
      onSuccess: () => toast.success('About content updated!'),
      onError: () => toast.error('Failed to update about content.'),
    });
  };

  const addCard = () => setCards([...cards, { title: '', description: '', icon: '⭐' }]);
  const removeCard = (i: number) => setCards(cards.filter((_, idx) => idx !== i));
  const updateCard = (i: number, field: keyof FeatureCard, val: string) => {
    setCards(cards.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  };

  return (
    <SectionCard title="📖 About Section">
      <Field label="Section Description">
        <textarea className={inputCls} style={{ ...inputStyle, minHeight: 80 }} value={desc}
          onChange={e => setDesc(e.target.value)} />
      </Field>
      <div className="mb-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground">Feature Cards</span>
          <button onClick={addCard}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors"
            style={{ background: 'oklch(0.25 0.08 145)', color: 'oklch(0.75 0.15 145)' }}>
            <Plus className="w-3 h-3" /> Add Card
          </button>
        </div>
        {cards.map((card, i) => (
          <div key={i} className="p-3 rounded-lg mb-2 relative"
            style={{ background: 'oklch(0.17 0.05 145)', border: '1px solid oklch(0.28 0.08 145)' }}>
            <button onClick={() => removeCard(i)}
              className="absolute top-2 right-2 p-1 rounded transition-colors hover:bg-red-500/10"
              style={{ color: 'oklch(0.55 0.15 25)' }}>
              <Trash2 className="w-3 h-3" />
            </button>
            <div className="grid grid-cols-2 gap-2 pr-6">
              <div>
                <label className="text-xs text-muted-foreground">Icon</label>
                <input className={inputCls} style={inputStyle} value={card.icon}
                  onChange={e => updateCard(i, 'icon', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Title</label>
                <input className={inputCls} style={inputStyle} value={card.title}
                  onChange={e => updateCard(i, 'title', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground">Description</label>
                <textarea className={inputCls} style={{ ...inputStyle, minHeight: 60 }} value={card.description}
                  onChange={e => updateCard(i, 'description', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <SaveButton onClick={save} loading={isPending} />
    </SectionCard>
  );
}

// ─── Event Details Section ────────────────────────────────────────────────────
function EventDetailsSection() {
  const { data } = useGetEventDetailsContent();
  const { mutate, isPending } = useUpdateEventDetailsContent();
  const [form, setForm] = useState<EventDetailsContent>({
    eventDate: '', venue: '', registrationFee: '', eligibilityCriteria: '',
    projectCategories: [], timelineMilestones: [],
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = () => {
    mutate(form, {
      onSuccess: () => toast.success('Event details updated!'),
      onError: () => toast.error('Failed to update event details.'),
    });
  };

  const addCategory = () => setForm({ ...form, projectCategories: [...form.projectCategories, ''] });
  const removeCategory = (i: number) => setForm({ ...form, projectCategories: form.projectCategories.filter((_, idx) => idx !== i) });
  const updateCategory = (i: number, val: string) => setForm({ ...form, projectCategories: form.projectCategories.map((c, idx) => idx === i ? val : c) });

  const addMilestone = () => setForm({ ...form, timelineMilestones: [...form.timelineMilestones, { milestoneLabel: '', date: '' }] });
  const removeMilestone = (i: number) => setForm({ ...form, timelineMilestones: form.timelineMilestones.filter((_, idx) => idx !== i) });
  const updateMilestone = (i: number, field: keyof TimelineMilestone, val: string) => {
    setForm({ ...form, timelineMilestones: form.timelineMilestones.map((m, idx) => idx === i ? { ...m, [field]: val } : m) });
  };

  return (
    <SectionCard title="📅 Event Details">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Event Date">
          <input className={inputCls} style={inputStyle} value={form.eventDate}
            onChange={e => setForm({ ...form, eventDate: e.target.value })} />
        </Field>
        <Field label="Venue">
          <input className={inputCls} style={inputStyle} value={form.venue}
            onChange={e => setForm({ ...form, venue: e.target.value })} />
        </Field>
        <Field label="Registration Fee">
          <input className={inputCls} style={inputStyle} value={form.registrationFee}
            onChange={e => setForm({ ...form, registrationFee: e.target.value })} />
        </Field>
        <Field label="Eligibility Criteria">
          <input className={inputCls} style={inputStyle} value={form.eligibilityCriteria}
            onChange={e => setForm({ ...form, eligibilityCriteria: e.target.value })} />
        </Field>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Project Categories</span>
          <button onClick={addCategory}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
            style={{ background: 'oklch(0.25 0.08 145)', color: 'oklch(0.75 0.15 145)' }}>
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        {form.projectCategories.map((cat, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className={`${inputCls} flex-1`} style={inputStyle} value={cat}
              onChange={e => updateCategory(i, e.target.value)} />
            <button onClick={() => removeCategory(i)}
              className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
              style={{ color: 'oklch(0.55 0.15 25)' }}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Timeline Milestones</span>
          <button onClick={addMilestone}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
            style={{ background: 'oklch(0.25 0.08 145)', color: 'oklch(0.75 0.15 145)' }}>
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        {form.timelineMilestones.map((m, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className={`${inputCls} flex-1`} style={inputStyle} placeholder="Label" value={m.milestoneLabel}
              onChange={e => updateMilestone(i, 'milestoneLabel', e.target.value)} />
            <input className={`${inputCls} flex-1`} style={inputStyle} placeholder="Date" value={m.date}
              onChange={e => updateMilestone(i, 'date', e.target.value)} />
            <button onClick={() => removeMilestone(i)}
              className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
              style={{ color: 'oklch(0.55 0.15 25)' }}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <SaveButton onClick={save} loading={isPending} />
    </SectionCard>
  );
}

// ─── Coordinators Section ─────────────────────────────────────────────────────
function CoordinatorsSection() {
  const { data } = useGetCoordinatorsContent();
  const { mutate, isPending } = useUpdateCoordinatorsContent();
  const [faculty, setFaculty] = useState<Coordinator[]>([]);
  const [students, setStudents] = useState<Coordinator[]>([]);

  useEffect(() => {
    if (data) {
      setFaculty(data.facultyCoordinators);
      setStudents(data.studentCoordinators);
    }
  }, [data]);

  const save = () => {
    mutate({ facultyCoordinators: faculty, studentCoordinators: students }, {
      onSuccess: () => toast.success('Coordinators updated!'),
      onError: () => toast.error('Failed to update coordinators.'),
    });
  };

  const CoordinatorList = ({
    list, setList, label
  }: { list: Coordinator[]; setList: (v: Coordinator[]) => void; label: string }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <button onClick={() => setList([...list, { name: '', role: '', phone: '', email: '' }])}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs"
          style={{ background: 'oklch(0.25 0.08 145)', color: 'oklch(0.75 0.15 145)' }}>
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      {list.map((c, i) => (
        <div key={i} className="p-3 rounded-lg mb-2 relative"
          style={{ background: 'oklch(0.17 0.05 145)', border: '1px solid oklch(0.28 0.08 145)' }}>
          <button onClick={() => setList(list.filter((_, idx) => idx !== i))}
            className="absolute top-2 right-2 p-1 rounded hover:bg-red-500/10"
            style={{ color: 'oklch(0.55 0.15 25)' }}>
            <Trash2 className="w-3 h-3" />
          </button>
          <div className="grid grid-cols-2 gap-2 pr-6">
            {(['name', 'role', 'phone', 'email'] as (keyof Coordinator)[]).map(field => (
              <div key={field}>
                <label className="text-xs text-muted-foreground capitalize">{field}</label>
                <input className={inputCls} style={inputStyle} value={c[field]}
                  onChange={e => setList(list.map((item, idx) => idx === i ? { ...item, [field]: e.target.value } : item))} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <SectionCard title="👥 Coordinators">
      <CoordinatorList list={faculty} setList={setFaculty} label="Faculty Coordinators" />
      <CoordinatorList list={students} setList={setStudents} label="Student Coordinators" />
      <SaveButton onClick={save} loading={isPending} />
    </SectionCard>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function ContactSection() {
  const { data } = useGetContactContent();
  const { mutate, isPending } = useUpdateContactContent();
  const [form, setForm] = useState<ContactContent>({
    addressLine1: '', addressLine2: '', phone: '', email: '', website: '',
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = () => {
    mutate(form, {
      onSuccess: () => toast.success('Contact info updated!'),
      onError: () => toast.error('Failed to update contact info.'),
    });
  };

  return (
    <SectionCard title="📞 Contact Information">
      {(Object.keys(form) as (keyof ContactContent)[]).map(field => (
        <Field key={field} label={field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}>
          <input className={inputCls} style={inputStyle} value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })} />
        </Field>
      ))}
      <SaveButton onClick={save} loading={isPending} />
    </SectionCard>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminContentManagement() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Content Management</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Edit and update all public-facing content sections. Changes are saved to the blockchain and reflected immediately.
        </p>
      </div>
      <HeroSection />
      <AboutSection />
      <EventDetailsSection />
      <CoordinatorsSection />
      <ContactSection />
    </div>
  );
}
