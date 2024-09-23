import type { I_VectorStore } from '@/services/main/file-service'

export function findStoreFromId(id: string, storeList: I_VectorStore[]) {
  return storeList.find(vs => vs.id === id)
}
