/**
 * The base URL for the backend API.
 * It reads from the environment variables and provides a fallback for safety.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Example of how to use this in a component:
 *
 * import { API_URL } from '@/app/lib/api';
 *
 * async function fetchData() {
 *   const response = await fetch(`${API_URL}/api/hello`);
 *   const data = await response.json();
 *   console.log(data.message); // "Hello from the FastAPI backend!"
 * }
 */