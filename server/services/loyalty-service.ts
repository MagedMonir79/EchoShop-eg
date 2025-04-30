import { db } from "../db";
import { users, loyaltyPoints, loyaltyTransactions, loyaltyRewards, redemptions } from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { InsertLoyaltyPoints, InsertLoyaltyTransaction, InsertRedemption } from "@shared/schema";

/**
 * Loyalty Service - Manages customer loyalty points and rewards
 */
class LoyaltyService {
  // Constants for points calculation
  private readonly POINTS_PER_CURRENCY = 1; // 1 point per EGP
  private readonly EXPIRATION_DAYS = 365; // Points expire after 1 year
  
  // Tier thresholds (lifetime points)
  private readonly TIER_THRESHOLDS = {
    bronze: 0,
    silver: 1000,
    gold: 5000,
    platinum: 15000
  };

  /**
   * Create a loyalty account for a user if it doesn't exist
   */
  async createLoyaltyAccount(userId: number): Promise<void> {
    const existingAccount = await db.select()
      .from(loyaltyPoints)
      .where(eq(loyaltyPoints.userId, userId));
    
    if (existingAccount.length === 0) {
      await db.insert(loyaltyPoints).values({
        userId,
        points: 0,
        balance: 0,
        lifetimePoints: 0,
        tier: 'bronze'
      });
    }
  }

  /**
   * Get a user's loyalty account
   */
  async getLoyaltyAccount(userId: number) {
    const [account] = await db.select()
      .from(loyaltyPoints)
      .where(eq(loyaltyPoints.userId, userId));
    
    return account;
  }

  /**
   * Award points for an order
   */
  async awardOrderPoints(userId: number, orderId: number, orderTotal: number): Promise<void> {
    // Make sure user has a loyalty account
    await this.createLoyaltyAccount(userId);
    
    // Calculate points to award (1 point per currency unit)
    const pointsToAward = Math.floor(orderTotal * this.POINTS_PER_CURRENCY);
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.EXPIRATION_DAYS);
    
    // Create transaction record
    await db.insert(loyaltyTransactions).values({
      userId,
      type: 'earn',
      amount: pointsToAward,
      description: `Points earned for order #${orderId}`,
      orderId,
      expiresAt
    });
    
    // Update loyalty account
    await db.transaction(async (tx) => {
      // Get current account
      const [account] = await tx.select()
        .from(loyaltyPoints)
        .where(eq(loyaltyPoints.userId, userId));
      
      // Update points balance
      const newBalance = account.balance + pointsToAward;
      const newLifetimePoints = account.lifetimePoints + pointsToAward;
      
      // Determine tier based on lifetime points
      const newTier = this.calculateTier(newLifetimePoints);
      
      // Update account
      await tx.update(loyaltyPoints)
        .set({
          points: sql`${loyaltyPoints.points} + ${pointsToAward}`,
          balance: newBalance,
          lifetimePoints: newLifetimePoints,
          tier: newTier,
          updatedAt: new Date()
        })
        .where(eq(loyaltyPoints.userId, userId));
    });
  }

  /**
   * Redeem points for a reward
   */
  async redeemPoints(userId: number, rewardId: number): Promise<string> {
    return await db.transaction(async (tx) => {
      // Get reward details
      const [reward] = await tx.select()
        .from(loyaltyRewards)
        .where(eq(loyaltyRewards.id, rewardId));
      
      if (!reward) {
        throw new Error('Reward not found');
      }
      
      if (!reward.active) {
        throw new Error('Reward is not active');
      }
      
      // Get user's loyalty account
      const [account] = await tx.select()
        .from(loyaltyPoints)
        .where(eq(loyaltyPoints.userId, userId));
      
      if (!account) {
        throw new Error('Loyalty account not found');
      }
      
      // Check if user has enough points
      if (account.balance < reward.pointsCost) {
        throw new Error('Insufficient points balance');
      }
      
      // Generate unique redemption code
      const code = this.generateRedemptionCode();
      
      // Calculate expiration date (90 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 90);
      
      // Create redemption record
      await tx.insert(redemptions).values({
        userId,
        rewardId,
        pointsUsed: reward.pointsCost,
        code,
        status: 'active',
        expiresAt
      });
      
      // Create transaction record
      await tx.insert(loyaltyTransactions).values({
        userId,
        type: 'redeem',
        amount: -reward.pointsCost,
        description: `Redeemed points for ${reward.name}`,
        expiresAt: null
      });
      
      // Update loyalty account balance
      await tx.update(loyaltyPoints)
        .set({
          balance: account.balance - reward.pointsCost,
          updatedAt: new Date()
        })
        .where(eq(loyaltyPoints.userId, userId));
      
      return code;
    });
  }

  /**
   * Get user's transaction history
   */
  async getTransactionHistory(userId: number, limit = 20, offset = 0) {
    return await db.select()
      .from(loyaltyTransactions)
      .where(eq(loyaltyTransactions.userId, userId))
      .orderBy(desc(loyaltyTransactions.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Get user's redemption history
   */
  async getRedemptionHistory(userId: number, limit = 20, offset = 0) {
    return await db
      .select({
        redemption: redemptions,
        reward: loyaltyRewards
      })
      .from(redemptions)
      .innerJoin(loyaltyRewards, eq(redemptions.rewardId, loyaltyRewards.id))
      .where(eq(redemptions.userId, userId))
      .orderBy(desc(redemptions.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Get all available rewards
   */
  async getAvailableRewards(minOrderValue?: number) {
    let query = db
      .select()
      .from(loyaltyRewards)
      .where(eq(loyaltyRewards.active, true));
    
    if (minOrderValue !== undefined) {
      query = query.where(
        sql`${loyaltyRewards.minimumOrderValue} IS NULL OR ${loyaltyRewards.minimumOrderValue} <= ${minOrderValue}`
      );
    }
    
    return await query;
  }

  /**
   * Process expired points
   * This should be run as a scheduled job
   */
  async processExpiredPoints(): Promise<number> {
    const now = new Date();
    let expiredPointsCount = 0;
    
    // Find expired transactions
    const expiredTransactions = await db.select()
      .from(loyaltyTransactions)
      .where(
        and(
          sql`${loyaltyTransactions.expiresAt} IS NOT NULL`,
          sql`${loyaltyTransactions.expiresAt} < ${now}`,
          eq(loyaltyTransactions.type, 'earn')
        )
      );
    
    // Process each expired transaction
    for (const transaction of expiredTransactions) {
      expiredPointsCount += transaction.amount;
      
      await db.transaction(async (tx) => {
        // Create expiration transaction
        await tx.insert(loyaltyTransactions).values({
          userId: transaction.userId,
          type: 'expire',
          amount: -transaction.amount,
          description: 'Points expired',
          expiresAt: null
        });
        
        // Update user's point balance
        await tx.update(loyaltyPoints)
          .set({
            balance: sql`${loyaltyPoints.balance} - ${transaction.amount}`,
            updatedAt: now
          })
          .where(eq(loyaltyPoints.userId, transaction.userId));
        
        // Mark the original transaction as expired
        await tx.update(loyaltyTransactions)
          .set({ expiresAt: null })
          .where(eq(loyaltyTransactions.id, transaction.id));
      });
    }
    
    return expiredPointsCount;
  }

  /**
   * Calculate user tier based on lifetime points
   */
  private calculateTier(lifetimePoints: number): string {
    if (lifetimePoints >= this.TIER_THRESHOLDS.platinum) {
      return 'platinum';
    } else if (lifetimePoints >= this.TIER_THRESHOLDS.gold) {
      return 'gold';
    } else if (lifetimePoints >= this.TIER_THRESHOLDS.silver) {
      return 'silver';
    } else {
      return 'bronze';
    }
  }

  /**
   * Create a new loyalty reward
   */
  async createReward(rewardData: any) {
    const [reward] = await db
      .insert(loyaltyRewards)
      .values(rewardData)
      .returning();
    
    return reward;
  }
  
  /**
   * Update an existing loyalty reward
   */
  async updateReward(rewardId: number, rewardData: any) {
    const [existingReward] = await db
      .select()
      .from(loyaltyRewards)
      .where(eq(loyaltyRewards.id, rewardId));
    
    if (!existingReward) {
      return null;
    }
    
    const [updatedReward] = await db
      .update(loyaltyRewards)
      .set({
        ...rewardData,
        updatedAt: new Date()
      })
      .where(eq(loyaltyRewards.id, rewardId))
      .returning();
    
    return updatedReward;
  }
  
  /**
   * Delete a loyalty reward
   */
  async deleteReward(rewardId: number) {
    const [existingReward] = await db
      .select()
      .from(loyaltyRewards)
      .where(eq(loyaltyRewards.id, rewardId));
    
    if (!existingReward) {
      return null;
    }
    
    await db
      .delete(loyaltyRewards)
      .where(eq(loyaltyRewards.id, rewardId));
    
    return true;
  }
  
  /**
   * Generate a unique redemption code
   */
  private generateRedemptionCode(): string {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing characters like O/0, I/1
    let code = '';
    
    // Generate 8 character code
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    
    // Add hyphens for readability: XXXX-XXXX
    return `${code.substring(0, 4)}-${code.substring(4, 8)}`;
  }
}

export const loyaltyService = new LoyaltyService();