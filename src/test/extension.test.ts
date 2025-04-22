import * as assert from 'assert';
import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('qczone.switch2idea'));
	});

	test('Commands should be registered', async () => {
		const commands = await vscode.commands.getCommands();
		assert.ok(commands.includes('Switch2IDEA.openFileInIDEA'));
		assert.ok(commands.includes('Switch2IDEA.openProjectInIDEA'));
	});

	test('Configuration should be available', () => {
		const config = vscode.workspace.getConfiguration('switch2idea');
		assert.ok(config.has('ideaPath'));
	});

	test('Should register open in IDEA command', () => {
		const commands = vscode.commands.getCommands(true);
		return commands.then((cmds) => {
			assert.ok(cmds.includes('Switch2IDEA.openInIDEA'));
		});
	});

	test('Should have correct configuration', () => {
		const config = vscode.workspace.getConfiguration('switch2idea');
		assert.ok(config.has('ideaPath'));
		assert.ok(config.has('keyboardShortcut'));
		assert.strictEqual(config.get('keyboardShortcut'), 'alt+shift+o');
	});

	test('Should handle file path with spaces and special characters', async () => {
		// Create a temporary file for testing
		const tmpDir = os.tmpdir();
		const testFileName = 'test file with spaces!.txt';
		const testFilePath = path.join(tmpDir, testFileName);
		
		try {
			// Create test file
			fs.writeFileSync(testFilePath, 'test content');

			// Open file
			const doc = await vscode.workspace.openTextDocument(testFilePath);
			const editor = await vscode.window.showTextDocument(doc);

			// Execute command
			await vscode.commands.executeCommand('Switch2IDEA.openInIDEA');

			// Verify command execution completed without errors
			// Note: We cannot verify if IDEA actually opened the file as it's an external process
			assert.ok(true);
		} finally {
			// Cleanup test file
			try {
				fs.unlinkSync(testFilePath);
			} catch (e) {
				console.error('Failed to cleanup test file:', e);
			}
		}
	});

	test('Should handle editor selection', async () => {
		// Create a temporary file
		const tmpDir = os.tmpdir();
		const testFilePath = path.join(tmpDir, 'test.txt');
		
		try {
			// Create multi-line test file
			const content = 'line1\nline2\nline3\nline4\n';
			fs.writeFileSync(testFilePath, content);

			// Open file and set cursor position
			const doc = await vscode.workspace.openTextDocument(testFilePath);
			const editor = await vscode.window.showTextDocument(doc);
			
			// Move cursor to line 3, column 2
			const position = new vscode.Position(2, 1);
			editor.selection = new vscode.Selection(position, position);

			// Execute command
			await vscode.commands.executeCommand('Switch2IDEA.openInIDEA');

			// Verify command execution completed without errors
			assert.ok(true);
		} finally {
			// Cleanup test file
			try {
				fs.unlinkSync(testFilePath);
			} catch (e) {
				console.error('Failed to cleanup test file:', e);
			}
		}
	});

	test('Should handle non-existent ideaPath gracefully', async () => {
		// Temporarily set a non-existent ideaPath
		const config = vscode.workspace.getConfiguration('switch2idea');
		const originalPath = config.get('ideaPath');
		
		try {
			await config.update('ideaPath', 'non-existent-path', vscode.ConfigurationTarget.Global);
			
			// Execute command
			await vscode.commands.executeCommand('Switch2IDEA.openInIDEA');
			
			// Command should complete without crashing
			assert.ok(true);
		} finally {
			// Restore original settings
			await config.update('ideaPath', originalPath, vscode.ConfigurationTarget.Global);
		}
	});
});
