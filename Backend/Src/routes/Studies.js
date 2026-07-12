import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all studies for admin
router.get('/', authenticate, async (req, res) => {
  try {
    const studies = await prisma.study.findMany({
      where: { adminId: req.admin.id },
      include: {
        links: true,
        replies: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const formatted = studies.map(study => ({
      ...study,
      sentCount: study.links.filter(l => l.sentAt).length,
      replyCount: study.replies.length
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create study
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, message, contacts } = req.body;
    
    const study = await prisma.study.create({
      data: {
        title,
        message,
        adminId: req.admin.id,
        links: {
          create: contacts.map(contact => ({
            token: crypto.randomUUID(),
            contactId: contact.id || crypto.randomUUID(),
            contactName: contact.name,
            contactPhone: contact.phone
          }))
        }
      },
      include: {
        links: true
      }
    });
    
    res.status(201).json(study);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single study
router.get('/:id', authenticate, async (req, res) => {
  try {
    const study = await prisma.study.findFirst({
      where: {
        id: req.params.id,
        adminId: req.admin.id
      },
      include: {
        links: true,
        replies: {
          include: { link: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!study) {
      return res.status(404).json({ error: 'Study not found' });
    }
    
    res.json(study);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark link as sent
router.patch('/:studyId/links/:linkId/sent', authenticate, async (req, res) => {
  try {
    const { studyId, linkId } = req.params;
    
    const link = await prisma.link.update({
      where: { id: linkId },
      data: { sentAt: new Date() }
    });
    
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
