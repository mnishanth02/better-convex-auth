/**
 * Organization Types
 *
 * Type definitions for multi-tenancy and organizations.
 */

/**
 * Organization role types.
 */
export type OrganizationRole = "owner" | "admin" | "member";

/**
 * Organization object from the database.
 */
export interface Organization {
  /** Unique organization ID (Convex document ID) */
  _id: string;

  /** Organization name */
  name: string;

  /** URL-friendly slug */
  slug: string;

  /** Organization description */
  description?: string;

  /** Organization logo/image URL */
  image?: string;

  /** Owner user ID */
  ownerId: string;

  /** Organization metadata */
  metadata?: Record<string, any>;

  /** Timestamp when organization was created */
  createdAt: number;

  /** Timestamp when organization was last updated */
  updatedAt: number;
}

/**
 * Organization member object from the database.
 */
export interface OrganizationMember {
  /** Unique member ID (Convex document ID) */
  _id: string;

  /** Organization ID */
  organizationId: string;

  /** User ID */
  userId: string;

  /** Member role */
  role: OrganizationRole;

  /** Timestamp when user joined */
  joinedAt: number;

  /** Custom permissions (optional, for fine-grained control) */
  permissions?: string[];
}

/**
 * Organization invitation object from the database.
 */
export interface OrganizationInvitation {
  /** Unique invitation ID (Convex document ID) */
  _id: string;

  /** Organization ID */
  organizationId: string;

  /** Invitee email address */
  email: string;

  /** Role to be assigned */
  role: OrganizationRole;

  /** User ID who sent the invitation */
  invitedBy: string;

  /** Invitation token */
  token: string;

  /** Invitation expiry timestamp */
  expiresAt: number;

  /** Invitation status */
  status: "pending" | "accepted" | "declined" | "expired";

  /** Timestamp when invitation was created */
  createdAt: number;

  /** Timestamp when invitation was accepted/declined (if applicable) */
  respondedAt?: number;
}

/**
 * Organization with member count.
 */
export interface OrganizationWithStats extends Organization {
  /** Number of members */
  memberCount: number;

  /** Number of pending invitations */
  pendingInvitations: number;

  /** Current user's role in this organization */
  currentUserRole?: OrganizationRole;
}

/**
 * Organization member with user information.
 */
export interface OrganizationMemberWithUser extends OrganizationMember {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    emailVerified: boolean;
  };
}

/**
 * Organization invitation with organization information.
 */
export interface OrganizationInvitationWithOrg extends OrganizationInvitation {
  organization: {
    name: string;
    slug: string;
    image?: string;
  };
  inviter: {
    name?: string;
    email: string;
  };
}

/**
 * Organization creation input.
 */
export interface CreateOrganizationInput {
  /** Organization name */
  name: string;

  /** URL-friendly slug (must be unique) */
  slug: string;

  /** Organization description */
  description?: string;

  /** Organization logo/image URL */
  image?: string;

  /** Organization metadata */
  metadata?: Record<string, any>;
}

/**
 * Organization update input.
 */
export interface UpdateOrganizationInput {
  /** Organization name */
  name?: string;

  /** Organization description */
  description?: string;

  /** Organization logo/image URL */
  image?: string;

  /** Organization metadata */
  metadata?: Record<string, any>;
}

/**
 * Invite member input.
 */
export interface InviteMemberInput {
  /** Organization ID */
  organizationId: string;

  /** Invitee email address */
  email: string;

  /** Role to assign */
  role: OrganizationRole;

  /** Custom message to include in invitation email */
  message?: string;
}

/**
 * Update member role input.
 */
export interface UpdateMemberRoleInput {
  /** Organization ID */
  organizationId: string;

  /** User ID of member to update */
  userId: string;

  /** New role */
  role: OrganizationRole;
}

/**
 * Remove member input.
 */
export interface RemoveMemberInput {
  /** Organization ID */
  organizationId: string;

  /** User ID of member to remove */
  userId: string;
}

/**
 * Accept invitation input.
 */
export interface AcceptInvitationInput {
  /** Invitation token */
  token: string;
}

/**
 * Organization permissions.
 */
export interface OrganizationPermissions {
  /** Can view organization details */
  read: boolean;

  /** Can update organization settings */
  update: boolean;

  /** Can delete organization */
  delete: boolean;

  /** Can invite new members */
  inviteMembers: boolean;

  /** Can remove members */
  removeMembers: boolean;

  /** Can change member roles */
  changeMemberRoles: boolean;

  /** Can transfer ownership */
  transferOwnership: boolean;
}

/**
 * Helper function to get permissions for a role.
 */
export function getOrganizationPermissions(role: OrganizationRole): OrganizationPermissions {
  switch (role) {
    case "owner":
      return {
        read: true,
        update: true,
        delete: true,
        inviteMembers: true,
        removeMembers: true,
        changeMemberRoles: true,
        transferOwnership: true,
      };
    case "admin":
      return {
        read: true,
        update: true,
        delete: false,
        inviteMembers: true,
        removeMembers: true,
        changeMemberRoles: true,
        transferOwnership: false,
      };
    case "member":
      return {
        read: true,
        update: false,
        delete: false,
        inviteMembers: false,
        removeMembers: false,
        changeMemberRoles: false,
        transferOwnership: false,
      };
  }
}

/**
 * Organization context for RLS and authorization.
 */
export interface OrganizationContext {
  /** Current organization ID */
  organizationId: string;

  /** Current user's role in the organization */
  role: OrganizationRole;

  /** Current user's permissions */
  permissions: OrganizationPermissions;
}
