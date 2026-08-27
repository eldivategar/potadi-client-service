import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Alamat email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Kata sandi wajib diisi")
    .min(8, "Kata sandi minimal 8 karakter"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Nama lengkap wajib diisi")
      .min(2, "Nama minimal 2 karakter"),
    email: z
      .string()
      .trim()
      .min(1, "Alamat email wajib diisi")
      .email("Format email tidak valid"),
    password: z
      .string()
      .min(1, "Kata sandi wajib diisi")
      .min(8, "Kata sandi minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Alamat email wajib diisi")
    .email("Format email tidak valid"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Kata sandi baru wajib diisi")
      .min(8, "Kata sandi minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
