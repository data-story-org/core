type Repeatables = {
  [k: number]: any;
};

type RepeatableConverter = (
  repeatables: Repeatables,
) => any;

// Return an array of values by default
const defaultRepeatableConverter = (
  repeatables: Repeatables,
) => {
  return Object.values(repeatables);
};

export class NodeParameter {
  name: string;
  description = '';
  fieldType = 'String_';
  placeholder?: string;
  value: any = '';
  defaultValue: any = '';
  options?: string[];
  isRepeatable = false;
  repeatableConverter: () => any;

  constructor(name: string, value: any = '') {
    this.name = name;
    this.value = value;
  }

  static make(name: string, value: any = '') {
    return new this(name, value);
  }

  static json(name: string) {
    return this.make(name).withFieldType('JSON_');
  }

  static number(name: string) {
    return this.make(name).withFieldType('Number');
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

  static row(name: string, params: NodeParameter[]) {
    const value = Object.fromEntries(
      params.map((p) => [p.name, p]),
    );
    return this.make(name, value).withFieldType('Row');
  }

  withFieldType(type: string) {
    this.fieldType = type;
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
    this.defaultValue = this.value;
    this.value = [this.value];

    this.isRepeatable = true;
    this.repeatableConverter = function () {
      this.value = converter(this.value);
    };

    return this;
  }
}
