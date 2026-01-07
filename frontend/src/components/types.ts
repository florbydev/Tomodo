export type ProjectType = {
  id: string;
  userId: string;
  name: string;
  description: string;
  color: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
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
  userId: string;
  project: ProjectType;
  description: string;
  estimatedCount: number;
  currentCount: number;
  completed: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
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
