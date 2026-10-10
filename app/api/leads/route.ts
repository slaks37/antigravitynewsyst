import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDatabase } from "@/lib/db";
import { leads, auditLogs } from "@/lib/db/schema";
import { sendNotificationEmail } from "@/lib/email/provider";
import crypto from "crypto";

import { LeadSchema } from "@/lib/validations/lead";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = LeadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Input tidak valid." },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const leadId = `lead-${crypto.randomUUID()}`;

    // 1. Insert into PostgreSQL
    await db.insert(leads).values({
      id: leadId,
      formType: parsed.data.formType,
      fullName: parsed.data.fullName,
      businessEmail: parsed.data.businessEmail,
      phoneNumber: parsed.data.phoneNumber || null,
      company: parsed.data.company,
      industry: parsed.data.industry,
      plantCount: parsed.data.plantCount,
      employeeRange: parsed.data.employeeRange || null,
      productionType: parsed.data.productionType || null,
      businessProblem: parsed.data.businessProblem || null,
      sourcePage: parsed.data.sourcePage,
      utmSource: parsed.data.utmSource || null,
      utmMedium: parsed.data.utmMedium || null,
      utmCampaign: parsed.data.utmCampaign || null,
      consent: parsed.data.consent,
      status: "NEW",
    });

    // 2. Audit log
    await db.insert(auditLogs).values({
      id: `audit-${crypto.randomUUID()}`,
      action: "LEAD_CREATED",
      targetType: "LEAD",
      targetId: leadId,
      notes: `Formulir ${parsed.data.formType} diterima dari ${parsed.data.company} (${parsed.data.businessEmail})`,
      metadata: {
        formType: parsed.data.formType,
        industry: parsed.data.industry,
        plantCount: parsed.data.plantCount,
      },
    });

    // 3. Notify team via email provider adapter
    await sendNotificationEmail({
      to: "sales@newsystem.id",
      subject: `[Lead Baru] ${parsed.data.formType}: ${parsed.data.company}`,
      text: `Permintaan baru dari ${parsed.data.fullName} (${parsed.data.company}) - Industri: ${parsed.data.industry}, Email: ${parsed.data.businessEmail}, Telepon: ${parsed.data.phoneNumber || "-"}`,
    });

    return NextResponse.json({
      success: true,
      leadId,
      message: "Data prospek berhasil disimpan di PostgreSQL.",
    });
  } catch (err) {
    console.error("Error creating lead:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server saat menyimpan data." },
      { status: 500 }
    );
  }
}
