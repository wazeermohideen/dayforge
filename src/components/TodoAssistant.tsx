/**
 * TodoAssistant Component
 *
 * Main application component that includes:
 * - Task input form with priority selection
 * - Task management (list, complete, delete)
 * - Habit questionnaire (collapsible)
 * - AI-generated schedule display
 * - User profile and logout
 */

import React, { FC, useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, TrashIcon, CheckIcon } from "@heroicons/react/20/solid";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  generateSchedule,
} from "../services/api";
import type { Todo, Habits, ScheduleItem, CreateTodoRequest } from "../types";

const TodoAssistant: FC = () => {
  const { instance, accounts } = useMsal();

  // State management
  const [todos, setTodos] = useState<Todo[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  // Form states
  const [taskInput, setTaskInput] = useState<string>("");
  const [priorityInput, setPriorityInput] = useState<"High" | "Medium" | "Low">("Medium");
  const [habits, setHabits] = useState<Habits>({
    workStartTime: "09:00",
    workEndTime: "17:00",
    breakDuration: 15,
    breakFrequency: 60,
    focusArea: "",
  });

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  /**
   * Fetch todos from backend
   */
  const fetchTodos = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle adding a new task
   */
  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const newTodo = await createTodo({
        task: taskInput,
        priority: priorityInput,
        completed: false,
      } as CreateTodoRequest);
      setTodos([...todos, newTodo]);
      setTaskInput("");
      setPriorityInput("Medium");
    } catch (err) {
      setError("Failed to add task. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle marking task as complete/incomplete
   */
  const handleToggleTodo = async (
    id: string,
    currentStatus: boolean
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const updatedTodo = await updateTodo(id, {
        completed: !currentStatus,
      });
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (err) {
      setError("Failed to update task. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle deleting a task
   */
  const handleDeleteTodo = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError("Failed to delete task. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle generating AI schedule
   */
  const handleGenerateSchedule = async (): Promise<void> => {
    if (todos.length === 0) {
      setError("Please add some tasks before generating a schedule.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const generatedSchedule = await generateSchedule(todos, habits);
      setSchedule(generatedSchedule);
      setShowSchedule(true);
    } catch (err) {
      setError("Failed to generate schedule. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle habit input changes
   */
  const handleHabitChange = (
    field: keyof Habits,
    value: string | number
  ): void => {
    setHabits((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handle logout
   */
  const handleLogout = async (): Promise<void> => {
    await instance.logoutPopup({
      postLogoutRedirectUri: "/",
      mainWindowRedirectUri: "/",
    });
  };

  const currentUser: AccountInfo | undefined = accounts[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📅</span>
            <h1 className="text-2xl font-bold text-gray-900">DayForge</h1>
          </div>

          {currentUser && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500">{currentUser.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Task Input and List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Input Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📝 Add a Task
              </h2>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="What do you need to accomplish today?"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                    aria-label="Task input"
                  />
                  <select
                    value={priorityInput}
                    onChange={(e) => setPriorityInput(e.target.value as "High" | "Medium" | "Low")}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                    aria-label="Priority selection"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Add task button"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>

            {/* Habit Questionnaire - Collapsible */}
            <Disclosure defaultOpen={false}>
              {({ open }) => (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Disclosure.Button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">
                      🎯 Your Habits
                    </h2>
                    <ChevronUpIcon
                      className={`w-5 h-5 text-gray-600 transition ${
                        open ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </Disclosure.Button>

                  <Disclosure.Panel className="px-6 py-4 border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Work Start Time
                        </label>
                        <input
                          type="time"
                          value={habits.workStartTime}
                          onChange={(e) =>
                            handleHabitChange("workStartTime", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Work start time"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Work End Time
                        </label>
                        <input
                          type="time"
                          value={habits.workEndTime}
                          onChange={(e) =>
                            handleHabitChange("workEndTime", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Work end time"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Break Duration (minutes)
                        </label>
                        <input
                          type="number"
                          value={habits.breakDuration}
                          onChange={(e) =>
                            handleHabitChange(
                              "breakDuration",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Break duration"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Break Frequency (minutes)
                        </label>
                        <input
                          type="number"
                          value={habits.breakFrequency}
                          onChange={(e) =>
                            handleHabitChange(
                              "breakFrequency",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Break frequency"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Focus Area (e.g., Development, Design, Admin)
                      </label>
                      <input
                        type="text"
                        value={habits.focusArea}
                        onChange={(e) =>
                          handleHabitChange("focusArea", e.target.value)
                        }
                        placeholder="What's your main focus today?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Focus area"
                      />
                    </div>
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>

            {/* Task List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                ✅ Your Tasks ({todos.length})
              </h2>

              {loading && todos.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>Loading tasks...</p>
                </div>
              ) : todos.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No tasks yet. Add one to get started!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() =>
                          handleToggleTodo(todo.id, todo.completed)
                        }
                        disabled={loading}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                          todo.completed
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300 hover:border-green-500"
                        }`}
                        aria-label={`Toggle task: ${todo.task}`}
                        aria-pressed={todo.completed}
                      >
                        {todo.completed && (
                          <CheckIcon className="w-4 h-4 text-white" aria-hidden="true" />
                        )}
                      </button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-gray-900 transition ${
                            todo.completed
                              ? "line-through text-gray-500"
                              : ""
                          }`}
                        >
                          {todo.task}
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded ${
                            todo.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : todo.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {todo.priority}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        disabled={loading}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete task"
                        aria-label={`Delete task: ${todo.task}`}
                      >
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Generate Schedule Button */}
              {todos.length > 0 && (
                <button
                  onClick={handleGenerateSchedule}
                  disabled={loading}
                  className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Generate AI schedule"
                >
                  🤖 Generate AI Schedule
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Schedule Display */}
          {showSchedule && schedule.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  📊 Your Daily Schedule
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {schedule.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 animate-fadeIn"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-blue-900">
                          {item.time}
                        </span>
                        <span className="text-xs text-blue-700">
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 mb-2">{item.task}</p>
                      {item.breakDuration && (
                        <div className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                          ☕ Break: {item.breakDuration}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowSchedule(false)}
                  className="w-full mt-4 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  aria-label="Hide schedule"
                >
                  Hide Schedule
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <p className="text-gray-700">Processing...</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TodoAssistant;
