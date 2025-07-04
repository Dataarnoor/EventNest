export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  if (error instanceof ApiError) {
    return new Response(error.message, { status: error.statusCode });
  }
  return new Response('Internal Server Error', { status: 500 });
};
