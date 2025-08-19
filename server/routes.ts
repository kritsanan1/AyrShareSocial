import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { ayrshareApi } from "./services/ayrshareApi";
import { insertPostSchema, insertSocialAccountSchema } from "@shared/schema";
import { z } from "zod";
import express, { Router } from 'express';
import crypto from 'crypto';

// Mock functions for session management and Supabase integration (to be implemented)
async function getUserFromSession(req: express.Request): Promise<any> {
  // In a real application, you would use session data or JWT to identify the user.
  // For demonstration, we'll assume a user ID is available in req.user.claims.sub
  if (req.user && req.user.claims && req.user.claims.sub) {
    return await storage.getUser(req.user.claims.sub);
  }
  return null;
}

// Placeholder for Supabase service
class SupabaseTrackingService {
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor(url: string, key: string) {
    this.supabaseUrl = url;
    this.supabaseKey = key;
  }

  async trackMobileSession(sessionData: any): Promise<string> {
    console.log('Tracking session with Supabase:', sessionData);
    // Replace with actual Supabase insert operation
    return crypto.randomUUID();
  }

  async getMobileAnalytics(userId: string, days: number): Promise<any> {
    console.log(`Fetching mobile analytics for user ${userId} for last ${days} days`);
    // Replace with actual Supabase query
    return {
      totalSessions: 150,
      mobilePercentage: 65,
      tabletPercentage: 20,
      desktopPercentage: 15,
      avgLoadTime: 2.3,
      avgSessionDuration: 180,
      deviceBreakdown: {
        mobile: 98,
        tablet: 30,
        desktop: 22
      },
      performanceMetrics: {
        averageLoadTime: 2.3,
        averageFCP: 1.8,
        averageLCP: 3.2,
        averageCLS: 0.12
      }
    };
  }

  async getLighthouseHistory(userId: string): Promise<any[]> {
    console.log(`Fetching Lighthouse history for user ${userId}`);
    // Replace with actual Supabase query
    return [
      {
        id: '1',
        url: 'https://example.com',
        device_type: 'mobile',
        lighthouse_score: 85,
        viewport_score: 100,
        tap_targets_score: 90,
        font_size_score: 95,
        test_date: new Date().toISOString()
      }
    ];
  }
}

const router = Router();

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Ayrshare User Profile Management
  app.post('/api/ayrshare/create-profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already has an Ayrshare profile
      if (user.ayrshareProfileKey) {
        return res.json({
          profileKey: user.ayrshareProfileKey,
          message: "Profile already exists"
        });
      }

      // Create Ayrshare profile with user's name
      const displayName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.email;

      const ayrshareResponse = await ayrshareApi.createUserProfile(
        displayName,
        user.profileImageUrl ?? undefined
      );

      if (ayrshareResponse.status === 'success' && ayrshareResponse.profileKey) {
        // Store the profile key in our database
        await storage.updateUserAyrshareProfile(userId, ayrshareResponse.profileKey);

        res.json({
          profileKey: ayrshareResponse.profileKey,
          message: "Profile created successfully"
        });
      } else {
        res.status(400).json({
          message: "Failed to create Ayrshare profile",
          error: ayrshareResponse.error
        });
      }
    } catch (error) {
      console.error("Error creating Ayrshare profile:", error);
      res.status(500).json({ message: "Failed to create Ayrshare profile" });
    }
  });

  app.post('/api/ayrshare/generate-jwt', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user || !user.ayrshareProfileKey) {
        return res.status(404).json({ message: "User profile not found" });
      }

      const jwtResponse = await ayrshareApi.generateJWT(
        user.ayrshareProfileKey,
        req.hostname // Use current domain
      );

      if (jwtResponse.status === 'success' && jwtResponse.url) {
        res.json({
          linkingUrl: jwtResponse.url,
          message: "JWT generated successfully"
        });
      } else {
        res.status(400).json({
          message: "Failed to generate JWT",
          error: jwtResponse.error
        });
      }
    } catch (error) {
      console.error("Error generating JWT:", error);
      res.status(500).json({ message: "Failed to generate JWT" });
    }
  });

  app.get('/api/ayrshare/social-accounts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user || !user.ayrshareProfileKey) {
        return res.json([]); // Return empty array if no profile
      }

      const profileResponse = await ayrshareApi.getProfileSocialAccounts(user.ayrshareProfileKey);

      if (profileResponse.status === 'success' && profileResponse.profiles) {
        res.json(profileResponse.profiles);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error("Error fetching social accounts:", error);
      res.json([]); // Return empty array on error
    }
  });

  // Social Account routes (now redirects to Ayrshare)
  app.get('/api/social-accounts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user || !user.ayrshareProfileKey) {
        return res.json([]); // Return empty array if no profile
      }

      const profileResponse = await ayrshareApi.getProfileSocialAccounts(user.ayrshareProfileKey);

      if (profileResponse.status === 'success' && profileResponse.profiles) {
        res.json(profileResponse.profiles);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error("Error fetching social accounts:", error);
      res.json([]); // Return empty array on error
    }
  });

  app.post('/api/social-accounts/sync', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      // Get profiles from Ayrshare
      const profilesResponse = await ayrshareApi.getProfiles();

      if (profilesResponse.status === 'success' && profilesResponse.profiles) {
        // Sync profiles to database
        const syncedAccounts = [];

        for (const profile of profilesResponse.profiles) {
          const accountData = {
            userId,
            platform: profile.platform,
            platformId: profile.platformId,
            platformName: profile.name,
            profileImage: profile.profileImg,
            followerCount: profile.followers || 0,
          };

          // Check if account already exists
          const existingAccounts = await storage.getSocialAccounts(userId);
          const existing = existingAccounts.find(
            acc => acc.platform === profile.platform && acc.platformId === profile.platformId
          );

          if (existing) {
            const updated = await storage.updateSocialAccount(existing.id, accountData);
            syncedAccounts.push(updated);
          } else {
            const created = await storage.createSocialAccount(accountData);
            syncedAccounts.push(created);
          }
        }

        res.json(syncedAccounts);
      } else {
        res.status(400).json({ message: "Failed to sync social accounts" });
      }
    } catch (error) {
      console.error("Error syncing social accounts:", error);
      res.status(500).json({ message: "Failed to sync social accounts" });
    }
  });

  // Post routes
  app.get('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 50;
      const posts = await storage.getPosts(userId, limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get('/api/posts/scheduled', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const scheduledPosts = await storage.getScheduledPosts(userId);
      res.json(scheduledPosts);
    } catch (error) {
      console.error("Error fetching scheduled posts:", error);
      res.status(500).json({ message: "Failed to fetch scheduled posts" });
    }
  });

  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = insertPostSchema.parse({
        ...req.body,
        userId,
      });

      // Create post in database first
      const post = await storage.createPost(postData);

      // If publishing immediately or scheduling
      if (postData.status === 'published' || postData.status === 'scheduled') {
        try {
          // Get user's Ayrshare profile
          const user = await storage.getUser(userId);
          if (!user || !user.ayrshareProfileKey) {
            return res.status(400).json({
              message: "Please connect your social accounts first"
            });
          }

          const ayrshareData = {
            post: postData.content,
            platforms: postData.platforms,
            mediaUrls: postData.mediaUrls || undefined,
            ...(postData.scheduledAt && {
              scheduleDate: postData.scheduledAt.toISOString()
            }),
          };

          const ayrshareResponse = await ayrshareApi.postForUser(user.ayrshareProfileKey, ayrshareData);

          if (ayrshareResponse.status === 'success') {
            // Update post with Ayrshare ID
            const updatedPost = await storage.updatePost(post.id, {
              ayrsharePostId: ayrshareResponse.id,
              publishedAt: postData.status === 'published' ? new Date() : undefined,
            });

            res.json(updatedPost);
          } else {
            // Update post status to failed
            await storage.updatePost(post.id, { status: 'failed' });
            res.status(400).json({
              message: "Failed to publish post",
              errors: ayrshareResponse.errors
            });
          }
        } catch (ayrshareError) {
          // Update post status to failed
          await storage.updatePost(post.id, { status: 'failed' });
          throw ayrshareError;
        }
      } else {
        // Just return the draft post
        res.json(post);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.put('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = req.params.id;

      // Verify ownership
      const existingPost = await storage.getPost(postId);
      if (!existingPost || existingPost.userId !== userId) {
        return res.status(404).json({ message: "Post not found" });
      }

      const updateData = req.body;
      const updatedPost = await storage.updatePost(postId, updateData);
      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = req.params.id;

      // Verify ownership
      const existingPost = await storage.getPost(postId);
      if (!existingPost || existingPost.userId !== userId) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Delete from Ayrshare if it was published
      if (existingPost.ayrsharePostId) {
        try {
          await ayrshareApi.deletePost(existingPost.ayrsharePostId);
        } catch (error) {
          console.warn("Failed to delete post from Ayrshare:", error);
        }
      }

      await storage.deletePost(postId);
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Analytics routes
  app.get('/api/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { startDate, endDate, platforms } = req.query;

      // Validate and parse parameters
      const platformsArray = platforms && typeof platforms === 'string'
        ? platforms.split(',').filter(p => p.trim())
        : undefined;

      const startDateStr = startDate && typeof startDate === 'string' ? startDate : undefined;
      const endDateStr = endDate && typeof endDate === 'string' ? endDate : undefined;

      // Get analytics from Ayrshare
      const ayrshareAnalytics = await ayrshareApi.getAnalytics(
        platformsArray,
        startDateStr,
        endDateStr
      );

      // Get stored analytics - check if storage.getAnalytics exists
      let storedAnalytics = [];
      if (typeof storage.getAnalytics === 'function') {
        storedAnalytics = await storage.getAnalytics(
          userId,
          startDateStr ? new Date(startDateStr) : undefined,
          endDateStr ? new Date(endDateStr) : undefined
        );
      }

      res.json({
        live: ayrshareAnalytics,
        stored: storedAnalytics,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Content Assets routes
  app.get('/api/content-assets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const assets = await storage.getContentAssets(userId);
      res.json(assets);
    } catch (error) {
      console.error("Error fetching content assets:", error);
      res.status(500).json({ message: "Failed to fetch content assets" });
    }
  });

  app.post('/api/content-assets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const assetData = {
        ...req.body,
        userId,
      };

      const asset = await storage.createContentAsset(assetData);
      res.json(asset);
    } catch (error) {
      console.error("Error creating content asset:", error);
      res.status(500).json({ message: "Failed to create content asset" });
    }
  });

  app.delete('/api/content-assets/:id', isAuthenticated, async (req: any, res) => {
    try {
      const assetId = req.params.id;
      await storage.deleteContentAsset(assetId);
      res.json({ message: "Asset deleted successfully" });
    } catch (error) {
      console.error("Error deleting content asset:", error);
      res.status(500).json({ message: "Failed to delete content asset" });
    }
  });

  // Dashboard stats route
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      // Get basic stats
      const posts = await storage.getPosts(userId, 100);
      const socialAccounts = await storage.getSocialAccounts(userId);
      const scheduledPosts = await storage.getScheduledPosts(userId);

      // Calculate stats
      const publishedPosts = posts.filter(p => p.status === 'published');
      const thisMonthPosts = publishedPosts.filter(p => {
        const postDate = new Date(p.createdAt || new Date());
        const now = new Date();
        return postDate.getMonth() === now.getMonth() &&
               postDate.getFullYear() === now.getFullYear();
      });

      const totalFollowers = socialAccounts.reduce((sum, acc) => sum + (acc.followerCount || 0), 0);

      const stats = {
        postsPublished: thisMonthPosts.length,
        totalEngagement: 0, // This would come from analytics
        newFollowers: Math.floor(totalFollowers * 0.1), // Estimate
        scheduledPosts: scheduledPosts.length,
        connectedAccounts: socialAccounts.length,
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Mobile tracking routes
  router.post('/api/mobile/track-session', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const sessionData = {
        ...req.body,
        user_id: user.id
      };

      // Here you would integrate with Supabase
      const supabaseService = new SupabaseTrackingService(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
      const sessionId = await supabaseService.trackMobileSession(sessionData);

      res.json({ success: true, sessionId: sessionId });
    } catch (error) {
      console.error('Mobile tracking error:', error);
      res.status(500).json({ error: 'Failed to track session' });
    }
  });

  router.get('/api/mobile/analytics', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const days = parseInt(req.query.days as string) || 30;

      // Integrate with Supabase
      const supabaseService = new SupabaseTrackingService(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
      const analytics = await supabaseService.getMobileAnalytics(user.id, days);

      res.json(analytics);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  router.post('/api/lighthouse/test', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      // Mock Lighthouse results - replace with actual API integration
      const lighthouseResults = {
        score: 85,
        categories: {
          performance: { score: 82 },
          accessibility: { score: 95 },
          'best-practices': { score: 88 },
          seo: { score: 90 },
          pwa: { score: 75 }
        },
        audits: {
          'viewport': { score: 100 },
          'tap-targets': { score: 90 },
          'font-size': { score: 95 }
        },
        url,
        timestamp: new Date().toISOString()
      };

      // Optionally, store these results in Supabase via SupabaseTrackingService
      // const supabaseService = new SupabaseTrackingService(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
      // await supabaseService.storeLighthouseResult(userId, url, lighthouseResults);

      res.json(lighthouseResults);
    } catch (error) {
      console.error('Lighthouse test error:', error);
      res.status(500).json({ error: 'Failed to run Lighthouse test' });
    }
  });

  router.get('/api/lighthouse/history', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Integrate with Supabase to get history
      const supabaseService = new SupabaseTrackingService(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
      const history = await supabaseService.getLighthouseHistory(user.id);

      res.json(history);
    } catch (error) {
      console.error('Lighthouse history error:', error);
      res.status(500).json({ error: 'Failed to fetch history' });
    }
  });

  // Mount the router with the new API routes
  app.use(router);

  const httpServer = createServer(app);
  return httpServer;
}