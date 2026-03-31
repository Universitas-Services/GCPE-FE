import { describe, it, expect } from 'vitest';
import { changePasswordSchema } from './change-password.schema';

describe('Profile Feature: changePasswordSchema', () => {
  it('should validate a correct password change form object', () => {
    const validData = {
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123',
    };

    const result = changePasswordSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe('Field Validations', () => {
    it('should fail if currentPassword is empty', () => {
      const data = {
        currentPassword: '',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      };
      const result = changePasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message === 'La contraseña anterior es requerida' && i.path.includes('currentPassword'))).toBe(true);
      }
    });

    it('should fail if newPassword is too short (less than 6 chars)', () => {
      const data = {
        currentPassword: 'oldPassword123',
        newPassword: 'short',
        confirmPassword: 'short',
      };
      const result = changePasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message === 'La nueva contraseña debe tener al menos 6 caracteres' && i.path.includes('newPassword'))).toBe(true);
      }
    });

    it('should fail if confirmPassword is empty', () => {
      const data = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
        confirmPassword: '',
      };
      const result = changePasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        // Validation fails at min(1) before the custom refine, or both
        expect(result.error.issues.some((i) => i.path.includes('confirmPassword'))).toBe(true);
      }
    });
  });

  describe('Custom Validation Rules', () => {
    it('should fail if newPassword and confirmPassword do not match', () => {
      const data = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
        confirmPassword: 'differentPassword123',
      };
      const result = changePasswordSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message === 'Las contraseñas no coinciden' && i.path.includes('confirmPassword'))).toBe(true);
      }
    });
  });
});
