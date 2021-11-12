import { Node } from '../Node';
import axios from 'axios';
import { Feature } from '../../Feature';
import { NodeParameter } from '../NodeParameter';
import { diagramRunResult } from '../Diagram';

export class HTTPRequest extends Node {
  client = axios;

  constructor(options = {}) {
    super({
      // Defaults
      name: 'HTTPRequest',
      summary: 'Make a HTTP request',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Features', 'Response', 'Failed'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    for await (const feature of this.input()) {
      await this.request(feature)
        .then((result) => {
          this.output([new Feature(result)], 'Response');

          if (this.getParameterValue('features_path')) {
            const features_path =
              this.getParameterValue('features_path');
            const raw = features_path
              .split('.')
              .reduce((traversed, part) => {
                return part ? traversed[part] : traversed;
              }, result);

            const wrapped = [raw].flat();
            this.output(
              wrapped.map((r) => new Feature(r)),
              'Features',
            );
          }
        })
        .catch((reason) => {
          if (reason) {
            this.output(
              // Prevent functions in data
              [
                new Feature(
                  JSON.parse(JSON.stringify(reason)),
                ),
              ],
              'Failed',
            );
          }
        });
    }

    return diagramRunResult(this.diagram);
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      //NodeParameter.select('client').withOptions(['axios', 'mock']).withValue('axios'),
      NodeParameter.string('url').withValue(
        'https://jsonplaceholder.cypress.io/{{ feature.resource }}',
      ),
      NodeParameter.string('verb').withValue('GET'),
      NodeParameter.json('data').withValue('{}'),
      NodeParameter.json('config').withValue('{}'),
      NodeParameter.string('features_path')
        .withValue('data')
        .withDescription(
          'optional dot.notated.path to feature(s)',
        ),
    ];
  }

  protected getClient() {
    this.getParameterValue('client') == 'axios'
      ? axios
      : axios;
  }

  protected request(feature: Feature) {
    if (this.getParameterValue('verb', feature) == 'GET') {
      return this.client.get(
        this.getParameterValue('url', feature),
        JSON.parse(this.getParameterValue('config')),
      );
    }

    if (this.getParameterValue('verb') == 'POST') {
      return this.client.post(
        this.getParameterValue('url', feature),
        this.getParameterValue('data'),
        JSON.parse(this.getParameterValue('config')),
      );
    }

    if (this.getParameterValue('verb') == 'DELETE') {
      return this.client.delete(
        this.getParameterValue('url', feature),
        JSON.parse(this.getParameterValue('config')),
      );
    }
  }
}
