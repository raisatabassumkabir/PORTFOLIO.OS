import { prisma } from '@/lib/prisma';
import { portfolioConfig } from '@/config/portfolio.config';
import { PortfolioConfig } from '@/types/portfolio';

export async function getPortfolioData(): Promise<PortfolioConfig> {
  try {
    const override = await prisma.siteConfigOverride.findUnique({
      where: { id: 'singleton' },
    });

    if (override && override.jsonData) {
      const parsed = JSON.parse(override.jsonData);
      return {
        ...portfolioConfig,
        ...parsed,
      };
    }
  } catch (error) {
    console.warn('Portfolio service using static fallback config:', error);
  }

  return portfolioConfig;
}

export async function savePortfolioOverride(data: Partial<PortfolioConfig>): Promise<boolean> {
  try {
    await prisma.siteConfigOverride.upsert({
      where: { id: 'singleton' },
      update: {
        jsonData: JSON.stringify(data),
      },
      create: {
        id: 'singleton',
        jsonData: JSON.stringify(data),
      },
    });
    return true;
  } catch (error) {
    console.error('Failed to save portfolio override to database:', error);
    return false;
  }
}
