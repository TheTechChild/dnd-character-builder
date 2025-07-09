import type {
  Open5eSpell,
  Open5eClass,
  Open5eRace,
  Open5eEquipment,
  Open5eCondition,
  Open5eMagicItem,
  Open5eMonster,
  Open5eResponse,
  Open5eEndpoint,
} from '@/types/open5e';

const BASE_URL = 'https://api.open5e.com';
const RATE_LIMIT_DELAY = 100; // ms between requests

class Open5eClient {
  private lastRequestTime = 0;

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }

  private async fetchWithRateLimit<T>(url: string): Promise<T> {
    await this.rateLimit();
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open5e API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async fetchAll<T>(endpoint: Open5eEndpoint): Promise<T[]> {
    const results: T[] = [];
    let nextUrl: string | null = `${BASE_URL}/${endpoint}/?limit=100`;

    while (nextUrl) {
      const response: Open5eResponse<T> = await this.fetchWithRateLimit<Open5eResponse<T>>(nextUrl);
      results.push(...response.results);
      nextUrl = response.next;
    }

    return results;
  }

  async fetchSpells(): Promise<Open5eSpell[]> {
    return this.fetchAll<Open5eSpell>('spells');
  }

  async fetchClasses(): Promise<Open5eClass[]> {
    return this.fetchAll<Open5eClass>('classes');
  }

  async fetchRaces(): Promise<Open5eRace[]> {
    return this.fetchAll<Open5eRace>('races');
  }

  async fetchEquipment(): Promise<Open5eEquipment[]> {
    return this.fetchAll<Open5eEquipment>('equipment');
  }

  async fetchConditions(): Promise<Open5eCondition[]> {
    return this.fetchAll<Open5eCondition>('conditions');
  }

  async fetchMagicItems(): Promise<Open5eMagicItem[]> {
    return this.fetchAll<Open5eMagicItem>('magicitems');
  }

  async fetchMonsters(): Promise<Open5eMonster[]> {
    return this.fetchAll<Open5eMonster>('monsters');
  }

  async search(endpoint: Open5eEndpoint, query: string): Promise<unknown[]> {
    const url = `${BASE_URL}/${endpoint}/?search=${encodeURIComponent(query)}&limit=20`;
    const response = await this.fetchWithRateLimit<Open5eResponse<unknown>>(url);
    return response.results;
  }

  async fetchBySlug(endpoint: Open5eEndpoint, slug: string): Promise<unknown> {
    const url = `${BASE_URL}/${endpoint}/${slug}/`;
    return this.fetchWithRateLimit<unknown>(url);
  }
}

export const open5eClient = new Open5eClient();