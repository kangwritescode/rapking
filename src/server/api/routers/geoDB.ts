import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "src/server/api/trpc";
import { env } from "src/env.mjs";
import axios from "axios";

type ZipCodeResult = {
  zip_code: string;
  distance: number;
  city: string;
  state: string;
}

export type getLocationsResult = {
  city: string;
  state: string;
}

export const geoDBRouter = createTRPCRouter({
  getLocationsByZip: protectedProcedure
    .input(z.object({ zipCode: z.string() }))
    .query(async ({ input }) => {
      try {

        const response = await axios.get(`https://www.zipcodeapi.com/rest/${env.ZIPCODE_API_KEY}/radius.json/${input.zipCode}/5/mile`);
        const data = response.data;

        if (data && data.zip_codes) {
          data.zip_codes.sort((a: ZipCodeResult, b: ZipCodeResult) => a.distance - b.distance)
          const filteredData = data.zip_codes.map(({ city, state }: ZipCodeResult) => ({ city, state }))
          const uniqueCities = filteredData.reduce((accumulator: any, currentValue: any) => {
            if (!accumulator.some((item: ZipCodeResult) => item.city === currentValue.city)) {
              accumulator.push(currentValue);
            }

            return accumulator;
          }, []);

          return uniqueCities;
        }

        return [];
      } catch (error) {
        console.log(error);
      }
    }),
});

