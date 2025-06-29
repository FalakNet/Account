import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { verifyFirebaseToken } from '../config/firebase';
import { prisma } from '../index';
import jwt from 'jsonwebtoken';

const router = Router();

// Verify Firebase token and create/update user
router.post('/verify', 
  body('firebaseToken').notEmpty().withMessage('Firebase token is required'),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { firebaseToken } = req.body;

      // Verify Firebase token
      const verificationResult = await verifyFirebaseToken(firebaseToken);
      if (!verificationResult.success || !verificationResult.data) {
        return res.status(401).json({
          error: 'Invalid Firebase token',
          message: verificationResult.error,
        });
      }

      const { uid, email, name, email_verified } = verificationResult.data;

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { firebaseUid: uid },
      });

      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: {
            firebaseUid: uid,
            email: email || '',
            displayName: name || null,
            emailVerified: email_verified || false,
            lastLoginAt: new Date(),
          },
        });

        // Log user creation
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'USER_CREATED',
            resource: 'user',
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
          },
        });
      } else {
        // Update existing user
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            emailVerified: email_verified || user.emailVerified,
            displayName: name || user.displayName,
          },
        });

        // Log user login
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'USER_LOGIN',
            resource: 'auth',
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
          },
        });
      }

      // Generate JWT token
      const jwtToken = jwt.sign(
        { 
          userId: user.id,
          firebaseUid: uid,
          email: user.email 
        },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Create session
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          sessionToken: jwtToken,
          deviceInfo: req.get('User-Agent'),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
        },
        token: jwtToken,
        sessionId: session.id,
      });

    } catch (error) {
      console.error('Auth verification failed:', error);
      res.status(500).json({
        error: 'Authentication failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

// Refresh token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Token is required',
      });
    }

    // Verify current token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Check if session exists and is active
    const session = await prisma.session.findFirst({
      where: {
        sessionToken: token,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return res.status(401).json({
        error: 'Invalid or expired session',
      });
    }

    // Generate new token
    const newJwtToken = jwt.sign(
      { 
        userId: session.user.id,
        firebaseUid: session.user.firebaseUid,
        email: session.user.email 
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Update session
    await prisma.session.update({
      where: { id: session.id },
      data: {
        sessionToken: newJwtToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      success: true,
      token: newJwtToken,
    });

  } catch (error) {
    console.error('Token refresh failed:', error);
    res.status(401).json({
      error: 'Token refresh failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (token) {
      // Deactivate session
      await prisma.session.updateMany({
        where: {
          sessionToken: token,
        },
        data: {
          isActive: false,
        },
      });
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });

  } catch (error) {
    console.error('Logout failed:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
