
import * as z from "zod";

export const checkoutFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Valid zip code is required"),
  cardNumber: z.string().min(16, "Valid card number is required").max(16),
  cardExpiry: z.string().min(5, "Valid expiry date is required (MM/YY)"),
  cardCvc: z.string().min(3, "Valid CVC is required").max(4),
});
