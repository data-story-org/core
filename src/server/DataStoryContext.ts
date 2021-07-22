export interface DataStoryContext {
  // Used to expose API routes as named HTTPRequest Nodes
  apis?: {
    name: string;
    url?: string;
  }[];
  // Used to expose data as named ResolveContextFeature Nodes
  models?: {
    [others: string]: unknown;
  };
  // We may put custom keys in the context
  [others: string]: unknown;
}
