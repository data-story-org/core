import { SerializedDiagram } from "../types/SerializedDiagram"
import Node from "./Node"

export default class Diagram {
    links: any[] = []
    nodes: any[] = []
    cachedNodeDependencyMap: {[T:string]: string[];} = {
        // id1: [d1, d2, ...]
    }
	history: Node[] = []
 
    static hydrate(data: SerializedDiagram, factory) {
        let instance = new this()
		
        for (const [key, value] of Object.entries(data)) {
            
            if(key === 'layers') {
				instance.links = Object.values(data.layers[0].models)

                instance.nodes = Object.values(data.layers[1].models).map(node => {
                    return factory.hydrate(node, instance)
                })				
                
                continue
            }
            
            instance[key] = value
        }

        return instance
    }

    async run() {
        for await (let node of this.executionOrder()) {
            await node.run()
        }
        
        return new Promise((callback) => {
            return callback({
                data: {
                    diagram: this
                } 
            })
        })
    }

    find(id: string) {
        let searchables = this.nodes
            .concat(this.nodes.map(node => node.ports).flat())
            .concat(this.links)

        return searchables.find(entity => entity.id == id)
    }

	findByName(name: string) {
        let searchables = this.nodes
            .concat(this.nodes.map(node => node.ports).flat())
            .concat(this.links)

        return searchables.find(entity => entity.name == name)		
	}

    addNode(node) {
		this.history.push(node)
        this.nodes.push(node)

        return this
    }

    executionOrder() {
        this.clearCachedNodeDependencies();

        let r = this.nodes.sort((n1, n2) => {

            if (this.dependsOn(n2, n1)) {
                return -1;
            }

            if (this.dependsOn(n1, n2)) {
              return 1;
            }

            return 0;
          });

		  return r
    }

    getCachedNodeDependencies(id) {
        return this.cachedNodeDependencyMap[id] ?? null
    }

    setCachedNodeDependencies(id, dependencies) {
        this.cachedNodeDependencyMap[id] = dependencies
    }

    clearCachedNodeDependencies() {
        this.cachedNodeDependencyMap = {}
    }

    dependencies(node) {
        let cached = this.getCachedNodeDependencies(node.id)
        if(cached !== null) {
            return cached;
        }

        let inPorts = Object.values(node.ports.filter(p => p.in == true))

        let linkLists = inPorts.map((port: any) => port.links)

        let links = linkLists.map(linkList => Object.values(linkList)).flat()
        let dependencies = links.map((link: any) => {
			let sourcePort = this.find(link).sourcePort
			let sourceNode = this.find(sourcePort).parentNode
			return this.find(sourceNode).id
		})

        let deepDependencies = dependencies.map(d => {
			return this.dependencies(
				this.find(d)
			)
		})

        let result = dependencies.concat(deepDependencies.flat())

        this.setCachedNodeDependencies(node.id, result)

        return result
    }

    dependsOn(n1, n2) {
        return this.dependencies(n1).map(d => {
			return d.id
		}).includes(n2.id)
    }

    attemptLinkToLatest(node)
    {
        let linked = false;
        
        // Try to link to latest nodes
        this.history.find(latest => {
            if(this.hasNode(latest)) {
                if(this.canLink(latest, node)) {
                    let link = this.getAutomatedLink(latest, node)
                    // break out of find with a return true
                    return linked = true;
                }
            }
        })
    }

    getAutomatedLink(from, to) {
        if(!this.canLink(from, to)) return;

        // fromPort: prefer first unused outPort. Otherwise defaults to first
        let fromPort: any = this.getAutomatedFromPort(from)

        // toPort: the first inPort
        let toPort: any = Object.values(to.getInPorts())[0];
        
		let link = {
			from: fromPort,
			to: toPort
		}

        return link
    }

	getAutomatedFromPort(fromNode) {
        // fromPort: prefer first unused outPort. Otherwise defaults to first
        return Object.values(fromNode.getOutPorts()).find((candidate: any) => {
            return Object.values(candidate.links).length === 0
        }) ?? Object.values(fromNode.getOutPorts())[0]
	}

    canLink(from, to)
    {
        // Has from node?
        if(!from) return
        
        // Resolve ports
        let fromPort = Object.values(from.getOutPorts())[0] ?? false;
        let toPort = Object.values(to.getInPorts())[0] ?? false;

        // Ensure there are ports to connect to
        return fromPort && toPort
    }

    hasNode(node) {
        return Boolean(node.id && this.find(node.id))
    }	
}