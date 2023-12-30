import {
  BsCalendar2Check,
  BsFillPinMapFill,
  BsPeopleFill,
  BsStopwatch,
} from "react-icons/bs";
import { FaPeopleArrows, FaPeopleCarry } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { GiOrganigram, GiSkills } from "react-icons/gi";
import { MdDashboardCustomize } from "react-icons/md";
import { TbCrane } from "react-icons/tb";
import type { RouteGroup } from "~/types";
import { path } from "~/utils/path";

const resourcesRoutes: RouteGroup[] = [
  {
    name: "Manage",
    routes: [
      {
        name: "People",
        to: path.to.people,
        icon: <BsPeopleFill />,
      },
      {
        name: "Contractors",
        to: path.to.contractors,
        icon: <FaPeopleCarry />,
      },
      {
        name: "Equipment",
        to: path.to.equipment,
        icon: <TbCrane />,
      },
      {
        name: "Partners",
        to: path.to.partners,
        icon: <FaPeopleArrows />,
      },
      {
        name: "Work Cells",
        to: path.to.workCells,
        icon: <MdDashboardCustomize />,
      },
    ],
  },
  {
    name: "Configure",
    routes: [
      {
        name: "Abilities",
        to: path.to.abilities,
        icon: <GiSkills />,
      },
      {
        name: "Attributes",
        to: path.to.attributes,
        icon: <FaListCheck />,
      },
      {
        name: "Departments",
        to: path.to.departments,
        icon: <GiOrganigram />,
      },
      {
        name: "Holidays",
        to: path.to.holidays,
        icon: <BsCalendar2Check />,
      },
      {
        name: "Locations",
        to: path.to.locations,
        icon: <BsFillPinMapFill />,
      },
      {
        name: "Shifts",
        to: path.to.shifts,
        icon: <BsStopwatch />,
      },
    ],
  },
];

export default function useResourcesSidebar() {
  return { groups: resourcesRoutes };
}
