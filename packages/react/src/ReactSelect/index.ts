import "./module-augmentation";

export { default as AsyncCreatableSelect } from "./select/async-creatable-select";
export { default as AsyncSelect } from "./select/async-select";
export { default as CreatableSelect } from "./select/creatable-select";
export { default as Select } from "./select/select";

export { default as carbonComponents } from "./components";
export { default as useSelectProps } from "./useSelectProps";

export type { AsyncCreatableSelectComponent } from "./select/async-creatable-select";
export type { AsyncSelectComponent } from "./select/async-select";
export type { CreatableSelectComponent } from "./select/creatable-select";
export type { SelectComponent } from "./select/select";

export type {
  OptionBase,
  SelectedOptionStyle,
  Size,
  SizeProps,
  StylesFunction,
  TagVariant,
} from "./types";

// Forward all available exports from the original `react-select` package
export * from "react-select";
export { useAsync } from "react-select/async";
export type { AsyncProps } from "react-select/async";
export type { AsyncCreatableProps } from "react-select/async-creatable";
export { useCreatable } from "react-select/creatable";
export type { CreatableProps } from "react-select/creatable";
