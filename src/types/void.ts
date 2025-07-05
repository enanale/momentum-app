import type { Timestamp, FieldValue } from 'firebase/firestore';

/**
 * Represents a moment when the user feels stuck and needs guidance.
 * Each entry can optionally have an associated next action.
 */
export interface VoidEntry {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  userId: string;
  nextAction?: NextAction;
}

/**
 * Represents a concrete next action that the user can take to move forward.
 * Actions are typically created from a Void entry and can be completed.
 */
export interface NextAction {
  id: string;
  /**
   * A detailed description of what's blocking the user.
   * Should be between 10 and 500 characters.
   */
  description: string;
  estimatedMinutes: number;
  completed: boolean;
  createdAt: Timestamp;
  completedAt?: Timestamp | FieldValue;
  voidId?: string;
  /**
   * The description of the original Void that this action addresses.
   */
  voidDescription?: string;
  userId: string;
}

/**
 * The following types are used for form handling and data input.
 * They represent the shape of data before it is saved to Firestore.
 */
/**
 * Represents a new next action being created through the form.
 * Differs from NextAction as it doesn't include server-generated fields.
 */
export interface NewNextAction {
  /**
   * A detailed description of what's blocking the user.
   * Should be between 10 and 500 characters.
   */
  description: string;
  /**
   * Estimated time in minutes to complete the action.
   * Must be between 1 and 120 minutes.
   */
  estimatedMinutes?: number;
  completed: boolean;
}

/**
 * Form data for creating a new Void entry.
 * All fields are required except nextAction.
 */
export interface VoidFormData {
  title: string;
  /**
   * A detailed description of what's blocking the user.
   * Should be between 10 and 500 characters.
   */
  description: string;
  nextAction?: NewNextAction;
}
