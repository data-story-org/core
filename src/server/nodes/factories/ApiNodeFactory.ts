import HTTPRequest from "../HTTPRequest";

export class ApiNodeFactory {
	static make(endpoints: any[]): {} {
		return endpoints.reduce((all, endpoint) => {
			// this is just a test
			return {
				Todos: new HTTPRequest({
					name: 'Todos',
					...endpoint,
					url: 'https://jsonplaceholder.cypress.io/todos',
					description: 'Get Todos',
				})
			}				
		}, {})
	}
}