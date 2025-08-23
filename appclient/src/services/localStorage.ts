// Local Storage Service - Deprecated
// This service is no longer used as the application now connects to real APIs
// Keeping this file for backward compatibility during migration

export interface LocalStorageData {
  quotations: any[];
  clients: any[];
  services: any[];
  chatSessions: any[];
  appointments: any[];
  emails: any[];
  templates: any[];
  automationRules: any[];
  pendingQuotes: any[];
  categories: any[];
}

const STORAGE_KEY = 'handyman_manager_data';

class LocalStorageService {
  /**
   * Clear all localStorage data to force using real APIs
   */
  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('Cleared all localStorage data - now using real APIs');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Check if localStorage has any data (for migration purposes)
   */
  hasData(): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get data for migration purposes only
   */
  getData(): LocalStorageData | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return null;
    }
  }
}

// Export singleton instance
export const localStorageService = new LocalStorageService();
export default localStorageService;