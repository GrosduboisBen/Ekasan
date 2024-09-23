export const COOKIE_MAX_AGE_1_YEAR = 365 * 24 * 60 * 60
export const CHATBOT_ANSWER_PLACEHOLDER_ID = 'chatbotAnswerPlaceholder'
export function replaceObjectInArray<T extends { id: any }>(
  objects: T[],
  objectId: string | number,
  newObject: T,
): T[] {
  return objects.map(obj => obj.id === objectId ? newObject : obj)
}

export const apiMainBasePath = import.meta.env.VITE_BASE_PATH_MAIN
export const apiAiBasePath = import.meta.env.VITE_BASE_PATH_AI

export const baseclientPass = import.meta.env.VITE_CLIENT_PASS
export const baseclientId = import.meta.env.VITE_CLIENT_ID
export const baseclientSec = import.meta.env.VITE_CLIENT_SEC

