import { NodeMap } from "../../NodeFactory";

export interface SpecializedNodeFactory {
	all(): NodeMap
}