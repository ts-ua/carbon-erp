/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GroupBase } from "react-select";
import type { SelectedOptionStyle } from "./types";

/**
 * Module augmentation is used to add extra props to the existing interfaces
 * from `react-select` as per the docs
 *
 * @see {@link https://react-select.com/typescript#custom-select-props}
 */
declare module "react-select/dist/declarations/src/Select" {
  export interface Props<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>
  > {
    /**
     * The max width of the menu container
     *
     */
    maxW?: number;

    /**
     * The min width of the menu container
     *
     */
    minW?: number;
    /**
     * The width of the menu container
     */
    w?: "full" | number;

    /**
     * The size of the base control; matches the sizes of the Input
     * component with the exception of `xs`. A [responsive style array/object](https://chakra-ui.com/docs/features/responsive-styles) can
     * also be passed.
     *
     * Options: `sm` | `md` | `lg`
     *
     * @defaultValue `md`
     */

    size?: "sm" | "md" | "lg";

    /**
     * Determines whether or not to style the input with the invalid border
     * color.
     *
     * If the `aria-invalid` prop is not passed, this prop will also set that
     *
     * @defaultValue `false`
     */
    isInvalid?: boolean;

    /**
     * If `true`, the form control will be `readonly`.
     *
     * @defaultValue `false`
     * @see {@link https://github.com/csandman/chakra-react-select#isinvalid--default-false--isreadonly---default-false}
     * @see {@link https://chakra-ui.com/docs/components/input/props}
     * @see {@link https://chakra-ui.com/docs/components/form-control/props}
     */
    isReadOnly?: boolean;

    /**
     * If true, the form control will be required. This has 2 side effects:
     *
     * - The `FormLabel` will show a required indicator
     * - The form element (e.g, Input) will have `aria-required` set to true
     *
     * @see {@link https://chakra-ui.com/docs/components/input/props}
     * @see {@link https://chakra-ui.com/docs/components/form-control/props}
     */
    isRequired?: boolean;

    /**
     * Passing `true` for this prop will make the group headers
     * `position: sticky` and keep them stuck to the top while their
     * corresponding group is in view.
     *
     * @defaultValue `false`
     * @deprecated This prop should probably not have existed and will be
     * removed soon.
     */
    hasStickyGroupHeaders?: boolean;

    /**
     * Whether to style a selected option by highlighting it in a solid color
     * or adding a check mark next to it like the chakra `Menu` component.
     *
     * Options: `color` | `check`
     *
     * @defaultValue `color`
     */
    selectedOptionStyle?: SelectedOptionStyle;
  }
}

declare module "react-select/dist/declarations/src/components/MultiValue" {
  export interface MultiValueProps<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>
  > {}

  export interface MultiValueGenericProps<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>
  > {}

  export interface MultiValueRemoveProps<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>
  > {
    isFocused: boolean;
  }
}

declare module "react-select/dist/declarations/src/components/indicators" {
  export interface LoadingIndicatorProps<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>
  > {
    /**
     * The size prop for the Chakra `<Spinner />` component.
     *
     * Defaults to one size smaller than the overall Select's size.
     */
    spinnerSize?: "xs" | "sm" | "md" | "lg" | "xl";

    /**
     * The speed of the spinner represented by the time it takes to make one full rotation.
     *
     * This speed is represented by a
     * [CSS `<time>`](https://developer.mozilla.org/en-US/docs/Web/CSS/time)
     * variable which uses either seconds or milliseconds.
     *
     * @defaultValue `0.45s`
     * @example
     * ```jsx
     * <Spinner speed="0.2s"/>
     * ```
     * @see {@link https://chakra-ui.com/docs/components/spinner/props}
     */
    speed?: string;

    /**
     * The thickness of the spinner.
     *
     * @defaultValue `2px`
     * @example
     * ```jsx
     * <Spinner thickness="4px"/>
     * ```
     * @see {@link https://chakra-ui.com/docs/components/spinner/props}
     */
    thickness?: string;
  }
}
