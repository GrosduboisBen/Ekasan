import type { I_File, I_Folder } from '@/stores/fileStore'
import { useFileStore } from '@/stores/fileStore'

const fileStore = useFileStore()
export function computeFilePath(file: I_File) {
  let filePath = ''
  let folderIteration = 0
  let currentFolder
  const rootFile = fileStore.getList.find(f => f === file)
  if (rootFile) {
    return `${file.name}`
  }
  else {
    const directParent = fileStore.getAllFolders.find(el => {
      return el.content.find(f => f.name === file.name)
    })

    console.log('DIRECT', directParent)
    currentFolder = directParent
    filePath = `${directParent.name}/`
    if (!currentFolder) {
      return 'ERROR FOLDER'
    }
    else {
      while (folderIteration >= 0) {
        const parentFolder = getFolderParent(currentFolder)
        if (parentFolder) {
          filePath = filePath.concat(`${parentFolder.name}/`)
          currentFolder = parentFolder
        }
        else {
          folderIteration = -1
        }
      }
      filePath = filePath.concat(`${file.name}`)

      return filePath
    }
  }
}

export function getFolderParent(folder: I_Folder) {
  return folder.parent
}
