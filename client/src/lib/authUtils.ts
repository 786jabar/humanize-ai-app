export function isUnauthorizedError(error: Error): boolean {
  // Match error format from apiRequest: "401: {message}"
  return /^401:/.test(error.message);
}
