import type { APIDocument, BaseDocument } from '@/services/main/file-service'
import { FileService } from '@/services/main/file-service'
import type { I_File } from '@/stores/fileStore'

const fileService = new FileService()

export function fileToBaseDocument(file: I_File, userId: string): BaseDocument {
  return {
    file_id: file.file_id,
    category: file.categories ? file.categories.map(cat => { return cat.name }) : [],
    name: file.name,
    type: file.type,
    user_id: userId,
    vector_id: file.vector_id,
  }
}

export function getUnsavedFileFromVector(
  vector_id: string,
  vectorsFileList: any[],
  user_id: string,
  baseFileList: BaseDocument[],
): I_File[] {
  const toAddFiles: I_File[] = []

  vectorsFileList.forEach(file => {
    if (!baseFileList.find(el => el.file_id === file.id)) {
      const [fileName, extension] = file.filename.split('.')

      toAddFiles.push({
        name: fileName,
        type: extension,
        extension,
        vector_id,
        file_id: file.id,
      })
    }
  })

  return toAddFiles
}

