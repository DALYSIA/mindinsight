import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get study details by token (for user reply)
router.get('/token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const link = await prisma.link.findUnique({
      where: { token },
      include: {
        study: {
          select: {
            id: true,
            title: true,
            message: true
          }
        }
      }
    });
    
    if (!link) {
      return res.status(404).json({ error: 'Invalid or expired link' });
    }
    
    if (link.isUsed) {
      return res.status(400).json({ error: 'This link has already been used' });
    }
    
    res.json({
      studyId: link.studyId,
      title: link.study.title,
      message: link.study.message,
      linkId: link.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
