type Repeatables = {
  [k: number]: any;
};

type RepeatableConverter = (
  repeatables: Repeatables,
) => any[];

// Return an array of values by default
const defaultRepeatableConverter = (
  repeatables: Repeatables,
) => {
  return Object.values(repeatables);
};

export default class NodeParameter {
  name: string;
	children: NodeParameter[];
  description = '';
  fieldType = 'String_';
  placeholder?: string;
  value: any = '';
  options?: string[];
  isRepeatable = false;
  repeatableConverter: () => any;

  constructor(name: string) {
    this.name = name;
  }

  static make(name: string) {
    return new this(name);
  }

  static json(name: string) {
    return this.make(name).withFieldType('JSON_');
  }

  static number(name: string) {
    return this.make(name).withFieldType('Number');
  }

	static row(name: string) {
		return this.make(name).withFieldType('Row')
	}

  static select(name: string) {
    return this.make(name).withFieldType('Select');
  }

  static string(name: string) {
    return this.make(name).withFieldType('String_');
  }

  static js(name: string) {
    return this.make(name).withFieldType('JS');
  }

  static textarea(name: string) {
    return this.make(name).withFieldType('Textarea');
  }

  withFieldType(type: string) {
    this.fieldType = type;
    return this;
  }

	withChildren(children: NodeParameter[]) {
		this.children = children;
		return this;
	}

  withOptions(options: string[]) {
    this.options = options;
    return this;
  }

  withPlaceholder(placeholder: string) {
    this.placeholder = placeholder;
    return this;
  }

  withValue(value: any) {
    this.value = value;
    return this;
  }

  withDescription(description: string) {
    this.description = description;
    return this;
  }

  repeatable(
    converter: RepeatableConverter = defaultRepeatableConverter,
  ) {
    this.value = [this.value];
    this.isRepeatable = true;
    this.repeatableConverter = function () {
      this.value = converter(this.value);
    };

    return this;
  }
}
