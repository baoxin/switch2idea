import * as vscode from 'vscode';
import {exec} from 'child_process';
import * as os from 'os';
import * as fs from 'fs';

function getMacWebStormPath(): string {
    const commonPaths = [
        '/Applications/WebStorm.app',
        `${os.homedir()}/Applications/WebStorm.app`,
    ];

    // Iterate through all possible IDEA installation paths and return the first existing path
    for (const path of commonPaths) {
        if (fs.existsSync(path)) {
            return path;
        }
    }
    // If no paths exist, return the default APP name
    return 'WebStorm';
}

function getMacAndroidStudioPath(): string {
    const commonPaths = [
        '/Applications/Android Studio.app',
        `${os.homedir()}/Applications/Android Studio.app`,
    ];

    // Iterate through all possible IDEA installation paths and return the first existing path
    for (const path of commonPaths) {
        if (fs.existsSync(path)) {
            return path;
        }
    }
    // If no paths exist, return the default APP name
    return 'Android Studio';
}

function getMacXcodePath(): string {
    const commonPaths = [
        '/Applications/Xcode.app',
        `${os.homedir()}/Applications/Xcode.app`,
    ];

    // Iterate through all possible Xcode installation paths and return the first existing path
    for (const path of commonPaths) {
        if (fs.existsSync(path)) {
            return path;
        }
    }
    // If no paths exist, return the default APP name
    return 'Xcode';
}

function executeCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const childProcess = exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing command:', error);
                console.error('Stderr:', stderr);
                reject(error);
                return;
            }
            if (stdout) {
                console.log('Command output:', stdout);
            }
            if (stderr) {
                console.log('Command stderr:', stderr);
            }
            resolve();
        });

        // Add error handling
        childProcess.on('error', (error: NodeJS.ErrnoException) => {
            if (error.code === 'EPIPE') {
                console.log('Pipe communication disconnected, but this may not affect IDEA startup');
                resolve(); // Continue execution as IDEA may have started normally
            } else {
                reject(error);
            }
        });
    });
}

// 检查 xed 命令是否可用
async function isXedAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
        exec('which xed', (error) => {
            resolve(!error);
        });
    });
}

// 提示安装 Xcode 命令行工具
async function promptInstallXcodeCLI(): Promise<void> {
    const install = await vscode.window.showErrorMessage(
        'Xcode 命令行工具未安装，是否现在安装？',
        '安装',
        '取消'
    );

    if (install === '安装') {
        exec('xcode-select --install', (error) => {
            if (error) {
                vscode.window.showErrorMessage('启动 Xcode 命令行工具安装失败，请手动安装');
            }
        });
    }
}

async function openInIDE(uri: vscode.Uri | undefined, isProject: boolean, ideType: 'webstorm' | 'androidstudio' | 'xcode'): Promise<void> {
    try {
        let filePath: string;
        let line = 1;
        let column = 1;

        if (uri) {
            filePath = uri.fsPath;
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.uri.fsPath === filePath) {
                line = editor.selection.active.line + 1;
                column = editor.selection.active.character;
            }
        } else {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('没有活动的编辑器！');
                return;
            }
            filePath = editor.document.uri.fsPath;
            line = editor.selection.active.line + 1;
            column = editor.selection.active.character;
        }

        const config = vscode.workspace.getConfiguration('switch2idea');
        let idePath: string;

        if (ideType === 'webstorm') {
            idePath = config.get<string>('webStormPath') || '';
            if (!idePath) {
                if (os.platform() === 'darwin') {
                    idePath = getMacWebStormPath();
                } else if (os.platform() === 'win32') {
                    idePath = 'C:\\Program Files\\JetBrains\\WebStorm\\bin\\webstorm64.exe';
                } else {
                    idePath = 'webstorm';
                }
            }
        } else if (ideType === 'androidstudio') {
            idePath = config.get<string>('androidStudioPath') || '';
            if (!idePath) {
                if (os.platform() === 'darwin') {
                    idePath = getMacAndroidStudioPath();
                } else if (os.platform() === 'win32') {
                    idePath = 'C:\\Program Files\\Android\\Android Studio\\bin\\studio64.exe';
                } else {
                    idePath = 'android-studio';
                }
            }
        } else {
            // Xcode
            idePath = config.get<string>('xcodePath') || '';
            if (!idePath) {
                if (os.platform() === 'darwin') {
                    idePath = getMacXcodePath();
                } else {
                    vscode.window.showErrorMessage('Xcode 仅在 macOS 上可用');
                    return;
                }
            }
        }

        let command: string;
        if (os.platform() === 'darwin') {
            if (ideType === 'xcode') {
                // 检查 xed 命令是否可用
                const xedAvailable = await isXedAvailable();
                if (!xedAvailable) {
                    await promptInstallXcodeCLI();
                    return;
                }
                // 使用 xed 命令打开文件并跳转到指定行
                command = `xed --line ${line} "${filePath}"`;
            } else {
                const ideUrl = `idea://open?file=${encodeURIComponent(filePath)}&line=${line}&column=${column}`;
                command = `open -a "${idePath}" "${ideUrl}"`;
            }
        } else {
            if (ideType === 'xcode') {
                vscode.window.showErrorMessage('Xcode 仅在 macOS 上可用');
                return;
            }
            command = `"${idePath}" --line ${line} --column ${column} "${filePath}"`;
        }

        console.log('Executing command:', command);

        try {
            await executeCommand(command);
            const ideName = ideType === 'webstorm' ? 'WebStorm' : (ideType === 'androidstudio' ? 'Android Studio' : 'Xcode');
            vscode.window.showInformationMessage(`成功在 ${ideName} 中打开${isProject ? '项目' : '文件'}: ${filePath}`);
        } catch (error) {
            const err = error as Error;
            const ideName = ideType === 'webstorm' ? 'WebStorm' : (ideType === 'androidstudio' ? 'Android Studio' : 'Xcode');
            vscode.window.showErrorMessage(`打开 ${ideName} 失败: ${err.message}`);
        }
    } catch (error) {
        const err = error as Error;
        vscode.window.showErrorMessage(`发生错误: ${err.message}`);
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Switch2IDEA is now active!');

    // WebStorm commands
    let openFileInWebStormDisposable = vscode.commands.registerCommand('Switch2IDEA.openFileInWebStorm', async (uri?: vscode.Uri) => {
        await openInIDE(uri, false, 'webstorm');
    });

    let openProjectInWebStormDisposable = vscode.commands.registerCommand('Switch2IDEA.openProjectInWebStorm', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('没有打开的工作区文件夹！');
            return;
        }
        await openInIDE(workspaceFolders[0].uri, true, 'webstorm');
    });

    // Android Studio commands
    let openFileInAndroidStudioDisposable = vscode.commands.registerCommand('Switch2IDEA.openFileInAndroidStudio', async (uri?: vscode.Uri) => {
        await openInIDE(uri, false, 'androidstudio');
    });

    let openProjectInAndroidStudioDisposable = vscode.commands.registerCommand('Switch2IDEA.openProjectInAndroidStudio', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('没有打开的工作区文件夹！');
            return;
        }
        await openInIDE(workspaceFolders[0].uri, true, 'androidstudio');
    });

    // Xcode commands
    let openFileInXcodeDisposable = vscode.commands.registerCommand('Switch2IDEA.openFileInXcode', async (uri?: vscode.Uri) => {
        await openInIDE(uri, false, 'xcode');
    });

    let openProjectInXcodeDisposable = vscode.commands.registerCommand('Switch2IDEA.openProjectInXcode', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('没有打开的工作区文件夹！');
            return;
        }
        await openInIDE(workspaceFolders[0].uri, true, 'xcode');
    });

    context.subscriptions.push(
        openFileInWebStormDisposable,
        openProjectInWebStormDisposable,
        openFileInAndroidStudioDisposable,
        openProjectInAndroidStudioDisposable,
        openFileInXcodeDisposable,
        openProjectInXcodeDisposable
    );
}

export function deactivate() {
}
