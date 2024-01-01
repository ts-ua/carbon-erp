import {
  HStack,
  IconButton,
  Input as InputBase,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@carbon/react";
import { Avatar, AvatarGroup, Spinner } from "@chakra-ui/react";
import { MdOutlineClear } from "react-icons/md";
import useUserSelectContext from "../provider";

const Input = () => {
  const {
    aria: { inputProps },
    innerProps: { disabled, isMulti, placeholder, readOnly, testID },
    inputValue,
    instanceId,
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
          <AvatarGroup size="xs" max={2}>
            <Avatar />
            <Avatar />
          </AvatarGroup>
        </InputLeftElement>
      ) : (
        <InputLeftElement>
          <Avatar size="xs" />
        </InputLeftElement>
      )}

      <InputBase
        {...inputProps}
        id={`${instanceId}:UserSelectionInput:searchInput:${testID}`}
        data-testid={`UserSelectionInput:searchInput:${testID}`}
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
        <HStack spacing={1} className="mr-2">
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
