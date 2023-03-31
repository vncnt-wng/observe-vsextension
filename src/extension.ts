// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, languages, commands, Disposable, workspace, window } from 'vscode';
// import fetch from 'node-fetch';
import axios from 'axios';
import { OverviewCodelensProvider } from './OverviewCodelensProvider';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "observe" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = commands.registerCommand('observe.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		window.showInformationMessage('Hello World from observe!');
	});



	const codelensProvider = new OverviewCodelensProvider();

	languages.registerCodeLensProvider("*", codelensProvider);

	commands.registerCommand("observe.enableCodeLens", () => {
		workspace.getConfiguration("observe").update("enableCodeLens", true, true);
	});

	commands.registerCommand("observe.disableCodeLens", () => {
		workspace.getConfiguration("observe").update("enableCodeLens", false, true);
	});

	commands.registerCommand("codelens-sample.codelensAction", (args: any) => {
		window.showInformationMessage(`CodeLens action clicked with args=${args}`);
	});


	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
