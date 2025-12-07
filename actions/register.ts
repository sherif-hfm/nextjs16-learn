"use server";

import { z } from "zod";

// Zod schema for registration form validation
const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be at most 20 characters long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password must be at most 100 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export type RegisterActionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

export async function registerUser(
  formData: FormData
): Promise<RegisterActionResult> {
  try {
    // Extract form data
    const rawData = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    // Validate with Zod
    const validatedData = registerSchema.parse(rawData);

    // TODO: Add your registration logic here
    // For example:
    // - Check if username/email already exists
    // - Hash the password
    // - Save to database
    // - Send verification email, etc.

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For now, just return success
    // In a real app, you would:
    // const user = await createUser(validatedData);
    // await sendVerificationEmail(user.email);

    return {
      success: true,
      message: "Registration successful! You can now log in.",
    };
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(issue.message);
      });

      return {
        success: false,
        error: "Validation failed",
        fieldErrors,
      };
    }

    // Handle other errors
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed. Please try again.",
    };
  }
}

