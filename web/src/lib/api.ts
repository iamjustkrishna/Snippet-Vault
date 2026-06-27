export interface Snippet {
  id: number;
  title: string;
  language: string;
  code: string;
  tags?: string;
  created_at: string;
}

export interface SnippetCreate {
  title: string;
  language: string;
  code: string;
  tags?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export async function fetchSnippets(q: string = "", page: number = 1, limit: number = 10): Promise<Snippet[]> {
  const url = new URL(`${API_BASE_URL}/snippets/`);
  if (q) url.searchParams.append("q", q);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", limit.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch snippets");
  }
  return response.json();
}

export async function createSnippet(data: SnippetCreate): Promise<Snippet> {
  const response = await fetch(`${API_BASE_URL}/snippets/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create snippet");
  }
  return response.json();
}

export async function deleteSnippet(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/snippets/${id}`, {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 204) {
    throw new Error("Failed to delete snippet");
  }
}
