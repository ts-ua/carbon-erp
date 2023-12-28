import { Card, CardContent } from "@carbon/react";
import {
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useParams } from "@remix-run/react";
import { BiLockAlt } from "react-icons/bi";
import { SectionTitle } from "~/components/Layout";
import type { PrivateAttributes, PublicAttributes } from "~/modules/account";
import { ProfileForm, UserAttributesForm } from "~/modules/account";
import type { EmployeeJob } from "~/modules/resources";
import { PersonJob } from "~/modules/resources";
import type { Note } from "~/modules/shared";
import { Notes } from "~/modules/shared";
import type { User } from "~/modules/users";

type PersonTabsProps = {
  user: User;
  job: EmployeeJob;
  notes: Note[];
  publicAttributes: PublicAttributes[];
  privateAttributes: PrivateAttributes[];
};

const PersonsTabs = ({
  user,
  job,
  notes,
  publicAttributes,
  privateAttributes,
}: PersonTabsProps) => {
  const { personId } = useParams();
  if (!personId) throw new Error("Missing personId");

  return (
    <Card>
      <CardContent>
        <Tabs colorScheme="gray">
          <TabList>
            <Tab>Profile</Tab>
            <Tab>Job</Tab>
            <Tab>Public</Tab>
            <Tab>
              <Icon as={BiLockAlt} h={4} w={4} mr={2} /> Private
            </Tab>
            <Tab>
              <Icon as={BiLockAlt} h={4} w={4} mr={2} /> Notes
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ProfileForm user={user} />
            </TabPanel>
            <TabPanel>
              <PersonJob job={job} />
            </TabPanel>
            <TabPanel>
              {publicAttributes.length ? (
                publicAttributes.map((category: PublicAttributes) => (
                  <div key={category.id} className="mb-8 w-full">
                    <SectionTitle>{category.name}</SectionTitle>
                    <UserAttributesForm attributeCategory={category} />
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground p-4 w-full text-center">
                  No public attributes
                </div>
              )}
            </TabPanel>
            <TabPanel>
              {privateAttributes.length ? (
                privateAttributes.map((category: PrivateAttributes) => (
                  <div key={category.id} className="mb-8 w-full">
                    <SectionTitle>{category.name}</SectionTitle>
                    <UserAttributesForm attributeCategory={category} />
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground p-4 w-full text-center">
                  No private attributes
                </div>
              )}
            </TabPanel>
            <TabPanel>
              <Notes documentId={personId} notes={notes} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonsTabs;
