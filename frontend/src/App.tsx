/* eslint-disable react-refresh/only-export-components */
import { Suspense, useEffect, useState } from "react";

export async function fetchGraphQL<TData>(
  query: string,
  variables = {}
): Promise<TData> {
  const res = await fetch("/graphql", {
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
};

function Tasks() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchGraphQL<{ activeTask: Task[] }>(GET_TASKS)
      .then((data) => {
        if (!cancelled) setTasks(data.activeTask);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p>Failed to load tasks: {error}</p>;
  if (!tasks) return <p>Loading…</p>;
  if (tasks.length === 0) return <p>No tasks yet.</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Tasks</h2>
      <ul style={{ display: "grid", gap: 12, paddingLeft: 18 }}>
        {tasks.map((t) => (
          <li key={t.id}>
            <div>
              <strong>{t.description}</strong>{" "}
              {t.completed ? "✅" : t.isChecked ? "☑️" : "⬜"}
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Project: {t.projectId} • Count: {t.currentCount ?? 0}/
              {t.estimatedCount ?? "?"} • Updated:{" "}
              {new Date(t.updatedAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
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
