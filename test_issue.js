// Test file to check the problematic code
async function testFunction() {
  const goal = "test";
  const plan = await someFunction(goal, { requestedBy: username });
  console.log(plan);
}