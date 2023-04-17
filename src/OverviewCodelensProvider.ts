import * as vscode from 'vscode';
import axios from 'axios';

/**
 * CodelensProvider
 */


class OverviewCodeLens extends vscode.CodeLens {
    constructor(
        public readonly funcName: string,
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
        const fileName = document.fileName.split("/").at(-1);

        const body =
        {
            "filePath": fileName,
            "prevDays": 10
        };

        const responseTimes: { [key: string]: number } = (await axios.post('http://127.0.0.1:8000/get_file_overview',
            body,
            { headers: { 'Content-Type': 'application/json' } },
        )).data;

        if (vscode.workspace.getConfiguration("observe").get("enableCodeLens", true)) {
            this.codeLenses = [];
            const regex = new RegExp(this.regexString, "g");
            const text = document.getText();
            let matches;
            while ((matches = regex.exec(text)) !== null) {
                const line = document.lineAt(document.positionAt(matches.index).line);
                const indexOf = line.text.indexOf(matches[0]);
                const position = new vscode.Position(line.lineNumber, indexOf);
                const range = document.getWordRangeAtPosition(position, new RegExp(this.regexString, "g"));

                const nextLine = document.lineAt(line.lineNumber + 1);
                const nextLineSplit = nextLine.text.split(" ").filter(word => word !== '');
                if (range && nextLineSplit[0] === "def") {
                    const funcName = nextLineSplit[1].split("(")[0];
                    this.codeLenses.push(new OverviewCodeLens(
                        funcName,
                        responseTimes[funcName],
                        range
                    ));
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
                command: "codelens-sample.codelensAction",
                arguments: ["Argument 1", false, codeLens.funcName]
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