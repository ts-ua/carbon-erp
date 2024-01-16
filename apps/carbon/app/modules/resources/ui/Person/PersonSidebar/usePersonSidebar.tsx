import { BiSolidUserDetail } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdNote, MdPublic, MdPublicOff } from "react-icons/md";

export function usePersonSidebar() {
  return [
    {
      name: "Profile",
      to: "",
      icon: CgProfile,
    },
    {
      name: "Job",
      to: "job",
      icon: BiSolidUserDetail,
    },
    {
      name: "Public",
      to: "public",
      icon: MdPublic,
    },
    {
      name: "Private",
      to: "private",
      icon: MdPublicOff,
    },
    {
      name: "Notes",
      to: "notes",
      icon: MdNote,
    },
  ];
}
