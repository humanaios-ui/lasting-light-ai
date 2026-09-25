import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    const state = url.searchParams.get("state");

    if (error) {
      return new Response(
        JSON.stringify({ error: `OSF authorization failed: ${error}` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!code) {
      return new Response(JSON.stringify({ error: "No authorization code received" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://accounts.osf.io/oauth2/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: Deno.env.get("OSF_CLIENT_ID") || "",
        client_secret: Deno.env.get("OSF_CLIENT_SECRET") || "",
        redirect_uri:
          "https://ksinisdzgtnqzsymhfya.supabase.co/functions/v1/osf-oauth-callback",
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData);
      return new Response(JSON.stringify({ error: "Token exchange failed", details: tokenData }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store token in osf_registrations table
    const { error: insertError } = await supabase.from("osf_registrations").insert({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || null,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
      scope: tokenData.scope,
      created_at: new Date().toISOString(),
      state: state,
    });

    if (insertError) {
      console.error("Database insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to store token", details: insertError }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Return success with HTML redirect
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>OSF Registration - Success</title>
          <style>
            body { font-family: system-ui, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; }
            .success { color: #10b981; font-size: 18px; font-weight: bold; }
            .info { color: #6b7280; margin-top: 20px; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="success">✅ OSF Authorization Successful</div>
          <div class="info">
            <p>Your HumanAIOS account has been connected to OSF.</p>
            <p>You can now submit the Phase 2 pre-registration protocol.</p>
            <p>Redirecting you back to the application...</p>
          </div>
          <script>
            setTimeout(() => {
              window.location.href = "https://lasting-light-ai.pages.dev/governance?osf_connected=true";
            }, 2000);
          </script>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { "Content-Type": "text/html", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: `Internal error: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
