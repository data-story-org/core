import { Node } from '../Node';
import { NodeParameter } from '../../NodeParameter';
import axios, { AxiosRequestConfig } from 'axios';
import { Feature } from '../../Feature';
import cheerio from 'cheerio';

export class ScrapeHTML extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'ScrapeHTML',
      summary:
        'Scrapes static HTML content lists. Might need a proxy.',
      category: 'Workflow',
      defaultInPorts: [],
      defaultOutPorts: ['Output', 'Failed'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    const proxy = this.getParameterValue('proxy');
    const url = this.getParameterValue('url');
    const fullUrl = (proxy ? proxy + '/' : '') + url;
    const selector =
      this.getParameterValue('Root selector');
    const config = {
      'X-Requested-With': 'XMLHttpRequest',
    } as AxiosRequestConfig;

    await axios
      .get(fullUrl, config)
      .then((response) => {
        const $ = cheerio.load(response.data);

        const elements = $(selector);
        const features = this.toFeatures(elements);
        this.output(features);
      })
      .catch((reason) => {
        console.log(reason);
        throw reason;
      });
  }

  toFeatures(elements): Feature[] {
    const features = [];

    for (let i = 0; i < elements.length; i++) {
      const root = elements[i];
      features.push(this.extractFeature(root));
    }

    return features;
  }

  extractFeature(element): Feature {
    const extractions = this.getParameterValue(
      'Attribute extractions',
    );
    const feature = new Feature({});

    extractions.forEach((extraction) => {
      const attributeName =
        extraction['attribute']['value'];
      const selector = extraction['selector']['value'];
      const method = extraction['method']['value'];

      feature.set(
        attributeName,
        this.extractAttributeValue(
          element,
          selector,
          method,
        ),
      );
    });

    return feature;
  }

  extractAttributeValue(
    element,
    selector,
    method = 'single',
  ): any {
    const $ = cheerio.load(element);

		const matches = $(selector)
    if (method == 'single') return matches[0].firstChild.data;

		const attributeValues = [];

		for (var i = 0; i < matches.length; i++) {
			attributeValues.push(matches[i].firstChild.data)
		}

		return attributeValues
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.string('url').withValue(
        'https://www.hemnet.se/bostader',
      ),
      NodeParameter.string('proxy').withValue(
        'https://nameless-dawn-49509.herokuapp.com',
      ),
      NodeParameter.string('Root selector').withValue(
        '.normal-results__hit',
      ),
      NodeParameter.row('Attribute extractions', [
        NodeParameter.string('attribute').withValue(
          'address',
        ),
        NodeParameter.string('selector').withValue(
          '.listing-card__street-address',
        ),
        // Refactor to select
        NodeParameter.select('method')
          .withOptions(['single', 'multiple'])
          .withValue('single'), // Only single implemented at the moment
      ]).repeatable(),
    ];
  }
}
