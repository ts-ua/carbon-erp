import { HStack, HTML, VStack } from "@carbon/react";
import { formatTimeAgo } from "@carbon/utils";
import { Button, Grid, Text } from "@chakra-ui/react";
import { Form } from "@remix-run/react";
import { Fragment } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Avatar } from "~/components";
import { Hidden, RichText, Submit } from "~/components/Form";
import { SectionTitle } from "~/components/Layout";
import { usePermissions, useUser } from "~/hooks";
import type { Note } from "~/modules/shared";
import { noteValidator } from "~/modules/shared";
import { path } from "~/utils/path";

type NotesProps = {
  documentId: string;
  notes: Note[];
};

const Notes = ({ documentId, notes }: NotesProps) => {
  const user = useUser();
  const permissions = usePermissions();
  const isEmployee = permissions.is("employee");

  if (!isEmployee) return null;

  return (
    <div className="w-full">
      <SectionTitle>Notes</SectionTitle>

      {notes.length > 0 ? (
        <Grid
          gridTemplateColumns="auto 1fr"
          gridColumnGap={4}
          gridRowGap={8}
          w="full"
        >
          {notes.map((note) => {
            if (!note.user || Array.isArray(note.user))
              throw new Error("Invalid user");
            return (
              <Fragment key={note.id}>
                {/* @ts-ignore */}
                <Avatar path={note.user.avatarUrl} />
                <VStack spacing={1}>
                  {/* @ts-ignore */}
                  <Text fontWeight="bold">{note.user?.fullName!}</Text>
                  <HTML text={note.note} />
                  <HStack spacing={4}>
                    <Text color="gray.500">
                      {formatTimeAgo(note.createdAt)}
                    </Text>
                    {/* @ts-ignore */}
                    {user.id === note.user.id && (
                      <Form method="post" action={path.to.deleteNote(note.id)}>
                        <Button
                          type="submit"
                          variant="link"
                          fontWeight="normal"
                          size="md"
                        >
                          Delete
                        </Button>
                      </Form>
                    )}
                  </HStack>
                </VStack>
              </Fragment>
            );
          })}
        </Grid>
      ) : (
        <div className="text-muted-foreground p-4 w-full text-center">
          No notes
        </div>
      )}

      <div className="pt-8 w-full">
        <ValidatedForm
          method="post"
          action={path.to.newNote}
          resetAfterSubmit
          validator={noteValidator}
        >
          <Hidden name="documentId" value={documentId} />
          <VStack spacing={3}>
            <div className="w-full border rounded-md">
              <RichText name="note" minH={160} />
            </div>
            <div className="flex justify-end w-full">
              <Submit>Add Note</Submit>
            </div>
          </VStack>
        </ValidatedForm>
      </div>
    </div>
  );
};

export default Notes;
