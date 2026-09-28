/**
 * Contamination Review Integration Example
 * Shows how to integrate with n8n, Make.com, or other platforms
 */

import ContaminationReviewManager, {
  ContaminationAssessment,
  ContaminationReviewRun,
  SubmissionSource
} from '../lib/contamination-review';

// ============================================================================
// Example 1: Basic Usage - Fetch and Log Contaminated Assessments
// ============================================================================
export async function example1_basicFetchAndLog() {
  const manager = new ContaminationReviewManager(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    parseInt(process.env.GITHUB_RUN_ID || '0')
  );

  // Fetch assessments flagged for review
  const contaminated = await manager.fetchContaminatedAssessments(50, 'FLAG_FOR_REVIEW');

  // Create log entries
  const logEntries = manager.createLogEntries(contaminated);
  const formatted = manager.formatLogEntries(logEntries);

  console.log('Contaminated assessments found:');
  formatted.forEach(line => console.log(line));

  return logEntries;
}

// ============================================================================
// Example 2: n8n Integration - Webhook Trigger
// ============================================================================
export async function example2_n8nWebhookIntegration() {
  /**
   * n8n Configuration:
   * 1. Create a Webhook trigger node
   * 2. Set Method: POST
   * 3. Set Response: Custom
   * 4. Use this handler in a JavaScript code block
   */

  return {
    handler: (webhookData: any) => {
      // Extract submission data from webhook
      const { submission_id, data_batch, source } = webhookData.body;

      // Format payload for GitHub repository dispatch
      const githubPayload = {
        event_type: 'data-submission',
        client_payload: {
          submission_id,
          batch_count: data_batch?.length || 0,
          submission_source: source || 'api'
        }
      };

      return {
        status: 'success',
        payload: githubPayload,
        message: `Submission ${submission_id} received, workflow triggered`
      };
    }
  };
}

// ============================================================================
// Example 3: Make.com Integration - Data Processing
// ============================================================================
export async function example3_makeComIntegration() {
  /**
   * Make.com Configuration:
   * 1. Use HTTP module to listen for webhook
   * 2. Parse incoming JSON
   * 3. Transform data into GitHub dispatch format
   * 4. Send to GitHub API
   */

  return {
    // Step 1: Receive from upstream service
    webhookReceiver: (payload: any) => ({
      entity_ids: payload.assessments.map((a: any) => a.id),
      submission_time: new Date().toISOString(),
      source: payload.source || 'batch'
    }),

    // Step 2: Transform for GitHub
    transformForGitHub: (data: any) => ({
      url: 'https://api.github.com/repos/your-owner/lasting-light-ai/dispatches',
      method: 'POST',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: {
        event_type: 'data-submission',
        client_payload: {
          submission_source: data.source,
          batch_size: data.entity_ids.length
        }
      }
    }),

    // Step 3: Handle response
    handleResponse: (response: any) => ({
      status: response.status,
      message: 'Workflow dispatched to GitHub Actions'
    })
  };
}

// ============================================================================
// Example 4: Programmatic Submission - Direct API Call
// ============================================================================
export async function example4_programmaticSubmission() {
  const manager = new ContaminationReviewManager(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  // Trigger workflow via GitHub API
  const result = await manager.triggerWorkflow(
    process.env.GITHUB_TOKEN!,
    'your-owner',
    'lasting-light-ai',
    undefined, // optional entity_id
    'api' // submission source
  );

  console.log('Workflow triggered:', result);
  return result;
}

// ============================================================================
// Example 5: Batch Assessment Processing
// ============================================================================
export async function example5_batchProcessing() {
  const manager = new ContaminationReviewManager(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    parseInt(process.env.GITHUB_RUN_ID || '0')
  );

  // Fetch contaminated assessments
  const contaminated = await manager.fetchContaminatedAssessments(100);

  // Define review run
  const run: ContaminationReviewRun = {
    github_run_id: parseInt(process.env.GITHUB_RUN_ID || '0'),
    github_run_url: process.env.GITHUB_SERVER_URL
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : undefined,
    github_actor: process.env.GITHUB_ACTOR,
    submission_source: 'batch',
    entries_processed: contaminated.length,
    entries_excluded: contaminated.filter(a => a.contamination_action === 'EXCLUDE').length,
    entries_flagged: contaminated.filter(a => a.contamination_action === 'FLAG_FOR_REVIEW').length,
    status: 'completed'
  };

  // Process batch
  const result = await manager.processAssessmentBatch(contaminated, run);

  console.log('Batch processing complete:');
  console.log(`- Processed: ${result.logEntries.length}`);
  console.log(`- Run ID: ${result.run.id}`);
  console.log(`- Assessments created: ${result.assessments.length}`);

  return result;
}

// ============================================================================
// Example 6: Real-time Monitoring - Subscribe to Changes
// ============================================================================
export async function example6_realtimeMonitoring() {
  const manager = new ContaminationReviewManager(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  /**
   * Subscribe to contamination_review_runs table changes
   * Use this in a Node.js app with Supabase realtime subscription
   */

  // Note: This requires Supabase client with realtime enabled
  // const subscription = manager['supabase']
  //   .from('contamination_review_runs')
  //   .on('*', (payload) => {
  //     console.log('Change received!', payload);
  //     handleReviewRunUpdate(payload);
  //   })
  //   .subscribe();

  // For now, poll recent runs
  const recentRuns = await manager.getRecentReviewRuns(5);

  console.log('Recent contamination review runs:');
  recentRuns.forEach(run => {
    console.log(`  - Run ${run.github_run_id}: ${run.entries_processed} entries, status: ${run.status}`);
  });

  return recentRuns;
}

// ============================================================================
// Example 7: Custom Assessment Workflow
// ============================================================================
export async function example7_customAssessmentWorkflow() {
  const manager = new ContaminationReviewManager(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    parseInt(process.env.GITHUB_RUN_ID || '0')
  );

  // Custom contamination assessment
  const assessment: ContaminationAssessment = {
    acat_assessment_id: 'uuid-of-assessment',
    detected_flags: ['ZERO_VARIANCE_P1', 'IDENTICAL_P1_P3'],
    review_action: 'FLAG_FOR_REVIEW',
    confidence_level: 'MEDIUM',
    decision_rationale: 'Multiple contamination signals detected, requires human review',
    reviewer_notes: {
      reviewer_email: 'human@example.com',
      review_status: 'pending_review',
      additional_context: 'Submission from batch XYZ processing'
    },
    reviewed_by: 'system'
  };

  // Create assessment
  const result = await manager.createAssessment(assessment);

  console.log('Assessment created:', result);
  return result;
}

// ============================================================================
// Example 8: Error Handling
// ============================================================================
export async function example8_errorHandling() {
  const manager = new ContaminationReviewManager(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    parseInt(process.env.GITHUB_RUN_ID || '0')
  );

  try {
    // Attempt to fetch assessments
    const assessments = await manager.fetchContaminatedAssessments(100);
    console.log(`Successfully fetched ${assessments.length} assessments`);

    // Log successful run
    await manager.logReviewRun({
      github_run_id: parseInt(process.env.GITHUB_RUN_ID || '0'),
      submission_source: 'api',
      entries_processed: assessments.length,
      status: 'completed'
    });
  } catch (error) {
    console.error('Error during processing:', error);

    // Log failure
    try {
      await manager.updateReviewRunStatus(
        parseInt(process.env.GITHUB_RUN_ID || '0'),
        'failed',
        {
          error_message: error instanceof Error ? error.message : 'Unknown error'
        }
      );
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    throw error;
  }
}

// ============================================================================
// Usage Instructions
// ============================================================================

/**
 * To run these examples:
 *
 * 1. Set environment variables:
 *    export SUPABASE_URL="https://your-project.supabase.co"
 *    export SUPABASE_ANON_KEY="your-anon-key"
 *    export GITHUB_TOKEN="your-github-token"
 *    export GITHUB_RUN_ID="123456789"
 *    export GITHUB_ACTOR="username"
 *    export GITHUB_REPOSITORY="owner/repo"
 *
 * 2. Run individual examples:
 *    npx ts-node examples/contamination-review-integration.example.ts
 *
 * 3. Integrate into your workflow:
 *    - Copy the pattern from relevant example
 *    - Adapt to your platform (n8n, Make.com, etc)
 *    - Deploy as webhook handler or scheduled task
 */

// Export all examples
export default {
  example1_basicFetchAndLog,
  example2_n8nWebhookIntegration,
  example3_makeComIntegration,
  example4_programmaticSubmission,
  example5_batchProcessing,
  example6_realtimeMonitoring,
  example7_customAssessmentWorkflow,
  example8_errorHandling
};
