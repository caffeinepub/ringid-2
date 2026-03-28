import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // TYPES

  type RoomId = Nat;
  type RoomTitle = Text;
  type HostName = Text;
  type ViewerCount = Nat;
  type ThumbnailURL = Text;
  type SenderName = Text;
  type RoomMessage = Text;
  type ChatRoomId = Nat;
  type MessageTimestamp = Time.Time;

  type Room = {
    id : RoomId;
    title : RoomTitle;
    hostName : HostName;
    thumbnailUrl : ThumbnailURL;
    viewerCount : ViewerCount;
    startTime : Time.Time;
    isActive : Bool;
  };

  type ChatMessage = {
    roomId : ChatRoomId;
    senderName : SenderName;
    message : RoomMessage;
    timestamp : MessageTimestamp;
  };

  type UserProfile = {
    displayName : Text;
    avatarUrl : Text;
  };

  // ACCESS CONTROL
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ROOMS
  var nextRoomId : Nat = 6; // Start after pre-populated rooms
  let rooms = Map.empty<Nat, Room>();

  // Pre-populate with 5 sample live rooms
  rooms.add(1, {
    id = 1;
    title = "Gaming Marathon - Live Now!";
    hostName = "ProGamer123";
    thumbnailUrl = "https://example.com/thumb1.jpg";
    viewerCount = 1523;
    startTime = Time.now() - 3_600_000_000_000; // 1 hour ago
    isActive = true;
  });

  rooms.add(2, {
    id = 2;
    title = "Cooking Show: Italian Cuisine";
    hostName = "ChefMaria";
    thumbnailUrl = "https://example.com/thumb2.jpg";
    viewerCount = 892;
    startTime = Time.now() - 1_800_000_000_000; // 30 minutes ago
    isActive = true;
  });

  rooms.add(3, {
    id = 3;
    title = "Music Jam Session";
    hostName = "DJMike";
    thumbnailUrl = "https://example.com/thumb3.jpg";
    viewerCount = 2341;
    startTime = Time.now() - 7_200_000_000_000; // 2 hours ago
    isActive = true;
  });

  rooms.add(4, {
    id = 4;
    title = "Tech Talk: Web3 Development";
    hostName = "DevSarah";
    thumbnailUrl = "https://example.com/thumb4.jpg";
    viewerCount = 567;
    startTime = Time.now() - 900_000_000_000; // 15 minutes ago
    isActive = true;
  });

  rooms.add(5, {
    id = 5;
    title = "Fitness Workout Live";
    hostName = "FitCoachJohn";
    thumbnailUrl = "https://example.com/thumb5.jpg";
    viewerCount = 1205;
    startTime = Time.now() - 2_700_000_000_000; // 45 minutes ago
    isActive = true;
  });

  // MESSAGES
  var messages = List.empty<ChatMessage>();

  // PROFILES
  let profiles = Map.empty<Principal, UserProfile>();

  // PUBLIC FUNCTIONS - ROOMS

  public query func getLiveRooms() : async [Room] {
    // No authorization needed - public access
    rooms.values().toArray().filter(func(room : Room) : Bool { room.isActive });
  };

  public shared ({ caller }) func createRoom(title : Text, hostName : Text, thumbnailUrl : Text) : async Nat {
    // Only authenticated users can create rooms
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create rooms");
    };

    let roomId = nextRoomId;
    nextRoomId += 1;

    let newRoom : Room = {
      id = roomId;
      title = title;
      hostName = hostName;
      thumbnailUrl = thumbnailUrl;
      viewerCount = 0;
      startTime = Time.now();
      isActive = true;
    };

    rooms.add(roomId, newRoom);
    roomId;
  };

  public shared ({ caller }) func joinRoom(roomId : Nat) : async () {
    // Only authenticated users can join rooms
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can join rooms");
    };

    switch (rooms.get(roomId)) {
      case (null) {
        Runtime.trap("Room does not exist");
      };
      case (?room) {
        if (not room.isActive) {
          Runtime.trap("Room is not active");
        };
        // Update viewer count
        let updatedRoom : Room = {
          id = room.id;
          title = room.title;
          hostName = room.hostName;
          thumbnailUrl = room.thumbnailUrl;
          viewerCount = room.viewerCount + 1;
          startTime = room.startTime;
          isActive = room.isActive;
        };
        rooms.add(roomId, updatedRoom);
      };
    };
  };

  // PUBLIC FUNCTIONS - CHAT

  public shared ({ caller }) func sendChatMessage(roomId : Nat, senderName : Text, message : Text) : async () {
    // Only authenticated users can send messages
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    // Verify room exists and is active
    switch (rooms.get(roomId)) {
      case (null) {
        Runtime.trap("Room does not exist");
      };
      case (?room) {
        if (not room.isActive) {
          Runtime.trap("Room is not active");
        };
      };
    };

    let chatMessage : ChatMessage = {
      roomId = roomId;
      senderName = senderName;
      message = message;
      timestamp = Time.now();
    };

    messages.add(chatMessage);
  };

  public query func getChatMessages(roomId : Nat) : async [ChatMessage] {
    // No authorization needed - public access
    messages.toArray().filter(func(msg : ChatMessage) : Bool { msg.roomId == roomId });
  };

  // PUBLIC FUNCTIONS - PROFILES

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    // Only authenticated users can get their own profile
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Users can only view their own profile, admins can view any profile
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(displayName : Text, avatarUrl : Text) : async () {
    // Only authenticated users can save their profile
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let profile : UserProfile = {
      displayName = displayName;
      avatarUrl = avatarUrl;
    };

    profiles.add(caller, profile);
  };

  public shared ({ caller }) func updateProfile(displayName : Text, avatarUrl : Text) : async () {
    // Only authenticated users can update their profile
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    let profile : UserProfile = {
      displayName = displayName;
      avatarUrl = avatarUrl;
    };

    profiles.add(caller, profile);
  };

  // ADMIN/DEBUG FUNCTIONS (kept for compatibility)

  public query ({ caller }) func getRoom(id : Nat) : async Room {
    // No authorization needed - public access
    switch (rooms.get(id)) {
      case (?room) { room };
      case (null) { Runtime.trap("Room does not exist") };
    };
  };

  public query ({ caller }) func getTotalRooms() : async Nat {
    // No authorization needed - public access
    rooms.size();
  };

  public query ({ caller }) func getAllRooms() : async [Room] {
    // No authorization needed - public access
    rooms.values().toArray();
  };

  public query ({ caller }) func getAllMessages() : async [ChatMessage] {
    // No authorization needed - public access
    messages.toArray();
  };

  public query ({ caller }) func getMessagesByRoom(roomId : Nat) : async [ChatMessage] {
    // No authorization needed - public access
    messages.toArray().filter(func(msg) { msg.roomId == roomId });
  };

  public query ({ caller }) func getProfile(user : Principal) : async UserProfile {
    // No authorization needed - public access to basic profile info
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getAllProfiles() : async [UserProfile] {
    // No authorization needed - public access
    profiles.values().toArray();
  };
};
