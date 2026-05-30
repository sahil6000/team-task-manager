module.exports = (schema) => (req, res, next) => {
  const r = schema.safeParse(req.body);
  if (!r.success) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: r.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }))
    });
  }
  req.body = r.data;
  next();
};
