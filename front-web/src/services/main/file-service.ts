import { aiApiClient, mainApiClient } from '../utils'
import type { I_File } from '@/stores/fileStore'

export interface BaseDocument {
  type: string
  name: string
  user_id: string
  category: string[]
  file_id: string
  vector_id: string
}
export interface APIDocument extends BaseDocument {
  id: string
}

export interface APIVectorStore {
  id: string
  name: string
  file_counts: APIFileCounter
}

export interface I_VectorStore {
  id: string
  name: string
  content: I_File[]
}

export interface APIFileCounter {
  cancelled: number
  completed: number
  failed: number
  in_progress: number
  total: number
}

/**
 * Format AI API store return into front interface.
 * @param {APIVectorStore} raw
 * @param {I_File[]} files
 * @returns {I_VectorStore}
 */
export function vectorAPIToCustom(raw: APIVectorStore, files?: I_File[]): I_VectorStore {
  return {
    id: raw.id,
    name: raw.name,
    content: files || [],
  } as I_VectorStore
}

export class FileService {
  constructor() {

  }

  /**
   * Get Database Documents.
   * @returns {APIDocument[]}
   */
  public async getFiles(filters?: any): Promise<APIDocument[]> {
    return await filters
      ? mainApiClient.get('/document/list', filters)
      : mainApiClient.get('/document/list')
  }

  /**
   * Add new File to Store
   * @param {string} vector_id Vector store id
   * @returns {any}
   */
  public async addFileToVector(file: File, vector_id: string) {
    return await aiApiClient.post('/upload_file/', {
      file,
      store_id: vector_id,
    },
    undefined,
    true,
    )
  }

  /**
   * Get all Vector Stores.
   * @returns {any}
   */
  public async getVectorStore(): Promise<APIVectorStore[]> {
    return await (aiApiClient.get('/get_all_vectors'))
  }

  /**
   * Add new File to Database
   * @param {I_File} file
   * @param {string} user_id
   * @returns {I_File}
   */
  public async addDocument(file: I_File, user_id: string) {
    return await mainApiClient.post('/document/create/', {
      user_id,
      type: file.type,
      name: file.name,
      file_id: file.file_id,
      vector_id: file.vector_id,
    })
  }

  /**
   * Add new vector store.
   * @param {string} vector_name:string
   * @returns {any}
   */
  public async addVectorStore(vector_name: string) {
    return await aiApiClient.post('/add_vector_store/', {
      name: vector_name,
    })
  }

  public async getVectorById(store_id: string) {
    return await aiApiClient.get('/get_vector', {
      store_id,
    })
  }

  public async getVectorFiles(store_id: string) {
    return await aiApiClient.get('/get_vector_files', {
      store_id,
    })
  }
}
