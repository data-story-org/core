import { FixedSizeArray } from '../../types';
import { cloneClass, zip } from '../../utils';

type Repeatables = {
  [k: number]: any;
};

type RepeatableConverter = (
  repeatables: Repeatables,
) => any;

// Return an array of values by default
export const repeatableConverter: RepeatableConverter = (
  repeatables: Repeatables,
) => {
  return Object.values(repeatables);
};

type SimpleFieldType =
  | 'String_'
  | 'Number'
  | 'Select'
  | 'JS'
  | 'JSON_'
  | 'Textarea';

type ComplexFieldType = 'Row' | 'Port';

type FieldType = SimpleFieldType | ComplexFieldType;

type NodeParameterRepeatableValue<V> = V[];
type NodeParameterRowValue<V> = V[][];

type NodeParameterValue<V> =
  | V
  | NodeParameterRepeatableValue<V>
  | NodeParameterRowValue<V>;

type RowValue = {
  [parameterName: string]: NodeParameter;
};

const extraRowsValues = <ValueType = string>(
  rowValues: Array<NodeParameter>,
  extraDefaultRows: Array<Array<ValueType>>,
): RowValue[] => {
  return extraDefaultRows.map((extraRowValues) =>
    Object.fromEntries(
      zip(rowValues, extraRowValues).map(
        ([parameter, value]) => [
          parameter.name,
          cloneClass(parameter).withValue(value),
        ],
      ),
    ),
  );
};

export class NodeParameter {
  name: string;
  description = '';
  fieldType: FieldType = 'String_';
  placeholder?: string;
  value: any = '';
  defaultValue: any = '';
  options?: string[];
  isRepeatable = false;
  wrappedPortType?: SimpleFieldType = 'String_';

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

  static port(
    name: string,
    wrappedFieldType: SimpleFieldType,
  ) {
    return this.make(name)
      .withFieldType('Port')
      .withWrappedPortType(wrappedFieldType);
  }

  static row<RowLength extends number>(
    name: string,
    rowParams: FixedSizeArray<RowLength, NodeParameter>,
  ) {
    const value: RowValue = Object.fromEntries(
      rowParams.map((p) => [p.name, p]),
    );

    return this.make(name, value)
      .withFieldType('Row')
      .repeatable();
  }

  withFieldType(type: FieldType) {
    this.fieldType = type;
    return this;
  }

  withWrappedPortType(type: SimpleFieldType) {
    this.wrappedPortType = type;
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

  withValue<V>(value: NodeParameterValue<V>) {
    if (this.isRepeatable) {
      this.value =
        this.fieldType === 'Row'
          ? [
              ...extraRowsValues(
                Object.values<NodeParameter>(
                  this.defaultValue,
                ),
                value as NodeParameterRowValue<V>,
              ),
              ...this.value,
            ]
          : [
              ...(value as NodeParameterRepeatableValue<V>),
              ...this.value,
            ];
    } else {
      this.value = value;
    }

    return this;
  }

  withDescription(description: string) {
    this.description = description;
    return this;
  }

  repeatable() {
    if (!this.isRepeatable) {
      this.defaultValue = this.value;
      this.value = [this.value];

      this.isRepeatable = true;
    }

    return this;
  }
}
