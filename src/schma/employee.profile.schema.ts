import z from "zod";

// New Zealand address validation
const validateNZAddress = (address: string) => {
  // Check for common NZ address patterns
  const hasStreetNumber = /\d+/.test(address);
  const hasStreetName =
    /\b(street|road|avenue|drive|lane|place|court|way|close|terrace|grove|mews|parade|highway|motorway|freeway)\b/i.test(
      address
    );
  const hasSuburb = /\b(suburb|area|district|town|city)\b/i.test(address);
  const hasNZPostalCode = /\b\d{4}\b/.test(address); // NZ postal codes are 4 digits

  return hasStreetNumber && (hasStreetName || hasSuburb || hasNZPostalCode);
};

export const employeeprofileformSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(1, {
    message: "Phone number is required.",
  }),
  address: z
    .string()
    .min(1, {
      message: "Address is required.",
    })
    .refine(validateNZAddress, {
      message:
        "Please enter a valid New Zealand address (include street number, name, and suburb/postal code).",
    }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  employment_type: z.string().min(1, {
    message: "Employment type is required.",
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
  notes: z.string().optional(),
});
