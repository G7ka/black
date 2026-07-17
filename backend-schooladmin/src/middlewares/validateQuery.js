export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const err = new Error('Validation failed');
      err.statusCode = 400;
      err.details = result.error.flatten();
      return next(err);
    }
    req.query = result.data;
    next();
  };
}
