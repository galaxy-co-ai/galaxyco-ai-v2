/**
 * Task Management Tools
 *
 * Tools for agents to create, update, and manage tasks and projects.
 * Integrates with task management systems (Linear, Jira, etc.) or internal task system.
 */

import { createTool } from "../tools";
import type { Tool } from "../types";

/**
 * Create task tool
 */
export function createTaskTool(): Tool {
  return createTool(
    "create_task",
    "Create a new task or ticket in the task management system",
    {
      title: {
        type: "string",
        description: "Task title",
      },
      description: {
        type: "string",
        description: "Detailed task description",
      },
      priority: {
        type: "string",
        description: "Task priority",
        enum: ["low", "medium", "high", "urgent"],
      },
      assigneeId: {
        type: "string",
        description: "ID of user to assign task to",
        required: false,
      },
      dueDate: {
        type: "string",
        description: "Due date in ISO format",
        required: false,
      },
      labels: {
        type: "array",
        description: "Task labels/tags",
        items: { type: "string" },
        required: false,
      },
      projectId: {
        type: "string",
        description: "Project or board ID",
        required: false,
      },
    },
    async (args: {
      title: string;
      description: string;
      priority: string;
      assigneeId?: string;
      dueDate?: string;
      labels?: string[];
      projectId?: string;
    }) => {
      const taskId = `task_${Date.now()}`;

      return {
        taskId,
        title: args.title,
        description: args.description,
        priority: args.priority,
        assigneeId: args.assigneeId,
        dueDate: args.dueDate,
        labels: args.labels || [],
        projectId: args.projectId,
        status: "created",
        createdAt: new Date().toISOString(),
        url: `https://app.example.com/tasks/${taskId}`,
        message: "Task created successfully",
      };
    },
  );
}

/**
 * Update task tool
 */
export function createUpdateTaskTool(): Tool {
  return createTool(
    "update_task",
    "Update an existing task",
    {
      taskId: {
        type: "string",
        description: "Task ID to update",
      },
      status: {
        type: "string",
        description: "New task status",
        enum: ["todo", "in_progress", "review", "done", "cancelled"],
        required: false,
      },
      comment: {
        type: "string",
        description: "Comment to add to task",
        required: false,
      },
      assigneeId: {
        type: "string",
        description: "Reassign to different user",
        required: false,
      },
      dueDate: {
        type: "string",
        description: "Update due date",
        required: false,
      },
    },
    async (args: {
      taskId: string;
      status?: string;
      comment?: string;
      assigneeId?: string;
      dueDate?: string;
    }) => {
      const updates: any = {};
      if (args.status) updates.status = args.status;
      if (args.assigneeId) updates.assigneeId = args.assigneeId;
      if (args.dueDate) updates.dueDate = args.dueDate;

      return {
        taskId: args.taskId,
        updates,
        comment: args.comment,
        updatedAt: new Date().toISOString(),
        status: "updated",
        message: "Task updated successfully",
      };
    },
  );
}

/**
 * Search tasks tool
 */
export function createSearchTasksTool(): Tool {
  return createTool(
    "search_tasks",
    "Search for tasks based on various criteria",
    {
      query: {
        type: "string",
        description: "Search query (title, description)",
        required: false,
      },
      status: {
        type: "string",
        description: "Filter by status",
        enum: ["todo", "in_progress", "review", "done", "cancelled"],
        required: false,
      },
      assigneeId: {
        type: "string",
        description: "Filter by assignee",
        required: false,
      },
      priority: {
        type: "string",
        description: "Filter by priority",
        enum: ["low", "medium", "high", "urgent"],
        required: false,
      },
      limit: {
        type: "number",
        description: "Maximum results to return",
        required: false,
      },
    },
    async (args: {
      query?: string;
      status?: string;
      assigneeId?: string;
      priority?: string;
      limit?: number;
    }) => {
      // Mock search results
      return {
        tasks: [],
        query: args.query,
        filters: {
          status: args.status,
          assigneeId: args.assigneeId,
          priority: args.priority,
        },
        total: 0,
        limit: args.limit || 10,
        message: "Task system integration required",
      };
    },
  );
}

/**
 * Create milestone tool
 */
export function createMilestoneTool(): Tool {
  return createTool(
    "create_milestone",
    "Create a project milestone or epic",
    {
      name: {
        type: "string",
        description: "Milestone name",
      },
      description: {
        type: "string",
        description: "Milestone description",
      },
      targetDate: {
        type: "string",
        description: "Target completion date",
      },
      projectId: {
        type: "string",
        description: "Associated project ID",
        required: false,
      },
    },
    async (args: {
      name: string;
      description: string;
      targetDate: string;
      projectId?: string;
    }) => {
      const milestoneId = `milestone_${Date.now()}`;

      return {
        milestoneId,
        name: args.name,
        description: args.description,
        targetDate: args.targetDate,
        projectId: args.projectId,
        status: "created",
        createdAt: new Date().toISOString(),
        message: "Milestone created successfully",
      };
    },
  );
}

/**
 * Create all task tools
 */
export function createTaskTools(): Tool[] {
  return [
    createTaskTool(),
    createUpdateTaskTool(),
    createSearchTasksTool(),
    createMilestoneTool(),
  ];
}
