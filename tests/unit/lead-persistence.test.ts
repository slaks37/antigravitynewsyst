import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "@/lib/db/schema";
import { NextRequest } from "next/server";

const state = vi.hoisted(() => ({ db: null as unknown }));
vi.mock("@/lib/db", () => ({ getDatabase: () => state.db }));
vi.mock("@/lib/email/provider", () => ({
  sendNotificationEmail: vi.fn().mockResolvedValue(undefined),
}));
const client = new PGlite();
beforeAll(async () => {
  await client.exec(
    `CREATE TABLE leads (id varchar(36) PRIMARY KEY, form_type varchar(50), full_name varchar(150), business_email varchar(255), phone_number varchar(50), company varchar(200), industry varchar(100), plant_count integer, employee_range varchar(50), production_type varchar(100), business_problem text, source_page varchar(255), utm_source varchar(100), utm_medium varchar(100), utm_campaign varchar(100), consent boolean, status varchar(50), notes text, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()); CREATE TABLE audit_logs (id varchar(36) PRIMARY KEY, user_id varchar(36), user_email varchar(255), action varchar(100), target_type varchar(100), target_id varchar(100), notes text, metadata jsonb, created_at timestamp DEFAULT now());`,
  );
  state.db = drizzle(client, { schema });
});
afterAll(() => client.close());
describe("lead route with real PostgreSQL column constraints", () => {
  it.each(["CONTACT", "DEMO_REQUEST", "DESIGN_PARTNER"])(
    "persists %s and its audit record without oversized IDs",
    async (formType) => {
      const { POST } = await import("@/app/api/leads/route");
      const response = await POST(
        new NextRequest("http://localhost/api/leads", {
          method: "POST",
          body: JSON.stringify({
            formType,
            fullName: "Synthetic QA",
            businessEmail: "qa@example.invalid",
            company: "Synthetic Company",
            sourcePage: "/services",
            consent: true,
          }),
        }),
      );
      expect(response.status).toBe(200);
      const { leadId } = await response.json();
      expect(leadId).toHaveLength(36);
      const stored = await client.query(
        "SELECT form_type, source_page FROM leads WHERE id=$1",
        [leadId],
      );
      expect(stored.rows).toEqual([
        { form_type: formType, source_page: "/services" },
      ]);
      const audit = await client.query(
        "SELECT action FROM audit_logs WHERE target_id=$1",
        [leadId],
      );
      expect(audit.rows).toEqual([{ action: "LEAD_CREATED" }]);
    },
  );
});
