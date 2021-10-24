import { DiagramBuilder } from "../DiagramBuilder";
import { Input } from "./Input";
import { Output } from "./Output";

export const underlyingDiagram = DiagramBuilder.begin()
	.add(Input)
	.add(Output)
	.finish()