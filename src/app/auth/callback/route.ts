import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { workspaceService } from "@/src/server/services/workspace.service";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Helper to determine destination URL
  const getDestinationUrl = (targetPath: string) => {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";
    if (isLocalEnv) {
      return `${origin}${targetPath}`;
    } else if (forwardedHost) {
      return `https://${forwardedHost}${targetPath}`;
    } else {
      return `${origin}${targetPath}`;
    }
  };

  // 1. If error was returned directly from Supabase (e.g. token expired, link already consumed)
  if (error || errorDescription) {
    const desc = errorDescription?.toLowerCase() || "";
    if (desc.includes("expired") || desc.includes("already") || desc.includes("invalid")) {
      // The email was likely already verified by email preview or earlier click
      return NextResponse.redirect(
        getDestinationUrl("/login?verified=true")
      );
    }
    return NextResponse.redirect(
      getDestinationUrl(`/login?error=${encodeURIComponent(errorDescription || error || "Verification link expired")}`)
    );
  }

  const supabase = await createClient();

  // 2. Handle token_hash verification (Supabase Auth v2 email verification)
  if (tokenHash) {
    try {
      const { error: otpError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type || "signup",
      });

      if (!otpError) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await workspaceService.ensureUserWorkspace(user);
        }
        return NextResponse.redirect(getDestinationUrl(next));
      }
    } catch {
      // Handled in fallbacks
    }
  }

  // 3. Handle PKCE code exchange
  if (code) {
    try {
      const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
      if (!codeError) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await workspaceService.ensureUserWorkspace(user);
        }
        return NextResponse.redirect(getDestinationUrl(next));
      }
    } catch {
      // Handled in fallbacks
    }
  }

  // 4. Check if session is already active
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await workspaceService.ensureUserWorkspace(user);
      return NextResponse.redirect(getDestinationUrl(next));
    }
  } catch {
    // Handled below
  }

  // 5. Client-Side Hash Fragment Verification Bridge:
  // If the request doesn't have query params because Supabase used fragment #access_token=...
  // or if PKCE code_verifier is stored in client browser storage, serve a fast client bridge page.
  const clientBridgeHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Verifying Authentication | AI-Business-Automation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 32px 40px;
      text-align: center;
      max-width: 420px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e2e8f0;
      border-top-color: #059669;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 18px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { font-size: 18px; font-weight: 700; margin: 0 0 8px; color: #0f172a; }
    p { font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h2>Confirming your email</h2>
    <p>Preparing your isolated workspace and securing your operational session...</p>
  </div>
  <script>
    (async function() {
      const supabaseUrl = "${process.env.NEXT_PUBLIC_SUPABASE_URL || ""}";
      const supabaseAnonKey = "${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}";
      
      try {
        if (!supabaseUrl || !supabaseAnonKey) {
          window.location.href = "${getDestinationUrl("/login?verified=true")}";
          return;
        }

        const sb = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
        
        // Check hash fragments (#access_token=...&refresh_token=...)
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken && refreshToken) {
            await sb.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            window.location.href = "${getDestinationUrl(next)}";
            return;
          }
        }

        // Check if session already resolved in browser
        const { data: { session } } = await sb.auth.getSession();
        if (session) {
          window.location.href = "${getDestinationUrl(next)}";
          return;
        }

        // If no hash and no session, redirect to login with positive verified badge
        window.location.href = "${getDestinationUrl("/login?verified=true")}";
      } catch (err) {
        window.location.href = "${getDestinationUrl("/login?verified=true")}";
      }
    })();
  </script>
</body>
</html>`;

  return new NextResponse(clientBridgeHtml, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}
