import admin from 'firebase-admin';

export const initializeFirebaseAdmin = () => {
  if (admin.apps.length === 0) {
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!privateKey || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PROJECT_ID) {
      throw new Error('Missing Firebase Admin configuration. Please check your environment variables.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    });

    console.log('🔥 Firebase Admin initialized successfully');
  }
};

export const verifyFirebaseToken = async (token: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return {
      success: true,
      data: decodedToken,
    };
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const getFirebaseUser = async (uid: string) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return {
      success: true,
      data: userRecord,
    };
  } catch (error) {
    console.error('Failed to get Firebase user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export default admin;
