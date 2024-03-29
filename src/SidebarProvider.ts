import * as vscode from "vscode";
import { apiBaseUrl } from "./constants";
import { getNonce } from "./getNonce";
import { SymbolKind } from "vscode-languageclient";

export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            console.log(data)
            switch (data.type) {
                case 'goToSymbol':
                    console.log(data)
                    const [qualName, filePath] = data.value;
                    const parts = qualName.split('.');
                    const funcName = parts[parts.length - 1];

                    const inClass = parts.length === 2;

                    const workspaceSymbols = await vscode.commands.executeCommand<vscode.SymbolInformation[]>(
                        'vscode.executeWorkspaceSymbolProvider',
                        funcName // Function name
                    );

                    let found = false;
                    let matchSymbol;
                    for (const symbol of workspaceSymbols) {
                        const name = symbol.name.split(" ")[0]
                        if ((name === funcName || name === funcName + '()') && symbol.location.uri.path.endsWith(filePath)) {
                            // sanity check for functions in classes 
                            if (inClass && symbol.containerName !== parts[0] && symbol.kind !== SymbolKind.Method) {
                                continue;
                            }
                            found = true;
                            matchSymbol = symbol;
                            break;
                        }
                    }

                    if (matchSymbol) {
                        await vscode.commands.executeCommand<vscode.TextDocumentShowOptions>("vscode.open", matchSymbol.location.uri);
                        vscode.window.activeTextEditor!.revealRange(matchSymbol.location.range, vscode.TextEditorRevealType.AtTop);
                    } else {
                        vscode.window.showInformationMessage("Could not find function " + qualName + " in file: " + filePath);
                    }

                    break;
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        });
    }

    public revive(panel: vscode.WebviewView) {
        this._view = panel;
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // const styleResetUri = webview.asWebviewUri(
        //     vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
        // );
        // const styleVSCodeUri = webview.asWebviewUri(
        //     vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
        // );

        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
        );
        const styleMainUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
        );

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data: blob: application/json; style-src 'unsafe-inline' ${webview.cspSource
            }; script-src 'nonce-${nonce}' https://cdn.plot.ly https://kit.fontawesome.com;">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">

                
        <link href="${styleMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
          const tsvscode = acquireVsCodeApi();
        </script>
			</head>
      <body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}