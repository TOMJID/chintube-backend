import status from "http-status";
import z from "zod";

export interface TErrorSources {
  path: string;
  message: string;
}
export interface TErrorResponse {
  statusCode?: number;
  success: boolean;
  message: string;
  errorSources: TErrorSources[];
  stack?: string;
  error?: unknown;
}

export const handleZodError = (err: z.ZodError): TErrorResponse => {
  const statusCode = status.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources: TErrorSources[] = [];

  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" ") || "Unknown",
      // path: issue.path.length > 1 ? issue.path.join("=>") : issue.path[0].toString(),
      message: issue.message,
    });
  });

  return {
    success: false,
    message,
    errorSources,
    statusCode,
  };
};
