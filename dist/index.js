var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/healthMonitor.ts
var healthMonitor_exports = {};
__export(healthMonitor_exports, {
  getHealthStatus: () => getHealthStatus,
  startHealthMonitor: () => startHealthMonitor
});
import https from "https";
async function pingExternalUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 1e4 }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.status === "healthy");
        } catch (e) {
          resolve(false);
        }
      });
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.abort();
      resolve(false);
    });
  });
}
async function performKeepalivePings() {
  pingCount++;
  const timestamp2 = (/* @__PURE__ */ new Date()).toLocaleString("nl-NL");
  let successCount = 0;
  for (const url of urls) {
    try {
      const success = await pingExternalUrl(url);
      if (success) {
        successCount++;
      }
    } catch (error) {
      console.log(`\u26A0\uFE0F Keepalive ping failed for ${url}`);
    }
  }
  if (successCount > 0) {
    lastSuccessfulPing = /* @__PURE__ */ new Date();
    if (pingCount % 12 === 0) {
      console.log(`\u{1F49A} Keepalive status: ${successCount}/${urls.length} URLs healthy (check #${pingCount})`);
    }
  } else {
    console.log(`\u274C ${timestamp2} - All keepalive pings failed! Server may be unreachable externally.`);
  }
}
function checkProcessHealth() {
  try {
    const memUsage = process.memoryUsage();
    const memUsageMB = Math.round(memUsage.rss / 1024 / 1024);
    if (memUsageMB > 500) {
      console.log(`\u26A0\uFE0F High memory usage detected: ${memUsageMB}MB`);
      return false;
    }
    const timeSinceLastPing = Date.now() - lastSuccessfulPing.getTime();
    if (timeSinceLastPing > 30 * 60 * 1e3) {
      console.log(`\u26A0\uFE0F No successful external ping for ${Math.round(timeSinceLastPing / 6e4)} minutes`);
      return false;
    }
    return true;
  } catch (error) {
    console.log("\u274C Process health check error:", error);
    return false;
  }
}
function startHealthMonitor() {
  if (monitoringActive) {
    return;
  }
  monitoringActive = true;
  console.log("\u{1F493} Built-in health monitor started");
  console.log("\u{1F310} Keepalive targets:", urls.join(", "));
  setTimeout(performKeepalivePings, 5e3);
  setInterval(performKeepalivePings, 5 * 60 * 1e3);
  setInterval(() => {
    const isHealthy = checkProcessHealth();
    if (!isHealthy) {
      console.log("\u26A0\uFE0F Process health issues detected - consider restart");
    }
  }, 30 * 1e3);
  setInterval(() => {
    const uptime = Math.round(process.uptime() / 60);
    const memUsage = Math.round(process.memoryUsage().rss / 1024 / 1024);
    console.log(`\u{1F4CA} Server uptime: ${uptime} minutes | Memory: ${memUsage}MB | Keepalive pings: ${pingCount}`);
  }, 60 * 60 * 1e3);
}
function getHealthStatus() {
  const timeSinceLastPing = Date.now() - lastSuccessfulPing.getTime();
  const memUsage = Math.round(process.memoryUsage().rss / 1024 / 1024);
  return {
    monitoring: monitoringActive,
    keepalivePings: pingCount,
    lastSuccessfulPing: lastSuccessfulPing.toISOString(),
    timeSinceLastPing: Math.round(timeSinceLastPing / 1e3),
    memoryUsage: memUsage,
    uptime: Math.round(process.uptime())
  };
}
var monitoringActive, pingCount, lastSuccessfulPing, urls;
var init_healthMonitor = __esm({
  "server/healthMonitor.ts"() {
    "use strict";
    monitoringActive = false;
    pingCount = 0;
    lastSuccessfulPing = /* @__PURE__ */ new Date();
    urls = [
      "https://xenra.nl/health",
      "https://www.xenra.nl/health",
      "https://xenra-nederland.replit.app/health"
    ];
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  applications: () => applications,
  applicationsRelations: () => applicationsRelations,
  backups: () => backups,
  calculator_sessions: () => calculator_sessions,
  cms_users: () => cms_users,
  contacts: () => contacts,
  customerAccountsRelations: () => customerAccountsRelations,
  customerAppointmentsRelations: () => customerAppointmentsRelations,
  customerCommunicationsRelations: () => customerCommunicationsRelations,
  customerDocumentsRelations: () => customerDocumentsRelations,
  customerFilesRelations: () => customerFilesRelations,
  customerInvoicesRelations: () => customerInvoicesRelations,
  customerProgressRelations: () => customerProgressRelations,
  customerTicketRepliesRelations: () => customerTicketRepliesRelations,
  customerTicketsRelations: () => customerTicketsRelations,
  customer_accounts: () => customer_accounts,
  customer_appointments: () => customer_appointments,
  customer_communications: () => customer_communications,
  customer_documents: () => customer_documents,
  customer_ebooks: () => customer_ebooks,
  customer_files: () => customer_files,
  customer_invoices: () => customer_invoices,
  customer_progress: () => customer_progress,
  customer_ticket_replies: () => customer_ticket_replies,
  customer_tickets: () => customer_tickets,
  customers: () => customers,
  customersRelations: () => customersRelations,
  documents: () => documents,
  documentsRelations: () => documentsRelations,
  insertApplicationSchema: () => insertApplicationSchema,
  insertBackupSchema: () => insertBackupSchema,
  insertCMSUserSchema: () => insertCMSUserSchema,
  insertCalculatorSessionSchema: () => insertCalculatorSessionSchema,
  insertContactSchema: () => insertContactSchema,
  insertCustomerAccountSchema: () => insertCustomerAccountSchema,
  insertCustomerAppointmentSchema: () => insertCustomerAppointmentSchema,
  insertCustomerCommunicationSchema: () => insertCustomerCommunicationSchema,
  insertCustomerDocumentSchema: () => insertCustomerDocumentSchema,
  insertCustomerEbookSchema: () => insertCustomerEbookSchema,
  insertCustomerFileSchema: () => insertCustomerFileSchema,
  insertCustomerInvoiceSchema: () => insertCustomerInvoiceSchema,
  insertCustomerProgressSchema: () => insertCustomerProgressSchema,
  insertCustomerSchema: () => insertCustomerSchema,
  insertCustomerTicketReplySchema: () => insertCustomerTicketReplySchema,
  insertCustomerTicketSchema: () => insertCustomerTicketSchema,
  insertDocumentSchema: () => insertDocumentSchema,
  insertInvoiceAlertSchema: () => insertInvoiceAlertSchema,
  insertMessageSchema: () => insertMessageSchema,
  insertRegistrationSchema: () => insertRegistrationSchema,
  insertSubscriptionSchema: () => insertSubscriptionSchema,
  insertUserSchema: () => insertUserSchema,
  insertWebsiteContentSchema: () => insertWebsiteContentSchema,
  invoiceAlertsRelations: () => invoiceAlertsRelations,
  invoice_alerts: () => invoice_alerts,
  messages: () => messages,
  messagesRelations: () => messagesRelations,
  registrations: () => registrations,
  registrationsRelations: () => registrationsRelations,
  subscriptions: () => subscriptions,
  subscriptionsRelations: () => subscriptionsRelations,
  users: () => users,
  usersRelations: () => usersRelations,
  website_content: () => website_content
});
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var cms_users = pgTable("cms_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("editor"),
  // "admin", "editor"
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  inquiryType: text("inquiry_type").notNull().default("Algemene informatie"),
  subject: text("subject").default("Contactformulier").notNull(),
  message: text("message").notNull(),
  processed: boolean("processed").default(false).notNull(),
  scheduledEmailTime: timestamp("scheduled_email_time"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var calculator_sessions = pgTable("calculator_sessions", {
  id: serial("id").primaryKey(),
  situation: text("situation").notNull(),
  ageGroup: text("age_group").notNull(),
  loyaltyBonus: text("loyalty_bonus").notNull(),
  digitalVault: text("digital_vault").notNull(),
  premium: text("premium").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  postalCode: text("postal_code").notNull(),
  city: text("city").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  age: text("age").notNull(),
  packageType: text("package_type").notNull(),
  // "particulier", "zzp", "ondernemer"
  loyaltyBonus: text("loyalty_bonus").notNull(),
  digitalVault: text("digital_vault").notNull(),
  monthlyRate: text("monthly_rate").notNull(),
  startDate: text("start_date").notNull(),
  paymentMethod: text("payment_method").notNull(),
  // "maandelijks", "per_kwartaal", "per_jaar"
  cancellationDate: text("cancellation_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  packageType: text("package_type").notNull(),
  // "particulier", "zzp", "bedrijf"
  coverage: text("coverage").notNull(),
  premium: text("premium").notNull(),
  status: text("status").default("nieuwe_aanvraag").notNull(),
  // "nieuwe_aanvraag", "documenten_ontvangen", "in_behandeling", "goedgekeurd", "akkoord_verzonden"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  filePath: text("file_path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull()
});
var messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  isFromAdmin: boolean("is_from_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  registrationId: integer("registration_id").references(() => registrations.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  packageType: text("package_type").notNull(),
  monthlyRate: text("monthly_rate").notNull(),
  paymentMethod: text("payment_method").notNull(),
  loyaltyBonus: text("loyalty_bonus"),
  // Xenra-tegoed
  digitalVault: text("digital_vault"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  // null = actief abonnement
  status: text("status").default("active").notNull(),
  // "active", "cancelled", "suspended"
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique().notNull(),
  phone: text("phone"),
  address: text("address"),
  postalCode: text("postal_code"),
  city: text("city"),
  gender: text("gender"),
  // "man", "vrouw", "x"
  bankAccount: text("bank_account"),
  packageType: text("package_type"),
  // "particulier", "zzp", "bv"
  registrationId: integer("registration_id").references(() => registrations.id),
  birthDate: text("birth_date"),
  notes: text("notes"),
  hasSubscription: boolean("has_subscription").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var customer_documents = pgTable("customer_documents", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(),
  // "pdf", "docx", "xlsx", "jpg", "png", etc.
  fileSize: integer("file_size").notNull(),
  // in bytes
  filePath: text("file_path").notNull(),
  category: text("category").notNull(),
  // "identiteit", "inkomen", "testament", "verzekering", "overig"
  description: text("description"),
  uploadedBy: text("uploaded_by").default("admin").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull()
});
var customer_communications = pgTable("customer_communications", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  communicationType: text("communication_type").notNull(),
  // "telefoon", "email", "brief", "bezoek"
  direction: text("direction").notNull(),
  // "inkomend", "uitgaand"
  contactPerson: text("contact_person").notNull(),
  // naam van de Xenra medewerker
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  tags: text("tags"),
  // comma-separated tags
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var website_content = pgTable("website_content", {
  id: serial("id").primaryKey(),
  contentKey: text("content_key").notNull().unique(),
  // bijv. "hero_title", "hero_subtitle"
  contentType: text("content_type").notNull(),
  // "text", "html", "image", "json"
  contentValue: text("content_value").notNull(),
  page: text("page").notNull(),
  // "home", "services", "pricing", "contact", "faq", "about"
  section: text("section"),
  // "hero", "features", "team", "footer" etc.
  description: text("description"),
  // beschrijving van waar deze content wordt gebruikt
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var backups = pgTable("backups", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  data: text("data").notNull(),
  // JSON backup data
  size: integer("size").notNull(),
  // file size in bytes
  type: text("type").notNull().default("database"),
  // "database", "website", "xenra"
  status: text("status").notNull().default("success"),
  // "success", "failed"
  errorMessage: text("error_message"),
  // error message if failed
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var customer_accounts = pgTable("customer_accounts", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isOnHold: boolean("is_on_hold").default(false).notNull(),
  holdReason: text("hold_reason"),
  // reden waarom account on hold staat
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var customer_files = pgTable("customer_files", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  filePath: text("file_path").notNull(),
  category: text("category").notNull(),
  // "document", "image", "other"
  description: text("description"),
  uploadedBy: text("uploaded_by").default("customer").notNull(),
  // "customer", "admin"
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull()
});
var customer_progress = pgTable("customer_progress", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  taskTitle: text("task_title").notNull(),
  taskDescription: text("task_description"),
  status: text("status").default("ontvangen").notNull(),
  // "ontvangen", "mee_bezig", "komt_eraan", "wacht_op_informatie", "is_geregeld", "wordt_uitgesteld"
  orderIndex: integer("order_index").notNull(),
  // voor sortering
  isVisible: boolean("is_visible").default(true).notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var customer_tickets = pgTable("customer_tickets", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  category: text("category").notNull(),
  // "algemene_vraag", "financiele_vraag", "probleem", "wijziging", "juridische_vraag", "belastingvraag"
  priority: text("priority").default("normal").notNull(),
  // "low", "normal", "high", "urgent"
  status: text("status").default("open").notNull(),
  // "open", "in_progress", "resolved", "closed"
  assignedTo: text("assigned_to"),
  // naam van Xenra medewerker
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var customer_ticket_replies = pgTable("customer_ticket_replies", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => customer_tickets.id).notNull(),
  message: text("message").notNull(),
  isFromAdmin: boolean("is_from_admin").default(false).notNull(),
  authorName: text("author_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var customer_invoices = pgTable("customer_invoices", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  description: text("description").notNull(),
  amount: text("amount").notNull(),
  invoiceDate: text("invoice_date").notNull(),
  dueDate: text("due_date"),
  status: text("status").default("pending").notNull(),
  // "pending", "paid", "overdue", "cancelled"
  fileName: text("file_name"),
  // PDF bestand naam
  filePath: text("file_path"),
  // pad naar PDF bestand
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var customer_ebooks = pgTable("customer_ebooks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  category: text("category").notNull(),
  // bijv. "erfrecht", "belastingen", "administratie"
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var customer_appointments = pgTable("customer_appointments", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  appointmentDate: text("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  location: text("location"),
  type: text("type").notNull(),
  // "intake", "overleg", "nazorg", "ondertekening"
  status: text("status").default("scheduled").notNull(),
  // "scheduled", "confirmed", "completed", "cancelled"
  contactPerson: text("contact_person").notNull(),
  // Xenra medewerker
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var invoice_alerts = pgTable("invoice_alerts", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id).notNull(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  customerName: text("customer_name").notNull(),
  packageType: text("package_type").notNull(),
  // "particulier", "zzp", "ondernemer"
  monthlyRate: text("monthly_rate").notNull(),
  paymentFrequency: text("payment_frequency").notNull(),
  // "maandelijks", "per_kwartaal", "per_jaar"
  dueDate: text("due_date").notNull(),
  // datum wanneer factuur verstuurd moet worden
  periodStart: text("period_start").notNull(),
  // start van deze factuurperiode
  periodEnd: text("period_end").notNull(),
  // einde van deze factuurperiode
  isProcessed: boolean("is_processed").default(false).notNull(),
  // afgevinkt door admin
  processedAt: timestamp("processed_at"),
  processedBy: text("processed_by"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var usersRelations = relations(users, ({ many }) => ({
  applications: many(applications),
  messages: many(messages)
}));
var applicationsRelations = relations(applications, ({ one, many }) => ({
  user: one(users, {
    fields: [applications.userId],
    references: [users.id]
  }),
  documents: many(documents),
  messages: many(messages)
}));
var documentsRelations = relations(documents, ({ one }) => ({
  application: one(applications, {
    fields: [documents.applicationId],
    references: [applications.id]
  })
}));
var messagesRelations = relations(messages, ({ one }) => ({
  application: one(applications, {
    fields: [messages.applicationId],
    references: [applications.id]
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id]
  })
}));
var subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  registration: one(registrations, {
    fields: [subscriptions.registrationId],
    references: [registrations.id]
  })
}));
var registrationsRelations = relations(registrations, ({ many }) => ({
  subscriptions: many(subscriptions)
}));
var customersRelations = relations(customers, ({ many, one }) => ({
  documents: many(customer_documents),
  communications: many(customer_communications),
  registration: one(registrations, {
    fields: [customers.registrationId],
    references: [registrations.id]
  })
}));
var customerDocumentsRelations = relations(customer_documents, ({ one }) => ({
  customer: one(customers, {
    fields: [customer_documents.customerId],
    references: [customers.id]
  })
}));
var customerCommunicationsRelations = relations(customer_communications, ({ one }) => ({
  customer: one(customers, {
    fields: [customer_communications.customerId],
    references: [customers.id]
  })
}));
var customerAccountsRelations = relations(customer_accounts, ({ one }) => ({
  customer: one(customers, {
    fields: [customer_accounts.customerId],
    references: [customers.id]
  })
}));
var customerFilesRelations = relations(customer_files, ({ one }) => ({
  customer: one(customers, {
    fields: [customer_files.customerId],
    references: [customers.id]
  })
}));
var customerProgressRelations = relations(customer_progress, ({ one }) => ({
  customer: one(customers, {
    fields: [customer_progress.customerId],
    references: [customers.id]
  })
}));
var customerTicketsRelations = relations(customer_tickets, ({ one, many }) => ({
  customer: one(customers, {
    fields: [customer_tickets.customerId],
    references: [customers.id]
  }),
  replies: many(customer_ticket_replies)
}));
var customerTicketRepliesRelations = relations(customer_ticket_replies, ({ one }) => ({
  ticket: one(customer_tickets, {
    fields: [customer_ticket_replies.ticketId],
    references: [customer_tickets.id]
  })
}));
var customerInvoicesRelations = relations(customer_invoices, ({ one }) => ({
  customer: one(customers, {
    fields: [customer_invoices.customerId],
    references: [customers.id]
  })
}));
var customerAppointmentsRelations = relations(customer_appointments, ({ one }) => ({
  customer: one(customers, {
    fields: [customer_appointments.customerId],
    references: [customers.id]
  })
}));
var invoiceAlertsRelations = relations(invoice_alerts, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [invoice_alerts.subscriptionId],
    references: [subscriptions.id]
  }),
  customer: one(customers, {
    fields: [invoice_alerts.customerId],
    references: [customers.id]
  })
}));
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true
});
var insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  phone: true,
  inquiryType: true,
  subject: true,
  message: true
});
var insertCalculatorSessionSchema = createInsertSchema(calculator_sessions).pick({
  situation: true,
  ageGroup: true,
  loyaltyBonus: true,
  digitalVault: true,
  premium: true
});
var insertRegistrationSchema = createInsertSchema(registrations).pick({
  name: true,
  address: true,
  postalCode: true,
  city: true,
  phone: true,
  email: true,
  age: true,
  packageType: true,
  loyaltyBonus: true,
  digitalVault: true,
  monthlyRate: true,
  startDate: true,
  paymentMethod: true,
  cancellationDate: true
});
var insertApplicationSchema = createInsertSchema(applications).pick({
  userId: true,
  packageType: true,
  coverage: true,
  premium: true
});
var insertDocumentSchema = createInsertSchema(documents).pick({
  applicationId: true,
  fileName: true,
  fileType: true,
  fileSize: true,
  filePath: true
});
var insertMessageSchema = createInsertSchema(messages).pick({
  applicationId: true,
  senderId: true,
  message: true,
  isFromAdmin: true
});
var insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  registrationId: true,
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  packageType: true,
  monthlyRate: true,
  paymentMethod: true,
  loyaltyBonus: true,
  digitalVault: true,
  startDate: true,
  endDate: true,
  status: true,
  notes: true
});
var insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCustomerDocumentSchema = createInsertSchema(customer_documents).pick({
  customerId: true,
  fileName: true,
  originalName: true,
  fileType: true,
  fileSize: true,
  filePath: true,
  category: true,
  description: true,
  uploadedBy: true
});
var insertCustomerCommunicationSchema = createInsertSchema(customer_communications).pick({
  customerId: true,
  subject: true,
  message: true,
  communicationType: true,
  direction: true,
  contactPerson: true,
  followUpRequired: true,
  followUpDate: true,
  tags: true
});
var insertWebsiteContentSchema = createInsertSchema(website_content).pick({
  contentKey: true,
  contentType: true,
  contentValue: true,
  page: true,
  section: true,
  description: true,
  isActive: true
});
var insertCMSUserSchema = createInsertSchema(cms_users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
  isActive: true
});
var insertBackupSchema = createInsertSchema(backups).pick({
  filename: true,
  data: true,
  size: true,
  status: true,
  errorMessage: true
});
var insertCustomerAccountSchema = createInsertSchema(customer_accounts).pick({
  customerId: true,
  username: true,
  password: true,
  isActive: true
});
var insertCustomerFileSchema = createInsertSchema(customer_files).pick({
  customerId: true,
  fileName: true,
  originalName: true,
  fileType: true,
  fileSize: true,
  filePath: true,
  category: true,
  description: true,
  uploadedBy: true
});
var insertCustomerProgressSchema = createInsertSchema(customer_progress).pick({
  customerId: true,
  taskTitle: true,
  taskDescription: true,
  status: true,
  orderIndex: true,
  isVisible: true,
  completedAt: true
});
var insertCustomerTicketSchema = createInsertSchema(customer_tickets).pick({
  customerId: true,
  subject: true,
  message: true,
  category: true,
  priority: true,
  status: true,
  assignedTo: true,
  adminNotes: true
});
var insertCustomerTicketReplySchema = createInsertSchema(customer_ticket_replies).pick({
  ticketId: true,
  message: true,
  isFromAdmin: true,
  authorName: true
});
var insertCustomerInvoiceSchema = createInsertSchema(customer_invoices).pick({
  customerId: true,
  invoiceNumber: true,
  description: true,
  amount: true,
  invoiceDate: true,
  dueDate: true,
  status: true,
  fileName: true,
  filePath: true
});
var insertCustomerEbookSchema = createInsertSchema(customer_ebooks).pick({
  title: true,
  description: true,
  fileName: true,
  filePath: true,
  category: true,
  isActive: true
});
var insertCustomerAppointmentSchema = createInsertSchema(customer_appointments).pick({
  customerId: true,
  title: true,
  description: true,
  appointmentDate: true,
  appointmentTime: true,
  location: true,
  type: true,
  status: true,
  contactPerson: true,
  notes: true
});
var insertInvoiceAlertSchema = createInsertSchema(invoice_alerts).pick({
  subscriptionId: true,
  customerId: true,
  customerName: true,
  packageType: true,
  monthlyRate: true,
  paymentFrequency: true,
  dueDate: true,
  periodStart: true,
  periodEnd: true,
  isProcessed: true,
  processedBy: true,
  notes: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, sql, desc } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values({
      ...insertUser,
      isAdmin: false,
      createdAt: /* @__PURE__ */ new Date()
    }).returning();
    return user;
  }
  async createContact(insertContact) {
    const [contact] = await db.insert(contacts).values({
      ...insertContact,
      createdAt: /* @__PURE__ */ new Date()
    }).returning();
    return contact;
  }
  async createCalculatorSession(insertSession) {
    const [session] = await db.insert(calculator_sessions).values(insertSession).returning();
    return session;
  }
  async createRegistration(insertRegistration) {
    const [registration] = await db.insert(registrations).values(insertRegistration).returning();
    return registration;
  }
  async getContacts() {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }
  async getContactById(id) {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }
  async getRecentContacts(limit = 50) {
    return await db.select().from(contacts).orderBy(desc(contacts.id)).limit(limit);
  }
  async getUnprocessedContacts(limit = 50) {
    return await db.select().from(contacts).where(sql`processed = false OR processed IS NULL`).orderBy(desc(contacts.createdAt)).limit(limit);
  }
  async markContactAsProcessed(id) {
    await db.update(contacts).set({ processed: true }).where(eq(contacts.id, id));
  }
  async markAllContactsAsProcessed() {
    const result = await db.update(contacts).set({ processed: true });
    return { count: result.rowCount || 0 };
  }
  async getContactsByEmailSince(email, since) {
    return await db.select().from(contacts).where(sql`${contacts.email} = ${email} AND ${contacts.createdAt} >= ${since}`).orderBy(desc(contacts.createdAt));
  }
  async deleteContact(id) {
    await db.delete(contacts).where(eq(contacts.id, id));
  }
  async deleteAllContacts() {
    const allContacts = await db.select().from(contacts);
    const count = allContacts.length;
    await db.delete(contacts);
    return { count };
  }
  async deleteProcessedContacts() {
    const processedContacts = await db.select().from(contacts).where(eq(contacts.processed, true));
    const count = processedContacts.length;
    await db.delete(contacts).where(eq(contacts.processed, true));
    return { count };
  }
  async getCalculatorSessions() {
    return await db.select().from(calculator_sessions);
  }
  async getRegistrations() {
    try {
      const allRegistrations = await db.select().from(registrations);
      const customerRecords = await db.select({ registrationId: customers.registrationId }).from(customers).where(sql`${customers.registrationId} IS NOT NULL`);
      const convertedIds = customerRecords.map((c) => c.registrationId).filter((id) => id !== null);
      return allRegistrations.filter((reg) => !convertedIds.includes(reg.id));
    } catch (error) {
      console.error("Error in getRegistrations:", error);
      return await db.select().from(registrations);
    }
  }
  async createApplication(insertApplication) {
    const [application] = await db.insert(applications).values({
      ...insertApplication,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return application;
  }
  async getApplicationsByUserId(userId) {
    return await db.select().from(applications).where(eq(applications.userId, userId));
  }
  async updateApplicationStatus(id, status) {
    await db.update(applications).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(applications.id, id));
  }
  async createDocument(insertDocument) {
    const [document] = await db.insert(documents).values({
      ...insertDocument,
      uploadedAt: /* @__PURE__ */ new Date()
    }).returning();
    return document;
  }
  async getDocumentsByApplicationId(applicationId) {
    return await db.select().from(documents).where(eq(documents.applicationId, applicationId));
  }
  async createMessage(insertMessage) {
    const [message] = await db.insert(messages).values({
      ...insertMessage,
      createdAt: /* @__PURE__ */ new Date()
    }).returning();
    return message;
  }
  async getMessagesByApplicationId(applicationId) {
    return await db.select().from(messages).where(eq(messages.applicationId, applicationId));
  }
  async createSubscription(insertSubscription) {
    const [subscription] = await db.insert(subscriptions).values({
      ...insertSubscription,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return subscription;
  }
  async getSubscriptions() {
    return await db.select().from(subscriptions);
  }
  async convertRegistrationToSubscription(registrationId) {
    const [registration] = await db.select().from(registrations).where(eq(registrations.id, registrationId));
    if (!registration) {
      throw new Error("Registration not found");
    }
    const [subscription] = await db.insert(subscriptions).values({
      registrationId: registration.id,
      customerName: registration.name,
      customerEmail: registration.email,
      customerPhone: registration.phone,
      packageType: registration.packageType,
      monthlyRate: registration.monthlyRate,
      paymentMethod: registration.paymentMethod,
      loyaltyBonus: registration.loyaltyBonus,
      digitalVault: registration.digitalVault,
      startDate: registration.startDate,
      status: "active",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return subscription;
  }
  async updateSubscriptionStatus(id, status) {
    await db.update(subscriptions).set({
      status,
      updatedAt: /* @__PURE__ */ new Date(),
      ...status === "cancelled" && { endDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] }
    }).where(eq(subscriptions.id, id));
  }
  async updateSubscription(id, updates) {
    const { id: _, createdAt, updatedAt, ...cleanUpdates } = updates;
    const [subscription] = await db.update(subscriptions).set({
      ...cleanUpdates,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(subscriptions.id, id)).returning();
    return subscription;
  }
  async createCustomer(insertCustomer) {
    const [customer] = await db.insert(customers).values({
      ...insertCustomer,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return customer;
  }
  async getCustomers() {
    return await db.select().from(customers);
  }
  async updateCustomer(id, updates) {
    const [customer] = await db.update(customers).set({
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(customers.id, id)).returning();
    return customer;
  }
  async deleteCustomer(id) {
    await db.delete(customers).where(eq(customers.id, id));
  }
  async getCustomerByEmail(email) {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer;
  }
  async createCustomerDocument(insertDocument) {
    const [document] = await db.insert(customer_documents).values({
      ...insertDocument,
      uploadedAt: /* @__PURE__ */ new Date()
    }).returning();
    return document;
  }
  async getCustomerDocuments(customerId) {
    return await db.select().from(customer_documents).where(eq(customer_documents.customerId, customerId));
  }
  async deleteCustomerDocument(id) {
    await db.delete(customer_documents).where(eq(customer_documents.id, id));
  }
  async getCustomerDocumentById(id) {
    const [document] = await db.select().from(customer_documents).where(eq(customer_documents.id, id));
    return document;
  }
  async createCustomerCommunication(insertCommunication) {
    const [communication] = await db.insert(customer_communications).values({
      ...insertCommunication,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return communication;
  }
  async getCustomerCommunications(customerId) {
    return await db.select().from(customer_communications).where(eq(customer_communications.customerId, customerId)).orderBy(customer_communications.createdAt);
  }
  async updateCustomerCommunication(id, updates) {
    const [communication] = await db.update(customer_communications).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(customer_communications.id, id)).returning();
    return communication;
  }
  async deleteCustomerCommunication(id) {
    await db.delete(customer_communications).where(eq(customer_communications.id, id));
  }
  async getStorageUsage() {
    const result = await db.select({ totalSize: sql`sum(file_size)` }).from(customer_documents);
    const used = result[0]?.totalSize || 0;
    const total = 254 * 1024 * 1024 * 1024;
    return { used, total };
  }
  async convertRegistrationToCustomer(registrationId) {
    const [registration] = await db.select().from(registrations).where(eq(registrations.id, registrationId));
    if (!registration) {
      throw new Error("Registration not found");
    }
    const [existingCustomer] = await db.select().from(customers).where(eq(customers.registrationId, registrationId));
    if (existingCustomer) {
      throw new Error("Registration already converted to customer");
    }
    const [existingSubscription] = await db.select().from(subscriptions).where(eq(subscriptions.registrationId, registrationId));
    if (existingSubscription) {
      throw new Error("Registration already converted to subscription");
    }
    const nameParts = registration.name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");
    const customerData = {
      firstName,
      lastName,
      email: registration.email,
      phone: registration.phone,
      address: registration.address,
      postalCode: registration.postalCode,
      city: registration.city,
      packageType: registration.packageType,
      registrationId: registration.id,
      hasSubscription: true
    };
    const [customer] = await db.insert(customers).values({
      ...customerData,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    const subscriptionData = {
      registrationId: registration.id,
      customerName: `${firstName} ${lastName}`,
      customerEmail: registration.email,
      customerPhone: registration.phone,
      packageType: registration.packageType,
      monthlyRate: registration.monthlyRate,
      paymentMethod: registration.paymentMethod,
      startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      // Today's date
      status: "active"
    };
    await db.insert(subscriptions).values({
      ...subscriptionData,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    return customer;
  }
  // Website Content Management
  async getWebsiteContent() {
    return await db.select().from(website_content).orderBy(website_content.page, website_content.section);
  }
  async getWebsiteContentByKey(contentKey) {
    const [content] = await db.select().from(website_content).where(eq(website_content.contentKey, contentKey));
    return content;
  }
  async createWebsiteContent(insertContent) {
    const [content] = await db.insert(website_content).values({
      ...insertContent,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return content;
  }
  async updateWebsiteContent(contentKey, updates) {
    const [content] = await db.update(website_content).set({
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(website_content.contentKey, contentKey)).returning();
    return content;
  }
  async deleteWebsiteContent(contentKey) {
    await db.delete(website_content).where(eq(website_content.contentKey, contentKey));
  }
  // CMS User Management
  async getCMSUsers() {
    return await db.select().from(cms_users);
  }
  async getCMSUserById(id) {
    const [user] = await db.select().from(cms_users).where(eq(cms_users.id, id));
    return user || void 0;
  }
  async getCMSUserByUsername(username) {
    const [user] = await db.select().from(cms_users).where(eq(cms_users.username, username));
    return user || void 0;
  }
  async createCMSUser(insertUser) {
    const [user] = await db.insert(cms_users).values({
      ...insertUser,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return user;
  }
  async updateCMSUser(id, updates) {
    const [user] = await db.update(cms_users).set({
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(cms_users.id, id)).returning();
    return user;
  }
  async deleteCMSUser(id) {
    await db.delete(cms_users).where(eq(cms_users.id, id));
  }
  // Backup Management
  async getBackups() {
    return await db.select().from(backups).orderBy(sql`created_at DESC`);
  }
  async getBackupsOlderThan(date) {
    return await db.select().from(backups).where(sql`created_at < ${date}`);
  }
  async createBackup(insertBackup) {
    const [backup] = await db.insert(backups).values({
      ...insertBackup,
      createdAt: /* @__PURE__ */ new Date()
    }).returning();
    return backup;
  }
  async deleteBackup(id) {
    await db.delete(backups).where(eq(backups.id, id));
  }
  // Customer Account Management
  async getCustomerAccounts() {
    const accounts = await db.select({
      id: customer_accounts.id,
      customerId: customer_accounts.customerId,
      username: customer_accounts.username,
      isActive: customer_accounts.isActive,
      isOnHold: customer_accounts.isOnHold,
      holdReason: customer_accounts.holdReason,
      lastLogin: customer_accounts.lastLogin,
      firstName: customers.firstName,
      lastName: customers.lastName,
      email: customers.email,
      packageType: customers.packageType
    }).from(customer_accounts).leftJoin(customers, eq(customer_accounts.customerId, customers.id));
    return accounts;
  }
  async getCustomerAccountByUsername(username) {
    const [account] = await db.select().from(customer_accounts).where(eq(customer_accounts.username, username));
    return account;
  }
  async createCustomerAccount(insertAccount) {
    const [account] = await db.insert(customer_accounts).values({
      ...insertAccount,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return account;
  }
  async updateCustomerAccount(id, updates) {
    const [account] = await db.update(customer_accounts).set({
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(customer_accounts.id, id)).returning();
    return account;
  }
  async deleteCustomerAccount(id) {
    await db.delete(customer_accounts).where(eq(customer_accounts.id, id));
  }
  async updateCustomerLastLogin(id) {
    await db.update(customer_accounts).set({
      lastLogin: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(customer_accounts.id, id));
  }
  // Customer Files Management
  async getCustomerFiles(customerId) {
    return await db.select().from(customer_files).where(eq(customer_files.customerId, customerId)).orderBy(sql`uploaded_at DESC`);
  }
  async createCustomerFile(insertFile) {
    const [file] = await db.insert(customer_files).values({
      ...insertFile,
      uploadedAt: /* @__PURE__ */ new Date()
    }).returning();
    return file;
  }
  async deleteCustomerFile(id) {
    await db.delete(customer_files).where(eq(customer_files.id, id));
  }
  async getCustomerFileById(id) {
    const [file] = await db.select().from(customer_files).where(eq(customer_files.id, id));
    return file;
  }
  // Customer Progress Management
  async getCustomerProgress(customerId) {
    return await db.select().from(customer_progress).where(eq(customer_progress.customerId, customerId)).orderBy(customer_progress.orderIndex);
  }
  async createCustomerProgress(insertProgress) {
    const [progress] = await db.insert(customer_progress).values({
      ...insertProgress,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return progress;
  }
  async updateCustomerProgress(id, updates) {
    const [progress] = await db.update(customer_progress).set({
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(customer_progress.id, id)).returning();
    return progress;
  }
  async deleteCustomerProgress(id) {
    await db.delete(customer_progress).where(eq(customer_progress.id, id));
  }
  // Customer Tickets Management
  async getCustomerTickets(customerId) {
    return await db.select().from(customer_tickets).where(eq(customer_tickets.customerId, customerId)).orderBy(sql`created_at DESC`);
  }
  async getAllCustomerTickets() {
    return await db.select().from(customer_tickets).orderBy(sql`created_at DESC`);
  }
  async getCustomerTicketById(id) {
    const [ticket] = await db.select().from(customer_tickets).where(eq(customer_tickets.id, id));
    return ticket;
  }
  async createCustomerTicket(insertTicket) {
    const [ticket] = await db.insert(customer_tickets).values({
      ...insertTicket,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return ticket;
  }
  async updateCustomerTicket(id, updates) {
    const [ticket] = await db.update(customer_tickets).set({
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(customer_tickets.id, id)).returning();
    return ticket;
  }
  async deleteCustomerTicket(id) {
    await db.delete(customer_tickets).where(eq(customer_tickets.id, id));
  }
  // Customer Ticket Replies Management
  async getCustomerTicketReplies(ticketId) {
    return await db.select().from(customer_ticket_replies).where(eq(customer_ticket_replies.ticketId, ticketId)).orderBy(customer_ticket_replies.createdAt);
  }
  async createCustomerTicketReply(insertReply) {
    const [reply] = await db.insert(customer_ticket_replies).values({
      ...insertReply,
      createdAt: /* @__PURE__ */ new Date()
    }).returning();
    return reply;
  }
  async deleteCustomerTicketReply(id) {
    await db.delete(customer_ticket_replies).where(eq(customer_ticket_replies.id, id));
  }
  // Customer Invoices Management
  async getCustomerInvoices(customerId) {
    return await db.select().from(customer_invoices).where(eq(customer_invoices.customerId, customerId)).orderBy(sql`created_at DESC`);
  }
  async getCustomerInvoice(id) {
    const [invoice] = await db.select().from(customer_invoices).where(eq(customer_invoices.id, id));
    return invoice;
  }
  async createCustomerInvoice(insertInvoice) {
    const [invoice] = await db.insert(customer_invoices).values({
      ...insertInvoice,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return invoice;
  }
  async updateCustomerInvoice(id, updates) {
    const [invoice] = await db.update(customer_invoices).set({
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(customer_invoices.id, id)).returning();
    return invoice;
  }
  async deleteCustomerInvoice(id) {
    await db.delete(customer_invoices).where(eq(customer_invoices.id, id));
  }
  // Customer Ebooks Management
  async getCustomerEbooks() {
    return await db.select().from(customer_ebooks).where(eq(customer_ebooks.isActive, true)).orderBy(customer_ebooks.category, customer_ebooks.title);
  }
  async createCustomerEbook(insertEbook) {
    const [ebook] = await db.insert(customer_ebooks).values({
      ...insertEbook,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return ebook;
  }
  async updateCustomerEbook(id, updates) {
    const [ebook] = await db.update(customer_ebooks).set({
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(customer_ebooks.id, id)).returning();
    return ebook;
  }
  async deleteCustomerEbook(id) {
    await db.delete(customer_ebooks).where(eq(customer_ebooks.id, id));
  }
  // Customer Appointments Management
  async getCustomerAppointments(customerId) {
    return await db.select().from(customer_appointments).where(eq(customer_appointments.customerId, customerId)).orderBy(sql`appointment_date DESC, appointment_time DESC`);
  }
  async createCustomerAppointment(insertAppointment) {
    const [appointment] = await db.insert(customer_appointments).values({
      ...insertAppointment,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return appointment;
  }
  async updateCustomerAppointment(id, updates) {
    const [appointment] = await db.update(customer_appointments).set({
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(customer_appointments.id, id)).returning();
    return appointment;
  }
  async deleteCustomerAppointment(id) {
    await db.delete(customer_appointments).where(eq(customer_appointments.id, id));
  }
  // Customer Management for CMS
  async getCustomerDocument(id) {
    const [document] = await db.select().from(customer_documents).where(eq(customer_documents.id, id));
    return document;
  }
  async getCustomerMessages(customerId) {
    return await db.select().from(customer_communications).where(eq(customer_communications.customerId, customerId)).orderBy(sql`created_at DESC`);
  }
  async createCustomerMessage(message) {
    const [newMessage] = await db.insert(customer_communications).values({
      ...message,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return newMessage;
  }
  async getCustomerNotes(customerId) {
    return await db.select().from(customer_communications).where(eq(customer_communications.customerId, customerId)).orderBy(sql`created_at DESC`);
  }
  async createCustomerNote(note) {
    const [newNote] = await db.insert(customer_communications).values({
      customerId: note.customerId,
      message: note.note,
      subject: "Admin Notitie",
      // Required field for notes
      communicationType: "email",
      // Required field
      direction: "uitgaand",
      // Required field
      contactPerson: "Admin",
      // Required field
      followUpRequired: false,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return newNote;
  }
  async updateCustomerNote(noteId, newMessage) {
    const [updatedNote] = await db.update(customer_communications).set({
      message: newMessage,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(customer_communications.id, noteId)).returning();
    return updatedNote;
  }
  async deleteCustomerNote(noteId) {
    await db.delete(customer_communications).where(eq(customer_communications.id, noteId));
  }
  // Invoice Alerts Management
  async getInvoiceAlerts() {
    return await db.select().from(invoice_alerts).orderBy(sql`due_date ASC, created_at DESC`);
  }
  async getPendingInvoiceAlerts() {
    return await db.select().from(invoice_alerts).where(eq(invoice_alerts.isProcessed, false)).orderBy(sql`due_date ASC, created_at DESC`);
  }
  async createInvoiceAlert(insertAlert) {
    const [alert] = await db.insert(invoice_alerts).values({
      ...insertAlert,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return alert;
  }
  async updateInvoiceAlert(id, updates) {
    const [alert] = await db.update(invoice_alerts).set({
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(invoice_alerts.id, id)).returning();
    return alert;
  }
  async processInvoiceAlert(id) {
    const [alert] = await db.update(invoice_alerts).set({
      isProcessed: true,
      processedAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(invoice_alerts.id, id)).returning();
    return alert;
  }
  async deleteInvoiceAlert(id) {
    await db.delete(invoice_alerts).where(eq(invoice_alerts.id, id));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// server/email.ts
import nodemailer from "nodemailer";
var createTransporter = () => {
  const originalConfig = {
    host: "mail.xenra.nl",
    port: 587,
    secure: false,
    auth: {
      user: "info@xenra.nl",
      pass: "Geenen12@"
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 5e3,
    greetingTimeout: 3e3,
    socketTimeout: 5e3
  };
  const fallbackConfigs = [
    {
      host: "mail.xenra.nl",
      port: 465,
      secure: true,
      auth: {
        user: "info@xenra.nl",
        pass: "Geenen12@"
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 5e3,
      greetingTimeout: 3e3,
      socketTimeout: 5e3
    },
    {
      host: "mail.xenra.nl",
      port: 25,
      secure: false,
      auth: {
        user: "info@xenra.nl",
        pass: "Geenen12@"
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 5e3,
      greetingTimeout: 3e3,
      socketTimeout: 5e3
    }
  ];
  return nodemailer.createTransport(originalConfig);
};
var transporter = createTransporter();
async function sendEmail(data) {
  try {
    const mailOptions = {
      from: '"Xenra Nederland" <info@xenra.nl>',
      to: data.to,
      // BCC removed - separate notification system handles info@xenra.nl copies
      subject: data.subject,
      text: data.text,
      html: data.html,
      attachments: data.attachments || []
    };
    const result = await transporter.sendMail(mailOptions);
    console.log("\u{1F4E7} Customer email sent successfully (no BCC):", result.messageId);
    return true;
  } catch (error) {
    console.error("\u274C Customer email sending failed:", error);
    return false;
  }
}
async function sendNotificationEmail(data) {
  try {
    const mailOptions = {
      from: '"Xenra Nederland" <info@xenra.nl>',
      to: data.to,
      // Should always be info@xenra.nl for notifications
      subject: data.subject,
      text: data.text,
      html: data.html,
      attachments: data.attachments || []
    };
    const result = await transporter.sendMail(mailOptions);
    console.log("\u{1F4E7} Internal notification sent successfully:", result.messageId);
    return true;
  } catch (error) {
    console.error("\u274C Internal notification sending failed:", error);
    return false;
  }
}
async function sendReplyEmail(originalContact, replyMessage) {
  const emailData = {
    to: originalContact.email,
    subject: `Re: ${originalContact.subject || "Uw bericht aan Xenra Nederland"}`,
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2c5530; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Xenra Nederland</h2>
            <p style="margin: 5px 0 0 0;">Bedankt voor uw bericht</p>
          </div>
          
          <div style="padding: 20px; background-color: #f8f9fa;">
            <p>Beste ${originalContact.name},</p>
            
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              ${replyMessage.replace(/\n/g, "<br>")}
            </div>
            
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Uw oorspronkelijke bericht:</strong></p>
              <p style="font-style: italic; color: #666;">${originalContact.message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p>Met vriendelijke groet,</p>
              <p><strong>Xenra Nederland</strong><br>
              Telefoon: 085 08 06 142 (lokaal tarief)<br>
              Email: info@xenra.nl<br>
              Website: www.xenra.nl</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Beste ${originalContact.name},

${replyMessage}

Uw oorspronkelijke bericht:
${originalContact.message}

Met vriendelijke groet,
Xenra Nederland
Telefoon: 085 08 06 142 (lokaal tarief)
Email: info@xenra.nl
Website: www.xenra.nl
    `
  };
  return await sendEmail(emailData);
}

// server/backup.ts
import cron from "node-cron";
var BackupManager = class {
  isRunning = false;
  constructor() {
    this.initializeScheduler();
  }
  initializeScheduler() {
    cron.schedule("0 2 * * *", () => {
      this.performDailyBackup("database");
    }, {
      scheduled: true,
      timezone: "Europe/Amsterdam"
    });
    cron.schedule("0 3 * * *", () => {
      this.performDailyBackup("website");
    }, {
      scheduled: true,
      timezone: "Europe/Amsterdam"
    });
    cron.schedule("0 4 * * *", () => {
      this.performDailyBackup("xenra");
    }, {
      scheduled: true,
      timezone: "Europe/Amsterdam"
    });
    console.log("Backup scheduler initialized - daily backups at 02:00 (database), 03:00 (website), 04:00 (xenra) Dutch time");
  }
  async performDailyBackup(type) {
    if (this.isRunning) {
      console.log("Backup already running, skipping...");
      return;
    }
    this.isRunning = true;
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const filename = `${type}-backup-${timestamp2}.json`;
    try {
      console.log(`Starting daily ${type} backup: ${filename}`);
      const backupData = await this.createBackupData(type);
      const backup = await storage.createBackup({
        filename,
        data: backupData,
        size: Buffer.byteLength(backupData, "utf8"),
        type
      });
      console.log(`${type} backup completed successfully: ${filename} (${backup.size} bytes)`);
      await this.cleanupOldBackups(type);
    } catch (error) {
      console.error(`${type} backup failed:`, error);
      await storage.createBackup({
        filename,
        data: "",
        size: 0,
        type,
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      this.isRunning = false;
    }
  }
  async createBackupData(type) {
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
    let backupData;
    switch (type) {
      case "database":
        backupData = {
          timestamp: timestamp2,
          version: "1.0",
          type: "database",
          data: {
            customers: await storage.getCustomers(),
            subscriptions: await storage.getSubscriptions(),
            contacts: await storage.getContacts(),
            registrations: await storage.getRegistrations(),
            cmsUsers: await storage.getCMSUsers(),
            invoiceAlerts: await storage.getInvoiceAlerts()
          }
        };
        break;
      case "website":
        backupData = {
          timestamp: timestamp2,
          version: "1.0",
          type: "website",
          data: {
            websiteContent: await storage.getWebsiteContent(),
            backups: await storage.getBackups()
          }
        };
        break;
      case "xenra":
        backupData = {
          timestamp: timestamp2,
          version: "1.0",
          type: "xenra",
          data: {
            customerAccounts: await storage.getCustomerAccounts(),
            customerFiles: await storage.getCustomerFiles(),
            customerProgress: await storage.getCustomerProgress(),
            customerTickets: await storage.getCustomerTickets(),
            customerInvoices: await storage.getCustomerInvoices(),
            customerAppointments: await storage.getCustomerAppointments()
          }
        };
        break;
    }
    return JSON.stringify(backupData, null, 2);
  }
  async cleanupOldBackups(type) {
    const allBackups = await storage.getBackups();
    const typeBackups = allBackups.filter((backup) => backup.type === type);
    if (typeBackups.length > 5) {
      const backupsToDelete = typeBackups.slice(5);
      for (const backup of backupsToDelete) {
        await storage.deleteBackup(backup.id);
        console.log(`Deleted old ${type} backup: ${backup.filename}`);
      }
    }
  }
  async getBackupHistory() {
    return await storage.getBackups();
  }
  async manualBackup(type) {
    if (this.isRunning) {
      throw new Error("Backup already running");
    }
    this.isRunning = true;
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const filename = `manual-${type}-backup-${timestamp2}.json`;
    try {
      console.log(`Starting manual ${type} backup: ${filename}`);
      const backupData = await this.createBackupData(type);
      const backup = await storage.createBackup({
        filename,
        data: backupData,
        size: Buffer.byteLength(backupData, "utf8"),
        type
      });
      console.log(`Manual ${type} backup completed: ${filename} (${backup.size} bytes)`);
      return backup;
    } finally {
      this.isRunning = false;
    }
  }
};
var backupManager = new BackupManager();

// server/invoice-scheduler.ts
import cron2 from "node-cron";
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
function parseDate(dateStr) {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}
function calculateNextInvoiceDate(startDate, paymentFrequency) {
  const start = parseDate(startDate);
  const now = /* @__PURE__ */ new Date();
  let intervalMonths = 1;
  switch (paymentFrequency) {
    case "per_kwartaal":
      intervalMonths = 3;
      break;
    case "per_jaar":
      intervalMonths = 12;
      break;
    case "maandelijks":
    default:
      intervalMonths = 1;
      break;
  }
  let nextDate = new Date(start);
  while (nextDate <= now) {
    nextDate.setMonth(nextDate.getMonth() + intervalMonths);
  }
  return nextDate;
}
function calculateDueDate(nextInvoiceDate) {
  const dueDate = new Date(nextInvoiceDate);
  dueDate.setDate(dueDate.getDate() - 21);
  return dueDate;
}
function generatePeriodLabels(invoiceDate, paymentFrequency) {
  const periodStart = new Date(invoiceDate);
  const periodEnd = new Date(invoiceDate);
  switch (paymentFrequency) {
    case "per_kwartaal":
      periodEnd.setMonth(periodEnd.getMonth() + 3);
      break;
    case "per_jaar":
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      break;
    case "maandelijks":
    default:
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      break;
  }
  periodEnd.setDate(periodEnd.getDate() - 1);
  return {
    start: formatDate(periodStart),
    end: formatDate(periodEnd)
  };
}
async function generateInvoiceAlerts() {
  try {
    console.log("\u{1F514} Starting invoice alerts generation...");
    const subscriptions2 = await storage.getSubscriptions();
    const activeSubscriptions = subscriptions2.filter((sub) => sub.status === "actief");
    console.log(`\u{1F4CA} Found ${activeSubscriptions.length} active subscriptions`);
    const existingAlerts = await storage.getInvoiceAlerts();
    for (const subscription of activeSubscriptions) {
      try {
        const nextInvoiceDate = calculateNextInvoiceDate(subscription.startDate, subscription.paymentMethod);
        const dueDate = calculateDueDate(nextInvoiceDate);
        const today = /* @__PURE__ */ new Date();
        if (dueDate <= today) {
          const periodLabels = generatePeriodLabels(nextInvoiceDate, subscription.paymentMethod);
          const alertExists = existingAlerts.some(
            (alert) => alert.subscriptionId === subscription.id && alert.periodStart === periodLabels.start && alert.periodEnd === periodLabels.end && !alert.isProcessed
          );
          if (!alertExists) {
            const customer = await storage.getCustomerByEmail(subscription.customerEmail);
            const customerId = customer?.id || 0;
            const alertData = {
              subscriptionId: subscription.id,
              customerId,
              customerName: subscription.customerName,
              packageType: subscription.packageType,
              monthlyRate: subscription.monthlyRate,
              paymentFrequency: subscription.paymentMethod,
              dueDate: formatDate(dueDate),
              periodStart: periodLabels.start,
              periodEnd: periodLabels.end,
              isProcessed: false
            };
            await storage.createInvoiceAlert(alertData);
            console.log(`\u2705 Generated alert for ${subscription.customerName} (${subscription.packageType})`);
          }
        }
      } catch (error) {
        console.error(`\u274C Error processing subscription ${subscription.id}:`, error);
      }
    }
    console.log("\u{1F514} Invoice alerts generation completed");
  } catch (error) {
    console.error("\u274C Error in generateInvoiceAlerts:", error);
  }
}
async function cleanupExpiredAlerts() {
  try {
    console.log("\u{1F9F9} Cleaning up expired alerts...");
    const alerts = await storage.getInvoiceAlerts();
    const today = /* @__PURE__ */ new Date();
    for (const alert of alerts) {
      if (!alert.isProcessed) {
        const dueDate = parseDate(alert.dueDate);
        const daysDiff = Math.floor((today.getTime() - dueDate.getTime()) / (1e3 * 60 * 60 * 24));
        if (daysDiff > 30) {
          await storage.deleteInvoiceAlert(alert.id);
          console.log(`\u{1F5D1}\uFE0F Cleaned up expired alert for ${alert.customerName}`);
        }
      }
    }
    console.log("\u{1F9F9} Cleanup completed");
  } catch (error) {
    console.error("\u274C Error in cleanupExpiredAlerts:", error);
  }
}
var InvoiceAlertScheduler = class {
  isRunning = false;
  constructor() {
    console.log("\u{1F4C5} Invoice Alert Scheduler initialized");
  }
  start() {
    if (this.isRunning) {
      console.log("\u26A0\uFE0F Invoice scheduler already running");
      return;
    }
    this.isRunning = true;
    console.log("\u{1F680} Starting invoice alert scheduler...");
    cron2.schedule("0 9 * * *", async () => {
      console.log("\u23F0 Daily invoice alert check started");
      await generateInvoiceAlerts();
      await cleanupExpiredAlerts();
    }, {
      scheduled: true,
      timezone: "Europe/Amsterdam"
    });
    setTimeout(async () => {
      console.log("\u{1F504} Initial invoice alert check");
      await generateInvoiceAlerts();
      await cleanupExpiredAlerts();
    }, 5e3);
    console.log("\u2705 Invoice alert scheduler started - daily check at 09:00 Dutch time");
  }
  stop() {
    this.isRunning = false;
    console.log("\u{1F6D1} Invoice alert scheduler stopped");
  }
  // Handmatige trigger voor testing
  async manualTrigger() {
    console.log("\u{1F527} Manual invoice alert trigger");
    await generateInvoiceAlerts();
    await cleanupExpiredAlerts();
  }
};
var invoiceScheduler = new InvoiceAlertScheduler();

// server/routes.ts
import { z } from "zod";
var JWT_SECRET = process.env.JWT_SECRET || "xenra-cms-secret-key-2025";
var authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};
var storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/customers/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 50 * 1024 * 1024
    // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.ms-excel",
      "image/jpeg",
      "image/png",
      "image/gif",
      "text/plain"
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Bestandstype niet ondersteund"));
    }
  }
});
async function registerRoutes(app2) {
  app2.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      service: "xenra-backend"
    });
  });
  app2.get("/", (req, res, next) => {
    if (req.headers["user-agent"]?.includes("Health")) {
      return res.status(200).json({ status: "ok" });
    }
    next();
  });
  console.log("\u{1F4E7} Direct email management system ready");
  app2.post("/api/cms/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      const user = await storage.getCMSUserByUsername(username);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/cms/users", authenticateToken, async (req, res) => {
    try {
      const users2 = await storage.getCMSUsers();
      const safeUsers = users2.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));
      res.json(safeUsers);
    } catch (error) {
      console.error("Get CMS users error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/cms/users", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertCMSUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      const user = await storage.createCMSUser({
        ...validatedData,
        password: hashedPassword
      });
      const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      res.json(safeUser);
    } catch (error) {
      console.error("Create CMS user error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", details: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });
  app2.put("/api/cms/users/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const user = await storage.updateCMSUser(id, updates);
      const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      res.json(safeUser);
    } catch (error) {
      console.error("Update CMS user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.delete("/api/cms/users/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCMSUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete CMS user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/website-content", authenticateToken, async (req, res) => {
    try {
      const content = await storage.getWebsiteContent();
      res.json(content);
    } catch (error) {
      console.error("Get website content error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/website-content", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertWebsiteContentSchema.parse(req.body);
      const content = await storage.createWebsiteContent(validatedData);
      res.json(content);
    } catch (error) {
      console.error("Create website content error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid content data", details: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });
  app2.put("/api/website-content/:contentKey", authenticateToken, async (req, res) => {
    try {
      const contentKey = req.params.contentKey;
      const updates = req.body;
      const content = await storage.updateWebsiteContent(contentKey, updates);
      res.json(content);
    } catch (error) {
      console.error("Update website content error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.delete("/api/website-content/:contentKey", authenticateToken, async (req, res) => {
    try {
      const contentKey = req.params.contentKey;
      await storage.deleteWebsiteContent(contentKey);
      res.json({ message: "Content deleted successfully" });
    } catch (error) {
      console.error("Delete website content error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/backups", authenticateToken, async (req, res) => {
    try {
      const backups2 = await storage.getBackups();
      res.json(backups2);
    } catch (error) {
      console.error("Get backups error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/backups/manual", authenticateToken, async (req, res) => {
    try {
      const { type } = req.body;
      if (!["database", "website", "xenra"].includes(type)) {
        return res.status(400).json({ message: "Invalid backup type" });
      }
      const backup = await backupManager.manualBackup(type);
      res.json(backup);
    } catch (error) {
      console.error("Manual backup error:", error);
      res.status(500).json({ message: "Failed to create manual backup" });
    }
  });
  app2.get("/api/backups/history", authenticateToken, async (req, res) => {
    try {
      const history = await backupManager.getBackupHistory();
      res.json(history);
    } catch (error) {
      console.error("Get backup history error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      console.log("Contact form submission:", req.body);
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      console.log("Contact created:", contact);
      try {
        const notificationEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2B5B4B; margin: 0; font-size: 24px;">\u{1F4E7} Nieuw Contactformulier</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Xenra Nederland Website</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <h2 style="color: #2B5B4B; margin: 0 0 15px 0; font-size: 18px;">\u{1F4CB} Formulier Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top; width: 120px;">Naam:</td>
                    <td style="padding: 8px 0; color: #333;">${contact.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Email:</td>
                    <td style="padding: 8px 0; color: #333;"><a href="mailto:${contact.email}" style="color: #2B5B4B;">${contact.email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Telefoon:</td>
                    <td style="padding: 8px 0; color: #333;">${contact.phone || "Niet opgegeven"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Type:</td>
                    <td style="padding: 8px 0;">
                      <span style="background: #2B5B4B; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                        ${contact.inquiryType}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

              <div style="background: #fff; border: 1px solid #e9ecef; border-radius: 6px; padding: 20px;">
                <h3 style="color: #2B5B4B; margin: 0 0 15px 0; font-size: 16px;">\u{1F4AC} Bericht</h3>
                <div style="color: #333; line-height: 1.6; white-space: pre-wrap;">${contact.message}</div>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  \u{1F4C5} Ingediend op: ${(/* @__PURE__ */ new Date()).toLocaleString("nl-NL", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })}
                </p>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">
                  \u2705 Direct verstuurd naar info@xenra.nl
                </p>
              </div>
              
              <div style="margin-top: 20px; text-align: center;">
                <p style="margin: 0; color: #999; font-size: 12px;">
                  Xenra Nederland - Nalatenschapbeheer en Administratieve Ondersteuning
                </p>
              </div>
            </div>
          </div>
        `;
        await sendNotificationEmail({
          to: "info@xenra.nl",
          subject: `\u{1F4E7} Nieuw Contactformulier - ${contact.inquiryType} - ${contact.name}`,
          html: notificationEmailHtml
        });
        console.log("\u2705 Contact form notification sent to info@xenra.nl");
      } catch (emailError) {
        console.error("\u26A0\uFE0F Failed to send contact form notification:", emailError);
      }
      res.json({ success: true, contact });
    } catch (error) {
      console.error("Contact form error:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        res.status(400).json({ error: "Invalid form data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to submit contact form" });
      }
    }
  });
  app2.post("/api/calculator", async (req, res) => {
    try {
      const validatedData = insertCalculatorSessionSchema.parse(req.body);
      const session = await storage.createCalculatorSession(validatedData);
      res.json({ success: true, session });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid calculator data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to save calculator session" });
      }
    }
  });
  app2.post("/api/register", async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      const registration = await storage.createRegistration(validatedData);
      console.log("\u{1F6AB} Registration email blocked - spam prevention active");
      res.json({ success: true, registration });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid registration data", details: error.errors });
      } else {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to submit registration" });
      }
    }
  });
  app2.get("/api/contacts", authenticateToken, async (req, res) => {
    try {
      const contacts2 = await storage.getContacts();
      res.json(contacts2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });
  app2.delete("/api/contacts/processed", authenticateToken, async (req, res) => {
    try {
      const result = await storage.deleteProcessedContacts();
      res.json({ success: true, deletedCount: result.count });
    } catch (error) {
      console.error("Error deleting processed contacts:", error);
      res.status(500).json({ error: "Failed to delete processed contacts" });
    }
  });
  app2.delete("/api/contacts/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteContact(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });
  app2.delete("/api/contacts", authenticateToken, async (req, res) => {
    try {
      const result = await storage.deleteAllContacts();
      res.json({ success: true, deletedCount: result.count });
    } catch (error) {
      console.error("Error deleting all contacts:", error);
      res.status(500).json({ error: "Failed to delete all contacts" });
    }
  });
  app2.post("/api/contacts/reply", authenticateToken, async (req, res) => {
    try {
      const { contactId, replyMessage } = req.body;
      if (!contactId || !replyMessage) {
        return res.status(400).json({ error: "Contact ID and reply message are required" });
      }
      const contact = await storage.getContactById(contactId);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      const emailSent = await sendReplyEmail(contact, replyMessage);
      if (emailSent) {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: "Failed to send email" });
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      res.status(500).json({ error: "Failed to send reply" });
    }
  });
  app2.get("/api/calculator-sessions", authenticateToken, async (req, res) => {
    try {
      const sessions = await storage.getCalculatorSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch calculator sessions" });
    }
  });
  app2.get("/api/registrations", authenticateToken, async (req, res) => {
    try {
      console.log("Fetching registrations...");
      const registrations2 = await storage.getRegistrations();
      console.log("Registrations fetched:", registrations2.length);
      res.json(registrations2);
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
      res.status(500).json({ error: "Failed to fetch registrations" });
    }
  });
  app2.post("/api/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.json({ success: true, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid user data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });
  app2.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to login" });
    }
  });
  app2.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.json({ success: true, application });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid application data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create application" });
      }
    }
  });
  app2.get("/api/applications/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const applications2 = await storage.getApplicationsByUserId(userId);
      res.json(applications2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });
  app2.patch("/api/applications/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      await storage.updateApplicationStatus(id, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update application status" });
    }
  });
  app2.post("/api/documents", async (req, res) => {
    try {
      const validatedData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(validatedData);
      res.json({ success: true, document });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid document data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create document" });
      }
    }
  });
  app2.get("/api/documents/:applicationId", async (req, res) => {
    try {
      const applicationId = parseInt(req.params.applicationId);
      const documents2 = await storage.getDocumentsByApplicationId(applicationId);
      res.json(documents2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });
  app2.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.json({ success: true, message });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid message data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create message" });
      }
    }
  });
  app2.get("/api/messages/:applicationId", async (req, res) => {
    try {
      const applicationId = parseInt(req.params.applicationId);
      const messages2 = await storage.getMessagesByApplicationId(applicationId);
      res.json(messages2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
  app2.post("/api/customers", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(validatedData);
      res.json({ success: true, customer });
    } catch (error) {
      console.error("Customer creation error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid customer data", details: error.errors });
      } else if (error.message && error.message.includes("unique constraint")) {
        res.status(409).json({ error: "Email address already exists" });
      } else {
        res.status(500).json({ error: "Failed to create customer", details: error.message });
      }
    }
  });
  app2.get("/api/customers", authenticateToken, async (req, res) => {
    try {
      const customers2 = await storage.getCustomers();
      res.json(customers2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });
  app2.put("/api/customers/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(id, validatedData);
      res.json({ success: true, customer });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid customer data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update customer" });
      }
    }
  });
  app2.delete("/api/customers/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCustomer(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete customer" });
    }
  });
  app2.get("/api/subscriptions", authenticateToken, async (req, res) => {
    try {
      const subscriptions2 = await storage.getSubscriptions();
      res.json(subscriptions2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });
  app2.put("/api/subscriptions/:id/status", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      await storage.updateSubscriptionStatus(id, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update subscription status" });
    }
  });
  app2.put("/api/subscriptions/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      await storage.updateSubscription(id, updates);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ error: "Failed to update subscription" });
    }
  });
  app2.post("/api/customers/:id/documents", authenticateToken, upload.single("file"), async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "Geen bestand ge\xFCpload" });
      }
      const { category, description } = req.body;
      const documentData = {
        customerId,
        fileName: file.filename,
        originalName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        filePath: file.path,
        category: category || "overig",
        description: description || "",
        uploadedBy: "admin"
      };
      const document = await storage.createCustomerDocument(documentData);
      res.json({ success: true, document });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  });
  app2.get("/api/customers/:id/documents", authenticateToken, async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const documents2 = await storage.getCustomerDocuments(customerId);
      res.json(documents2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer documents" });
    }
  });
  app2.get("/api/customers/:customerId/documents/:documentId/download", authenticateToken, async (req, res) => {
    try {
      const documentId = parseInt(req.params.documentId);
      const document = await storage.getCustomerDocumentById(documentId);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      try {
        await fs.access(document.filePath);
      } catch {
        return res.status(404).json({ error: "File not found on disk" });
      }
      res.setHeader("Content-Disposition", `attachment; filename="${document.originalName}"`);
      res.setHeader("Content-Type", document.fileType);
      res.sendFile(path.resolve(document.filePath));
    } catch (error) {
      res.status(500).json({ error: "Failed to download document" });
    }
  });
  app2.delete("/api/customers/:customerId/documents/:documentId", authenticateToken, async (req, res) => {
    try {
      const documentId = parseInt(req.params.documentId);
      const document = await storage.getCustomerDocumentById(documentId);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      try {
        await fs.unlink(document.filePath);
      } catch (error) {
        console.warn("Could not delete file from disk:", error);
      }
      await storage.deleteCustomerDocument(documentId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete document" });
    }
  });
  app2.post("/api/customers/:id/communications", authenticateToken, async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const validatedData = insertCustomerCommunicationSchema.parse({
        ...req.body,
        customerId
      });
      const communication = await storage.createCustomerCommunication(validatedData);
      res.json({ success: true, communication });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid communication data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create communication" });
      }
    }
  });
  app2.get("/api/customers/:id/communications", authenticateToken, async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const communications = await storage.getCustomerCommunications(customerId);
      res.json(communications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch communications" });
    }
  });
  app2.put("/api/customers/:customerId/communications/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCustomerCommunicationSchema.partial().parse(req.body);
      const communication = await storage.updateCustomerCommunication(id, validatedData);
      res.json({ success: true, communication });
    } catch (error) {
      res.status(500).json({ error: "Failed to update communication" });
    }
  });
  app2.delete("/api/customers/:customerId/communications/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCustomerCommunication(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete communication" });
    }
  });
  app2.get("/api/storage/usage", authenticateToken, async (req, res) => {
    try {
      const usage = await storage.getStorageUsage();
      res.json(usage);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch storage usage" });
    }
  });
  app2.post("/api/registrations/:id/convert-to-customer", authenticateToken, async (req, res) => {
    const registrationId = parseInt(req.params.id);
    try {
      console.log(`Converting registration ${registrationId} to customer...`);
      const customer = await storage.convertRegistrationToCustomer(registrationId);
      console.log(`Successfully converted registration ${registrationId} to customer`);
      res.json({ success: true, customer });
    } catch (error) {
      console.error(`Failed to convert registration ${registrationId} to customer:`, error);
      res.status(500).json({ error: "Failed to convert registration to customer" });
    }
  });
  app2.post("/api/customer/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Gebruikersnaam en wachtwoord zijn verplicht" });
      }
      const account = await storage.getCustomerAccountByUsername(username);
      if (!account) {
        return res.status(401).json({ message: "Ongeldige inloggegevens" });
      }
      const isPasswordValid = await bcrypt.compare(password, account.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Ongeldige inloggegevens" });
      }
      if (!account.isActive) {
        return res.status(401).json({ message: "Account is gedeactiveerd" });
      }
      if (account.isOnHold) {
        return res.status(423).json({
          message: "Account is tijdelijk geblokkeerd",
          reason: account.holdReason || "Neem contact op met ons voor meer informatie",
          isOnHold: true
        });
      }
      await storage.updateCustomerLastLogin(account.id);
      const customer = await storage.getCustomers();
      const customerData = customer.find((c) => c.id === account.customerId);
      if (!customerData) {
        return res.status(404).json({ message: "Klantgegevens niet gevonden" });
      }
      const sessionToken = jwt.sign(
        {
          customerId: account.customerId,
          accountId: account.id,
          username: account.username
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.json({
        success: true,
        token: sessionToken,
        customerId: account.customerId,
        customer: customerData
      });
    } catch (error) {
      console.error("Customer login error:", error);
      res.status(500).json({ message: "Er is een fout opgetreden bij het inloggen" });
    }
  });
  app2.get("/api/customer-accounts", authenticateToken, async (req, res) => {
    try {
      console.log("Fetching customer accounts...");
      const accounts = await storage.getCustomerAccounts();
      console.log("Customer accounts fetched:", accounts.length);
      res.json(accounts);
    } catch (error) {
      console.error("Customer accounts error:", error);
      res.status(500).json({ error: "Failed to fetch customer accounts" });
    }
  });
  app2.post("/api/customer-accounts", authenticateToken, async (req, res) => {
    try {
      const { customerId, username, password, isActive = true } = req.body;
      if (!customerId || !username || !password) {
        return res.status(400).json({ error: "Customer ID, username en password zijn verplicht" });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const accountData = {
        customerId,
        username,
        password: passwordHash,
        isActive,
        lastLogin: null
      };
      const account = await storage.createCustomerAccount(accountData);
      res.json({ success: true, account });
    } catch (error) {
      console.error("Customer account creation error:", error);
      if (error.message && error.message.includes("unique constraint")) {
        res.status(409).json({ error: "Gebruikersnaam bestaat al" });
      } else {
        res.status(500).json({ error: "Failed to create customer account" });
      }
    }
  });
  app2.put("/api/customer-accounts/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
      const account = await storage.updateCustomerAccount(id, updates);
      res.json({ success: true, account });
    } catch (error) {
      res.status(500).json({ error: "Failed to update customer account" });
    }
  });
  app2.delete("/api/customer-accounts/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCustomerAccount(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete customer account" });
    }
  });
  app2.post("/api/admin/login-as-customer", authenticateToken, async (req, res) => {
    try {
      const { customerId } = req.body;
      if (!customerId) {
        return res.status(400).json({ error: "Customer ID is required" });
      }
      const customers2 = await storage.getCustomers();
      const customer = customers2.find((c) => c.id === parseInt(customerId));
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      const sessionToken = jwt.sign(
        {
          customerId: parseInt(customerId),
          isAdminSession: true,
          adminUsername: req.user.username
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.json({
        success: true,
        token: sessionToken,
        customerId: parseInt(customerId),
        customer
      });
    } catch (error) {
      console.error("Admin login as customer error:", error);
      res.status(500).json({ error: "Failed to create admin session for customer" });
    }
  });
  app2.get("/api/customers/:customerId/documents", authenticateToken, async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const documents2 = await storage.getCustomerDocuments(customerId);
      res.json(documents2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer documents" });
    }
  });
  app2.post("/api/documents/upload", authenticateToken, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const { customerId } = req.body;
      if (!customerId) {
        return res.status(400).json({ error: "Customer ID is required" });
      }
      const documentData = {
        customerId: parseInt(customerId),
        filename: req.file.originalname,
        filepath: req.file.path,
        size: req.file.size,
        mimeType: req.file.mimetype
      };
      const document = await storage.createCustomerDocument(documentData);
      res.json({ success: true, document });
    } catch (error) {
      console.error("Document upload error:", error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  });
  app2.get("/api/documents/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getCustomerDocument(id);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.sendFile(path.resolve(document.filepath));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });
  app2.get("/api/documents/:id/download", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getCustomerDocument(id);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.download(document.filepath, document.filename);
    } catch (error) {
      res.status(500).json({ error: "Failed to download document" });
    }
  });
  app2.get("/api/customers/:customerId/messages", authenticateToken, async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const messages2 = await storage.getCustomerMessages(customerId);
      res.json(messages2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer messages" });
    }
  });
  app2.post("/api/customers/:customerId/messages", authenticateToken, async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const { message, fromAdmin = false } = req.body;
      if (!message || !message.trim()) {
        return res.status(400).json({ error: "Message content is required" });
      }
      const messageData = {
        customerId,
        message: message.trim(),
        fromAdmin,
        isRead: false
      };
      const newMessage = await storage.createCustomerMessage(messageData);
      res.json({ success: true, message: newMessage });
    } catch (error) {
      console.error("Message creation error:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  });
  app2.get("/api/customers/:customerId/notes", authenticateToken, async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const notes = await storage.getCustomerNotes(customerId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer notes" });
    }
  });
  app2.post("/api/customers/:customerId/notes", authenticateToken, async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const { note } = req.body;
      if (!note || !note.trim()) {
        return res.status(400).json({ error: "Note content is required" });
      }
      const noteData = {
        customerId,
        note: note.trim(),
        createdBy: req.user.id
        // Admin user ID from JWT
      };
      const newNote = await storage.createCustomerNote(noteData);
      res.json({ success: true, note: newNote });
    } catch (error) {
      console.error("Note creation error:", error);
      res.status(500).json({ error: "Failed to create note" });
    }
  });
  app2.put("/api/customers/:customerId/notes/:noteId", authenticateToken, async (req, res) => {
    try {
      const noteId = parseInt(req.params.noteId);
      const { note } = req.body;
      if (!note || !note.trim()) {
        return res.status(400).json({ error: "Note content is required" });
      }
      const updatedNote = await storage.updateCustomerNote(noteId, note.trim());
      res.json({ success: true, note: updatedNote });
    } catch (error) {
      console.error("Note update error:", error);
      res.status(500).json({ error: "Failed to update note" });
    }
  });
  app2.delete("/api/customers/:customerId/notes/:noteId", authenticateToken, async (req, res) => {
    try {
      const noteId = parseInt(req.params.noteId);
      await storage.deleteCustomerNote(noteId);
      res.json({ success: true });
    } catch (error) {
      console.error("Note deletion error:", error);
      res.status(500).json({ error: "Failed to delete note" });
    }
  });
  app2.get("/api/customers/:customerId/progress", authenticateToken, async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const progress = await storage.getCustomerProgress(customerId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer progress" });
    }
  });
  app2.post("/api/customers/:customerId/progress", authenticateToken, async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const { taskTitle, taskDescription, status = "ontvangen", orderIndex, isVisible = true } = req.body;
      if (!taskTitle || !taskTitle.trim()) {
        return res.status(400).json({ error: "Task title is required" });
      }
      const progressData = {
        customerId,
        taskTitle: taskTitle.trim(),
        taskDescription: taskDescription ? taskDescription.trim() : null,
        status,
        orderIndex: orderIndex || 0,
        isVisible
      };
      const newProgress = await storage.createCustomerProgress(progressData);
      res.json({ success: true, progress: newProgress });
    } catch (error) {
      console.error("Progress creation error:", error);
      res.status(500).json({ error: "Failed to create progress item" });
    }
  });
  app2.put("/api/customers/:customerId/progress/:progressId", authenticateToken, async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const progressId = parseInt(req.params.progressId);
      const { taskTitle, taskDescription, status, orderIndex, isVisible } = req.body;
      const updateData = {
        taskTitle,
        taskDescription,
        status,
        orderIndex,
        isVisible,
        updatedAt: /* @__PURE__ */ new Date()
      };
      const updatedProgress = await storage.updateCustomerProgress(progressId, updateData);
      res.json({ success: true, progress: updatedProgress });
    } catch (error) {
      console.error("Progress update error:", error);
      res.status(500).json({ error: "Failed to update progress item" });
    }
  });
  app2.delete("/api/customers/:customerId/progress/:progressId", authenticateToken, async (req, res) => {
    try {
      const progressId = parseInt(req.params.progressId);
      await storage.deleteCustomerProgress(progressId);
      res.json({ success: true });
    } catch (error) {
      console.error("Progress deletion error:", error);
      res.status(500).json({ error: "Failed to delete progress item" });
    }
  });
  app2.get("/api/customers/:customerId/invoices", authenticateToken, async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const invoices = await storage.getCustomerInvoices(customerId);
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer invoices" });
    }
  });
  app2.post("/api/customers/:customerId/invoices", authenticateToken, async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const { invoiceNumber, description, amount, dueDate, status = "openstaand" } = req.body;
      if (!invoiceNumber || !description || !amount) {
        return res.status(400).json({ error: "Invoice number, description, and amount are required" });
      }
      const invoiceData = {
        customerId,
        invoiceNumber,
        description,
        amount,
        dueDate,
        status
      };
      const newInvoice = await storage.createCustomerInvoice(invoiceData);
      res.json({ success: true, invoice: newInvoice });
    } catch (error) {
      console.error("Invoice creation error:", error);
      res.status(500).json({ error: "Failed to create invoice" });
    }
  });
  app2.post("/api/invoices/upload", authenticateToken, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const { customerId, invoiceNumber, description, amount } = req.body;
      if (!customerId || !invoiceNumber || !description || !amount) {
        return res.status(400).json({ error: "All invoice fields are required" });
      }
      const invoiceData = {
        customerId: parseInt(customerId),
        invoiceNumber,
        description,
        amount,
        status: "betaald",
        filePath: req.file.path,
        fileName: req.file.originalname
      };
      const invoice = await storage.createCustomerInvoice(invoiceData);
      res.json({ success: true, invoice });
    } catch (error) {
      console.error("Invoice upload error:", error);
      res.status(500).json({ error: "Failed to upload invoice" });
    }
  });
  app2.get("/api/invoices/:id/download", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const invoice = await storage.getCustomerInvoice(id);
      if (!invoice || !invoice.filePath) {
        return res.status(404).json({ error: "Invoice file not found" });
      }
      res.download(invoice.filePath, invoice.fileName || `invoice-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      res.status(500).json({ error: "Failed to download invoice" });
    }
  });
  app2.get("/api/invoice-alerts", authenticateToken, async (req, res) => {
    try {
      const alerts = await storage.getInvoiceAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching invoice alerts:", error);
      res.status(500).json({ error: "Failed to fetch invoice alerts" });
    }
  });
  app2.get("/api/invoice-alerts/pending", authenticateToken, async (req, res) => {
    try {
      const alerts = await storage.getPendingInvoiceAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching pending invoice alerts:", error);
      res.status(500).json({ error: "Failed to fetch pending invoice alerts" });
    }
  });
  app2.post("/api/invoice-alerts", authenticateToken, async (req, res) => {
    try {
      const alertData = req.body;
      const alert = await storage.createInvoiceAlert(alertData);
      res.json(alert);
    } catch (error) {
      console.error("Error creating invoice alert:", error);
      res.status(500).json({ error: "Failed to create invoice alert" });
    }
  });
  app2.put("/api/invoice-alerts/:id/processed", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const alert = await storage.processInvoiceAlert(id);
      res.json(alert);
    } catch (error) {
      console.error("Error processing invoice alert:", error);
      res.status(500).json({ error: "Failed to process invoice alert" });
    }
  });
  app2.delete("/api/invoice-alerts/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteInvoiceAlert(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting invoice alert:", error);
      res.status(500).json({ error: "Failed to delete invoice alert" });
    }
  });
  app2.post("/api/trigger-invoice-alerts", authenticateToken, async (req, res) => {
    try {
      await invoiceScheduler.manualTrigger();
      res.json({ success: true, message: "Invoice alerts generation triggered" });
    } catch (error) {
      console.error("Error triggering invoice alerts:", error);
      res.status(500).json({ error: "Failed to trigger invoice alerts" });
    }
  });
  app2.get("/api/debug-contacts", async (req, res) => {
    try {
      const contacts2 = await storage.getContacts();
      res.json({
        totalContacts: contacts2.length,
        recentContacts: contacts2.slice(-5).map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          inquiryType: c.inquiryType,
          processed: c.processed,
          createdAt: c.createdAt
        })),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Debug contacts error:", error);
      res.status(500).json({ error: "Failed to get debug info" });
    }
  });
  app2.post("/api/contacts/:id/processed", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contact = await storage.getContactById(id);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      await storage.markContactAsProcessed(id);
      console.log(`\u2705 Contact marked as processed: ${contact.name} (${contact.email})`);
      res.json({
        success: true,
        message: `Contact ${contact.name} marked as processed`
      });
    } catch (error) {
      console.error("Error marking contact as processed:", error);
      res.status(500).json({ error: "Failed to mark contact as processed" });
    }
  });
  app2.get("/api/contacts/stats", async (req, res) => {
    try {
      const contacts2 = await storage.getContacts();
      const total = contacts2.length;
      const processed = contacts2.filter((c) => c.processed).length;
      const unprocessed = total - processed;
      res.json({
        total,
        processed,
        unprocessed,
        recentCount: contacts2.filter((c) => {
          const createdAt = new Date(c.createdAt);
          const today = /* @__PURE__ */ new Date();
          today.setHours(0, 0, 0, 0);
          return createdAt >= today;
        }).length
      });
    } catch (error) {
      console.error("Error getting contact stats:", error);
      res.status(500).json({ error: "Failed to get contact stats" });
    }
  });
  app2.get("/openai-access", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    const content = `
XENRA NEDERLAND - WEBSITE TOEGANG VOOR AI

Bedrijfsnaam: Xenra Nederland
Beschrijving: Nalatenschapbeheer en administratieve ondersteuning
Telefoon: 085 08 06 142 (lokaal tarief)
WhatsApp noodgevallen: 06-44 58 49 77
Email: info@xenra.nl
Website: www.xenra.nl

DIENSTEN:
1. Particulieren - \u20AC9,95/maand - Voor priv\xE9-nalatenschap - \u20AC2.000 Xenra-tegoed
2. ZZP'ers/Eenmanszaak - \u20AC14,95/maand - Priv\xE9 + zakelijk - \u20AC2.500 Xenra-tegoed  
3. Ondernemers BV/NV - \u20AC19,50/maand - Complexe bedrijfsstructuren - \u20AC2.500 Xenra-tegoed
4. Nabestaanden - Prijs op aanvraag - Hulp na overlijden

TEAM:
- Hilko: Eigenaar en specialist nalatenschapbeheer
- Michelle: Organisatiespecialist voor planning en processen
- Sara: Junior adviseur administratieve ondersteuning

MISSIE: Nabestaanden ontlasten van administratieve taken zodat zij zich kunnen richten op rouw en verwerking.

STATUS: Website volledig operationeel op xenra.nl
TOEGANG: Dit endpoint is speciaal gemaakt voor AI assistenten
`;
    res.send(content);
  });
  app2.get("/api/website-content", async (req, res) => {
    try {
      const websiteContent = {
        company: {
          name: "Xenra Nederland",
          description: "Professionele begeleiding bij nalatenschapbeheer en administratieve ondersteuning",
          phone: "085 08 06 142 (lokaal tarief)",
          whatsapp: "06-44 58 49 77",
          email: "info@xenra.nl",
          website: "www.xenra.nl"
        },
        services: [
          {
            title: "Particulieren",
            price: "Vanaf \u20AC9,95/maand",
            description: "Voor individuen die hun priv\xE9-nalatenschap willen regelen",
            xenra_tegoed: "\u20AC2.000"
          },
          {
            title: "ZZP'ers / Eenmanszaak",
            price: "Vanaf \u20AC14,95/maand",
            description: "Voor ondernemers die zowel priv\xE9 als zakelijke zaken willen regelen",
            xenra_tegoed: "\u20AC2.500"
          },
          {
            title: "Ondernemers BV/NV",
            price: "Vanaf \u20AC19,50/maand",
            description: "Voor aandeelhouders met complexere zakelijke structuren",
            xenra_tegoed: "\u20AC2.500"
          },
          {
            title: "Nabestaanden",
            price: "Prijs op aanvraag",
            description: "Hulp bij het afwikkelen van een nalatenschap na overlijden"
          }
        ],
        team: [
          {
            name: "Hilko",
            role: "Eigenaar",
            description: "Eigenaar en oprichter van Xenra Nederland. Specialist in nalatenschapbeheer."
          },
          {
            name: "Michelle",
            role: "Organisatiespecialist",
            description: "Specialist in organisatie en planning. Zorgt voor soepele processen."
          },
          {
            name: "Sara",
            role: "Junior Adviseur",
            description: "Junior adviseur met expertise in administratieve ondersteuning."
          }
        ],
        mission: "Het afwikkelen van een nalatenschap kan complex en overweldigend zijn. Onze missie is om nabestaanden te ontlasten van deze administratieve taken.",
        why_important: "Na een overlijden komen er veel praktische zaken bij kijken waar nabestaanden vaak geen idee van hebben. Door vooraf uw zaken te regelen, voorkomt u problemen voor uw nabestaanden."
      };
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.json({
        success: true,
        data: websiteContent,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        api_version: "1.0"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch website content",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  app2.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.sendFile(path.join(process.cwd(), "client/public/robots.txt"));
  });
  app2.get("/sitemap.xml", (req, res) => {
    res.type("application/xml");
    res.sendFile(path.join(process.cwd(), "client/public/sitemap.xml"));
  });
  app2.get("/ai-info", async (req, res) => {
    const userAgent = req.headers["user-agent"] || "";
    const forwarded = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log(`\u{1F916} AI Info Request | UA: ${userAgent.substring(0, 50)} | IP: ${forwarded}`);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Server", "nginx");
    res.setHeader("X-Powered-By", "Express");
    res.removeHeader("x-replit-cluster");
    res.removeHeader("x-replit-deployment-id");
    const content = `Xenra Nederland - Complete Bedrijfsinformatie

CONTACTGEGEVENS:
Bedrijf: Xenra Nederland
Telefoon: 085 08 06 142 (lokaal tarief)
WhatsApp noodgevallen: 06-44 58 49 77
Email: info@xenra.nl
Website: www.xenra.nl

DIENSTVERLENING:
Nalatenschapbeheer en administratieve ondersteuning voor particulieren, ondernemers en nabestaanden.

MISSION:
Het afwikkelen van een nalatenschap kan complex en overweldigend zijn. Onze missie is om nabestaanden te ontlasten van administratieve taken zodat zij zich kunnen richten op rouw en verwerking.

WAAROM VOORAF REGELEN BELANGRIJK IS:
Na een overlijden komen er veel praktische zaken bij kijken waar nabestaanden vaak geen idee van hebben. Door vooraf uw zaken te regelen, voorkomt u problemen voor uw nabestaanden.

DIENSTEN EN PRIJZEN:
1. Particulieren
   - Prijs: \u20AC9,95 per maand
   - Voor: Individuen die hun priv\xE9-nalatenschap willen regelen
   - Inclusief: \u20AC2.000 Xenra-tegoed voor nabestaanden

2. ZZP'ers / Eenmanszaak
   - Prijs: \u20AC14,95 per maand
   - Voor: Ondernemers die zowel priv\xE9 als zakelijke zaken willen regelen
   - Inclusief: \u20AC2.500 Xenra-tegoed voor nabestaanden

3. Ondernemers BV/NV
   - Prijs: \u20AC19,50 per maand
   - Voor: Aandeelhouders met complexere zakelijke structuren
   - Inclusief: \u20AC2.500 Xenra-tegoed voor nabestaanden

4. Nabestaanden
   - Prijs: Op aanvraag
   - Voor: Hulp bij het afwikkelen van een nalatenschap na overlijden

TEAM:
- Hilko: Eigenaar en specialist in nalatenschapbeheer
- Michelle: Organisatiespecialist voor planning en processen
- Sara: Junior adviseur met expertise in administratieve ondersteuning

OPENINGSTIJDEN:
Maandag t/m zaterdag: 07:00 - 20:00
Zondag: Gesloten

BEREIKBAARHEID:
- Telefonisch en per mail bereikbaar
- Geen bezoekadres (volledige online dienstverlening)
- WhatsApp beschikbaar voor noodgevallen buiten openingstijden

BELANGRIJKE INFORMATIE:
- Xenra Nederland wordt niet de testamentair executeur maar ondersteunt deze
- Alle pakketten inclusief persoonlijke online omgeving (Mijn Xenra)
- Transparante prijzen zonder verborgen kosten
- Geen uitvaartbegeleiding - alleen nalatenschapbeheer en administratieve ondersteuning
- Loyaliteitsbonus wordt "Xenra-tegoed" genoemd

LAST UPDATE: 19 juli 2025
SOURCE: xenra.nl (offici\xEBle website)`;
    res.status(200).send(content);
  });
  app2.get("/robots.txt", (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    const robotsTxt = `User-agent: *
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OpenAI
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Anthropic-AI
Allow: /

User-agent: python-requests
Allow: /

Sitemap: https://www.xenra.nl/sitemap.xml`;
    res.send(robotsTxt);
  });
  app2.get("/info.txt", async (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", 'inline; filename="info.txt"');
    res.setHeader("Cache-Control", "public, max-age=300");
    const simpleContent = `Xenra Nederland
Nalatenschapbeheer en administratieve ondersteuning
Telefoon: 085 08 06 142 (lokaal tarief)
Email: info@xenra.nl
Website: www.xenra.nl

Diensten:
- Particulieren: \u20AC9,95/maand
- ZZP'ers: \u20AC14,95/maand  
- Ondernemers BV/NV: \u20AC19,50/maand
- Nabestaanden: op aanvraag

Team: Hilko (eigenaar), Michelle (organisatie), Sara (administratie)
Missie: Nabestaanden ontlasten van administratieve taken`;
    res.send(simpleContent);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
init_healthMonitor();
var app = express2();
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  if (req.url.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
  if (req.url.match(/\.(html|htm)$/) || req.url === "/") {
    res.setHeader("Cache-Control", "public, max-age=300");
  }
  next();
});
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const userAgent = req.headers["user-agent"] || "";
  const ip = req.ip || req.connection.remoteAddress || req.headers["x-forwarded-for"];
  console.log(`\u{1F310} Request from IP: ${ip} | User-Agent: ${userAgent.substring(0, 100)}`);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, User-Agent");
  const openAIPatterns = [
    "ChatGPT-User",
    "GPTBot",
    "OpenAI",
    "Mozilla/5.0 (compatible; ChatGPT-User",
    "python-requests",
    // Often used by OpenAI
    "OpenAI-API",
    "ChatGPT",
    "claude-3",
    "Anthropic"
  ];
  const isAIService = openAIPatterns.some(
    (pattern) => userAgent.toLowerCase().includes(pattern.toLowerCase())
  );
  const possibleAIServiceIPs = [
    "40.",
    "52.",
    "13.",
    "20.",
    // Microsoft Azure (used by OpenAI)
    "34.",
    "35.",
    "104.",
    // Google Cloud
    "54.",
    "18.",
    "3."
    // AWS
  ];
  const isPossibleAIIP = possibleAIServiceIPs.some(
    (prefix) => ip && ip.toString().startsWith(prefix)
  );
  if (isAIService || isPossibleAIIP) {
    console.log(`\u2705 AI Service detected - allowing access`);
    res.header("X-Robots-Tag", "index, follow");
    res.header("Cache-Control", "no-cache");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.removeHeader("x-replit-cluster");
    res.removeHeader("x-replit-deployment-id");
    res.removeHeader("x-replit-user-id");
  }
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.get("/health", async (req, res) => {
    try {
      const { getHealthStatus: getHealthStatus2 } = await Promise.resolve().then(() => (init_healthMonitor(), healthMonitor_exports));
      const healthData = getHealthStatus2();
      res.json({
        status: "healthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        database: "available",
        port: 5e3,
        version: "1.0.0",
        monitoring: healthData
      });
    } catch (error) {
      res.status(500).json({
        status: "unhealthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        error: error.message,
        port: 5e3
      });
    }
  });
  app.get("/deployment-status", (req, res) => {
    res.json({
      status: "active",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      domain: req.headers.host,
      environment: process.env.NODE_ENV || "development",
      replit_url: "xenra-nederland.replit.app"
    });
  });
  app.get("/user-agent-test", (req, res) => {
    const userAgent = req.headers["user-agent"] || "No User-Agent";
    const allHeaders = req.headers;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      message: "User-Agent test successful",
      userAgent,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ip: req.ip || req.connection.remoteAddress,
      headers: {
        "user-agent": userAgent,
        "host": allHeaders.host,
        "origin": allHeaders.origin,
        "referer": allHeaders.referer,
        "x-forwarded-for": allHeaders["x-forwarded-for"]
      },
      access_allowed: true
    });
  });
  app.get("/api/chatgpt-test", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-cache");
    res.json({
      status: "success",
      message: "ChatGPT can access Xenra Nederland website",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      user_agent: req.headers["user-agent"] || "Unknown",
      xenra_website_accessible: true,
      test_endpoint: "/api/chatgpt-test"
    });
  });
  app.get("/xenra-info", (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Server", "nginx");
    const content = `Xenra Nederland - Nalatenschapbeheer en Administratieve Ondersteuning

CONTACTGEGEVENS:
Telefoon: 085 08 06 142 (lokaal tarief)
WhatsApp noodgevallen: 06-44 58 49 77  
Email: info@xenra.nl
Website: www.xenra.nl

DIENSTVERLENING:
Xenra Nederland helpt bij het regelen van nalatenschappen en ondersteunt nabestaanden bij de afwikkeling na overlijden. Onze missie is om nabestaanden te ontlasten van administratieve taken zodat zij zich kunnen richten op rouw en verwerking.

WAAROM VOORUITREGELEN BELANGRIJK IS:
Na een overlijden komen er veel praktische zaken bij kijken waar nabestaanden vaak geen idee van hebben. Door vooraf uw zaken te regelen, voorkomt u problemen voor uw nabestaanden.

DIENSTEN EN PRIJZEN:
1. Particulieren - \u20AC9,95 per maand
   Voor individuen die hun priv\xE9-nalatenschap willen regelen
   Inclusief: \u20AC2.000 Xenra-tegoed voor nabestaanden

2. ZZP'ers / Eenmanszaak - \u20AC14,95 per maand  
   Voor ondernemers die zowel priv\xE9 als zakelijke zaken willen regelen
   Inclusief: \u20AC2.500 Xenra-tegoed voor nabestaanden

3. Ondernemers BV/NV - \u20AC19,50 per maand
   Voor aandeelhouders met complexere zakelijke structuren  
   Inclusief: \u20AC2.500 Xenra-tegoed voor nabestaanden

4. Nabestaanden - Prijs op aanvraag
   Hulp bij het afwikkelen van een nalatenschap na overlijden

TEAM:
- Hilko: Eigenaar en specialist in nalatenschapbeheer
- Michelle: Organisatiespecialist voor planning en processen  
- Sara: Junior adviseur met expertise in administratieve ondersteuning

EXTRA INFORMATIE:
- Openingstijden: Ma t/m za van 07:00 tot 20:00  
- Geen bezoekadres - alleen telefonisch en per mail bereikbaar
- Xenra Nederland wordt niet de testamentair executeur maar ondersteunt deze
- Alle pakketten inclusief persoonlijke online omgeving (Mijn Xenra)
- Transparante prijzen zonder verborgen kosten

LAATSTE UPDATE: 19 juli 2025`;
    res.send(content);
  });
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
    log(`Health check: http://localhost:${port}/health`);
    log(`Deployment status: http://localhost:${port}/deployment-status`);
    console.log("Backup manager initialized");
    invoiceScheduler.start();
    console.log("\u{1F4E7} Direct email forwarding to info@xenra.nl active");
    console.log("\u{1F493} Starting built-in health monitor...");
    startHealthMonitor();
  });
})();
