// Temporary fix for the problematic section
const createPlanCommand = async (lower, message, username, respond, denyCommand, hasTrustLevel, aiPlanner) => {
  if (lower.includes('plan') || lower.includes('make plan') || lower.includes('create plan') || lower.includes('ai plan') || lower.includes('smart plan')) {
    if (!hasTrustLevel(username, 'trusted')) {
      denyCommand("Only trusted+ can create AI plans!", 'blocked_planning');
      return;
    }

    // Extract goal from message
    const goalMatch = message.match(/(?:plan|make plan|create plan|ai plan|smart plan)\s+(.+)$/i);
    if (!goalMatch) {
      respond(false, "Usage: plan <goal> (e.g., 'plan get me full netherite gear')");
      return;
    }

    const goal = goalMatch[1].trim();

    try {
      const plan = await aiPlanner.createPlan(goal, { requestedBy: username });
      const steps = plan.steps.slice(0, 10); // Show first 10 steps

      respond(true, `🧠 Created AI plan for: ${goal}`);
      respond(true, `📋 Plan ID: ${plan.id}`);
      respond(true, `⏱️ Estimated time: ${Math.round(plan.estimatedTime / 60)} minutes`);
      respond(true, `📝 Steps: ${plan.steps.length} total`);

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        respond(true, `${i + 1}. ${step.description}`);
      }

      if (plan.steps.length > 10) {
        respond(true, `... and ${plan.steps.length - 10} more steps`);
      }

      respond(true, `💡 Use 'execute plan ${plan.id}' to start execution`);

    } catch (error) {
      respond(false, `❌ Failed to create plan: ${error.message}`);
    }
    return;
  }
};