import { DiagramBuilder } from '../DiagramBuilder';
import { DataStory } from '../DataStory';
import { Create, Inspect, HTTPRequest } from '../nodes';

const empty = new DataStory(
  'Empty',
  'Start from scratch.',
  ['empty'],
  DiagramBuilder.begin().finish(),
);

const api = new DataStory(
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
