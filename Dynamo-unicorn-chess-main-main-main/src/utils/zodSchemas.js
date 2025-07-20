import { z } from 'zod';
export const ChangeSchema = z.object({
    currentPassword: z.string().min(6,{message:"Current password is too short"}),
    password: z.string().min(6,{message:"New Password is too short"}).nullable(),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match', // Custom error message if passwords don't match
    path: ['confirmPassword'], // Path to specify which field the error message is associated with
  });

  export const RegisterSchema = z.object({
    name: z.string().min(1,{message:"Name should be at least one character long"}),
    email: z.string().email({message:"Invalid email format"}),
    mobile: z.string().min(10,{message:"Mobile number should be 10 digits"}),
    country: z.string(),
    password: z.string().min(6,{message:"Password length minium 6 characters"}),
    referalCode: z.string(),
    deviceId: z.string(),
    // img: z.any(),
});

export const loginSchema = z.object({
    email: z.string().email({message:"Invalid email format"}),
    password: z.string().min(6,{message:"Password length minium 6 characters"}), // Example: Password should be at least 6 characters long
    deviceId: z.string(), // Example: Password should be at least 6 characters long
});

export const bannerSchema=z.object({
  img: z.any(),
  title:z.string().min(3,{message:"Name should be at least three character long"}),
  gametype:z.string().min(3,{message:"Password length minium 3 characters"})
})
export const sendotpSchema=z.object({
  email: z.string().email({message:"Invalid email format"}),
})
export const forgetSchema=z.object({
  email: z.string().email({message:"Invalid email format"}),
  // otp:z.string().min(6).max(6),
  password: z.string().min(6,{message:"New Password is too short"}).nullable(),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match', // Custom error message if passwords don't match
  path: ['confirmPassword'],
})