import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(3, 'At least 3 characters'),
  password: z.string().min(6, 'At least 6 characters'),
})

export const registerSchema = z.object({
  username: z.string().min(3, 'At least 3 characters'),
  password: z.string().min(6, 'At least 6 characters'),
  role: z.enum(['ADMIN', 'USER']),
})

export const studentSchema = z.object({
  name: z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Invalid email'),
  rollNumber: z.string().min(1, 'Required'),
})

export const subjectSchema = z.object({
  name: z.string().min(2, 'At least 2 characters'),
  maxMarks: z.coerce.number().int().min(1).max(1000),
})

export const markSchema = z.object({
  studentId: z.coerce.number().int().positive(),
  subjectId: z.coerce.number().int().positive(),
  marksObtained: z.coerce.number().int().min(0, 'Cannot be negative'),
})

export const updateMarkSchema = z.object({
  marksObtained: z.coerce.number().int().min(0, 'Cannot be negative'),
})
