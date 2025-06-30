import z from "zod";

export const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(
      /^0[234679]\d{7,8}$/,
      "Enter a valid New Zealand phone number (e.g. 0212345678, 093456789)"
    ),
  position: z.string().min(1, "Position is required"),
  employment_type: z.string().min(1, "Employment type is required"),
  status: z.string().min(1, "Status is required"),
  payrate: z.string().min(1, "Pay rate is required"),
  start_date: z.string().min(1, "Start date is required"),
  notes: z.string().optional(),
  job: z.string().optional(),
});
