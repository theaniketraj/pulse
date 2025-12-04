// Quick extension test - run this to verify command registration
const vscode = require("vscode");

async function testExtension() {
  console.log("🔍 Testing VS Code extension...");

  try {
    // Get all available commands
    const commands = await vscode.commands.getCommands();

    // Look for our command
    const vitalsCommand = commands.find(
      (cmd) => cmd === "vitals.openDashboard"
    );

    if (vitalsCommand) {
      console.log('✅ Command "vitals.openDashboard" is registered!');

      // Try to execute the command
      try {
        await vscode.commands.executeCommand("vitals.openDashboard");
        console.log("✅ Command executed successfully!");
      } catch (error) {
        console.log("❌ Command execution failed:", error.message);
      }
    } else {
      console.log('❌ Command "vitals.openDashboard" NOT found');
      console.log(
        '📝 Available commands containing "vitals":',
        commands.filter((cmd) => cmd.includes("vitals"))
      );
    }
  } catch (error) {
    console.log("❌ Error testing extension:", error.message);
  }
}

module.exports = { testExtension };
