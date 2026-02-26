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
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

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

  public type AdminCredentials = {
    email : Text;
    password : Text;
  };

  public type AdminDetails = {
    adminName : Text;
  };

  public type GalleryImage = {
    id : Text;
    title : Text;
    imageBlob : Storage.ExternalBlob;
    uploadedAt : Int;
  };

  var nextId = 1;
  let registrations = Map.empty<Nat, Registration>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var heroContent : ?HeroContent = null;
  var aboutContent : ?AboutContent = null;
  var eventDetailsContent : ?EventDetailsContent = null;
  var coordinatorsContent : ?CoordinatorsContent = null;
  var contactContent : ?ContactContent = null;
  var galleryImages = Map.empty<Text, GalleryImage>();

  // Anyone (including guests) can submit a registration
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

  // Public: anyone can see the registration count
  public query func getRegistrationCount() : async Nat {
    registrations.size();
  };

  // Admin only: view all registrations
  public query ({ caller }) func getRegistrations() : async [Registration] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all registrations");
    };

    registrations.values().toArray().sort(Registration.compareByTimestamp);
  };

  // Admin only: delete a registration
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

  // Authenticated users only: get their own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get their profile");
    };
    userProfiles.get(caller);
  };

  // Authenticated users only: save their own profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Users can view their own profile; admins can view any profile
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Admin only: search registration by email
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

  // Admin only: update a registration
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

  // Public: anyone can read CMS content
  public query func getHeroContent() : async ?HeroContent {
    heroContent;
  };

  // Admin only: update hero content
  public shared ({ caller }) func updateHeroContent(content : HeroContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update hero content");
    };
    heroContent := ?content;
  };

  // Public: anyone can read about content
  public query func getAboutContent() : async ?AboutContent {
    aboutContent;
  };

  // Admin only: update about content
  public shared ({ caller }) func updateAboutContent(content : AboutContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update about content");
    };
    aboutContent := ?content;
  };

  // Public: anyone can read event details content
  public query func getEventDetailsContent() : async ?EventDetailsContent {
    eventDetailsContent;
  };

  // Admin only: update event details content
  public shared ({ caller }) func updateEventDetailsContent(content : EventDetailsContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update event details content");
    };
    eventDetailsContent := ?content;
  };

  // Public: anyone can read coordinators content
  public query func getCoordinatorsContent() : async ?CoordinatorsContent {
    coordinatorsContent;
  };

  // Admin only: update coordinators content
  public shared ({ caller }) func updateCoordinatorsContent(content : CoordinatorsContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update coordinators content");
    };
    coordinatorsContent := ?content;
  };

  // Public: anyone can read contact content
  public query func getContactContent() : async ?ContactContent {
    contactContent;
  };

  // Admin only: update contact content
  public shared ({ caller }) func updateContactContent(content : ContactContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update contact content");
    };
    contactContent := ?content;
  };

  // Public: anyone can view gallery images
  public query func getGalleryImages() : async [GalleryImage] {
    galleryImages.values().toArray();
  };

  // Admin only: add a gallery image
  public shared ({ caller }) func addGalleryImage(
    title : Text,
    imageBlob : Storage.ExternalBlob,
  ) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add gallery images");
    };

    let id = Time.now().toText();
    let newImage : GalleryImage = {
      id;
      title;
      imageBlob;
      uploadedAt = Time.now();
    };

    galleryImages.add(id, newImage);
    id;
  };

  // Admin only: delete a gallery image
  public shared ({ caller }) func deleteGalleryImage(id : Text) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete gallery images");
    };

    if (galleryImages.containsKey(id)) {
      galleryImages.remove(id);
      true;
    } else {
      false;
    };
  };
};
