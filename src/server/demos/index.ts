import { DiagramBuilder } from '../DiagramBuilder';
import { Story } from '../Story';
import { Create, Inspect, HTTPRequest } from '../nodes';

const empty = new Story(
  'Empty',
  'Start from scratch.',
  ['empty'],
  DiagramBuilder.begin().finish(),
);

const api = new Story(
  'Working with APIs',
  'Call APIs and process output.',
  ['api', 'http'],
  DiagramBuilder.begin()
    .add(Create)
    .add(HTTPRequest)
    .add(Inspect)
    .add(Inspect)
    .add(Inspect)
    .finish(),
);

export const demos = [empty, api];
