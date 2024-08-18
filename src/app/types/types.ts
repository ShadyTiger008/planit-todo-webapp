export interface Task {
  _id: string;
  status: string;
  name: string;
}

export interface BoardTypes {
  tasks: Task[];
  _id: string;
  name: string;
}
