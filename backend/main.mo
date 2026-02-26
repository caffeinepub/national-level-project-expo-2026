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

  public type HeroContent = {
    eventTitle : Text;
    tagline : Text;
    eventDate : Text;
    collegeName : Text;
  };

  public type FeatureCard = {
    title : Text;
    description : Text;
    icon : Text;
  };

  public type AboutContent = {
    sectionDescription : Text;
    featureCards : [FeatureCard];
  };

  public type TimelineMilestone = {
    milestoneLabel : Text;
    date : Text;
  };

  public type EventDetailsContent = {
    eventDate : Text;
    venue : Text;
    registrationFee : Text;
    eligibilityCriteria : Text;
    projectCategories : [Text];
    timelineMilestones : [TimelineMilestone];
  };

  public type Coordinator = {
    name : Text;
    role : Text;
    phone : Text;
    email : Text;
  };

  public type CoordinatorsContent = {
    facultyCoordinators : [Coordinator];
    studentCoordinators : [Coordinator];
  };

  public type ContactContent = {
    addressLine1 : Text;
    addressLine2 : Text;
    phone : Text;
    email : Text;
    website : Text;
  };

  module Registration {
    public func compareByTimestamp(a : Registration, b : Registration) : Order.Order {
      Int.compare(b.timestamp, a.timestamp); // Most recent first
    };
  };

  var nextId = 1;
  let registrations = Map.empty<Nat, Registration>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var heroContent : ?HeroContent = null;
  var aboutContent : ?AboutContent = null;
  var eventDetailsContent : ?EventDetailsContent = null;
  var coordinatorsContent : ?CoordinatorsContent = null;
  var contactContent : ?ContactContent = null;

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

  // Verify admin credentials — open to any caller (returns bool, no sensitive data exposed).
  // Actual privileged actions are still guarded by AccessControl.isAdmin checks.
  public query ({ caller }) func verifyAdminCredentials(email : Text, password : Text) : async Bool {
    let adminEmail = "athiakash1977@gmail.com";
    let adminPassword = "Akash@8667099605";

    if (email == adminEmail and password == adminPassword) {
      true;
    } else {
      false;
    };
  };

  // User profile: Get the caller's own profile (no auth check needed — anonymous gets null)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  // User profile: Save the caller's own profile (requires at least #user role — guests/anonymous cannot save)
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // User profile: Get another user's profile (admin or self only)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Admin only: Get registration by email — exposes personal data so restricted to admins
  public query ({ caller }) func getRegistrationByEmail(email : Text) : async ?Registration {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can search registrations by email");
    };
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
          timestamp = Time.now();
        };
        registrations.add(id, updatedRegistration);
        true;
      };
    };
  };

  // Editable content functions

  // Hero Section

  public query func getHeroContent() : async ?HeroContent {
    heroContent;
  };

  public shared ({ caller }) func updateHeroContent(content : HeroContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update hero content");
    };
    heroContent := ?content;
  };

  // About Section

  public query func getAboutContent() : async ?AboutContent {
    aboutContent;
  };

  public shared ({ caller }) func updateAboutContent(content : AboutContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update about content");
    };
    aboutContent := ?content;
  };

  // Event Details Section

  public query func getEventDetailsContent() : async ?EventDetailsContent {
    eventDetailsContent;
  };

  public shared ({ caller }) func updateEventDetailsContent(content : EventDetailsContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update event details content");
    };
    eventDetailsContent := ?content;
  };

  // Coordinators Section

  public query func getCoordinatorsContent() : async ?CoordinatorsContent {
    coordinatorsContent;
  };

  public shared ({ caller }) func updateCoordinatorsContent(content : CoordinatorsContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update coordinators content");
    };
    coordinatorsContent := ?content;
  };

  // Contact Section

  public query func getContactContent() : async ?ContactContent {
    contactContent;
  };

  public shared ({ caller }) func updateContactContent(content : ContactContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update contact content");
    };
    contactContent := ?content;
  };
};
