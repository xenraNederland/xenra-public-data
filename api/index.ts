import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ 
    message: 'Xenra Nederland API is running',
    timestamp: new Date().toISOString()
  });
}