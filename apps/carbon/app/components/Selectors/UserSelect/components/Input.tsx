import {
  Avatar,
  AvatarGroup,
  HStack,
  IconButton,
  Input as InputBase,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@carbon/react";
import { Spinner } from "@chakra-ui/react";
import { MdOutlineClear } from "react-icons/md";
import useUserSelectContext from "../provider";

const Input = () => {
  const {
    aria: { inputProps },
    innerProps: { disabled, isMulti, placeholder, readOnly },
    inputValue,
    loading,
    refs: { inputRef },
    onClearInput,
    onInputBlur,
    onInputChange,
    onInputFocus,
  } = useUserSelectContext();

  return (
    <InputGroup>
      {isMulti ? (
        <InputLeftElement>
          <AvatarGroup size="xs" limit={2}>
            <Avatar size="xs" />
            <Avatar size="xs" />
          </AvatarGroup>
        </InputLeftElement>
      ) : (
        <InputLeftElement>
          <Avatar size="xs" />
        </InputLeftElement>
      )}

      <InputBase
        {...inputProps}
        readOnly={disabled || readOnly}
        isDisabled={disabled || readOnly}
        onBlur={onInputBlur}
        onChange={onInputChange}
        onFocus={onInputFocus}
        placeholder={placeholder}
        spellCheck="false"
        ref={inputRef}
        type="text"
        value={inputValue}

        // pl={isMulti ? "3.175rem" : undefined}
        // pr="2.5rem"
      />

      <InputRightElement>
        <HStack spacing={1}>
          {loading && <Spinner size="sm" />}
          {!loading && !disabled && inputValue.length > 0 && (
            <IconButton
              aria-label="Clear search query"
              icon={<MdOutlineClear />}
              onClick={onClearInput}
              variant="ghost"
            />
          )}
        </HStack>
      </InputRightElement>
    </InputGroup>
  );
};

export default Input;
