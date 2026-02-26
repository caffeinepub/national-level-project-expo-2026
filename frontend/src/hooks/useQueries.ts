import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Registration } from '../backend';

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
      if (!actor) return [];
      return actor.getRegistrations();
    },
    enabled: !!actor && !isFetching,
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
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyAdminCredentials(email, password);
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
