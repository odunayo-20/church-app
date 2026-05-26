const { memberSchema } = require('./lib/validations');

try {
  const res = memberSchema.parse({
    name: "John Doe",
    email: "john@example.com",
    phone: "",
    birthday: null,
    anniversary: null
  });
  console.log("Success:", res);
} catch (e) {
  console.error("Validation failed:", e.errors || e);
}
