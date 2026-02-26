import { useState } from 'react';
import {
  useGetHeroContent,
  useUpdateHeroContent,
  useGetAboutContent,
  useUpdateAboutContent,
  useGetEventDetailsContent,
  useUpdateEventDetailsContent,
  useGetCoordinatorsContent,
  useUpdateCoordinatorsContent,
  useGetContactContent,
  useUpdateContactContent,
} from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import type {
  HeroContent,
  AboutContent,
  FeatureCard,
  EventDetailsContent,
  TimelineMilestone,
  CoordinatorsContent,
  Coordinator,
  ContactContent,
} from '../backend';

// ─── Hero Section ────────────────────────────────────────────────────────────
function HeroSection() {
  const { data: heroContent, isLoading } = useGetHeroContent();
  const { mutate: updateHero, isPending } = useUpdateHeroContent();
  const [form, setForm] = useState<HeroContent>({
    eventTitle: '',
    tagline: '',
    eventDate: '',
    collegeName: '',
  });
  const [initialized, setInitialized] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isLoading && heroContent && !initialized) {
    setForm(heroContent);
    setInitialized(true);
  }

  const handleSave = () => {
    updateHero(form, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-base">Hero Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-foreground text-sm">Event Title</Label>
                <Input value={form.eventTitle} onChange={(e) => setForm({ ...form, eventTitle: e.target.value })} className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground text-sm">Event Date</Label>
                <Input value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground text-sm">College Name</Label>
                <Input value={form.collegeName} onChange={(e) => setForm({ ...form, collegeName: e.target.value })} className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground text-sm">Tagline</Label>
                <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="bg-background border-border text-foreground" />
              </div>
            </div>
            <Button onClick={handleSave} disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saved ? 'Saved!' : 'Save Hero'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── About Section ───────────────────────────────────────────────────────────
function AboutSection() {
  const { data: aboutContent, isLoading } = useGetAboutContent();
  const { mutate: updateAbout, isPending } = useUpdateAboutContent();
  const [form, setForm] = useState<AboutContent>({
    sectionDescription: '',
    featureCards: [],
  });
  const [initialized, setInitialized] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isLoading && aboutContent && !initialized) {
    setForm(aboutContent);
    setInitialized(true);
  }

  const handleSave = () => {
    updateAbout(form, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  };

  const addCard = () => {
    setForm({ ...form, featureCards: [...form.featureCards, { title: '', description: '', icon: '🌟' }] });
  };

  const removeCard = (i: number) => {
    setForm({ ...form, featureCards: form.featureCards.filter((_, idx) => idx !== i) });
  };

  const updateCard = (i: number, field: keyof FeatureCard, value: string) => {
    const cards = [...form.featureCards];
    cards[i] = { ...cards[i], [field]: value };
    setForm({ ...form, featureCards: cards });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-base">About Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
        ) : (
          <>
            <div className="space-y-1">
              <Label className="text-foreground text-sm">Section Description</Label>
              <Textarea value={form.sectionDescription} onChange={(e) => setForm({ ...form, sectionDescription: e.target.value })} className="bg-background border-border text-foreground" rows={3} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground text-sm">Feature Cards</Label>
                <Button variant="outline" size="sm" onClick={addCard} className="border-border text-foreground hover:bg-muted h-7 text-xs">
                  <Plus className="w-3 h-3 mr-1" /> Add Card
                </Button>
              </div>
              {form.featureCards.map((card, i) => (
                <div key={i} className="border border-border rounded-lg p-3 space-y-2 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Card {i + 1}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeCard(i)} className="text-destructive hover:bg-destructive/10 h-6 w-6">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Title" value={card.title} onChange={(e) => updateCard(i, 'title', e.target.value)} className="bg-background border-border text-foreground text-sm" />
                    <Input placeholder="Icon (emoji)" value={card.icon} onChange={(e) => updateCard(i, 'icon', e.target.value)} className="bg-background border-border text-foreground text-sm" />
                  </div>
                  <Textarea placeholder="Description" value={card.description} onChange={(e) => updateCard(i, 'description', e.target.value)} className="bg-background border-border text-foreground text-sm" rows={2} />
                </div>
              ))}
            </div>
            <Button onClick={handleSave} disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saved ? 'Saved!' : 'Save About'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Event Details Section ────────────────────────────────────────────────────
function EventDetailsSection() {
  const { data: eventContent, isLoading } = useGetEventDetailsContent();
  const { mutate: updateEvent, isPending } = useUpdateEventDetailsContent();
  const [form, setForm] = useState<EventDetailsContent>({
    eventDate: '',
    venue: '',
    registrationFee: '',
    eligibilityCriteria: '',
    projectCategories: [],
    timelineMilestones: [],
  });
  const [initialized, setInitialized] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  if (!isLoading && eventContent && !initialized) {
    setForm(eventContent);
    setInitialized(true);
  }

  const handleSave = () => {
    updateEvent(form, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setForm({ ...form, projectCategories: [...form.projectCategories, newCategory.trim()] });
    setNewCategory('');
  };

  const removeCategory = (i: number) => {
    setForm({ ...form, projectCategories: form.projectCategories.filter((_, idx) => idx !== i) });
  };

  const addMilestone = () => {
    setForm({ ...form, timelineMilestones: [...form.timelineMilestones, { milestoneLabel: '', date: '' }] });
  };

  const removeMilestone = (i: number) => {
    setForm({ ...form, timelineMilestones: form.timelineMilestones.filter((_, idx) => idx !== i) });
  };

  const updateMilestone = (i: number, field: keyof TimelineMilestone, value: string) => {
    const milestones = [...form.timelineMilestones];
    milestones[i] = { ...milestones[i], [field]: value };
    setForm({ ...form, timelineMilestones: milestones });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-base">Event Details Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-foreground text-sm">Event Date</Label>
                <Input value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground text-sm">Venue</Label>
                <Input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground text-sm">Registration Fee</Label>
                <Input value={form.registrationFee} onChange={(e) => setForm({ ...form, registrationFee: e.target.value })} className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground text-sm">Eligibility Criteria</Label>
                <Input value={form.eligibilityCriteria} onChange={(e) => setForm({ ...form, eligibilityCriteria: e.target.value })} className="bg-background border-border text-foreground" />
              </div>
            </div>

            {/* Project Categories */}
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Project Categories</Label>
              <div className="flex gap-2">
                <Input placeholder="Add category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCategory()} className="bg-background border-border text-foreground" />
                <Button variant="outline" size="sm" onClick={addCategory} className="border-border text-foreground hover:bg-muted">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.projectCategories.map((cat, i) => (
                  <span key={i} className="flex items-center gap-1 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                    {cat}
                    <button onClick={() => removeCategory(i)} className="hover:text-destructive ml-1">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Timeline Milestones */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-foreground text-sm">Timeline Milestones</Label>
                <Button variant="outline" size="sm" onClick={addMilestone} className="border-border text-foreground hover:bg-muted h-7 text-xs">
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>
              {form.timelineMilestones.map((m, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input placeholder="Label" value={m.milestoneLabel} onChange={(e) => updateMilestone(i, 'milestoneLabel', e.target.value)} className="bg-background border-border text-foreground text-sm" />
                  <Input placeholder="Date" value={m.date} onChange={(e) => updateMilestone(i, 'date', e.target.value)} className="bg-background border-border text-foreground text-sm" />
                  <Button variant="ghost" size="icon" onClick={() => removeMilestone(i)} className="text-destructive hover:bg-destructive/10 h-8 w-8 flex-shrink-0">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>

            <Button onClick={handleSave} disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saved ? 'Saved!' : 'Save Event Details'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Coordinators Section ─────────────────────────────────────────────────────
function CoordinatorsSection() {
  const { data: coordContent, isLoading } = useGetCoordinatorsContent();
  const { mutate: updateCoord, isPending } = useUpdateCoordinatorsContent();
  const [form, setForm] = useState<CoordinatorsContent>({
    facultyCoordinators: [],
    studentCoordinators: [],
  });
  const [initialized, setInitialized] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isLoading && coordContent && !initialized) {
    setForm(coordContent);
    setInitialized(true);
  }

  const handleSave = () => {
    updateCoord(form, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  };

  const addCoordinator = (type: 'faculty' | 'student') => {
    const empty: Coordinator = { name: '', role: '', phone: '', email: '' };
    if (type === 'faculty') {
      setForm({ ...form, facultyCoordinators: [...form.facultyCoordinators, empty] });
    } else {
      setForm({ ...form, studentCoordinators: [...form.studentCoordinators, empty] });
    }
  };

  const removeCoordinator = (type: 'faculty' | 'student', i: number) => {
    if (type === 'faculty') {
      setForm({ ...form, facultyCoordinators: form.facultyCoordinators.filter((_, idx) => idx !== i) });
    } else {
      setForm({ ...form, studentCoordinators: form.studentCoordinators.filter((_, idx) => idx !== i) });
    }
  };

  const updateCoordinator = (type: 'faculty' | 'student', i: number, field: keyof Coordinator, value: string) => {
    if (type === 'faculty') {
      const arr = [...form.facultyCoordinators];
      arr[i] = { ...arr[i], [field]: value };
      setForm({ ...form, facultyCoordinators: arr });
    } else {
      const arr = [...form.studentCoordinators];
      arr[i] = { ...arr[i], [field]: value };
      setForm({ ...form, studentCoordinators: arr });
    }
  };

  const renderCoordinatorList = (type: 'faculty' | 'student', list: Coordinator[]) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-foreground text-sm capitalize">{type} Coordinators</Label>
        <Button variant="outline" size="sm" onClick={() => addCoordinator(type)} className="border-border text-foreground hover:bg-muted h-7 text-xs">
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      {list.map((coord, i) => (
        <div key={i} className="border border-border rounded-lg p-3 space-y-2 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{type === 'faculty' ? 'Faculty' : 'Student'} {i + 1}</span>
            <Button variant="ghost" size="icon" onClick={() => removeCoordinator(type, i)} className="text-destructive hover:bg-destructive/10 h-6 w-6">
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Name" value={coord.name} onChange={(e) => updateCoordinator(type, i, 'name', e.target.value)} className="bg-background border-border text-foreground text-sm" />
            <Input placeholder="Role" value={coord.role} onChange={(e) => updateCoordinator(type, i, 'role', e.target.value)} className="bg-background border-border text-foreground text-sm" />
            <Input placeholder="Phone" value={coord.phone} onChange={(e) => updateCoordinator(type, i, 'phone', e.target.value)} className="bg-background border-border text-foreground text-sm" />
            <Input placeholder="Email" value={coord.email} onChange={(e) => updateCoordinator(type, i, 'email', e.target.value)} className="bg-background border-border text-foreground text-sm" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-base">Coordinators Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
        ) : (
          <>
            {renderCoordinatorList('faculty', form.facultyCoordinators)}
            {renderCoordinatorList('student', form.studentCoordinators)}
            <Button onClick={handleSave} disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saved ? 'Saved!' : 'Save Coordinators'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function ContactSection() {
  const { data: contactContent, isLoading } = useGetContactContent();
  const { mutate: updateContact, isPending } = useUpdateContactContent();
  const [form, setForm] = useState<ContactContent>({
    addressLine1: '',
    addressLine2: '',
    phone: '',
    email: '',
    website: '',
  });
  const [initialized, setInitialized] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isLoading && contactContent && !initialized) {
    setForm(contactContent);
    setInitialized(true);
  }

  const handleSave = () => {
    updateContact(form, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-base">Contact Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-foreground text-sm">Address Line 1</Label>
                <Input value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground text-sm">Address Line 2</Label>
                <Input value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground text-sm">Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground text-sm">Email</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-background border-border text-foreground" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-foreground text-sm">Website</Label>
                <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="bg-background border-border text-foreground" />
              </div>
            </div>
            <Button onClick={handleSave} disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saved ? 'Saved!' : 'Save Contact'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminContentManagement() {
  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="hero" className="border-0">
          <AccordionTrigger className="text-foreground font-semibold bg-muted/50 px-4 rounded-lg hover:no-underline hover:bg-muted">
            Hero Content
          </AccordionTrigger>
          <AccordionContent className="pt-3">
            <HeroSection />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="about" className="border-0">
          <AccordionTrigger className="text-foreground font-semibold bg-muted/50 px-4 rounded-lg hover:no-underline hover:bg-muted">
            About Content
          </AccordionTrigger>
          <AccordionContent className="pt-3">
            <AboutSection />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="event" className="border-0">
          <AccordionTrigger className="text-foreground font-semibold bg-muted/50 px-4 rounded-lg hover:no-underline hover:bg-muted">
            Event Details Content
          </AccordionTrigger>
          <AccordionContent className="pt-3">
            <EventDetailsSection />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="coordinators" className="border-0">
          <AccordionTrigger className="text-foreground font-semibold bg-muted/50 px-4 rounded-lg hover:no-underline hover:bg-muted">
            Coordinators Content
          </AccordionTrigger>
          <AccordionContent className="pt-3">
            <CoordinatorsSection />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="contact" className="border-0">
          <AccordionTrigger className="text-foreground font-semibold bg-muted/50 px-4 rounded-lg hover:no-underline hover:bg-muted">
            Contact Content
          </AccordionTrigger>
          <AccordionContent className="pt-3">
            <ContactSection />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
