// Test section for problematic code
const username = "test";
const goal = "test";
const plan = await this.aiPlanner.createPlan(goal, { requestedBy: username });
console.log(plan);