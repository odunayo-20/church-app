const { z } = require('zod');

const dateSchema = z
  .preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date({
    error: (issue) =>
      issue.input === undefined
        ? "Date is required"
        : "Please select a valid date"
  }));

const memberSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional().nullable().or(z.literal("")),
  birthday: dateSchema.optional().nullable(),
  anniversary: dateSchema.optional().nullable(),
});

const memberUpdateSchema = memberSchema.partial();

try {
  const res = memberUpdateSchema.parse({
    name: "John Doe",
    email: "john@example.com",
    phone: "",
    birthday: null,
    anniversary: null
  });
  console.log("Success (null):", res);
} catch (e) {
  console.error("Validation failed (null):", e.errors || e);
}

try {
  const res = memberUpdateSchema.parse({
    name: "John Doe",
    email: "john@example.com",
    phone: "",
    birthday: new Date("2026-05-25"),
    anniversary: new Date("2026-05-25")
  });
  console.log("Success (Date object):", res);
} catch (e) {
  console.error("Validation failed (Date object):", e.errors || e);
}

try {
  const res = memberUpdateSchema.parse({
    name: "John Doe",
    email: "john@example.com",
    phone: "",
    birthday: "2026-05-25",
    anniversary: "2026-05-25"
  });
  console.log("Success (String date):", res);
} catch (e) {
  console.error("Validation failed (String date):", e.errors || e);
}
