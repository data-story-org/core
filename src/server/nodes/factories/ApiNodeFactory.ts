import HTTPRequest from "../HTTPRequest";

export class ApiNodeFactory {
		static make(endpoints: any[]) {
			return {
				Todos: HTTPRequest(...)
			}
		}
}