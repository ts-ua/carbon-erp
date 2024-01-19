import { intervalTrigger } from "@trigger.dev/sdk";
import { exchangeRatesClient } from "~/lib/exchange-rates.server";
import { getSupabaseServiceRole } from "~/lib/supabase";
import { triggerClient } from "~/lib/trigger.server";

const supabaseClient = getSupabaseServiceRole();

export const job = triggerClient.defineJob({
  id: "get-exchange-rates",
  name: "Update Currency Exchange Rates",
  version: "0.0.2",
  trigger: intervalTrigger({
    seconds: 60 * 60 * 8, // thrice a day
  }),
  run: async (payload, io, ctx) => {
    // TODO: get client dynamically from DB
    if (!exchangeRatesClient) return;

    await io.logger.info(`💵 Exchange Rates Job: ${payload.lastTimestamp}`);
    await io.logger.info(JSON.stringify(exchangeRatesClient.getMetaData()));

    try {
      const rates = await exchangeRatesClient.getExchangeRates();
      const timestamp = new Date().toISOString();
      await io.logger.info(JSON.stringify(rates));
      const { error } = await supabaseClient
        .from("currencyExchangeRate")
        .upsert(
          Object.entries(rates).map(([currency, exchangeRate]) => ({
            currency,
            exchangeRate,
            timestamp,
          }))
        );
      if (error) {
        await io.logger.error(JSON.stringify(error));
        return;
      }

      io.logger.log("Success");
    } catch (err) {
      // TODO: notify SRE
      await io.logger.error(JSON.stringify(err));
    }
  },
});
