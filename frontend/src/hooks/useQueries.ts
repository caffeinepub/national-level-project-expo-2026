import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import {
  HeroContent, AboutContent, EventDetailsContent,
  CoordinatorsContent, ContactContent, RegistrationRecord,
  GalleryImage, UserProfile, ExternalBlob,
} from '../backend';

// ─── Registration Queries ────────────────────────────────────────────────────

export function useGetRegistrationCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ['registrationCount'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getRegistrationCount();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useGetAllRegistrations() {
  const { actor, isFetching } = useActor();
  return useQuery<RegistrationRecord[]>({
    queryKey: ['allRegistrationRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRegistrationRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      fullName: string; email: string; phoneNumber: string;
      collegeName: string; department: string; projectTitle: string;
      category: string; abstract: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitRegistration(
        data.fullName, data.email, data.phoneNumber,
        data.collegeName, data.department, data.projectTitle,
        data.category, data.abstract
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrationCount'] });
      queryClient.invalidateQueries({ queryKey: ['allRegistrationRecords'] });
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
      queryClient.invalidateQueries({ queryKey: ['allRegistrationRecords'] });
      queryClient.invalidateQueries({ queryKey: ['registrationCount'] });
    },
  });
}

export function useGetRegistrationByEmail() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRegistrationByEmail(email);
    },
  });
}

// ─── Content Queries ─────────────────────────────────────────────────────────

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

// ─── Gallery Queries ──────────────────────────────────────────────────────────

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
    mutationFn: async ({ title, imageBlob }: { title: string; imageBlob: Uint8Array }) => {
      if (!actor) throw new Error('Actor not available');
      // Cast to Uint8Array<ArrayBuffer> as required by ExternalBlob.fromBytes
      const blob = ExternalBlob.fromBytes(imageBlob.buffer instanceof ArrayBuffer
        ? (imageBlob as unknown as Uint8Array<ArrayBuffer>)
        : new Uint8Array(imageBlob) as unknown as Uint8Array<ArrayBuffer>
      );
      return actor.addGalleryImage(title, blob);
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

// ─── User Profile Queries ─────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}
