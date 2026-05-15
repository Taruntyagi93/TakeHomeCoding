export type ActionType = 'create' | 'edit';

export interface Task {
  action: ActionType;
  filePath: string;
  description: string;
  dependencies: string[]; // Files that must exist before this one is created
}

export interface Plan {
  tasks: Task[];
}