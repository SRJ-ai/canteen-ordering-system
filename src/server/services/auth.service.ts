import { createClient } from '@/lib/supabase/server';
import { AuthRepository } from '../repositories/auth.repository';

export class AuthService {
  /**
   * Get the current session along with the user's role.
   */
  static async getSession() {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }

    const role = await AuthRepository.getUserRole(session.user.id);
    
    return { 
      ...session, 
      user: { ...session.user, role } 
    };
  }
  
  /**
   * Get the current user along with their role (more secure than getSession).
   */
  static async getUser() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    const role = await AuthRepository.getUserRole(user.id);
    
    return { ...user, role };
  }
  
  /**
   * Verify if the current user has the required role.
   */
  static async requireRole(requiredRoles: string[]) {
    const user = await this.getUser();
    
    if (!user || !user.role || !requiredRoles.includes(user.role)) {
      throw new Error('Unauthorized');
    }
    
    return user;
  }
}
