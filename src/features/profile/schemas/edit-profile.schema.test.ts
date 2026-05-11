import { describe, it, expect } from 'vitest';
import { editProfileSchema } from './edit-profile.schema';

describe('editProfileSchema', () => {
  const validData = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '04141234567',
    institution: 'Universidad Central',
    role: 'Administrador',
  };

  it('should validate correct data successfully', () => {
    const result = editProfileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when firstName is empty', () => {
    const result = editProfileSchema.safeParse({ ...validData, firstName: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre es requerido');
    }
  });

  it('should fail when lastName is empty', () => {
    const result = editProfileSchema.safeParse({ ...validData, lastName: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El apellido es requerido');
    }
  });

  it('should fail when phone is empty', () => {
    const result = editProfileSchema.safeParse({ ...validData, phone: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El teléfono es requerido');
    }
  });

  it('should fail when institution is empty', () => {
    const result = editProfileSchema.safeParse({
      ...validData,
      institution: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'La institución es requerida'
      );
    }
  });

  it('should fail when role is empty', () => {
    const result = editProfileSchema.safeParse({ ...validData, role: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El cargo es requerido');
    }
  });

  it('should fail when required fields are missing', () => {
    const result = editProfileSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(5);
    }
  });
});
