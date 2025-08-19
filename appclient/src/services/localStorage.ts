// Local Storage Service for Mock Data Persistence
// This service provides persistent storage for mock data using localStorage

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
}

const STORAGE_KEY = 'handyman_manager_data';
const DEFAULT_DATA: LocalStorageData = {
  quotations: [],
  clients: [],
  services: [],
  chatSessions: [],
  appointments: [],
  emails: [],
  templates: [],
  automationRules: [],
  pendingQuotes: []
};

class LocalStorageService {
  private data: LocalStorageData;

  constructor() {
    this.data = this.loadData();
  }

  /**
   * Load data from localStorage or return default data
   */
  private loadData(): LocalStorageData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with default data to ensure all keys exist
        return { ...DEFAULT_DATA, ...parsed };
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
    return { ...DEFAULT_DATA };
  }

  /**
   * Save data to localStorage
   */
  private saveData(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }

  /**
   * Initialize with mock data if storage is empty
   */
  initializeWithMockData(mockData: Partial<LocalStorageData>): void {
    const hasData = Object.values(this.data).some(arr => arr.length > 0);
    
    if (!hasData) {
      this.data = { ...this.data, ...mockData };
      this.saveData();
      console.log('Initialized localStorage with mock data');
    }
  }

  /**
   * Generic CRUD operations
   */
  getAll<T>(key: keyof LocalStorageData): T[] {
    return [...this.data[key]] as T[];
  }

  getById<T>(key: keyof LocalStorageData, id: string): T | null {
    const items = this.data[key] as any[];
    return items.find(item => item.id === id) || null;
  }

  create<T>(key: keyof LocalStorageData, item: T): T {
    const items = this.data[key] as any[];
    const newItem = { ...item, id: this.generateId(key) };
    items.push(newItem);
    this.saveData();
    return newItem;
  }

  update<T>(key: keyof LocalStorageData, id: string, updates: Partial<T>): T | null {
    const items = this.data[key] as any[];
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedItem = { 
      ...items[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    items[index] = updatedItem;
    this.saveData();
    return updatedItem;
  }

  delete(key: keyof LocalStorageData, id: string): boolean {
    const items = this.data[key] as any[];
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return false;
    
    items.splice(index, 1);
    this.saveData();
    return true;
  }

  /**
   * Generate unique ID for new items
   */
  private generateId(key: keyof LocalStorageData): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${key}_${timestamp}_${random}`;
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.data = { ...DEFAULT_DATA };
    this.saveData();
  }

  /**
   * Export data (for backup)
   */
  exportData(): LocalStorageData {
    return { ...this.data };
  }

  /**
   * Import data (for restore)
   */
  importData(data: LocalStorageData): void {
    this.data = { ...DEFAULT_DATA, ...data };
    this.saveData();
  }

  /**
   * Get storage statistics
   */
  getStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    Object.keys(this.data).forEach(key => {
      stats[key] = this.data[key as keyof LocalStorageData].length;
    });
    return stats;
  }
}

// Create singleton instance
export const localStorageService = new LocalStorageService();

// Export types for convenience
export type { LocalStorageData };
