# Email Integration Quick Reference

Quick guide for using the Resend email service in your Convex backend.

---

## 📧 Available Email Functions

All email functions are internal mutations that can be called via `ctx.scheduler.runAfter()` or directly from internal functions.

### 1. Verification Email

```typescript
await ctx.scheduler.runAfter(0, internal.emailService.sendVerificationEmail, {
  to: "user@example.com",
  verificationUrl: "https://yourapp.com/verify?token=abc123",
  userName: "John Doe", // Optional
});
```

### 2. Password Reset Email

```typescript
await ctx.scheduler.runAfter(0, internal.emailService.sendPasswordResetEmail, {
  to: "user@example.com",
  resetUrl: "https://yourapp.com/reset-password?token=xyz789",
  userName: "John Doe", // Optional
});
```

### 3. Magic Link Email

```typescript
await ctx.scheduler.runAfter(0, internal.emailService.sendMagicLinkEmail, {
  to: "user@example.com",
  magicLinkUrl: "https://yourapp.com/auth/magic-link?token=def456",
  userName: "John Doe", // Optional
});
```

### 4. Welcome Email

```typescript
await ctx.scheduler.runAfter(0, internal.emailService.sendWelcomeEmail, {
  to: "user@example.com",
  userName: "John Doe",
});
```

### 5. Test Email

```typescript
// Sends to delivered@resend.dev for testing
await ctx.scheduler.runAfter(0, internal.emailService.sendTestEmail, {});
```

---

## 🚀 Quick Setup

### 1. Environment Variables

Add to your Convex dashboard environment variables:

```bash
# Required
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional (for webhook tracking)
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Automatically set by Convex
NODE_ENV=production  # or development
SITE_URL=https://yourapp.com
```

### 2. Get Your API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys** in the dashboard
3. Click **Create API Key**
4. Copy the key (starts with `re_`)
5. Paste into Convex environment variables

### 3. Test It Works

Run this in the Convex dashboard:

```typescript
internal.emailService.sendTestEmail
```

Check the [Resend dashboard](https://resend.com/emails) for the test email.

---

## 🔧 Configuration

### Test Mode (Development)

In development (`NODE_ENV=development`):
- ✅ Emails only sent to `delivered@resend.dev`
- ✅ Safe to test without spamming users
- ✅ Can use labels: `delivered+test123@resend.dev`

### Production Mode

In production (`NODE_ENV=production`):
- ✅ Emails sent to any address
- ✅ Automatically enabled based on environment
- ⚠️ Make sure your Resend account is verified

---

## 📊 Webhook Setup (Optional)

Track email delivery, bounces, and opens.

### 1. Get Webhook URL

Your webhook endpoint is:
```
https://[your-deployment].convex.site/resend-webhook
```

Find your deployment name in the Convex dashboard URL.

### 2. Configure in Resend

1. Go to [Resend Webhooks](https://resend.com/webhooks)
2. Click **Add Webhook**
3. Paste your webhook URL
4. Enable **all** `email.*` events:
   - `email.sent`
   - `email.delivered`
   - `email.bounced`
   - `email.complained`
   - `email.opened`
   - `email.clicked`
5. Click **Create Webhook**
6. Copy the **Signing Secret**
7. Add to Convex as `RESEND_WEBHOOK_SECRET`

---

## 💡 Usage Examples

### Example 1: Send Verification After Signup

```typescript
// convex/users.ts
export const signUp = mutation({
  args: { 
    email: v.string(), 
    name: v.string(),
    password: v.string() 
  },
  handler: async (ctx, args) => {
    // 1. Create user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      emailVerified: false,
      createdAt: Date.now(),
    });

    // 2. Create verification token
    const token = crypto.randomUUID();
    await ctx.db.insert("verifications", {
      identifier: args.email,
      value: token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // 3. Send verification email
    const verificationUrl = `${backendEnv.SITE_URL}/verify-email?token=${token}`;
    await ctx.scheduler.runAfter(
      0, 
      internal.emailService.sendVerificationEmail,
      {
        to: args.email,
        verificationUrl,
        userName: args.name,
      }
    );

    return { userId };
  },
});
```

### Example 2: Password Reset Flow

```typescript
// convex/auth.ts
export const requestPasswordReset = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // 1. Find user
    const user = await ctx.db
      .query("users")
      .withIndex("byemail", (q) => q.eq("email", args.email))
      .first();
      
    if (!user) {
      // Don't reveal if email exists
      return { success: true };
    }

    // 2. Create reset token
    const token = crypto.randomUUID();
    await ctx.db.insert("passwordResetTokens", {
      userId: user._id,
      token,
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
      used: false,
    });

    // 3. Send reset email
    const resetUrl = `${backendEnv.SITE_URL}/reset-password?token=${token}`;
    await ctx.scheduler.runAfter(
      0,
      internal.emailService.sendPasswordResetEmail,
      {
        to: args.email,
        resetUrl,
        userName: user.name,
      }
    );

    return { success: true };
  },
});
```

### Example 3: Welcome Email After Verification

```typescript
// convex/users.ts
export const verifyEmail = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    // 1. Find verification token
    const verification = await ctx.db
      .query("verifications")
      .filter((q) => q.eq(q.field("value"), args.token))
      .first();
      
    if (!verification || verification.expiresAt < Date.now()) {
      throw new Error("Invalid or expired token");
    }

    // 2. Update user
    const user = await ctx.db
      .query("users")
      .withIndex("byemail", (q) => q.eq("email", verification.identifier))
      .first();
      
    if (user) {
      await ctx.db.patch(user._id, { emailVerified: true });
      
      // 3. Send welcome email
      await ctx.scheduler.runAfter(
        0,
        internal.emailService.sendWelcomeEmail,
        {
          to: user.email,
          userName: user.name,
        }
      );
    }

    // 4. Delete verification token
    await ctx.db.delete(verification._id);

    return { success: true };
  },
});
```

---

## 🎨 Email Templates

All emails use professional HTML templates with:
- ✨ Gradient purple/blue header
- 📱 Mobile responsive design
- 🔘 Clear call-to-action buttons
- ⏰ Expiration warnings
- 🔒 Security notes

You can customize templates in `convex/emailService.ts`.

---

## 🐛 Troubleshooting

### Problem: Emails Not Sending

**Solution 1**: Check API key
```bash
# In Convex dashboard, verify RESEND_API_KEY is set
```

**Solution 2**: Check test mode
- In development, emails only go to `delivered@resend.dev`
- Set `NODE_ENV=production` to send to real addresses

**Solution 3**: Check Resend dashboard
- Go to [resend.com/emails](https://resend.com/emails)
- Look for errors or failed sends

### Problem: Webhook Not Receiving Events

**Solution 1**: Verify URL
- Should be: `https://[deployment].convex.site/resend-webhook`
- Test in Resend dashboard with "Test Webhook"

**Solution 2**: Check secret
- `RESEND_WEBHOOK_SECRET` must match Resend dashboard

**Solution 3**: Enable events
- Make sure all `email.*` events are enabled in webhook settings

### Problem: Emails Going to Spam

**Solution 1**: Verify domain
- Add and verify your sending domain in Resend
- Use `noreply@yourdomain.com` instead of `noreply@techlete.app`

**Solution 2**: Add SPF/DKIM records
- Resend provides DNS records to add to your domain
- This significantly improves deliverability

---

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Convex Component](https://github.com/get-convex/convex-resend)
- [Email Best Practices](https://resend.com/docs/knowledge-base/best-practices)

---

## 🎯 Next Steps

1. [ ] Set up `RESEND_API_KEY` in Convex dashboard
2. [ ] Run test email to verify configuration
3. [ ] Integrate verification email into signup flow
4. [ ] Setup webhook for email tracking (optional)
5. [ ] Customize email templates with your branding
6. [ ] Add your own domain in Resend for better deliverability

---

**Need help?** Check the full documentation in `PHASE_6_RESEND_EMAIL_SETUP.md`
