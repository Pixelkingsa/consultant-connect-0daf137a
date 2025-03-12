
import * as z from "zod";

export const checkoutFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().min(4, "Valid South African postal code is required").max(5),
  phoneNumber: z.string().min(10, "Valid South African phone number is required").optional(),
});

