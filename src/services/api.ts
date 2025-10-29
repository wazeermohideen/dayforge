/**
 * API Service Layer
 *
 * This module provides centralized API communication with the backend.
 * It handles:
 * - Automatic JWT token acquisition and attachment to requests
 * - Error handling and response processing
 * - All CRUD operations for todos and schedule generation
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { PublicClientApplication } from "@azure/msal-browser";
import { apiRequest } from "../authConfig";
import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  ScheduleItem,
  Habits,
} from "../types";

// Get backend URL from environment variable or use default
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://todoapi.azurewebsites.net";

/**
 * Create an Axios instance with base configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Initialize API service with MSAL instance for token acquisition
 * @param msalInstance - MSAL instance for authentication
 */
let msalInstance: PublicClientApplication | null = null;

export const initializeApi = (msalInstanceParam: PublicClientApplication): void => {
  msalInstance = msalInstanceParam;

  // Add request interceptor to attach JWT token to all API calls
  apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        // Acquire token silently from MSAL
        if (!msalInstance) {
          throw new Error("MSAL instance not initialized");
        }

        const accounts = msalInstance.getAllAccounts();
        if (accounts.length === 0) {
          throw new Error("No user account found");
        }

        const response = await msalInstance.acquireTokenSilent({
          ...apiRequest,
          account: accounts[0],
        });

        // Attach token to Authorization header
        config.headers.Authorization = `Bearer ${response.accessToken}`;
      } catch (error) {
        console.error("Error acquiring token:", error);
        // Return config even if token acquisition fails
        // The backend will handle unauthorized requests
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Error:", error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
};

/**
 * Fetch all todos for the current user
 * @returns Array of todo items
 */
export const getTodos = async (): Promise<Todo[]> => {
  try {
    const response = await apiClient.get<Todo[]>("/todos");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
};

/**
 * Create a new todo item
 * @param todoData - Todo data { task: string, priority: string, completed: boolean }
 * @returns Created todo item with ID
 */
export const createTodo = async (todoData: CreateTodoRequest): Promise<Todo> => {
  try {
    const response = await apiClient.post<Todo>("/todos", {
      task: todoData.task,
      priority: todoData.priority,
      completed: todoData.completed || false,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
};

/**
 * Update an existing todo item (primarily for marking complete/incomplete)
 * @param id - Todo ID
 * @param updateData - Partial todo data to update
 * @returns Updated todo item
 */
export const updateTodo = async (
  id: string,
  updateData: UpdateTodoRequest
): Promise<Todo> => {
  try {
    const response = await apiClient.put<Todo>(`/todos/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
};

/**
 * Delete a todo item
 * @param id - Todo ID
 */
export const deleteTodo = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/todos/${id}`);
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
};

/**
 * Generate AI-powered daily schedule
 * @param todos - Array of todo items
 * @param habits - User habits object (work hours, break preferences, etc.)
 * @returns Generated schedule [ { time, task, duration, breakDuration } ]
 */
export const generateSchedule = async (
  todos: Todo[],
  habits: Habits
): Promise<ScheduleItem[]> => {
  try {
    const response = await apiClient.post<ScheduleItem[]>("/schedule", {
      todos,
      habits,
    });
    return response.data || [];
  } catch (error) {
    console.error("Error generating schedule:", error);
    throw error;
  }
};

export default apiClient;
