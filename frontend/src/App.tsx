/* eslint-disable react-refresh/only-export-components */
import { apiFetch } from "@/lib/api";
import { Suspense, useEffect, useMemo, useState } from "react";

export async function fetchGraphQL<TData>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<TData> {
  const res = await apiFetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json: { data: TData; errors?: { message: string }[] } = await res.json();

  if (json.errors?.length) {
    console.error(json.errors);
    throw new Error(json.errors[0]?.message ?? "GraphQL error");
  }

  return json.data;
}

const GET_TASKS = `
  query {
    activeTask {
      id
      projectId
      description
      estimatedCount
      currentCount
      isChecked
      completed
      updatedAt
      completedAt
    }
  }
`;

const SET_TASK_IS_CHECKED = `
  mutation SetTaskIsChecked($id: ID!, $isChecked: Boolean!) {
    setTaskIsChecked(id: $id, isChecked: $isChecked) {
      id
      isChecked
      updatedAt
    }
  }
`;

const SET_TASK_COMPLETED = `
  mutation SetTaskCompleted($id: ID!, $completed: Boolean!) {
    setTaskCompleted(id: $id, completed: $completed) {
      id
      completed
      completedAt
      updatedAt
    }
  }
`;

const INCREMENT_TASK_CURRENT_COUNT = `
  mutation IncrementTaskCurrentCount($id: ID!, $by: Int) {
    incrementTaskCurrentCount(id: $id, by: $by) {
      id
      currentCount
      updatedAt
    }
  }
`;

// optional: create task
const CREATE_TASK = `
  mutation CreateTask($projectId: ID!, $description: String!, $estimatedCount: Int, $currentCount: Int) {
    createTask(projectId: $projectId, description: $description, estimatedCount: $estimatedCount, currentCount: $currentCount) {
      id
      projectId
      description
      estimatedCount
      currentCount
      isChecked
      completed
      updatedAt
    }
  }
`;

type Task = {
  id: string;
  projectId: string;
  description: string;
  estimatedCount: number | null;
  currentCount: number | null;
  isChecked: boolean;
  completed: boolean;
  updatedAt: string;
  completedAt?: string | null;
};

function Tasks() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // tiny form for createTask
  const [newDesc, setNewDesc] = useState("");
  const [newProjectId, setNewProjectId] = useState("");
  const [newEstimated, setNewEstimated] = useState<string>("");

  const loadTasks = useMemo(
    () => async () => {
      const data = await fetchGraphQL<{ activeTask: Task[] }>(GET_TASKS);
      setTasks(data.activeTask);
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchGraphQL<{ activeTask: Task[] }>(GET_TASKS);
        if (!cancelled) setTasks(data.activeTask);
      } catch (e: unknown) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Unknown error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function toggleChecked(task: Task) {
    // optimistic update
    setTasks((prev) =>
      prev
        ? prev.map((t) =>
          t.id === task.id ? { ...t, isChecked: !t.isChecked } : t
        )
        : prev
    );

    try {
      await fetchGraphQL<{ setTaskIsChecked: Pick<Task, "id" | "isChecked" | "updatedAt"> }>(
        SET_TASK_IS_CHECKED,
        { id: task.id, isChecked: !task.isChecked }
      );
      await loadTasks(); // keep client in sync with server timestamps
    } catch (e) {
      // rollback by refetch
      await loadTasks();
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }

  async function toggleCompleted(task: Task) {
    setTasks((prev) =>
      prev
        ? prev.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        )
        : prev
    );

    try {
      await fetchGraphQL<{ setTaskCompleted: Pick<Task, "id" | "completed" | "completedAt" | "updatedAt"> }>(
        SET_TASK_COMPLETED,
        { id: task.id, completed: !task.completed }
      );
      await loadTasks();
    } catch (e) {
      await loadTasks();
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }

  async function incrementCount(task: Task, by = 1) {
    setTasks((prev) =>
      prev
        ? prev.map((t) =>
          t.id === task.id
            ? { ...t, currentCount: (t.currentCount ?? 0) + by }
            : t
        )
        : prev
    );

    try {
      await fetchGraphQL<{ incrementTaskCurrentCount: Pick<Task, "id" | "currentCount" | "updatedAt"> }>(
        INCREMENT_TASK_CURRENT_COUNT,
        { id: task.id, by }
      );
      await loadTasks();
    } catch (e) {
      await loadTasks();
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }

  async function createTask() {
    const desc = newDesc.trim();
    const pid = newProjectId.trim();
    if (!desc || !pid) return;

    const estimatedCount =
      newEstimated.trim() === "" ? null : Number(newEstimated);

    try {
      await fetchGraphQL<{ createTask: Task }>(CREATE_TASK, {
        projectId: pid,
        description: desc,
        estimatedCount: Number.isFinite(estimatedCount as number)
          ? (estimatedCount as number)
          : null,
      });

      setNewDesc("");
      setNewEstimated("");
      await loadTasks();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }

  if (error) return <p>Failed to load tasks: {error}</p>;
  if (!tasks) return <p>Loading…</p>;

  return (
    <div style={{ padding: 16, display: "grid", gap: 16 }}>
      <h2 style={{ margin: 0 }}>Tasks</h2>

      {/* simple create UI */}
      <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        <input
          placeholder="Project ID :)"
          value={newProjectId}
          onChange={(e) => setNewProjectId(e.target.value)}
        />
        <input
          placeholder="Task description"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
        />
        <input
          placeholder="Estimated count (optional)"
          value={newEstimated}
          onChange={(e) => setNewEstimated(e.target.value)}
          inputMode="numeric"
        />
        <button onClick={createTask} disabled={!newProjectId.trim() || !newDesc.trim()}>
          Create task
        </button>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul style={{ display: "grid", gap: 12, paddingLeft: 18 }}>
          {tasks.map((t) => (
            <li key={t.id} style={{ display: "grid", gap: 6 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <strong>{t.description}</strong>
                <span>{t.completed ? "✅" : t.isChecked ? "☑️" : "⬜"}</span>

                <button onClick={() => toggleChecked(t)}>
                  {t.isChecked ? "Uncheck" : "Check"}
                </button>

                <button onClick={() => toggleCompleted(t)}>
                  {t.completed ? "Mark active" : "Complete"}
                </button>

                <button onClick={() => incrementCount(t, 1)}>+1</button>
              </div>

              <div style={{ fontSize: 12, opacity: 0.8 }}>
                Project: {t.projectId} • Count: {t.currentCount ?? 0}/
                {t.estimatedCount ?? "?"} • Updated:{" "}
                {new Date(t.updatedAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Tasks />
    </Suspense>
  );
}

export default App;
