import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    email: string;
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteRegistration(id: bigint): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getRegistrationByEmail(email: string): Promise<Registration | null>;
    getRegistrationCount(): Promise<bigint>;
    getRegistrations(): Promise<Array<Registration>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitRegistration(fullName: string, email: string, phoneNumber: string, collegeName: string, department: string, projectTitle: string, category: string, abstract: string): Promise<bigint>;
    updateRegistration(id: bigint, fullName: string, email: string, phoneNumber: string, collegeName: string, department: string, projectTitle: string, category: string, abstract: string): Promise<boolean>;
    verifyAdminCredentials(email: string, password: string): Promise<boolean>;
}
