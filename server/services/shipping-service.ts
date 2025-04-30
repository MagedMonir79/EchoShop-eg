import { db } from "../db";
import { shippingCompanies, shippingOptions } from "@shared/schema";
import { eq, and, asc } from "drizzle-orm";
import { InsertShippingCompany, InsertShippingOption } from "@shared/schema";

/**
 * Shipping Service - Manages shipping companies and shipping options
 */
export class ShippingService {
  /**
   * Get all active shipping companies
   */
  async getAllShippingCompanies() {
    return await db
      .select()
      .from(shippingCompanies)
      .where(eq(shippingCompanies.isActive, true))
      .orderBy(asc(shippingCompanies.name));
  }

  /**
   * Get shipping company by ID
   */
  async getShippingCompanyById(id: number) {
    const [company] = await db
      .select()
      .from(shippingCompanies)
      .where(eq(shippingCompanies.id, id));
    
    return company;
  }

  /**
   * Get all shipping options for a specific company
   */
  async getShippingOptionsByCompanyId(companyId: number) {
    return await db
      .select()
      .from(shippingOptions)
      .where(
        and(
          eq(shippingOptions.shippingCompanyId, companyId),
          eq(shippingOptions.isActive, true)
        )
      )
      .orderBy(asc(shippingOptions.name));
  }

  /**
   * Get all active shipping options
   */
  async getAllShippingOptions() {
    return await db
      .select({
        id: shippingOptions.id,
        name: shippingOptions.name,
        nameAr: shippingOptions.nameAr,
        description: shippingOptions.description,
        descriptionAr: shippingOptions.descriptionAr,
        price: shippingOptions.price,
        deliveryTimeMinDays: shippingOptions.deliveryTimeMinDays,
        deliveryTimeMaxDays: shippingOptions.deliveryTimeMaxDays,
        isDefault: shippingOptions.isDefault,
        isActive: shippingOptions.isActive,
        shippingCompanyId: shippingOptions.shippingCompanyId,
        shippingCompanyName: shippingCompanies.name,
        shippingCompanyNameAr: shippingCompanies.nameAr,
      })
      .from(shippingOptions)
      .innerJoin(
        shippingCompanies, 
        eq(shippingOptions.shippingCompanyId, shippingCompanies.id)
      )
      .where(
        and(
          eq(shippingOptions.isActive, true),
          eq(shippingCompanies.isActive, true)
        )
      )
      .orderBy(asc(shippingOptions.deliveryTimeMinDays));
  }

  /**
   * Get shipping option by ID
   */
  async getShippingOptionById(id: number) {
    const [option] = await db
      .select({
        id: shippingOptions.id,
        name: shippingOptions.name,
        nameAr: shippingOptions.nameAr,
        description: shippingOptions.description,
        descriptionAr: shippingOptions.descriptionAr,
        price: shippingOptions.price,
        deliveryTimeMinDays: shippingOptions.deliveryTimeMinDays,
        deliveryTimeMaxDays: shippingOptions.deliveryTimeMaxDays,
        isDefault: shippingOptions.isDefault,
        isActive: shippingOptions.isActive,
        shippingCompanyId: shippingOptions.shippingCompanyId,
        shippingCompanyName: shippingCompanies.name,
        shippingCompanyNameAr: shippingCompanies.nameAr,
      })
      .from(shippingOptions)
      .innerJoin(
        shippingCompanies, 
        eq(shippingOptions.shippingCompanyId, shippingCompanies.id)
      )
      .where(eq(shippingOptions.id, id));
    
    return option;
  }

  /**
   * Get default shipping option
   */
  async getDefaultShippingOption() {
    const [option] = await db
      .select({
        id: shippingOptions.id,
        name: shippingOptions.name,
        nameAr: shippingOptions.nameAr,
        description: shippingOptions.description,
        descriptionAr: shippingOptions.descriptionAr,
        price: shippingOptions.price,
        deliveryTimeMinDays: shippingOptions.deliveryTimeMinDays,
        deliveryTimeMaxDays: shippingOptions.deliveryTimeMaxDays,
        isDefault: shippingOptions.isDefault,
        isActive: shippingOptions.isActive,
        shippingCompanyId: shippingOptions.shippingCompanyId,
        shippingCompanyName: shippingCompanies.name,
        shippingCompanyNameAr: shippingCompanies.nameAr,
      })
      .from(shippingOptions)
      .innerJoin(
        shippingCompanies, 
        eq(shippingOptions.shippingCompanyId, shippingCompanies.id)
      )
      .where(
        and(
          eq(shippingOptions.isDefault, true),
          eq(shippingOptions.isActive, true),
          eq(shippingCompanies.isActive, true)
        )
      );
    
    // If no default option is found, get the first active option
    if (!option) {
      const [firstOption] = await this.getAllShippingOptions();
      return firstOption;
    }
    
    return option;
  }

  /**
   * Create shipping company
   */
  async createShippingCompany(companyData: InsertShippingCompany) {
    const [createdCompany] = await db
      .insert(shippingCompanies)
      .values(companyData)
      .returning();
    
    return createdCompany;
  }

  /**
   * Create shipping option
   */
  async createShippingOption(optionData: InsertShippingOption) {
    // If this option is set as default, unset any existing default options
    if (optionData.isDefault) {
      await db
        .update(shippingOptions)
        .set({ isDefault: false })
        .where(eq(shippingOptions.isDefault, true));
    }
    
    const [createdOption] = await db
      .insert(shippingOptions)
      .values(optionData)
      .returning();
    
    return createdOption;
  }

  /**
   * Update shipping company
   */
  async updateShippingCompany(id: number, companyData: Partial<InsertShippingCompany>) {
    const [updatedCompany] = await db
      .update(shippingCompanies)
      .set(companyData)
      .where(eq(shippingCompanies.id, id))
      .returning();
    
    return updatedCompany;
  }

  /**
   * Update shipping option
   */
  async updateShippingOption(id: number, optionData: Partial<InsertShippingOption>) {
    // If this option is set as default, unset any existing default options
    if (optionData.isDefault) {
      // Unset default for all other options
      await db
        .update(shippingOptions)
        .set({ isDefault: false })
        .where(
          eq(shippingOptions.isDefault, true)
        );
    }
    
    const [updatedOption] = await db
      .update(shippingOptions)
      .set(optionData)
      .where(eq(shippingOptions.id, id))
      .returning();
    
    return updatedOption;
  }
}

// Export a singleton instance
export const shippingService = new ShippingService();