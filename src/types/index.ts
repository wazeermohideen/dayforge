/**
 * Type Definitions for DayForge Application
 *
 * Contains all TypeScript interfaces and types used throughout the application
 */

/**
 * Represents a single todo/task item
 */
export interface Todo {
  id: string;
  task: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Request payload for creating a new todo
 */
export interface CreateTodoRequest {
  task: string;
  priority: "High" | "Medium" | "Low";
  completed?: boolean;
}

/**
 * Request payload for updating an existing todo
 */
export interface UpdateTodoRequest {
  task?: string;
  priority?: "High" | "Medium" | "Low";
  completed?: boolean;
}

/**
 * Represents user habits and preferences for schedule generation
 */
export interface Habits {
  workStartTime: string;
  workEndTime: string;
  breakDuration: number;
  breakFrequency: number;
  focusArea: string;
}

/**
 * Represents a single scheduled item in the daily schedule
 */
export interface ScheduleItem {
  time: string;
  task: string;
  duration: string;
  breakDuration?: string | number;
}

/**
 * Request payload for generating a schedule
 */
export interface GenerateScheduleRequest {
  todos: Todo[];
  habits: Habits;
}

/**
 * MSAL Configuration object structure
 */
export interface MSALConfig {
  auth: {
    clientId: string;
    authority: string;
    redirectUri: string;
  };
  cache: {
    cacheLocation: "sessionStorage" | "localStorage";
    storeAuthStateInCookie: boolean;
  };
}

/**
 * Login request configuration
 */
export interface LoginRequest {
  scopes: string[];
}

/**
 * API request configuration
 */
export interface ApiRequest {
  scopes: string[];
}

/**
 * User account information from MSAL
 */
export interface UserAccount {
  name?: string;
  username?: string;
  [key: string]: any;
}
