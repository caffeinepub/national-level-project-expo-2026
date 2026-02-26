import Array "mo:core/Array";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
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

  public query func getRegistrationCount() : async Nat {
    registrations.size();
  };

  public query ({ caller }) func getRegistrations() : async [Registration] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all registrations");
    };
    registrations.values().toArray().sort(Registration.compareByTimestamp);
  };

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

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

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

  public query func getHeroContent() : async ?HeroContent {
    heroContent;
  };

  public shared ({ caller }) func updateHeroContent(content : HeroContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update hero content");
    };
    heroContent := ?content;
  };

  public query func getAboutContent() : async ?AboutContent {
    aboutContent;
  };

  public shared ({ caller }) func updateAboutContent(content : AboutContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update about content");
    };
    aboutContent := ?content;
  };

  public query func getEventDetailsContent() : async ?EventDetailsContent {
    eventDetailsContent;
  };

  public shared ({ caller }) func updateEventDetailsContent(content : EventDetailsContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update event details content");
    };
    eventDetailsContent := ?content;
  };

  public query func getCoordinatorsContent() : async ?CoordinatorsContent {
    coordinatorsContent;
  };

  public shared ({ caller }) func updateCoordinatorsContent(content : CoordinatorsContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update coordinators content");
    };
    coordinatorsContent := ?content;
  };

  public query func getContactContent() : async ?ContactContent {
    contactContent;
  };

  public shared ({ caller }) func updateContactContent(content : ContactContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update contact content");
    };
    contactContent := ?content;
  };

  public query func getGalleryImages() : async [GalleryImage] {
    galleryImages.values().toArray();
  };

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
