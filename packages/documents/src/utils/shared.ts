export function formatAddress(
  city: string | null,
  state: string | null,
  postalCode: string | null
) {
  if (city && state && postalCode) {
    return `${city}, ${state}, ${postalCode}`;
  }

  return "";
}
