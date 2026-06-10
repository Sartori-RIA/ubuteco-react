import type {LegalDocument} from "@/app/_lib/legal/types";

const privacy: LegalDocument = {
  title: "Privacy Policy",
  lastUpdated: "June 10, 2026",
  intro:
    "This Privacy Policy explains how uButeco processes personal data of users and operational data of establishments, in line with Brazil's LGPD (Law No. 13.709/2018) and other applicable rules.",
  sections: [
    {
      title: "1. Controller and contact",
      paragraphs: [
        "uButeco acts as controller for personal data processed for registration, authentication, support, and platform operation.",
        "To exercise privacy rights or ask questions, use the contact channel listed on the site or in the app footer.",
      ],
    },
    {
      title: "2. Data we collect",
      paragraphs: [
        "Registration data: name, email, password (stored hashed), role, and organization link.",
        "Establishment data: business name, phone, logo, regional settings (locale, currency, timezone), and operational status.",
        "Operational data: orders, line items, tables, stock movements, and logs required to run the service.",
        "Technical data: access logs, IP address, session identifiers, auth tokens, and device/browser information for security and diagnostics.",
      ],
    },
    {
      title: "3. Purposes and legal bases",
      paragraphs: [
        "Provide the subscribed service (contract performance).",
        "Authenticate users, enforce permissions, and isolate tenant data (legitimate interest and security).",
        "Improve stability and prevent fraud or abuse (legitimate interest).",
        "Comply with legal obligations and lawful requests from authorities.",
        "Transactional communications about your account. Direct marketing, if any, will rely on consent or opt-out as required by law.",
      ],
    },
    {
      title: "4. Sharing",
      paragraphs: [
        "We do not sell personal data. We share data only with infrastructure providers needed to operate the service (hosting, database, transactional email, search indexing) under appropriate safeguards.",
        "Data may be disclosed when required by law or to protect rights, safety, and integrity of the service and users.",
      ],
    },
    {
      title: "5. Retention and deletion",
      paragraphs: [
        "We retain data while the account is active and as needed for the purposes above, legal obligations, dispute resolution, and security backups.",
        "After account deletion, personal data is deleted or anonymized when no legal basis for retention remains, subject to limited backup retention.",
      ],
    },
    {
      title: "6. Security",
      paragraphs: [
        "We apply technical and organizational measures such as HTTPS, role-based access, API multi-tenant isolation, dependency auditing, and secure development practices.",
        "No system is completely risk-free. If a relevant personal data breach occurs, we will take mitigation and notification steps as required by LGPD.",
      ],
    },
    {
      title: "7. Your rights",
      paragraphs: [
        "You may request confirmation of processing, access, correction, anonymization, portability, deletion of unnecessary data, information on sharing, and withdrawal of consent where applicable.",
        "Requests are handled within a reasonable timeframe; identity verification may be required.",
      ],
    },
    {
      title: "8. Cookies and local storage",
      paragraphs: [
        "We use browser local storage for session tokens (JWT) and UI preferences (e.g. light/dark theme) required for authenticated use.",
        "This version does not use third-party advertising cookies. Analytics tools, if added later, will be described here with consent options when required.",
      ],
    },
    {
      title: "9. International transfers",
      paragraphs: [
        "Infrastructure or subprocessors may be located outside Brazil. In those cases we apply LGPD-compatible safeguards such as standard contractual clauses or adequate protection levels.",
      ],
    },
    {
      title: "10. Children",
      paragraphs: [
        "The service targets businesses and their staff. We do not knowingly collect data from individuals under 18 for standalone registration.",
      ],
    },
    {
      title: "11. Policy updates",
      paragraphs: [
        "This policy may be updated; the revision date appears at the top. Material changes may be communicated by email or in-app notice.",
      ],
    },
  ],
};

export default privacy;
