import { DiagramBuilder } from '../DiagramBuilder';
import { Demo } from './Demo';
import { Create, Inspect, HTTPRequest } from '../nodes';

const empty = new Demo(
  'Empty',
  'Start from scratch.',
  ['empty'],
  DiagramBuilder.begin().finish(),
);

const api = new Demo(
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

export { Demo } from './Demo';
