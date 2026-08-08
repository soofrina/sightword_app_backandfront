export const localStorageEffect = <T>(key: string) => ({ setSelf, onSet }: any) => {
  const savedValue = localStorage.getItem(key);
  if (savedValue !== null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  });
};
