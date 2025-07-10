/**
 * Format a date in medieval fantasy style
 */
export function formatMedievalTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) {
    return 'moments ago';
  } else if (diffMins === 1) {
    return 'a moment past';
  } else if (diffMins < 5) {
    return 'but a few moments past';
  } else if (diffMins < 15) {
    return 'a quarter bell past';
  } else if (diffMins < 30) {
    return 'half a bell past';
  } else if (diffMins < 45) {
    return 'three quarters bell past';
  } else if (diffHours === 1) {
    return 'one bell past';
  } else if (diffHours < 3) {
    return 'a few bells past';
  } else if (diffHours < 6) {
    return 'quarter day past';
  } else if (diffHours < 12) {
    return 'half day past';
  } else if (diffDays === 1) {
    return 'yestereve';
  } else if (diffDays === 2) {
    return 'two suns past';
  } else if (diffDays === 3) {
    return 'three suns past';
  } else if (diffDays < 7) {
    return `${diffDays} suns past`;
  } else if (diffDays < 14) {
    return 'a sennight past';
  } else if (diffDays < 21) {
    return 'a fortnight past';
  } else if (diffDays < 28) {
    return 'three sennights past';
  } else if (diffDays < 60) {
    return 'a moon past';
  } else {
    return 'many moons past';
  }
}

/**
 * Get a medieval time of day description
 */
export function getMedievalTimeOfDay(date: Date): string {
  const hour = date.getHours();
  
  if (hour >= 0 && hour < 3) return 'the witching hour';
  if (hour >= 3 && hour < 5) return 'the wolf hour';
  if (hour >= 5 && hour < 7) return 'dawn\'s first light';
  if (hour >= 7 && hour < 9) return 'the morning bells';
  if (hour >= 9 && hour < 11) return 'mid-morning';
  if (hour >= 11 && hour < 13) return 'high sun';
  if (hour >= 13 && hour < 15) return 'afternoon';
  if (hour >= 15 && hour < 17) return 'late afternoon';
  if (hour >= 17 && hour < 19) return 'eventide';
  if (hour >= 19 && hour < 21) return 'dusk\'s embrace';
  if (hour >= 21 && hour < 24) return 'the night watch';
  
  return 'an unknown hour';
}