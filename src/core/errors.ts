export class ThemeGeneratorError extends Error {
  public readonly code: string;

  public constructor(message: string, code = 'THEME_GENERATOR_ERROR') {
    super(message);
    this.name = 'ThemeGeneratorError';
    this.code = code;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred.';
}
