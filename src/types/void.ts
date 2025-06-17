export interface VoidEntry {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  userId: string;
  nextAction?: NextAction;
}

export interface NextAction {
  id: string;
  description: string;
  estimatedMinutes: number;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  voidId: string;
  userId: string;
}
