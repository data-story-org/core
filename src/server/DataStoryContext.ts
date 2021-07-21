export interface DataStoryContext {
	// Used to expose API routes as named HTTPRequest Nodes
	apis?: {},
	// Used to expose data as named ResolveContextFeature Nodes
	models?: {},
	// We may put custom keys in the context
	[others: string]: any;
}