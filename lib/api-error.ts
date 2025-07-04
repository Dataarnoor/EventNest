export class APIError extends Error {
  public status: number;
  public data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
    // Ensure proper inheritance in TypeScript
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

export async function handleAPIResponse<T>(response: Response): Promise<T> {
  try {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`
      }));
      
      console.error('API Error:', {
        status: response.status,
        data: errorData
      });

      throw new APIError(
        response.status,
        errorData.message || `HTTP error! status: ${response.status}`,
        errorData
      );
    }
    
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('API Response Error:', error);
    if (error instanceof APIError) throw error;
    throw new APIError(
      500,
      error instanceof Error ? error.message : 'Unknown error occurred',
      error
    );
  }
}
