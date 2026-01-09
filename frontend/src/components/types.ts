export type ProjectType = {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  is_archived: boolean;
  created_at?: Date | null;
  updated_at?: Date | null;
};

export type TaskInputType = {
  // root type
  projectList: Array<ProjectType>;
  inputValue: string;
  pomoCount: number;
  setProjectList: (value: Array<ProjectType>) => void;
  setInputValue: (value: string) => void;
  setPomoCount: (value: number) => void;
};

export type TaskType = {
  id: string;
  user_id: string;
  project_id: string | null;
  project: ProjectType;
  title: string;
  notes: string | null;
  target_sessions: number;
  completed_sessions: number;
  is_completed: boolean;
  completed_at: string | null;
  sort_order: number | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export type ListItemData = {
  id: string;
  text: string;
  categoryLabel: string;
  categoryColor: string;
  currentPomoCount: number;
  estimatedPomoCount: number;
  completed: boolean;
};
