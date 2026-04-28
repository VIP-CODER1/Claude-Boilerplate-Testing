const API_BASE = '/api/posts';

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.error || 'Request failed');
  }

  return payload;
}

export async function fetchPosts() {
  const payload = await requestJson(API_BASE);
  return payload.data || [];
}

export async function createPost(post) {
  const payload = await requestJson(API_BASE, {
    method: 'POST',
    body: JSON.stringify(post),
  });

  return payload.data;
}

export async function updatePost(postId, post) {
  const payload = await requestJson(`${API_BASE}/${postId}`, {
    method: 'PATCH',
    body: JSON.stringify(post),
  });

  return payload.data;
}

export async function deletePost(postId) {
  await requestJson(`${API_BASE}/${postId}`, {
    method: 'DELETE',
  });
}
