export { createConvexAuthBackend } from "./create-backend.js";
export type {
  ConvexAuthBackendConfig,
  ConvexAuthBackendResult,
  EmailTemplateParams,
  EmailTemplates,
} from "./types.js";
export {
  defaultEmailTemplates,
  defaultVerificationEmailTemplate,
  defaultPasswordResetTemplate,
  defaultMagicLinkTemplate,
} from "./templates.js";
