export interface storeFile {
  key: string;
  name: string;
  file_url: string;
  file: File;
}

export class FileUpload {
    key: string;
    name: string;
    url: string;
    file: File;
  
    constructor(file: File) {
      this.file = file;
    }
  }
