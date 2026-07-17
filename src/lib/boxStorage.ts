const keyFor = (userId: string) => `taniplus:box-names:${userId}`;

export function readBoxNames(userId: string): Record<number, string> {
  try {
    const value = JSON.parse(localStorage.getItem(keyFor(userId)) ?? '{}');
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}

export function saveBoxName(userId: string, boxId: number, name: string) {
  const names = readBoxNames(userId);
  names[boxId] = name.trim();
  localStorage.setItem(keyFor(userId), JSON.stringify(names));
}
