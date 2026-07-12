import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Submit reply
router.post('/', async (req, res) => {
  try {
    const { linkId, content } = req.body;
    
    // Check if link exists and is not used
    const link = await prisma.link.findUnique({
      where: { id: linkId }
    });
    
    if (!link) {
      return res.status(404).json({ error: 'Invalid link' });
    }
    
    if (link.isUsed) {
      return res.status(400).json({ error: 'This link has already been used' });
    }
    
    // Create reply and mark link as used
    const reply = await prisma.$transaction([
      prisma.reply.create({
        data: {
          content,
          studyId: link.studyId,
          linkId: link.id
        }
      }),
      prisma.link.update({
        where: { id: linkId },
        data: { isUsed: true, usedAt: new Date() }
      })
    ]);
    
    res.status(201).json({ success: true, replyId: reply[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
