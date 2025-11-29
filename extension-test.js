// Quick extension test - run this to verify command registration
const vscode = require('vscode');

async function testExtension() {
    console.log('🔍 Testing VS Code extension...');
    
    try {
        // Get all available commands
        const commands = await vscode.commands.getCommands();
        
        // Look for our command
        const pulseCommand = commands.find(cmd => cmd === 'pulse.openDashboard');
        
        if (pulseCommand) {
            console.log('✅ Command "pulse.openDashboard" is registered!');
            
            // Try to execute the command
            try {
                await vscode.commands.executeCommand('pulse.openDashboard');
                console.log('✅ Command executed successfully!');
            } catch (error) {
                console.log('❌ Command execution failed:', error.message);
            }
        } else {
            console.log('❌ Command "pulse.openDashboard" NOT found');
            console.log('📝 Available commands containing "pulse":', 
                commands.filter(cmd => cmd.includes('pulse')));
        }
    } catch (error) {
        console.log('❌ Error testing extension:', error.message);
    }
}

module.exports = { testExtension };
