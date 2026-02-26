import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CommissionEntry, Stats, FrontPhoto } from '../backend';

export function useGetAllCommissions() {
  const { actor, isFetching } = useActor();

  return useQuery<CommissionEntry[]>({
    queryKey: ['commissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCommissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStats() {
  const { actor, isFetching } = useActor();

  return useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: async () => {
      if (!actor) {
        return {
          totalTransactions: BigInt(0),
          totalTransactionVolume: 0,
          totalCommissionEarned: 0,
          averageCommissionRate: 0,
        };
      }
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCommission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      transactionId: string;
      transactionAmount: number;
      commissionRate: number;
      transactionDate: bigint;
      merchantName: string;
      category: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addCommission(
        params.transactionId,
        params.transactionAmount,
        params.commissionRate,
        params.transactionDate,
        params.merchantName,
        params.category
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useDeleteCommission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteCommission(transactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useCustomerPhotos() {
  const { actor, isFetching } = useActor();

  return useQuery<FrontPhoto[]>({
    queryKey: ['customerPhotos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPhotos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCustomerPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; photo: FrontPhoto }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addPhoto(params.id, params.photo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerPhotos'] });
    },
  });
}

export function useDeleteCustomerPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deletePhoto(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerPhotos'] });
    },
  });
}
