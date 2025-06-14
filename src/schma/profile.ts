import z from "zod";

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(1, {
    message: "Phone number is required.",
  }),
  address: z.string().min(1, {
    message: "Address is required.",
  }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  employment_type: z.string().min(1, {
    message: "Employment type is required.",
  }),
  status: z.string().min(1, {
    message: "Status is required.",
  }),
  payrate: z
    .string()
    .min(1, {
      message: "Pay rate is required.",
    })
    .refine(val => !isNaN(Number(val)), {
      message: "Pay rate must be a valid number.",
    }),
  start_date: z.date({
    required_error: "Please select a start date.",
  }),
  notes: z.string().min(1, {
    message: "Notes are required.",
  }),
});
