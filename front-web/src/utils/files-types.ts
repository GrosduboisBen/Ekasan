export enum E_FileExtension {
  PDF = '.pdf',
  CSV = '.csv',
  HTML = '.html',
  JPEG = '.jpeg',
  JSON = '.json',
  MP4 = '.mp4',
  MPEG = '.mpeg',
  PNG = '.png',
  PLAIN = '.txt',
  EXCEL = '.excel',
  UNKOWN = '',
}

export function getFileExtension(file: any): E_FileExtension {
  switch (file.type) {
    case 'application/pdf':
      return E_FileExtension.PDF
    case 'text/csv':
      return E_FileExtension.CSV
    case 'text/html':
      return E_FileExtension.HTML
    case 'image/jpeg':
      return E_FileExtension.JPEG
    case 'application/json':
      return E_FileExtension.JSON
    case 'video/mp4':
      return E_FileExtension.MP4
    case 'video/mpeg':
      return E_FileExtension.MPEG
    case 'image/png':
      return E_FileExtension.PNG
    case 'text/plain':
      return E_FileExtension.PLAIN
    case 'application/vnd.ms-excel':
      return E_FileExtension.EXCEL
  }
}
