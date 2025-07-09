import { useQuery, useQueries } from '@tanstack/react-query';
import { open5eClient } from '@/services/open5eClient';
import { cacheService } from '@/services/cacheService';
import type { Open5eEndpoint } from '@/types/open5e';

// Initialize cache service on module load
cacheService.init().catch(console.error);

// Query key factory
const queryKeys = {
  all: ['open5e'] as const,
  spells: () => [...queryKeys.all, 'spells'] as const,
  spell: (slug: string) => [...queryKeys.spells(), slug] as const,
  classes: () => [...queryKeys.all, 'classes'] as const,
  class: (slug: string) => [...queryKeys.classes(), slug] as const,
  races: () => [...queryKeys.all, 'races'] as const,
  race: (slug: string) => [...queryKeys.races(), slug] as const,
  equipment: () => [...queryKeys.all, 'equipment'] as const,
  equipmentItem: (slug: string) => [...queryKeys.equipment(), slug] as const,
  conditions: () => [...queryKeys.all, 'conditions'] as const,
  condition: (slug: string) => [...queryKeys.conditions(), slug] as const,
  magicItems: () => [...queryKeys.all, 'magicitems'] as const,
  magicItem: (slug: string) => [...queryKeys.magicItems(), slug] as const,
  monsters: () => [...queryKeys.all, 'monsters'] as const,
  monster: (slug: string) => [...queryKeys.monsters(), slug] as const,
  search: (endpoint: Open5eEndpoint, query: string) => [...queryKeys.all, 'search', endpoint, query] as const,
};

// Helper function to fetch with cache
async function fetchWithCache<T>(
  endpoint: Open5eEndpoint,
  slug: string,
  fetcher: () => Promise<T>
): Promise<T> {
  // Try to get from cache first
  const cached = await cacheService.get<T>(endpoint, slug);
  if (cached) {
    return cached;
  }

  // Fetch from API
  const data = await fetcher();
  
  // Store in cache
  await cacheService.set(endpoint, slug, data);
  
  return data;
}

// Fetch all with cache
async function fetchAllWithCache<T>(
  endpoint: Open5eEndpoint,
  fetcher: () => Promise<T[]>
): Promise<T[]> {
  // Check if we have cached data
  const cached = await cacheService.getByEndpoint<T>(endpoint);
  if (cached.length > 0) {
    return cached;
  }

  // Fetch from API
  const data = await fetcher();
  
  // Store each item in cache
  for (const item of data) {
    const itemWithSlug = item as { slug?: string };
    if (itemWithSlug.slug && typeof itemWithSlug.slug === 'string') {
      await cacheService.set(endpoint, itemWithSlug.slug, item);
    }
  }
  
  return data;
}

// Spells
export function useSpells() {
  return useQuery({
    queryKey: queryKeys.spells(),
    queryFn: () => fetchAllWithCache('spells', () => open5eClient.fetchSpells()),
  });
}

export function useSpell(slug: string) {
  return useQuery({
    queryKey: queryKeys.spell(slug),
    queryFn: () => fetchWithCache('spells', slug, () => open5eClient.fetchBySlug('spells', slug)),
    enabled: !!slug,
  });
}

// Classes
export function useClasses() {
  return useQuery({
    queryKey: queryKeys.classes(),
    queryFn: () => fetchAllWithCache('classes', () => open5eClient.fetchClasses()),
  });
}

export function useClass(slug: string) {
  return useQuery({
    queryKey: queryKeys.class(slug),
    queryFn: () => fetchWithCache('classes', slug, () => open5eClient.fetchBySlug('classes', slug)),
    enabled: !!slug,
  });
}

// Races
export function useRaces() {
  return useQuery({
    queryKey: queryKeys.races(),
    queryFn: () => fetchAllWithCache('races', () => open5eClient.fetchRaces()),
  });
}

export function useRace(slug: string) {
  return useQuery({
    queryKey: queryKeys.race(slug),
    queryFn: () => fetchWithCache('races', slug, () => open5eClient.fetchBySlug('races', slug)),
    enabled: !!slug,
  });
}

// Equipment
export function useEquipment() {
  return useQuery({
    queryKey: queryKeys.equipment(),
    queryFn: () => fetchAllWithCache('equipment', () => open5eClient.fetchEquipment()),
  });
}

export function useEquipmentItem(slug: string) {
  return useQuery({
    queryKey: queryKeys.equipmentItem(slug),
    queryFn: () => fetchWithCache('equipment', slug, () => open5eClient.fetchBySlug('equipment', slug)),
    enabled: !!slug,
  });
}

// Conditions
export function useConditions() {
  return useQuery({
    queryKey: queryKeys.conditions(),
    queryFn: () => fetchAllWithCache('conditions', () => open5eClient.fetchConditions()),
  });
}

export function useCondition(slug: string) {
  return useQuery({
    queryKey: queryKeys.condition(slug),
    queryFn: () => fetchWithCache('conditions', slug, () => open5eClient.fetchBySlug('conditions', slug)),
    enabled: !!slug,
  });
}

// Magic Items
export function useMagicItems() {
  return useQuery({
    queryKey: queryKeys.magicItems(),
    queryFn: () => fetchAllWithCache('magicitems', () => open5eClient.fetchMagicItems()),
  });
}

export function useMagicItem(slug: string) {
  return useQuery({
    queryKey: queryKeys.magicItem(slug),
    queryFn: () => fetchWithCache('magicitems', slug, () => open5eClient.fetchBySlug('magicitems', slug)),
    enabled: !!slug,
  });
}

// Monsters
export function useMonsters() {
  return useQuery({
    queryKey: queryKeys.monsters(),
    queryFn: () => fetchAllWithCache('monsters', () => open5eClient.fetchMonsters()),
  });
}

export function useMonster(slug: string) {
  return useQuery({
    queryKey: queryKeys.monster(slug),
    queryFn: () => fetchWithCache('monsters', slug, () => open5eClient.fetchBySlug('monsters', slug)),
    enabled: !!slug,
  });
}

// Search
export function useOpen5eSearch(endpoint: Open5eEndpoint, query: string) {
  return useQuery({
    queryKey: queryKeys.search(endpoint, query),
    queryFn: () => open5eClient.search(endpoint, query),
    enabled: !!query && query.length >= 2,
  });
}

// Multiple searches
export function useOpen5eMultiSearch(query: string) {
  const endpoints: Open5eEndpoint[] = ['spells', 'classes', 'races', 'equipment', 'conditions', 'magicitems'];
  
  return useQueries({
    queries: endpoints.map(endpoint => ({
      queryKey: queryKeys.search(endpoint, query),
      queryFn: () => open5eClient.search(endpoint, query),
      enabled: !!query && query.length >= 2,
    })),
  });
}

// Cache management hooks
export function useCacheStats() {
  return useQuery({
    queryKey: ['cache-stats'],
    queryFn: () => cacheService.getCacheStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useBookmarks() {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => cacheService.getBookmarks(),
  });
}

export function useIsBookmarked(id: string) {
  return useQuery({
    queryKey: ['bookmark', id],
    queryFn: () => cacheService.isBookmarked(id),
    enabled: !!id,
  });
}