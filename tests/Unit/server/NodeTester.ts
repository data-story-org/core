import { Diagram } from '../../../src/server/Diagram';
import { DiagramBuilder } from '../../../src/server/DiagramBuilder';
import { Feature } from '../../../src/Feature';
import { OutputProvider } from '../../../src/server/nodes/OutputProvider';
import { Port } from '../../../src/server/Port';
import { Node } from '../../../src/server/Node';
import { DataStoryContext } from '../../../src/server/DataStoryContext';
import uniq from 'lodash/uniq';
import { DownloaderNode } from '../../../src/server/DownloaderNode';

export class NodeTester {
  diagram: Diagram;
  diagramContext: DataStoryContext;
  runResult: Diagram;
  nodeClass: { name: string };
  parameterKeyValues: {};
  dynamicPortsList: string[] = [];
  configurations = {};
	shouldDoAssertAttachedFeatures = false
  shouldDoAssertCanRun = false;
  shouldDoAssertCantRun = false;
  shouldDoAssertOutputs = false;
  shouldDoAssertOutputCounts = false;
  shouldDoAssertDownloads = false;
  
	attachedFeatures = []
	outputMap = {};
  outputCountMap = {};
  inputMap = {};
  downloadsMap = {};
  hasRun = false;
  ranSuccessfully: boolean;

  constructor(nodeClass) {
    this.nodeClass = nodeClass;
  }

  begin() {
    return this;
  }

  configuration(configurations) {
    this.configurations = configurations;
    return this;
  }

  parameters(parameterKeyValues) {
    this.parameterKeyValues = parameterKeyValues;
    return this;
  }

  dynamicPorts(dynamicPortsList: string[]) {
    this.dynamicPortsList = dynamicPortsList;
    return this;
  }

  hasParameters(parameterKeyValues) {
    return this.parameters(parameterKeyValues);
  }

  diagramHasContext(contextData) {
    this.diagramContext = contextData;
    return this;
  }

  and() {
    return this;
  }

  has() {
    return this;
  }

  hasInputs(inputMap) {
    this.inputMap = inputMap;
    return this;
  }

  hasInput(features) {
    return this.hasInputs({
      Input: [features].flat(),
    });
  }

  hasDefaultParameters() {
    return this;
  }

  assertAttachedFeatures(features) {
    this.shouldDoAssertAttachedFeatures = true;
		this.attachedFeatures = features
    return this;
  }

  assertCanRun() {
    this.shouldDoAssertCanRun = true;
    return this;
  }

  assertCantRun() {
    this.shouldDoAssertCantRun = true;
    return this;
  }

  assertOutput(features: any, portName = 'Output') {
    return this.assertOutputs({
      [portName]: [features].flat(),
    });
  }

  assertOutputs(outputMap: {}) {
    this.shouldDoAssertOutputs = true;
    this.outputMap = outputMap;
    return this;
  }

  assertOutputCount(count: number, portName = 'Output') {
    return this.assertOutputCounts({
      [portName]: count,
    });
  }

  assertOutputCounts(outputCountMap: {}) {
    this.shouldDoAssertOutputCounts = true;
    this.outputCountMap = outputCountMap;
    return this;
  }

  assertDownloads(downloadsMap: {}, prettyPrint = false) {
    this.shouldDoAssertDownloads = true;
    this.downloadsMap = prettyPrint
      ? JSON.stringify(downloadsMap, null, 4)
      : JSON.stringify(downloadsMap);
    return this;
  }

  async finish() {
    this.setupDiagram();
    if (this.shouldDoAssertCanRun)
      await this.doAssertCanRun();
    if (this.shouldDoAssertCantRun)
      await this.doAssertCantRun();
		if (this.shouldDoAssertAttachedFeatures)
      await this.doAssertAttachedFeatures();			
    if (this.shouldDoAssertOutputs)
      await this.doAssertOutputs();
    if (this.shouldDoAssertOutputCounts)
      await this.doAssertOutputCounts();
    if (this.shouldDoAssertDownloads)
      await this.doAssertDownloads();
  }

  protected setupDiagram() {
    this.diagram = DiagramBuilder.begin()
      .setContext(this.diagramContext ?? {})
      .add(
        OutputProvider,
        {
          // Used by the Node run method to fan out data
          outputs: this.inputMap,
        },
        {
          // used by the Node constructor to override default input/outputs
          ports: Object.keys(this.inputMap).map((p) => {
            return new Port({
              name: p,
              in: false,
            });
          }),
        },
      )
      .add(
        this.nodeClass,
        this.parameterKeyValues,
        this.configurations,
        this.dynamicPortsList,
      )
      .finish();
  }

  protected async doAssertCanRun() {
    await this.runOnce();

    expect(this.ranSuccessfully).toBe(true);
  }

  protected async doAssertCantRun() {
    await this.runOnce();

    expect(this.ranSuccessfully).toBe(false);
  }

  protected async doAssertAttachedFeatures() {
    await this.runOnce();

		let Diagram = this.runResult;
		let node = Diagram.findByName(this.nodeClass.name) as Node

		let expectedFeatures = (this.attachedFeatures as any).map(
			(f) => new Feature(f),
		);
		expect(node.features).toStrictEqual(
			expectedFeatures,
		);
	}
		

  protected async doAssertOutputs() {
    await this.runOnce();

    let Diagram = this.runResult;

    // Check explicitly provided port outputs
    for (const [portName, expected] of Object.entries(
      this.outputMap,
    )) {
      let port = Diagram.findByName(portName);
      let expectedFeatures = (expected as any).map(
        (f) => new Feature(f),
      );
      expect((port as Port).features).toStrictEqual(
        expectedFeatures,
      );
    }

    // Check that no other ports emits feautures
    let ports = (
      Diagram.findByName(this.nodeClass.name) as Node
    ).ports;
    let outputingPorts = ports
      .filter((p) => p.features && p.features.length)
      .map((p) => p.name);
    const msg =
      'There was a port outputting features that was not listed!';
    expect({
      msg,
      keys: uniq([
        ...Object.keys(this.outputMap),
        ...this.dynamicPortsList,
      ]).sort(),
    }).toEqual({ msg, keys: outputingPorts.sort() });
  }

  protected async doAssertDownloads() {
    await this.runOnce();

    const Diagram = this.runResult;

    const node = Diagram.findByName(
      this.nodeClass.name,
    ) as DownloaderNode;

    expect(node.downloadData.data).toEqual(
      this.downloadsMap,
    );
  }

  protected async doAssertOutputCounts() {
    await this.runOnce();

    let Diagram = this.runResult;

    // Check explicitly provided port outputs
    for (const [portName, expectedCount] of Object.entries(
      this.outputCountMap,
    )) {
      let port = Diagram.findByName(portName);
      expect((port as Port).features.length).toStrictEqual(
        expectedCount,
      );
    }

    // Check that no other ports emits feautures
    let node = Diagram.findByName(this.nodeClass.name);

    let ports = (node as Node).ports;
    let outputingPorts = ports
      .filter((p) => p.features && p.features.length)
      .map((p) => p.name);
    const msg =
      'There was a port outputting features that was not listed!';

    expect({
      msg,
      keys: uniq([
        ...Object.keys(this.outputCountMap),
        ...this.dynamicPortsList,
      ]).sort(),
    }).toEqual({ msg, keys: outputingPorts.sort() });
  }

  protected async runOnce() {
    if (this.hasRun) return;

    await this.diagram
      .run()
      .then((result: any) => {
        this.runResult = result.data.diagram;
        this.ranSuccessfully = true;
      })
      .catch((f) => {
        console.warn(f);
        this.ranSuccessfully = false;
      });

    this.hasRun = true;
  }
}

export function when(nodeClass) {
  return new NodeTester(nodeClass);
}
