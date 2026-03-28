import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatMessage, Room, UserProfile } from "../backend";
import { useActor } from "./useActor";

export type { Room, ChatMessage, UserProfile };

export function useGetLiveRooms() {
  const { actor, isFetching } = useActor();
  return useQuery<Room[]>({
    queryKey: ["liveRooms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLiveRooms();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15000,
  });
}

export function useGetChatMessages(roomId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<ChatMessage[]>({
    queryKey: ["chatMessages", roomId?.toString()],
    queryFn: async () => {
      if (!actor || roomId === null) return [];
      return actor.getChatMessages(roomId);
    },
    enabled: !!actor && !isFetching && roomId !== null,
    refetchInterval: 3000,
  });
}

export function useGetCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roomId,
      senderName,
      message,
    }: { roomId: bigint; senderName: string; message: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.sendChatMessage(roomId, senderName, message);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["chatMessages", vars.roomId.toString()],
      });
    },
  });
}

export function useCreateRoom() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      hostName,
      thumbnailUrl,
    }: { title: string; hostName: string; thumbnailUrl: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.createRoom(title, hostName, thumbnailUrl);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["liveRooms"] });
    },
  });
}

export function useJoinRoom() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (roomId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.joinRoom(roomId);
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      displayName,
      avatarUrl,
    }: { displayName: string; avatarUrl: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.saveCallerUserProfile(displayName, avatarUrl);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}
