import idb from "localforage";
import { useEffect } from "react";
import { useSupabase } from "~/lib/supabase";
import { useCustomers, useParts, useSuppliers } from "~/stores";
import type { Part } from "~/stores/parts";
import type { ListItem } from "~/types";

let hydrated = false;
let hydratedFromServer = false;

const RealtimeDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { supabase, accessToken } = useSupabase();

  const [, setParts] = useParts();
  const [, setSuppliers] = useSuppliers();
  const [, setCustomers] = useCustomers();

  const hydrate = async () => {
    if (!hydrated) {
      hydrated = true;

      idb.getItem("customers").then((data) => {
        if (data && !hydratedFromServer) setCustomers(data as ListItem[], true);
      });
      idb.getItem("parts").then((data) => {
        if (data && !hydratedFromServer) setParts(data as Part[], true);
      });
      idb.getItem("suppliers").then((data) => {
        if (data && !hydratedFromServer) setSuppliers(data as ListItem[], true);
      });
    }

    if (!supabase || !accessToken) return;

    const [parts, suppliers, customers] = await Promise.all([
      supabase
        .from("part")
        .select("id, name, replenishmentSystem")
        .eq("active", true)
        .eq("blocked", false)
        .order("name"),
      supabase.from("supplier").select("id, name").order("name"),
      supabase.from("customer").select("id, name").order("name"),
    ]);

    if (parts.error || suppliers.error || customers.error) {
      throw new Error("Failed to fetch core data");
    }

    hydratedFromServer = true;

    setParts(parts.data ?? []);
    setSuppliers(suppliers.data ?? []);
    setCustomers(customers.data ?? []);
  };

  useEffect(() => {
    hydrate();

    if (!supabase || !accessToken) return;
    supabase.realtime.setAuth(accessToken);
    const channel = supabase
      .channel("realtime:core")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "part",
        },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              const { new: inserted } = payload;
              setParts((parts) =>
                [
                  ...parts,
                  {
                    id: inserted.id,
                    name: inserted.name,
                    replenishmentSystem: inserted.replenishmentSystem,
                  },
                ].sort((a, b) => a.name.localeCompare(b.name))
              );
              break;
            case "UPDATE":
              const { new: updated } = payload;
              setParts((parts) =>
                parts
                  .map((p) => {
                    if (p.id === updated.id) {
                      return {
                        ...p,
                        name: updated.name,
                        replenishmentSystem: updated.replenishmentSystem,
                      };
                    }
                    return p;
                  })
                  .sort((a, b) => a.name.localeCompare(b.name))
              );
              break;
            case "DELETE":
              const { old: deleted } = payload;
              setParts((parts) => parts.filter((p) => p.id !== deleted.id));
              break;
            default:
              break;
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "customer",
        },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              const { new: inserted } = payload;
              setCustomers((customers) =>
                [
                  ...customers,
                  {
                    id: inserted.id,
                    name: inserted.name,
                  },
                ].sort((a, b) => a.name.localeCompare(b.name))
              );
              break;
            case "UPDATE":
              const { new: updated } = payload;
              setCustomers((customers) =>
                customers
                  .map((p) => {
                    if (p.id === updated.id) {
                      return {
                        ...p,
                        name: updated.name,
                      };
                    }
                    return p;
                  })
                  .sort((a, b) => a.name.localeCompare(b.name))
              );
              break;
            case "DELETE":
              const { old: deleted } = payload;
              setCustomers((customers) =>
                customers.filter((p) => p.id !== deleted.id)
              );
              break;
            default:
              break;
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "supplier",
        },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              const { new: inserted } = payload;
              setSuppliers((suppliers) =>
                [
                  ...suppliers,
                  {
                    id: inserted.id,
                    name: inserted.name,
                  },
                ].sort((a, b) => a.name.localeCompare(b.name))
              );
              break;
            case "UPDATE":
              const { new: updated } = payload;
              setSuppliers((suppliers) =>
                suppliers
                  .map((p) => {
                    if (p.id === updated.id) {
                      return {
                        ...p,
                        name: updated.name,
                      };
                    }
                    return p;
                  })
                  .sort((a, b) => a.name.localeCompare(b.name))
              );
              break;
            case "DELETE":
              const { old: deleted } = payload;
              setSuppliers((suppliers) =>
                suppliers.filter((p) => p.id !== deleted.id)
              );
              break;
            default:
              break;
          }
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase?.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, accessToken]);

  return <>{children}</>;
};

export default RealtimeDataProvider;
