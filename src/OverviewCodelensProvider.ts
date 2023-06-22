import * as vscode from 'vscode';
import axios from 'axios';
/**
 * CodelensProvider
 */


class OverviewCodeLens extends vscode.CodeLens {
    constructor(
        public readonly qualName: string,
        public readonly fileName: string,
        public readonly meanResponseTime: number,
        range: vscode.Range,
    ) {
        super(range);
    }
}

export class OverviewCodelensProvider implements vscode.CodeLensProvider {
    private codeLenses: vscode.CodeLens[] = [];
    private regexString: string;
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    constructor() {
        this.regexString = '@trace_function';

        // vscode.workspace.onDidChangeConfiguration((_) => {
        // 	this._onDidChangeCodeLenses.fire();
        // });
    }

    public async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.CodeLens[]> {
        this.codeLenses = []
        if (vscode.workspace.getConfiguration("observe").get("enableCodeLens", true)) {
            const symbols = await vscode.commands.executeCommand<vscode.SymbolInformation[]>(
                'vscode.executeDocumentSymbolProvider',
                document.uri,
            );

            // Map symbols by their name for convenience
            const nameToSymbolIndex: Map<string, number> = new Map();
            for (const [i, symbol] of symbols.entries()) {
                nameToSymbolIndex.set(String(symbol.name).split(" ")[0], i);
            }

            console.log(symbols)

            const fileName = document.fileName.replace(vscode.workspace.workspaceFolders![0].uri.path + '/', '')
            // const fileName = document.fileName.replace()
            console.log(document.fileName)
            console.log(vscode.workspace.workspaceFolders![0].uri.path)
            console.log(fileName)
            const body =
            {
                "filePath": fileName,
                "prevDays": 30
            };

            const responseTimes: { [key: string]: number } = (await axios.post('http://127.0.0.1:8000/get_file_overview',
                body,
                { headers: { 'Content-Type': 'application/json' } },
            )).data;

            console.log(responseTimes)

            for (const [qualName, value] of Object.entries(responseTimes)) {
                let symbolIndex = nameToSymbolIndex.get(qualName)
                const parts = qualName.split(".");
                let inClass = false;
                if (symbolIndex === undefined) {
                    inClass = true;
                    symbolIndex = nameToSymbolIndex.get(parts[0]);
                    if (symbolIndex === undefined) {
                        console.log("Couldn't find symbol '" + qualName + "'");
                        continue;
                    }
                }
                const symbol = symbols[symbolIndex!];
                if (!inClass) {
                    // sanity check
                    if (symbol && symbol.kind === vscode.SymbolKind.Function) {
                        this.codeLenses.push(new OverviewCodeLens(
                            qualName,
                            fileName,
                            responseTimes[qualName] ?? 0,
                            symbol.location.range
                        ));
                    } else {
                        console.log("Couldn't find function '" + qualName + "'")
                    }
                    // If function is in class
                } else {
                    // sanity check 
                    if (symbol && symbol.kind === vscode.SymbolKind.Class) {
                        const funcName = parts[1];
                        let flag = false
                        for (const child of symbol.children) {
                            if (child.name === funcName && child.kind === vscode.SymbolKind.Method) {
                                flag = true
                                this.codeLenses.push(new OverviewCodeLens(
                                    qualName,
                                    fileName,
                                    responseTimes[qualName] ?? 0,
                                    child.location.range
                                ));
                            }
                        }

                        if (!flag) {
                            console.log("Couldn't find function '" + funcName + "' in class '" + parts[0] + "'")
                        }
                    } else {
                        console.log("Couldn't find class '" + parts[0] + "'")
                    }
                }
            }
            return this.codeLenses;
        }
        return [];
    }

    public resolveOverviewCodeLens(codeLens: OverviewCodeLens, token: vscode.CancellationToken) {
        if (vscode.workspace.getConfiguration("observe").get("enableCodeLens", true)) {
            codeLens.command = {
                title: "Mean response time (ms): " + codeLens.meanResponseTime.toFixed(2),
                tooltip: "Click to view more details",
                command: "observe.switchSidePanelFocus",
                arguments: [codeLens.qualName, codeLens.fileName]
            };
            return codeLens;
        }
        return null;
    }

    public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
        if (codeLens instanceof OverviewCodeLens) {
            return this.resolveOverviewCodeLens(codeLens, token);
        }
        return null;
    }
}