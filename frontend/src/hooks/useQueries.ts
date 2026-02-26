import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Registration,
  HeroContent,
  AboutContent,
  EventDetailsContent,
  CoordinatorsContent,
  ContactContent,
  GalleryImage,
} from '../backend';
import { ExternalBlob } from '../backend';

export function useGetRegistrationCount() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['registrationCount'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getRegistrationCount();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useGetRegistrations() {
  const { actor, isFetching } = useActor();

  return useQuery<Registration[]>({
    queryKey: ['registrations'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getRegistrations();
      return Array.isArray(result) ? result : [];
    },
    enabled: !!actor && !isFetching,
    retry: 1,
    retryDelay: 1000,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useSubmitRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      fullName: string;
      email: string;
      phoneNumber: string;
      collegeName: string;
      department: string;
      projectTitle: string;
      category: string;
      abstract: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitRegistration(
        data.fullName,
        data.email,
        data.phoneNumber,
        data.collegeName,
        data.department,
        data.projectTitle,
        data.category,
        data.abstract
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrationCount'] });
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
  });
}

export function useDeleteRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteRegistration(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      queryClient.invalidateQueries({ queryKey: ['registrationCount'] });
    },
  });
}

export function useUpdateRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      fullName: string;
      email: string;
      phoneNumber: string;
      collegeName: string;
      department: string;
      projectTitle: string;
      category: string;
      abstract: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRegistration(
        data.id,
        data.fullName,
        data.email,
        data.phoneNumber,
        data.collegeName,
        data.department,
        data.projectTitle,
        data.category,
        data.abstract
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
  });
}

export function useVerifyAdminCredentials() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (_credentials: { email: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend uses Internet Identity principal for admin verification
      return actor.isCallerAdmin();
    },
  });
}

export function useGetRegistrationByEmail(email: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Registration | null>({
    queryKey: ['registrationByEmail', email],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRegistrationByEmail(email);
    },
    enabled: !!actor && !isFetching && email.trim().length > 0,
    retry: false,
  });
}

// ─── Content Getter Hooks ────────────────────────────────────────────────────

export function useGetHeroContent() {
  const { actor, isFetching } = useActor();

  return useQuery<HeroContent | null>({
    queryKey: ['heroContent'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHeroContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAboutContent() {
  const { actor, isFetching } = useActor();

  return useQuery<AboutContent | null>({
    queryKey: ['aboutContent'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAboutContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEventDetailsContent() {
  const { actor, isFetching } = useActor();

  return useQuery<EventDetailsContent | null>({
    queryKey: ['eventDetailsContent'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getEventDetailsContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCoordinatorsContent() {
  const { actor, isFetching } = useActor();

  return useQuery<CoordinatorsContent | null>({
    queryKey: ['coordinatorsContent'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCoordinatorsContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetContactContent() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactContent | null>({
    queryKey: ['contactContent'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getContactContent();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Content Mutation Hooks ──────────────────────────────────────────────────

export function useUpdateHeroContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: HeroContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateHeroContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroContent'] });
    },
  });
}

export function useUpdateAboutContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: AboutContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAboutContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aboutContent'] });
    },
  });
}

export function useUpdateEventDetailsContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: EventDetailsContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEventDetailsContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventDetailsContent'] });
    },
  });
}

export function useUpdateCoordinatorsContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: CoordinatorsContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCoordinatorsContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coordinatorsContent'] });
    },
  });
}

export function useUpdateContactContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: ContactContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContactContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactContent'] });
    },
  });
}

// ─── Gallery Hooks ───────────────────────────────────────────────────────────

export function useGetGalleryImages() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryImage[]>({
    queryKey: ['galleryImages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGalleryImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; imageBlob: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGalleryImage(data.title, data.imageBlob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
    },
  });
}

export function useDeleteGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGalleryImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
    },
  });
}
