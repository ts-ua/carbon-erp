import { HStack, VStack, useMount } from "@carbon/react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Employees, Hidden, Radios, Submit } from "~/components/Form";
import type { Permission } from "~/modules/users";
import { bulkPermissionsValidator } from "~/modules/users";
import { path } from "~/utils/path";
import PermissionCheckboxes from "../../components/Permission";

type BulkEditPermissionsProps = {
  userIds: string[];
  isOpen: boolean;
  onClose: () => void;
};

const BulkEditPermissions = ({
  userIds,
  isOpen,
  onClose,
}: BulkEditPermissionsProps) => {
  const [permissions, setPermissions] = useState<Record<string, Permission>>(
    {}
  );

  const updatePermissions = (module: string, permission: Permission) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [module]: permission,
    }));
  };

  const emptyPermissionsFetcher = useFetcher<{
    permissions: Record<
      string,
      {
        id: string;
        permission: Permission;
      }
    >;
  }>();

  useMount(() => {
    emptyPermissionsFetcher.load(path.to.api.emptyPermissions);
  });

  useEffect(() => {
    if (emptyPermissionsFetcher.data) {
      let emptyPermissions: Record<string, Permission> = {};
      Object.entries(emptyPermissionsFetcher.data.permissions).forEach(
        ([module, data]) => {
          emptyPermissions[module] = data.permission;
        }
      );
      setPermissions(emptyPermissions);
    }
  }, [emptyPermissionsFetcher.data]);

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Bulk Edit Permissions</DrawerHeader>
        <DrawerBody pb={8}>
          <ValidatedForm
            validator={bulkPermissionsValidator}
            method="post"
            action={path.to.bulkEditPermissions}
            onSubmit={onClose}
            defaultValues={{ userIds }}
          >
            <VStack spacing={4}>
              <div className="border p-4 w-full rounded-lg">
                <Radios
                  name="editType"
                  label="Type of Permission Update"
                  options={[
                    {
                      label: "Add Permissions",
                      value: "add",
                    },
                    {
                      label: "Update Permissions",
                      value: "update",
                    },
                  ]}
                />
              </div>

              <Employees
                name="userIds"
                selectionsMaxHeight={"calc(100vh - 330px)"}
                label="Users to Update"
              />

              <FormLabel>Permissions</FormLabel>
              {Object.entries(permissions)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([module, data], index) => (
                  <div key={index}>
                    <PermissionCheckboxes
                      module={module}
                      permissions={data}
                      updatePermissions={updatePermissions}
                    />
                  </div>
                ))}
              <Hidden name="data" value={JSON.stringify(permissions)} />
              <HStack spacing={2} className="my-4">
                <Submit>Save</Submit>
                <Button
                  size="md"
                  colorScheme="gray"
                  variant="solid"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </ValidatedForm>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default BulkEditPermissions;
