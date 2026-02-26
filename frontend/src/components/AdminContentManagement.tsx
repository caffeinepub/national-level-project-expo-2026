import { useState, useEffect } from 'react';
import { Loader2, Plus, X, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  useGetHeroContent,
  useGetAboutContent,
  useGetEventDetailsContent,
  useGetCoordinatorsContent,
  useGetContactContent,
  useUpdateHeroContent,
  useUpdateAboutContent,
  useUpdateEventDetailsContent,
  useUpdateCoordinatorsContent,
  useUpdateContactContent,
} from '../hooks/useQueries';
import type {
  HeroContent,
  AboutContent,
  EventDetailsContent,
  CoordinatorsContent,
  ContactContent,
  Coordinator,
  FeatureCard,
  TimelineMilestone,
} from '../backend';
import { toast } from 'sonner';

// ─── Shared sub-components ────────────────────────────────────────────────────

function CmsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="backdrop-blur-md bg-card/60 border border-border/40 rounded-2xl p-6 space-y-4">
      <h3 className="text-foreground font-bold text-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function CmsInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground text-xs uppercase tracking-wider">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-background/50 border-border/40 text-foreground placeholder:text-muted-foreground/50"
      />
    </div>
  );
}

function CmsTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground text-xs uppercase tracking-wider">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="bg-background/50 border-border/40 text-foreground placeholder:text-muted-foreground/50 resize-none"
      />
    </div>
  );
}

function SaveButton({ isPending, onClick }: { isPending: boolean; onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      disabled={isPending}
      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
    >
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Saving…
        </>
      ) : (
        <>
          <Save className="w-4 h-4" />
          Save Changes
        </>
      )}
    </Button>
  );
}

// ─── Hero CMS ─────────────────────────────────────────────────────────────────

function HeroCmsSection() {
  const { data: heroContent } = useGetHeroContent();
  const updateMutation = useUpdateHeroContent();
  const [form, setForm] = useState<HeroContent>({
    eventTitle: 'National Level Project Expo 2026',
    tagline: 'Innovate · Collaborate · Inspire',
    eventDate: 'April 15, 2026',
    collegeName: 'E.G.S. Pillay Engineering College',
  });

  useEffect(() => {
    if (heroContent) setForm(heroContent);
  }, [heroContent]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(form);
      toast.success('Hero content updated successfully!');
    } catch {
      toast.error('Failed to update hero content.');
    }
  };

  return (
    <CmsCard title="Hero Section">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CmsInput
          label="Event Title"
          value={form.eventTitle}
          onChange={(v) => setForm((p) => ({ ...p, eventTitle: v }))}
          placeholder="National Level Project Expo 2026"
        />
        <CmsInput
          label="Tagline"
          value={form.tagline}
          onChange={(v) => setForm((p) => ({ ...p, tagline: v }))}
          placeholder="Innovate · Collaborate · Inspire"
        />
        <CmsInput
          label="Event Date"
          value={form.eventDate}
          onChange={(v) => setForm((p) => ({ ...p, eventDate: v }))}
          placeholder="April 15, 2026"
        />
        <CmsInput
          label="College Name"
          value={form.collegeName}
          onChange={(v) => setForm((p) => ({ ...p, collegeName: v }))}
          placeholder="E.G.S. Pillay Engineering College"
        />
      </div>
      <div className="flex justify-end pt-2">
        <SaveButton isPending={updateMutation.isPending} onClick={handleSave} />
      </div>
    </CmsCard>
  );
}

// ─── About CMS ────────────────────────────────────────────────────────────────

function AboutCmsSection() {
  const { data: aboutContent } = useGetAboutContent();
  const updateMutation = useUpdateAboutContent();
  const [description, setDescription] = useState(
    'The National Level Project Expo 2026 is a prestigious technical event organized by the Department of Electronics and Communication Engineering at E.G.S. Pillay Engineering College, Nagapattinam.'
  );
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([
    {
      title: 'Innovation Hub',
      description: 'A platform to showcase cutting-edge projects across IoT, AI/ML, Robotics, and more.',
      icon: 'Lightbulb',
    },
    {
      title: 'Inter-College Participation',
      description: 'Open to all engineering colleges across Tamil Nadu and beyond.',
      icon: 'Globe',
    },
    {
      title: 'Certificates & Prizes',
      description: 'Win exciting cash prizes, trophies, and certificates of merit.',
      icon: 'Award',
    },
  ]);

  useEffect(() => {
    if (aboutContent) {
      setDescription(aboutContent.sectionDescription);
      if (aboutContent.featureCards.length > 0) setFeatureCards([...aboutContent.featureCards]);
    }
  }, [aboutContent]);

  const updateCard = (i: number, field: keyof FeatureCard, value: string) => {
    setFeatureCards((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  };

  const addCard = () =>
    setFeatureCards((prev) => [...prev, { title: '', description: '', icon: 'Lightbulb' }]);
  const removeCard = (i: number) =>
    setFeatureCards((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ sectionDescription: description, featureCards });
      toast.success('About content updated successfully!');
    } catch {
      toast.error('Failed to update about content.');
    }
  };

  return (
    <CmsCard title="About Section">
      <CmsTextarea
        label="Section Description"
        value={description}
        onChange={setDescription}
        rows={4}
      />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Feature Cards</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addCard}
            className="h-7 gap-1 text-xs border-border/40"
          >
            <Plus className="w-3 h-3" />
            Add Card
          </Button>
        </div>
        {featureCards.map((card, i) => (
          <div key={i} className="border border-border/40 rounded-xl p-4 space-y-3 bg-background/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Card {i + 1}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => removeCard(i)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CmsInput
                label="Title"
                value={card.title}
                onChange={(v) => updateCard(i, 'title', v)}
              />
              <CmsInput
                label="Icon Name"
                value={card.icon}
                onChange={(v) => updateCard(i, 'icon', v)}
                placeholder="e.g. Lightbulb"
              />
            </div>
            <CmsTextarea
              label="Description"
              value={card.description}
              onChange={(v) => updateCard(i, 'description', v)}
              rows={2}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <SaveButton isPending={updateMutation.isPending} onClick={handleSave} />
      </div>
    </CmsCard>
  );
}

// ─── Event Details CMS ────────────────────────────────────────────────────────

function EventDetailsCmsSection() {
  const { data: eventDetailsContent } = useGetEventDetailsContent();
  const updateMutation = useUpdateEventDetailsContent();
  const [form, setForm] = useState<EventDetailsContent>({
    eventDate: 'April 15, 2026',
    venue: 'E.G.S. Pillay Engineering College, Nagapattinam',
    registrationFee: '₹500 per team',
    eligibilityCriteria: 'Open to all undergraduate and postgraduate engineering students.',
    projectCategories: [
      'IoT & Embedded Systems',
      'AI / Machine Learning',
      'Robotics & Automation',
      'Software Development',
      'Electronics & VLSI',
      'Others / Interdisciplinary',
    ],
    timelineMilestones: [
      { milestoneLabel: 'Registration Opens', date: 'March 1, 2026' },
      { milestoneLabel: 'Registration Closes', date: 'April 10, 2026' },
      { milestoneLabel: 'Event Day', date: 'April 15, 2026' },
    ],
  });

  useEffect(() => {
    if (eventDetailsContent) setForm(eventDetailsContent);
  }, [eventDetailsContent]);

  const updateCategory = (i: number, value: string) => {
    setForm((p) => {
      const cats = [...p.projectCategories];
      cats[i] = value;
      return { ...p, projectCategories: cats };
    });
  };
  const addCategory = () =>
    setForm((p) => ({ ...p, projectCategories: [...p.projectCategories, ''] }));
  const removeCategory = (i: number) =>
    setForm((p) => ({
      ...p,
      projectCategories: p.projectCategories.filter((_, idx) => idx !== i),
    }));

  const updateMilestone = (i: number, field: keyof TimelineMilestone, value: string) => {
    setForm((p) => {
      const ms = [...p.timelineMilestones];
      ms[i] = { ...ms[i], [field]: value };
      return { ...p, timelineMilestones: ms };
    });
  };
  const addMilestone = () =>
    setForm((p) => ({
      ...p,
      timelineMilestones: [...p.timelineMilestones, { milestoneLabel: '', date: '' }],
    }));
  const removeMilestone = (i: number) =>
    setForm((p) => ({
      ...p,
      timelineMilestones: p.timelineMilestones.filter((_, idx) => idx !== i),
    }));

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(form);
      toast.success('Event details updated successfully!');
    } catch {
      toast.error('Failed to update event details.');
    }
  };

  return (
    <CmsCard title="Event Details Section">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CmsInput
          label="Event Date"
          value={form.eventDate}
          onChange={(v) => setForm((p) => ({ ...p, eventDate: v }))}
        />
        <CmsInput
          label="Venue"
          value={form.venue}
          onChange={(v) => setForm((p) => ({ ...p, venue: v }))}
        />
        <CmsInput
          label="Registration Fee"
          value={form.registrationFee}
          onChange={(v) => setForm((p) => ({ ...p, registrationFee: v }))}
        />
      </div>
      <CmsTextarea
        label="Eligibility Criteria"
        value={form.eligibilityCriteria}
        onChange={(v) => setForm((p) => ({ ...p, eligibilityCriteria: v }))}
        rows={2}
      />

      {/* Project Categories */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Project Categories</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addCategory}
            className="h-7 gap-1 text-xs border-border/40"
          >
            <Plus className="w-3 h-3" />
            Add
          </Button>
        </div>
        {form.projectCategories.map((cat, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={cat}
              onChange={(e) => updateCategory(i, e.target.value)}
              className="bg-background/50 border-border/40 text-foreground"
            />
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeCategory(i)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Timeline Milestones */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Timeline Milestones</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addMilestone}
            className="h-7 gap-1 text-xs border-border/40"
          >
            <Plus className="w-3 h-3" />
            Add
          </Button>
        </div>
        {form.timelineMilestones.map((ms, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="grid grid-cols-2 gap-2 flex-1">
              <Input
                placeholder="Milestone label"
                value={ms.milestoneLabel}
                onChange={(e) => updateMilestone(i, 'milestoneLabel', e.target.value)}
                className="bg-background/50 border-border/40 text-foreground"
              />
              <Input
                placeholder="Date"
                value={ms.date}
                onChange={(e) => updateMilestone(i, 'date', e.target.value)}
                className="bg-background/50 border-border/40 text-foreground"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeMilestone(i)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <SaveButton isPending={updateMutation.isPending} onClick={handleSave} />
      </div>
    </CmsCard>
  );
}

// ─── Coordinators CMS ─────────────────────────────────────────────────────────

function CoordinatorsCmsSection() {
  const { data: coordinatorsContent } = useGetCoordinatorsContent();
  const updateMutation = useUpdateCoordinatorsContent();
  const [form, setForm] = useState<CoordinatorsContent>({
    facultyCoordinators: [
      { name: 'Dr. Faculty Name', role: 'Head of Department', phone: '+91 00000 00000', email: 'faculty@egspillay.ac.in' },
    ],
    studentCoordinators: [
      { name: 'Student Name', role: 'Student Coordinator', phone: '+91 00000 00000', email: 'student@egspillay.ac.in' },
    ],
  });

  useEffect(() => {
    if (coordinatorsContent) setForm(coordinatorsContent);
  }, [coordinatorsContent]);

  const updateCoord = (
    type: 'facultyCoordinators' | 'studentCoordinators',
    i: number,
    field: keyof Coordinator,
    value: string
  ) => {
    setForm((p) => {
      const arr = [...p[type]];
      arr[i] = { ...arr[i], [field]: value };
      return { ...p, [type]: arr };
    });
  };

  const addCoord = (type: 'facultyCoordinators' | 'studentCoordinators') =>
    setForm((p) => ({
      ...p,
      [type]: [...p[type], { name: '', role: '', phone: '', email: '' }],
    }));

  const removeCoord = (type: 'facultyCoordinators' | 'studentCoordinators', i: number) =>
    setForm((p) => ({ ...p, [type]: p[type].filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(form);
      toast.success('Coordinators updated successfully!');
    } catch {
      toast.error('Failed to update coordinators.');
    }
  };

  const CoordGroup = ({
    title,
    type,
    coords,
  }: {
    title: string;
    type: 'facultyCoordinators' | 'studentCoordinators';
    coords: Coordinator[];
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground text-xs uppercase tracking-wider">{title}</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addCoord(type)}
          className="h-7 gap-1 text-xs border-border/40"
        >
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>
      {coords.map((coord, i) => (
        <div key={i} className="border border-border/40 rounded-xl p-4 space-y-3 bg-background/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">{title} {i + 1}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={() => removeCoord(type, i)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CmsInput label="Name" value={coord.name} onChange={(v) => updateCoord(type, i, 'name', v)} />
            <CmsInput label="Role" value={coord.role} onChange={(v) => updateCoord(type, i, 'role', v)} />
            <CmsInput label="Phone" value={coord.phone} onChange={(v) => updateCoord(type, i, 'phone', v)} />
            <CmsInput label="Email" value={coord.email} onChange={(v) => updateCoord(type, i, 'email', v)} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <CmsCard title="Coordinators Section">
      <CoordGroup title="Faculty Coordinators" type="facultyCoordinators" coords={form.facultyCoordinators} />
      <CoordGroup title="Student Coordinators" type="studentCoordinators" coords={form.studentCoordinators} />
      <div className="flex justify-end pt-2">
        <SaveButton isPending={updateMutation.isPending} onClick={handleSave} />
      </div>
    </CmsCard>
  );
}

// ─── Contact CMS ──────────────────────────────────────────────────────────────

function ContactCmsSection() {
  const { data: contactContent } = useGetContactContent();
  const updateMutation = useUpdateContactContent();
  const [form, setForm] = useState<ContactContent>({
    addressLine1: 'E.G.S. Pillay Engineering College',
    addressLine2: 'Nagapattinam, Tamil Nadu - 611002',
    phone: '+91 4365 254 321',
    email: 'info@egspillay.ac.in',
    website: 'www.egspillay.ac.in',
  });

  useEffect(() => {
    if (contactContent) setForm(contactContent);
  }, [contactContent]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(form);
      toast.success('Contact content updated successfully!');
    } catch {
      toast.error('Failed to update contact content.');
    }
  };

  return (
    <CmsCard title="Contact Section">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CmsInput
          label="Address Line 1"
          value={form.addressLine1}
          onChange={(v) => setForm((p) => ({ ...p, addressLine1: v }))}
        />
        <CmsInput
          label="Address Line 2"
          value={form.addressLine2}
          onChange={(v) => setForm((p) => ({ ...p, addressLine2: v }))}
        />
        <CmsInput
          label="Phone"
          value={form.phone}
          onChange={(v) => setForm((p) => ({ ...p, phone: v }))}
        />
        <CmsInput
          label="Email"
          value={form.email}
          onChange={(v) => setForm((p) => ({ ...p, email: v }))}
        />
        <CmsInput
          label="Website"
          value={form.website}
          onChange={(v) => setForm((p) => ({ ...p, website: v }))}
        />
      </div>
      <div className="flex justify-end pt-2">
        <SaveButton isPending={updateMutation.isPending} onClick={handleSave} />
      </div>
    </CmsCard>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function AdminContentManagement() {
  return (
    <div className="space-y-6">
      <HeroCmsSection />
      <AboutCmsSection />
      <EventDetailsCmsSection />
      <CoordinatorsCmsSection />
      <ContactCmsSection />
    </div>
  );
}
