import { ActionMenu, Dot, HStack, VStack } from "@carbon/react";
import { Avatar, Grid, MenuItem } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import type { Action } from "~/types";

type ContactProps = {
  contact: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  url?: string;
  user?: {
    id: string;
    active: boolean | null;
  } | null;
  actions: Action[];
};

enum UserStatus {
  Active,
  Inactive,
  None,
}

const Contact = ({ contact, url, user, actions }: ContactProps) => {
  const name = `${contact.firstName ?? ""} ${contact.lastName ?? ""}`;
  const userStatus = user
    ? user.active
      ? UserStatus.Active
      : UserStatus.Inactive
    : UserStatus.None;

  return (
    <Grid w="full" gridColumnGap={4} gridTemplateColumns="auto 1fr auto">
      <Avatar size="sm" name={`${name}`} />
      <VStack spacing={0}>
        <HStack>
          {url ? (
            <Link to={url}>
              <p className="text-sm font-bold">{name}</p>
            </Link>
          ) : (
            <p className="text-sm font-bold">{name}</p>
          )}

          {userStatus === UserStatus.Active && (
            <Dot color="green.400" title="Active" />
          )}
          {userStatus === UserStatus.Inactive && (
            <Dot color="red.400" title="Inactive" />
          )}
        </HStack>

        <p className="text-sm text-muted-foreground line-clamp-1">
          {contact.email ?? ""}
        </p>
      </VStack>
      {actions.length > 0 && (
        <ActionMenu>
          {actions.map((action) => (
            <MenuItem
              key={action.label}
              icon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </MenuItem>
          ))}
        </ActionMenu>
      )}
    </Grid>
  );
};

export default Contact;
