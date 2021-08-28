export interface DownloadDataI<T> {
  data: T;
  mimeType: string;
  fileName: string;
  fileExtension: string;
}

export class DownloadData<T> {
  data: T;
  mimeType: string;
  fileName: string;
  fileExtension: string;

  public async download() {
    const blob = new Blob([this.data], {
      type: this.mimeType,
    });

    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = href;
    link.download =
      this.fileName + `.${this.fileExtension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  constructor(options: DownloadDataI<T>) {
    this.data = options.data;
    this.mimeType = options.mimeType;
    this.fileName = options.fileName;
    this.fileExtension = options.fileExtension;
  }
}
