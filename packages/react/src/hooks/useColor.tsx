import { useColorModeValue } from "@chakra-ui/react";

const darkModeColor = {
  white: "black",
  black: "white",
  "gray.50": "whiteAlpha.100",
  "gray.100": "gray.900",
  "gray.200": "gray.800",
  "gray.300": "gray.700",
  "gray.400": "whiteAlpha.400",
  "gray.500": "gray.500",
  "gray.600": "gray.400",
  "gray.700": "gray.300",
  "gray.800": "gray.200",
  "gray.900": "gray.100",
  "var(--chakra-colors-zinc-50)": "var(--chakra-colors-whiteAlpha-100)",
  "var(--chakra-colors-zinc-100)": "var(--chakra-colors-zinc-900)",
  "var(--chakra-colors-zinc-200)": "var(--chakra-colors-zinc-800)",
  "var(--chakra-colors-zinc-300)": "var(--chakra-colors-zinc-700)",
  "var(--chakra-colors-zinc-400)": "var(--chakra-colors-zinc-600)",
  "var(--chakra-colors-zinc-500)": "var(--chakra-colors-zinc-500)",
  "var(--chakra-colors-zinc-600)": "var(--chakra-colors-zinc-400)",
  "var(--chakra-colors-zinc-700)": "var(--chakra-colors-zinc-300)",
  "var(--chakra-colors-zinc-800)": "var(--chakra-colors-zinc-200)",
  "var(--chakra-colors-zinc-900)": "var(--chakra-colors-zinc-100)",
};

export default function useColor(color: keyof typeof darkModeColor) {
  return useColorModeValue(color, darkModeColor[color]);
}
