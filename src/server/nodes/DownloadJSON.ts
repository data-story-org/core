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

  downloadData = new DownloadData<any>({
    data: [],
    mimeType: 'application/json',
    fileExtension: 'json',
  });

  async run() {
    const toDownload = this.getParameterValue(
      'attributes to download',
    );

    const toStringify = this.getParameterValue(
      'pretty print json',
    );

    const isToDownloadConfigured = !(
      toDownload.length === 1 && toDownload[0] === ''
    );

    this.downloadData.fileName = `${this.getParameterValue(
      'node_name',
    )} ${new Date()
      .toLocaleString('en-US', {
        hour12: false,
      })
      .replace(/:/gi, '_')
      .replace(/\//gi, '_')}`;

    const latestAttribute = (downloadIndex: number) => {
      const toDownloadAttrs =
        toDownload[downloadIndex].split('.');
      return toDownloadAttrs[toDownloadAttrs.length - 1];
    };

    isToDownloadConfigured
      ? this.input().forEach((feature, featureIndex) => {
          const { original } = feature;

          toDownload.forEach((path, i) => {
            const data = get(original, path);

            if (data !== null) {
              this.downloadData.data[featureIndex] = {
                ...(this.downloadData.data[featureIndex] ??
                  []),
                [latestAttribute(i)]: data,
              };
            }
          });
        })
      : (this.downloadData.data = this.input().map(
          (feature) => feature.original,
        ));

    toStringify == String('true')
      ? (this.downloadData.data = JSON.stringify(
          this.downloadData.data,
          null,
          4,
        ))
      : (this.downloadData.data = JSON.stringify(
          this.downloadData.data,
        ));

    // this.output(this.input());
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.string('attributes to download')
        .withValue('')
        .withDescription(
          'you may use dot notated paths, or ignore this field to download whole feature',
        )
        .repeatable(),
      NodeParameter.select('pretty print json')
        .withOptions(['true', 'false'])
        .withValue('true'),
    ];
  }
}
