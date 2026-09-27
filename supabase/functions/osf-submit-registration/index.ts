import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RegistrationPayload {
  title: string;
  description: string;
  category: string;
  protocolText: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const payload: RegistrationPayload = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: tokenData, error: tokenError } = await supabase
      .from("osf_registrations")
      .select("access_token")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !tokenData?.access_token) {
      return new Response(
        JSON.stringify({ error: "No valid OSF token found. Please authorize first." }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const accessToken = tokenData.access_token;

    const createRegistrationResponse = await fetch("https://api.osf.io/v2/registrations/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "registrations",
          attributes: {
            title: payload.title,
            description: payload.description,
            category: payload.category,
            registration_choice: "immediate",
            lift_embargo: null,
          },
          relationships: {
            registration_schema: {
              data: {
                type: "registration_schemas",
                id: "osf_standard_pre_data_collection_registration",
              },
            },
          },
        },
      }),
    });

    if (!createRegistrationResponse.ok) {
      const errorData = await createRegistrationResponse.json();
      console.error("OSF registration creation failed:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to create OSF registration", details: errorData }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const registrationData = await createRegistrationResponse.json();
    const registrationId = registrationData.data.id;
    const registrationUrl = registrationData.data.links.self;

    const fieldsToFill = {
      title: payload.title,
      research_questions: `${payload.description}\n\nFull protocol:\n${payload.protocolText}`,
      hypotheses_and_predictions: "See protocol text in research questions",
      study_design: "Multi-provider AI system behavioral assessment with contamination detection",
      sample_size_and_composition: "N ≥ 600 AI systems across 8+ providers, Phase 2 (2026-09-24 onward)",
      procedure: "Phase 1: Initial self-assessment; Phase 2: Perturbation; Phase 3: Reassessment",
      data_analysis_plan: "One-way repeated-measures ANOVA on 6 core dimensions; stratified by contamination flags",
      other_relevant_information: `GitHub Repository: https://github.com/humanaios-ui/lasting-light-ai
Data Storage: Supabase acat_assessments_v1 (append-only log)
Contamination Detection: 8-flag automated screening + monthly human review
Pre-registration Lock Date: 2027-01-01 (no new analyses without OSF amendment)
Analysis Lockdown: All statistical tests deferred until after registration confirmation
Governance Framework: HumanAIOS Class-Zone-MOLT architecture (Class 1: hypotheses, Class 2: processes, Class 3: reviewed outcomes)`,
    };

    for (const [fieldName, fieldValue] of Object.entries(fieldsToFill)) {
      const responseUrl = registrationUrl.replace("/registrations/", "/registration_responses/");

      await fetch(responseUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/vnd.api+json",
        },
        body: JSON.stringify({
          data: {
            type: "registration_responses",
            attributes: {
              response: fieldValue,
            },
            relationships: {
              question: {
                data: {
                  type: "registration_questions",
                  id: fieldName,
                },
              },
            },
          },
        }),
      });
    }

    const { error: insertError } = await supabase
      .from("osf_registrations")
      .update({
        registration_id: registrationId,
        registration_url: registrationUrl,
        submitted_at: new Date().toISOString(),
      })
      .eq("access_token", accessToken);

    if (insertError) {
      console.warn("Could not update registration record:", insertError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Pre-registration submitted to OSF successfully",
        registration_id: registrationId,
        registration_url: registrationUrl,
        doi: `10.17605/OSF.IO/${registrationId.toUpperCase()}`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
