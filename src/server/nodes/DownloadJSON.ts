import { NodeParameter } from '../../NodeParameter';
import { DownloadData } from '../../types';
import { get } from '../../utils';
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
    );

    const isToDownloadConfigured = !(toDownload === '');

    const fileName = `${this.getParameterValue(
      'node_name',
    )} ${new Date()
      .toLocaleString('en-US', {
        hour12: false,
      })
      .replace(/:/gi, '_')}`;

    this.downloadData = new DownloadData<any>({
      data: [],
      mimeType: 'application/json',
      fileName: fileName,
      fileExtension: 'json',
    });

    const toDownloadAttrs = toDownload.split('.');
    const latestAttribute =
      toDownloadAttrs[toDownloadAttrs.length - 1];

    isToDownloadConfigured
      ? this.input().forEach((feature) => {
          const { original } = feature;

          const data = get(original, toDownload);

          if (data !== null) {
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
