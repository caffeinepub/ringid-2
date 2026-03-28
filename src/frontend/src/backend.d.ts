import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ViewerCount = bigint;
export type HostName = string;
export type Time = bigint;
export type RoomTitle = string;
export type MessageTimestamp = bigint;
export type RoomMessage = string;
export type RoomId = bigint;
export interface Room {
    id: RoomId;
    startTime: Time;
    title: RoomTitle;
    thumbnailUrl: ThumbnailURL;
    hostName: HostName;
    isActive: boolean;
    viewerCount: ViewerCount;
}
export type SenderName = string;
export type ThumbnailURL = string;
export type ChatRoomId = bigint;
export interface ChatMessage {
    message: RoomMessage;
    timestamp: MessageTimestamp;
    senderName: SenderName;
    roomId: ChatRoomId;
}
export interface UserProfile {
    displayName: string;
    avatarUrl: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createRoom(title: string, hostName: string, thumbnailUrl: string): Promise<bigint>;
    getAllMessages(): Promise<Array<ChatMessage>>;
    getAllProfiles(): Promise<Array<UserProfile>>;
    getAllRooms(): Promise<Array<Room>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatMessages(roomId: bigint): Promise<Array<ChatMessage>>;
    getLiveRooms(): Promise<Array<Room>>;
    getMessagesByRoom(roomId: bigint): Promise<Array<ChatMessage>>;
    getProfile(user: Principal): Promise<UserProfile>;
    getRoom(id: bigint): Promise<Room>;
    getTotalRooms(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    joinRoom(roomId: bigint): Promise<void>;
    saveCallerUserProfile(displayName: string, avatarUrl: string): Promise<void>;
    sendChatMessage(roomId: bigint, senderName: string, message: string): Promise<void>;
    updateProfile(displayName: string, avatarUrl: string): Promise<void>;
}
