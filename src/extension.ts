import * as path from 'path';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, languages, commands, Disposable, workspace, window, Location } from 'vscode';
// import fetch from 'node-fetch';
import axios from 'axios';
import { OverviewCodelensProvider } from './OverviewCodelensProvider';
import { SidebarProvider } from './SidebarProvider';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';

let client: LanguageClient;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {


	const sidebarProvider = new SidebarProvider(context.extensionUri);


	context.subscriptions.push(
		window.registerWebviewViewProvider("observe-sidebar", sidebarProvider)
	);

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

	context.subscriptions.push(
		commands.registerCommand("observe.refresh", async () => {
			// HelloWorldPanel.kill();
			// HelloWorldPanel.createOrShow(context.extensionUri);
			await commands.executeCommand("workbench.action.closeSidebar");
			await commands.executeCommand(
				"workbench.view.extension.observe-sidebar-view"
			);
			// setTimeout(() => {
			//   vscode.commands.executeCommand(
			//     "workbench.action.webview.openDeveloperTools"
			//   );
			// }, 500);
		})
	);

	context.subscriptions.push(
		commands.registerCommand("observe.switchSidePanelFocus", async (qualName: string, fileName: string) => {
			sidebarProvider._view?.webview.postMessage({
				type: "switch-focus",
				value: qualName + ":" + fileName,
			});
		})
	)

	const activeEditor = window.activeTextEditor;
	if (!activeEditor) {
		return;
	}



	// The server is implemented in node
	let serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	}

	const clientOptions: LanguageClientOptions = {
		documentSelector: [
			// Active functionality on files of these languages.
			{
				language: 'python',
			},
		],
	};

	// client = new LanguageClient("LanguageServerExample", "Language Server Example", serverOptions, clientOptions);
	// await client.start();
}


export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
