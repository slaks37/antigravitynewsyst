/**
 * Privacy-Aware Marketing Analytics & Event Tracking
 * Compliance with Section 20 — Website Analytics
 */

export type MarketingFunnelEvent =
  | "view_homepage"
  | "view_module_page"
  | "view_industry_page"
  | "view_article"
  | "click_primary_cta"
  | "submit_contact_form"
  | "submit_demo_request"
  | "submit_design_partner_form"
  | "newsletter_subscribe";

export interface AnalyticsEventParams {
  page_title?: string;
  page_location?: string;
  module_id?: string;
  industry_id?: string;
  article_slug?: string;
  category?: string;
  cta_name?: string;
  form_type?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Dispatch analytics event safely without leaking PII (Personal Identifiable Information)
 */
export function trackEvent(
  eventName: MarketingFunnelEvent,
  params: AnalyticsEventParams = {}
): void {
  if (typeof window === "undefined") return;

  // Sanitize params to guarantee no PII is transmitted
  const sanitizedParams: Record<string, unknown> = {
    ...params,
    timestamp: new Date().toISOString(),
  };

  // Remove potential PII fields
  delete sanitizedParams.email;
  delete sanitizedParams.phone;
  delete sanitizedParams.name;
  delete sanitizedParams.fullName;

  // Dispatch to GA4 if initialized
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, sanitizedParams);
  }

  // Debug log in non-production
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Analytics Event: ${eventName}]`, sanitizedParams);
  }
}
