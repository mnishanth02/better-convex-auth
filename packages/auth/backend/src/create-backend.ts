import { createConvexAuth } from "@auth/core";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { defaultVerificationEmailTemplate } from "./templates.js";
import type { ConvexAuthBackendConfig } from "./types.js";

export function createConvexAuthBackend(ctx: unknown, config: ConvexAuthBackendConfig) {
  const {
    adapter,
    baseURL,
    trustedOrigins = [baseURL],
    emailPassword,
    socialProviders,
    emailVerification,
    session,
    rateLimit,
    isDevelopment = false,
  } = config;

  const authConfig: Record<string, unknown> = {
    adapter,
    baseURL,
    trustedOrigins,
  };

  if (emailPassword) {
    authConfig.emailPassword = {
      enabled: emailPassword.enabled,
      requireEmailVerification: emailPassword.requireEmailVerification ?? !isDevelopment,
      minPasswordLength: emailPassword.minPasswordLength ?? 8,
      maxPasswordLength: emailPassword.maxPasswordLength ?? 128,
      autoSignIn: emailPassword.autoSignIn ?? true,
      disableSignUp: emailPassword.disableSignUp ?? false,
    };
  }

  if (socialProviders) {
    const providers: Record<string, unknown> = {};
    if (socialProviders.google) providers.google = socialProviders.google;
    if (socialProviders.github) providers.github = socialProviders.github;
    if (socialProviders.apple) providers.apple = socialProviders.apple;
    if (socialProviders.discord) providers.discord = socialProviders.discord;
    authConfig.socialProviders = providers;
  }

  if (emailVerification) {
    const template = emailVerification.template ?? defaultVerificationEmailTemplate;
    authConfig.emailVerification = {
      sendVerificationEmail: async (params: { user: unknown; url: string }) => {
        const user = params.user as { email: string; name?: string };
        const actionCtx = requireActionCtx(ctx as never);
        const htmlContent = template.html
          ? template.html({ user, url: params.url })
          : defaultVerificationEmailTemplate.html({ user, url: params.url });
        const textContent = template.text
          ? template.text({ user, url: params.url })
          : defaultVerificationEmailTemplate.text({ user, url: params.url });
        const resendClient = emailVerification.resend as {
          sendEmail: (ctx: unknown, params: Record<string, string>) => Promise<void>;
        };
        await resendClient.sendEmail(actionCtx, {
          from: `${emailVerification.from.name} <${emailVerification.from.email}>`,
          to: user.email,
          subject: template.subject ?? defaultVerificationEmailTemplate.subject,
          html: htmlContent,
          text: textContent,
        });
      },
      sendOnSignUp: emailVerification.sendOnSignUp ?? !isDevelopment,
      autoSignInAfterVerification: emailVerification.autoSignInAfterVerification ?? true,
      expiresIn: emailVerification.expiresIn ?? 86400,
    };
  }
  if (session) {
    authConfig.session = {
      expiresIn: session.expiresIn ?? 604800,
      updateAge: session.updateAge ?? 86400,
    };
  }

  if (rateLimit) {
    authConfig.rateLimit = {
      enabled: rateLimit.enabled,
      window: rateLimit.window ?? 60,
      max: rateLimit.max ?? 10,
    };
  }

  authConfig.isDevelopment = isDevelopment;

  return createConvexAuth(ctx, authConfig as never);
}
