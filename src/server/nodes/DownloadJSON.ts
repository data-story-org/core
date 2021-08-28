import { NodeParameter } from '../../NodeParameter';
import { DownloadData } from '../../types';
import { DownloaderNode } from '../DownloaderNode';

export class DownloadJSON extends DownloaderNode {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'DownloadJSON',
      summary: 'Downloads features in JSON view',
      category: 'Downloader',
      defaultInPorts: ['Input'],
      defaultOutPorts: [],
      // defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    const toDownload = this.getParameterValue(
      'attribute to download',
    ).split('.');

    const isToDownloadConfigured = !(
      toDownload.length === 1 && toDownload[0] === ''
    );

    console.log(this.getParameterValue('node_name'));

    const fileName = `data-story ${
      this.parameters['name']
    } ${new Date().toLocaleString('en-US', {
      hour12: false,
    })}`;

    this.downloadData = new DownloadData<any>({
      data: [],
      mimeType: 'application/json',
      fileName: fileName,
      fileExtension: 'json',
    });

    const latestAttribute = isToDownloadConfigured
      ? toDownload[toDownload.length - 1]
      : toDownload[0];

    isToDownloadConfigured
      ? this.input().forEach((feature) => {
          const { original } = feature;

          const data = toDownload.reduce((obj, path) => {
            return obj && obj[path] !== undefined
              ? obj[path]
              : {};
          }, original);

          if (data !== undefined || data !== {}) {
            this.downloadData.data = [
              ...this.downloadData.data,
              {
                [latestAttribute]: data,
              },
            ];
          }
        })
      : (this.downloadData.data = this.input().map(
          (feature) => feature.original,
        ));

    this.downloadData.data = JSON.stringify(
      this.downloadData.data,
    );

    // this.output(this.input());
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.string('attribute to download')
        .withValue('')
        .withDescription(
          'you may use dot notated paths, or ignore this field to download whole feature',
        ),
    ];
  }
}
