# Launch checklist

The design preview is complete. The items below are what the preview **cannot** decide on its own. Each
one is shown in the preview as a dashed gold box, an "INSERT PHOTO" placeholder, a "not connected"
slot, or an honest empty state. None of them has been invented.

Owners: **Bob** confirms business facts and scope, **Jocel** installs and configures GHL, and a
**qualified reviewer** checks legal and housing wording.

## A. Business facts to confirm (Bob)

- [ ] Management DBA and exact legal footer wording (footer, both legal pages)
- [x] Management phone number: **(612) 210-8424** (confirmed 2026-10-01; header, footer, heroes, quote page,
      owner thank-you page, legal drafts)
- [x] Management email: **info@mg.propertymanagementprofessionals.net** (confirmed 2026-10-01; same places)
- [ ] Check that this email **receives and answers mail**. An `mg.` subdomain is usually a sending-only
      domain set up for GHL email, so replies may go nowhere. If a different inbox is preferred (for example
      info@propertymanagementprofessionals.net), change it in `shared/header.html`, `shared/footer.html`,
      the home and service heroes, the quote page, the owner thank-you page and both legal drafts.
- [ ] The one approved HTTPS domain for the site (canonicals, sitemap). The email suggests
      propertymanagementprofessionals.net, but it is not assumed until confirmed.
- [x] Logo supplied (2026-10-01). Web files and favicons were cut from it (see `image-inventory.md`).
- [ ] Approve the header treatment: only the logo's name block is shown in the header, the full logo is in
      the footer. Send a horizontal or true-vector logo if one exists.
- [ ] Bob's preferred public title (About page, portrait alt text). No title is shown until confirmed.
- [ ] Long-term service scope as written on `/long-term-rental-management` (marketing and leasing,
      screening and placement, rent collection and reporting, tenant communication, maintenance
      coordination). Standalone tenant placement is **not** described as a package until Bob confirms it.
- [ ] Short-term service scope as written on `/short-term-rental-management` (listings, pricing
      strategy, guest communication, turnovers, performance)
- [ ] Service area: the site says "East Central Minnesota" only. Add towns only when Bob confirms them;
      do not create thin city pages.
- [ ] **Held FAQ:** "Do you offer guaranteed rent?" stays unpublished until Bob confirms a
      selected-property guaranteed-rent or master-lease arrangement and approves the wording
      (instructions in `pages/faqs/02-owner-questions.html`).

## B. Photos (see `image-inventory.md`)

- [ ] Real, approved photos for each slot, with photo permission and honest alt text. No generic luxury
      stock, and no photo that implies an amenity, location or management relationship that is not true.
- [ ] Bob's approved headshot (800 × 1000 px) and an approved photo of Bob or the team at a property.

## C. Listings and booking

- [ ] Long-term listings: only verified, approved, currently available homes, checked in DoorLoop and
      with Bob. Each needs verified rent, availability date, fees, deposits, lease terms and requirements,
      and a verified listing URL. Never copy the internal address roster to the site.
- [ ] Vacation properties: current details, confirmed region, verified amenities, and a confirmed
      booking page or approved current listing link for each.
- [ ] PMS choice: evaluate OwnerRez first; compare Lodgify if needed. Test booking, availability,
      payment, modification and cancellation before any booking widget or "Book Direct" wording.
- [ ] Confirm merchant account, taxes, fees, deposits, cancellation rules, payment schedules and
      refunds during PMS onboarding.

## D. Forms and GHL (separate tasks; nothing here is configured by the design build)

- [ ] **Owner form:** build a new dedicated GHL property-owner form (fields in `installation-guide.md`),
      redirect success to `/management-thank-you`, keep messaging opt-ins separate and worded to match
      the real program.
- [ ] **Applicant form:** inspect the previously supplied GHL form, ID `4hpxZOMnPuBipucVpDwm`, before
      embedding it, or use the DoorLoop preliminary form if Bob selects it. Replace any placeholder policy
      links inside it. Bob and a qualified housing reviewer check its questions about children, local
      origin, criminal/eviction history, fees and move-in funds against actual policy and applicable
      rules. Its certification checkbox is not an SMS marketing opt-in. Redirect success to
      `/prequalification-thank-you`.
- [ ] **Guest updates signup:** only when sender identity and unsubscribe handling are ready; store email
      and SMS consent separately with source, timestamp, wording/version and withdrawal status.
- [ ] Account foundation: subaccount ID, branding, domain, sender/reply address, phone, time zone, team
      access, sending-domain authentication, unsubscribe handling, SMS registration status.
- [ ] PM Owner Leads pipeline (New Inquiry, Contact Attempted, Consultation Scheduled, Property Review,
      Proposal Sent, Follow Up, Won, Lost), with no duplicate opportunities for repeat submissions.
- [ ] STR Marketing Inquiries pipeline (New Inquiry, Contacted, Referred to Booking Site, Closed).
      Reservations stay in the PMS.
- [ ] Tags and fields from brief section 5 (ROLE_OWNER, ROLE_APPLICANT, ROLE_STR_GUEST, OWNER_LONG_TERM,
      OWNER_STR, SOURCE_WEBSITE_QUOTE, property-specific guest tags; rental type, city, units, occupancy,
      support needed, contact method, timing, PMS guest ID, channel marketing choices).
- [ ] Owner consultation calendar with Bob's availability, duration, buffers, time zone, staff and
      reminders.
- [ ] Owner workflow as described in the brief, with stop conditions and no duplicate notes or
      notifications.
- [ ] PMS-to-GHL connection (for example Zapier) tested for events, lookups, property IDs, changes,
      cancellations, duplicates, retries and error alerts. Credentials stay in secure configuration,
      never in website code.

## E. Legal review drafts (qualified reviewer)

- [ ] Privacy Policy: effective date, legal operator/DBA, mailing address, confirm the listed email is the
      right privacy contact, the
      providers actually used, the actual mobile opt-in sharing practice, cookies and analytics actually
      used, and actual retention and security practice.
- [ ] Terms of Service: effective date, operator and support contact, booking provider name, and the
      text-messaging section (only categories and opt-in paths that are really active, with correct
      STOP and HELP instructions), or remove that section.
- [ ] Remove the "Review draft" banner and "Review note" boxes only after approval, then switch the
      pages to indexable.

## F. Before launch

- [ ] No dashed pending boxes, "INSERT PHOTO" labels, "not connected" slots or review notes remain.
- [ ] Every link goes to a real page; the maintenance link
      (https://www.propertymaintenanceprofessionals.net/) still loads (it returned 200 on 2026-10-01).
- [ ] Contact details, legal identity and service area are identical everywhere.
- [ ] Mobile check of every page, form and menu on real phones.

## G. At launch

- [ ] Page titles, descriptions, canonicals and indexing set per `seo-settings.md`; the live page source
      checked, not only the GHL settings screen.
- [ ] Public pages switched from noindex to indexable; thank-you pages and unapproved legal drafts stay
      noindex.
- [ ] XML sitemap contains only the indexable canonical URLs (`sitemap-template.xml`); robots.txt allows
      the public pages and their CSS, JavaScript and fonts.
- [ ] Missing pages return a 404 status and do not show Home.
- [ ] Real test submissions: one owner contact, one opportunity, one note, one notification, correct
      follow-up; applicant submissions excluded from owner and guest campaigns; guest consent respected.

## H. After launch

- [ ] Verify the site in Google Search Console, submit the sitemap, and use URL Inspection on Home and
      both service pages.
- [ ] Review Search Console queries and owner inquiries over time and improve content from real results.
      A sitemap does not guarantee indexing, and no ranking is promised.
