import { z } from 'zod';

export const projectInquirySchema = z.object({
  clientName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  clientEmail: z.string().email('Please enter a valid email address'),
  projectType: z.enum(['Mobile App', 'AI/ML System', 'Full-Stack Web', 'Cloud/API', 'Other']),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  brief: z.string().min(10, 'Please provide at least a brief description (min 10 characters)').max(3000),
});

export type ProjectInquiryInput = z.infer<typeof projectInquirySchema>;

export const adminLoginSchema = z.object({
  secret: z.string().min(1, 'Admin key is required'),
});
