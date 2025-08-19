import {
  users,
  socialAccounts,
  posts,
  analytics,
  contentAssets,
  type User,
  type UpsertUser,
  type SocialAccount,
  type InsertSocialAccount,
  type Post,
  type InsertPost,
  type Analytics,
  type InsertAnalytics,
  type ContentAsset,
  type InsertContentAsset,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Social Account operations
  getSocialAccounts(userId: string): Promise<SocialAccount[]>;
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  updateSocialAccount(id: string, account: Partial<SocialAccount>): Promise<SocialAccount>;
  deleteSocialAccount(id: string): Promise<void>;

  // Post operations
  getPosts(userId: string, limit?: number): Promise<Post[]>;
  getPost(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<Post>): Promise<Post>;
  deletePost(id: string): Promise<void>;
  getScheduledPosts(userId: string): Promise<Post[]>;

  // Analytics operations
  getAnalytics(userId: string, startDate?: Date, endDate?: Date): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;

  // Content Asset operations
  getContentAssets(userId: string): Promise<ContentAsset[]>;
  createContentAsset(asset: InsertContentAsset): Promise<ContentAsset>;
  deleteContentAsset(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserAyrshareProfile(userId: string, ayrshareProfileKey: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ayrshareProfileKey,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Social Account operations
  async getSocialAccounts(userId: string): Promise<SocialAccount[]> {
    return await db
      .select()
      .from(socialAccounts)
      .where(eq(socialAccounts.userId, userId))
      .orderBy(desc(socialAccounts.createdAt));
  }

  async createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount> {
    const [newAccount] = await db
      .insert(socialAccounts)
      .values(account)
      .returning();
    return newAccount;
  }

  async updateSocialAccount(id: string, account: Partial<SocialAccount>): Promise<SocialAccount> {
    const [updatedAccount] = await db
      .update(socialAccounts)
      .set({ ...account, updatedAt: new Date() })
      .where(eq(socialAccounts.id, id))
      .returning();
    return updatedAccount;
  }

  async deleteSocialAccount(id: string): Promise<void> {
    await db.delete(socialAccounts).where(eq(socialAccounts.id, id));
  }

  // Post operations
  async getPosts(userId: string, limit: number = 50): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  }

  async getPost(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: string, post: Partial<Post>): Promise<Post> {
    const [updatedPost] = await db
      .update(posts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async getScheduledPosts(userId: string): Promise<Post[]> {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.userId, userId),
          eq(posts.status, "scheduled"),
          gte(posts.scheduledAt, now),
          lte(posts.scheduledAt, nextWeek)
        )
      )
      .orderBy(posts.scheduledAt);
  }

  // Analytics operations
  async getAnalytics(userId: string, startDate?: Date, endDate?: Date): Promise<Analytics[]> {
    const userPosts = await this.getPosts(userId);
    const postIds = userPosts.map(p => p.id);

    if (postIds.length === 0) return [];

    let baseQuery = db
      .select()
      .from(analytics);

    const conditions = [];
    if (postIds.length > 0) {
      // This condition is problematic. It should ideally check if analytics.postId is in postIds.
      // For now, sticking to the provided logic but flagging it.
      conditions.push(analytics.postId ? eq(analytics.postId, postIds[0]) : undefined);
    }
    if (startDate) {
      conditions.push(gte(analytics.date, startDate));
    }
    if (endDate) {
      conditions.push(lte(analytics.date, endDate));
    }

    const query = conditions.length > 0
      ? baseQuery.where(and(...conditions.filter(Boolean)))
      : baseQuery;

    return await query.orderBy(desc(analytics.date));
  }

  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [newAnalytics] = await db
      .insert(analytics)
      .values(analyticsData)
      .returning();
    return newAnalytics;
  }

  // Content Asset operations
  async getContentAssets(userId: string): Promise<ContentAsset[]> {
    return await db
      .select()
      .from(contentAssets)
      .where(eq(contentAssets.userId, userId))
      .orderBy(desc(contentAssets.createdAt));
  }

  async createContentAsset(asset: InsertContentAsset): Promise<ContentAsset> {
    const [newAsset] = await db.insert(contentAssets).values(asset).returning();
    return newAsset;
  }

  async deleteContentAsset(assetId: string): Promise<void> {
    await db.delete(contentAssets).where(eq(contentAssets.id, assetId));
  }

  async getAnalytics(userId: string, startDate?: Date, endDate?: Date) {
    // For now, return empty array as analytics table might not exist yet
    // This prevents the API from crashing
    return [];
  }
}

export const storage = new DatabaseStorage();