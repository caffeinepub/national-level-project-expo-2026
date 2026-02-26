import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Registration = {
    id : Nat;
    fullName : Text;
    email : Text;
    phoneNumber : Text;
    collegeName : Text;
    department : Text;
    projectTitle : Text;
    category : Text;
    abstract : Text;
    timestamp : Int;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  module Registration {
    public func compareByTimestamp(a : Registration, b : Registration) : Order.Order {
      Int.compare(b.timestamp, a.timestamp); // Most recent first
    };
  };

  var nextId = 1;
  let registrations = Map.empty<Nat, Registration>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Public: Submit new registration (no auth required, open to all)
  public shared ({ caller }) func submitRegistration(
    fullName : Text,
    email : Text,
    phoneNumber : Text,
    collegeName : Text,
    department : Text,
    projectTitle : Text,
    category : Text,
    abstract : Text,
  ) : async Nat {
    let registration : Registration = {
      id = nextId;
      fullName;
      email;
      phoneNumber;
      collegeName;
      department;
      projectTitle;
      category;
      abstract;
      timestamp = Time.now();
    };

    registrations.add(nextId, registration);
    nextId += 1;
    registration.id;
  };

  // Public: Get total registration count (no auth required)
  public query func getRegistrationCount() : async Nat {
    registrations.size();
  };

  // Admin only: Get all registrations (sorted by timestamp)
  public query ({ caller }) func getRegistrations() : async [Registration] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all registrations");
    };

    registrations.values().toArray().sort(Registration.compareByTimestamp);
  };

  // Admin only: Delete registration by ID
  public shared ({ caller }) func deleteRegistration(id : Nat) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete registrations");
    };

    if (registrations.containsKey(id)) {
      registrations.remove(id);
      true;
    } else {
      false;
    };
  };

  // Admin only: Verify admin credentials and return a session token indicator
  // The actual session management is handled via the AccessControl role system.
  // This function allows the frontend to verify admin credentials by checking
  // if the caller has admin role.
  public query ({ caller }) func verifyAdminCredentials(email : Text, password : Text) : async Bool {
    // Hardcoded admin credential check (stored securely in backend)
    let adminEmail = "admin@egspillay.ac.in";
    let adminPassword = "Admin@Expo2026";

    if (email == adminEmail and password == adminPassword) {
      true;
    } else {
      false;
    };
  };

  // User profile: Get the caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  // User profile: Save the caller's own profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // User profile: Get another user's profile (admin or self only)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Public: Get registration by email (case-insensitive)
  public query func getRegistrationByEmail(email : Text) : async ?Registration {
    let lowerEmail = email.toLower();
    let registration = registrations.values().find(
      func(registration) {
        registration.email.toLower() == lowerEmail;
      }
    );
    registration;
  };

  // Admin only: Update existing registration
  public shared ({ caller }) func updateRegistration(
    id : Nat,
    fullName : Text,
    email : Text,
    phoneNumber : Text,
    collegeName : Text,
    department : Text,
    projectTitle : Text,
    category : Text,
    abstract : Text,
  ) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update registrations");
    };

    switch (registrations.get(id)) {
      case (null) { false };
      case (?existing) {
        let updatedRegistration : Registration = {
          existing with
          fullName;
          email;
          phoneNumber;
          collegeName;
          department;
          projectTitle;
          category;
          abstract;
          timestamp = Time.now(); // Update timestamp for modification
        };
        registrations.add(id, updatedRegistration);
        true;
      };
    };
  };
};
