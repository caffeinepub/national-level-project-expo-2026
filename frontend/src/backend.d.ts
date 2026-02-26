import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface AboutContent {
    sectionDescription: string;
    featureCards: Array<FeatureCard>;
}
export interface TimelineMilestone {
    milestoneLabel: string;
    date: string;
}
export interface EventDetailsContent {
    venue: string;
    timelineMilestones: Array<TimelineMilestone>;
    projectCategories: Array<string>;
    eligibilityCriteria: string;
    registrationFee: string;
    eventDate: string;
}
export interface Registration {
    id: bigint;
    collegeName: string;
    fullName: string;
    email: string;
    projectTitle: string;
    timestamp: bigint;
    abstract: string;
    category: string;
    department: string;
    phoneNumber: string;
}
export interface CoordinatorsContent {
    studentCoordinators: Array<Coordinator>;
    facultyCoordinators: Array<Coordinator>;
}
export interface HeroContent {
    tagline: string;
    collegeName: string;
    eventTitle: string;
    eventDate: string;
}
export interface ContactContent {
    email: string;
    website: string;
    addressLine1: string;
    addressLine2: string;
    phone: string;
}
export interface GalleryImage {
    id: string;
    title: string;
    imageBlob: ExternalBlob;
    uploadedAt: bigint;
}
export interface FeatureCard {
    title: string;
    icon: string;
    description: string;
}
export interface Coordinator {
    name: string;
    role: string;
    email: string;
    phone: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGalleryImage(title: string, imageBlob: ExternalBlob): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteGalleryImage(id: string): Promise<boolean>;
    deleteRegistration(id: bigint): Promise<boolean>;
    getAboutContent(): Promise<AboutContent | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactContent(): Promise<ContactContent | null>;
    getCoordinatorsContent(): Promise<CoordinatorsContent | null>;
    getEventDetailsContent(): Promise<EventDetailsContent | null>;
    getGalleryImages(): Promise<Array<GalleryImage>>;
    getHeroContent(): Promise<HeroContent | null>;
    getRegistrationByEmail(email: string): Promise<Registration | null>;
    getRegistrationCount(): Promise<bigint>;
    getRegistrations(): Promise<Array<Registration>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitRegistration(fullName: string, email: string, phoneNumber: string, collegeName: string, department: string, projectTitle: string, category: string, abstract: string): Promise<bigint>;
    updateAboutContent(content: AboutContent): Promise<void>;
    updateContactContent(content: ContactContent): Promise<void>;
    updateCoordinatorsContent(content: CoordinatorsContent): Promise<void>;
    updateEventDetailsContent(content: EventDetailsContent): Promise<void>;
    updateHeroContent(content: HeroContent): Promise<void>;
    updateRegistration(id: bigint, fullName: string, email: string, phoneNumber: string, collegeName: string, department: string, projectTitle: string, category: string, abstract: string): Promise<boolean>;
}
