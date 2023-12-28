import { useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSupabase } from "~/lib/supabase";
import { useCustomers, useParts, useSuppliers } from "~/stores";

const RealtimeDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const { supabase, accessToken } = useSupabase();

  const [, setParts] = useParts();
  const [, setSuppliers] = useSuppliers();
  const [, setCustomers] = useCustomers();

  const fetchData = async () => {
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

    setParts(parts.data ?? []);
    setSuppliers(suppliers.data ?? []);
    setCustomers(customers.data ?? []);

    setLoading(false);
  };

  useEffect(() => {
    if (!supabase || !accessToken) return;
    fetchData();

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

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
};

function Loading() {
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center">
      <img
        src={useColorModeValue(
          "/carbon-logo-dark.png",
          "/carbon-logo-light.png"
        )}
        alt="Carbon Logo"
        className="max-w-[100px]"
      />
    </div>
  );
}

export default RealtimeDataProvider;
