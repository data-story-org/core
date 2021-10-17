import { isBrowserEnv } from '../utils';

export type DataDownloadFunction = (
  downloadData: DownloadDataI<any>,
) => Promise<void>;

export interface DownloadDataI<T> {
  data: T;
  mimeType: string;
  fileName?: string;
  fileExtension: string;
  downloaderFunction?: DataDownloadFunction;
}

export const defaultDataDownloader: DataDownloadFunction =
  async (downloadData: DownloadDataI<any>) => {
    if (isBrowserEnv) {
      const { data, mimeType, fileName, fileExtension } =
        downloadData;

      const blob = new Blob([data as unknown as BlobPart], {
        type: mimeType,
      });

      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = href;
      link.download = fileName + `.${fileExtension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

export class DownloadData<T> {
  data: T;
  mimeType: string;
  fileName: string;
  fileExtension: string;
  downloaderFunction: DataDownloadFunction =
    defaultDataDownloader;

  public async download() {
    await this.downloaderFunction({
      ...this,
    });
  }

  constructor(options: DownloadDataI<T>) {
    this.data = options.data;
    this.mimeType = options.mimeType;
    this.fileName =
      options.fileName ??
      `data ${new Date()
        .toLocaleString('en-US', {
          hour12: false,
        })
        .replace(/:/gi, '_')}`;
    this.fileExtension = options.fileExtension;
  }
}
