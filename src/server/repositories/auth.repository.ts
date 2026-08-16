import { createClient } from '@/lib/supabase/server';

export class AuthRepository {
  /**
   * Fetches the user role from the database.
   */
  static async getUserRole(userId: string) {
    const supabase = await createClient();
    
    // We assume there's a 'user_roles' table or a 'profiles' table that stores roles.
    // Replace 'profiles' with your actual table name if different.
    const { data, error } = await supabase
      .from('profiles') 
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error.message);
      return null;
    }

    return data?.role || null;
  }
}
