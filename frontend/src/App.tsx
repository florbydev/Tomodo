/* eslint-disable react-refresh/only-export-components */
import { Heading } from "@/components/shared/typography";
import { Suspense } from "react";

// src/graphql/fetchGraphQL.ts

export async function fetchGraphQL<TData>(
  query: string,
  variables = {}
): Promise<TData> {
  const res = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const json: { data: TData; errors?: { message: string }[] } =
    await res.json();

  if (json.errors) {
    console.error(json.errors);
    throw new Error("GraphQL error");
  }

  return json.data;
}

type Post = {
  id: number;
  title: string;
  body: string;
  published: boolean;
};

const GET_POSTS = `
  query GetPosts {
    drafts {
      id
      title
      body
      published
    }
  }
`;

function wrapPromise<T>(promise: Promise<T>) {
  let status: "pending" | "success" | "error" = "pending";
  let result: T;
  let error: unknown;

  const suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      error = e;
    }
  );

  return {
    read(): T {
      if (status === "pending") throw suspender;
      if (status === "error") throw error;
      return result!;
    },
  };
}

const postResource = wrapPromise(
  fetchGraphQL<{ drafts: Post[] }>(GET_POSTS).then((data) => data.drafts)
);

function Posts() {
  const posts = postResource.read(); // -> typed as Post[]
  return (
    <Heading as="h2">Hello World {posts[0]?.title ?? "No posts"}</Heading>
  );
}

function App() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Posts />
    </Suspense>
  );
}

export default App;
