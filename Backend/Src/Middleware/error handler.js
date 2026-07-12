export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.code === 'P2002') {
    return res.status(400).json({ error: 'Duplicate entry' });
  }
  
  res.status(500).json({ error: err.message || 'Internal server error' });
};
