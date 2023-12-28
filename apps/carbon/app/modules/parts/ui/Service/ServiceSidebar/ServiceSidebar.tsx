import { useParams } from "@remix-run/react";
import { DetailSidebar } from "~/components/Layout";
import { useRouteData } from "~/hooks";
import type { Service } from "~/modules/parts/types";
import { path } from "~/utils/path";
import { useServiceSidebar } from "./useServiceSidebar";

const ServiceSidebar = () => {
  const { serviceId } = useParams();

  if (!serviceId) throw new Error("serviceId not found");

  const routeData = useRouteData<{ service: Service }>(
    path.to.service(serviceId)
  );
  if (!routeData?.service?.serviceType)
    throw new Error("Could not find service type in routeData");

  const links = useServiceSidebar(routeData.service.serviceType);

  return <DetailSidebar links={links} />;
};

export default ServiceSidebar;
