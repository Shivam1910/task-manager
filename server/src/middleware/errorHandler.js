export function notFound(req, res) { res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }); }
export function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid task ID' });
  if (err.name === 'ValidationError') { const first = Object.values(err.errors)[0]; return res.status(400).json({ message: first?.message || 'Validation failed' }); }
  res.status(err.status || 500).json({ message: err.status ? err.message : 'Internal server error' });
}
