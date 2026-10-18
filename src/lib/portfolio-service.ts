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
        meta: {
          ...portfolioConfig.meta,
          ...(parsed.meta || {}),
        },
        hero: {
          ...portfolioConfig.hero,
          ...(parsed.hero || {}),
          circuitNodes:
            Array.isArray(parsed.hero?.circuitNodes) && parsed.hero.circuitNodes.length > 0
              ? parsed.hero.circuitNodes
              : portfolioConfig.hero.circuitNodes,
        },
        profile: {
          ...portfolioConfig.profile,
          ...(parsed.profile || {}),
          metrics:
            Array.isArray(parsed.profile?.metrics) && parsed.profile.metrics.length > 0
              ? parsed.profile.metrics
              : portfolioConfig.profile.metrics,
        },
        stack: {
          ...portfolioConfig.stack,
          ...(parsed.stack || {}),
          items:
            Array.isArray(parsed.stack?.items) && parsed.stack.items.length > 0
              ? parsed.stack.items
              : portfolioConfig.stack.items,
        },
        work: {
          ...portfolioConfig.work,
          ...(parsed.work || {}),
          projects:
            Array.isArray(parsed.work?.projects) && parsed.work.projects.length > 0
              ? parsed.work.projects
              : portfolioConfig.work.projects,
        },
        journey: {
          ...portfolioConfig.journey,
          ...(parsed.journey || {}),
          nodes:
            Array.isArray(parsed.journey?.nodes) && parsed.journey.nodes.length > 0
              ? parsed.journey.nodes
              : portfolioConfig.journey.nodes,
        },
        contact: {
          ...portfolioConfig.contact,
          ...(parsed.contact || {}),
        },
      };
    }
  } catch (error) {
    console.warn('Portfolio service using static fallback config:', error);
  }

  return portfolioConfig;
}

export async function savePortfolioOverride(data: Partial<PortfolioConfig>): Promise<boolean> {
  try {
    const existing = await prisma.siteConfigOverride.findUnique({
      where: { id: 'singleton' },
    });

    let merged: Record<string, any> = { ...data };
    if (existing?.jsonData) {
      try {
        const existingData = JSON.parse(existing.jsonData);
        merged = {
          ...existingData,
          ...data,
          meta: { ...(existingData.meta || {}), ...(data.meta || {}) },
          hero: { ...(existingData.hero || {}), ...(data.hero || {}) },
          profile: { ...(existingData.profile || {}), ...(data.profile || {}) },
        };
      } catch (e) {
        // ignore
      }
    }

    await prisma.siteConfigOverride.upsert({
      where: { id: 'singleton' },
      update: {
        jsonData: JSON.stringify(merged),
      },
      create: {
        id: 'singleton',
        jsonData: JSON.stringify(merged),
      },
    });
    return true;
  } catch (error) {
    console.error('Failed to save portfolio override to database:', error);
    return false;
  }
}
