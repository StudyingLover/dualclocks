import * as vscode from 'vscode';
import * as moment from 'moment-timezone';

export function activate(context: vscode.ExtensionContext) {
    // 注册视图
    const timeZonesTreeView = vscode.window.createTreeView('timezones-view', {
        treeDataProvider: aSimpleDataProvider()
    });
    context.subscriptions.push(timeZonesTreeView);

    // 注册命令
    let disposable = vscode.commands.registerCommand('timezones.showTimeZones', () => {
        const panel = vscode.window.createWebviewPanel(
            'timeZones', // Identifies the type of the webview. Used internally
            'Time Zones', // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            {
                // 启用脚本在webview上下文中运行
                enableScripts: true
            } // Webview options.
        );

        panel.webview.html = getWebviewContent();
    });

    context.subscriptions.push(disposable);

    // 直接调用命令
    vscode.commands.executeCommand('timezones.showTimeZones');
}

function aSimpleDataProvider(): vscode.TreeDataProvider<{ key: string }> {
    return {
        getTreeItem: (element: { key: string }): vscode.TreeItem => {
            return {
                label: `Time Zone - ${element.key}`,
                command: { 
                    command: 'timezones.showTimeZones', 
                    title: '', 
                    arguments: [element.key] 
                }, // 命令处理
                iconPath: vscode.Uri.parse('path/to/icon'), // 指定图标路径
            };
        },
        getChildren: (element?: { key: string }): Thenable<{ key: string }[]> => {
            return Promise.resolve([
                { key: 'TimeZone1' },
            ]);
        }
    };
}

function getWebviewContent() {
    // HTML 和 CSS 样式内容
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Time Zones</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                padding: 20px;
                box-sizing: border-box;
            }
            .timezone-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px;
                margin: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #f9f9f9;
            }
            select, input {
                margin: 10px 0;
                padding: 5px;
                width: 200px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            #clock-1, #clock-2 {
                display: none;

            }
        </style>
    </head>
    <body>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.33/moment-timezone-with-data.min.js"></script>
        <div class="timezone-container">
            <select id="timezone-select-1">

            </select>
            <input type="datetime-local" id="datetime-input-1">
            <div id="clock-1"></div>
        </div>
        <div class="timezone-container">
            <select id="timezone-select-2">

            </select>
            <input type="datetime-local" id="datetime-input-2">
            <div id="clock-2"></div>
        </div>
        <script>
            // JavaScript 代码
            const clock1 = document.getElementById('clock-1');
            const clock2 = document.getElementById('clock-2');
            const timezoneSelect1 = document.getElementById('timezone-select-1');
            const timezoneSelect2 = document.getElementById('timezone-select-2');
            const datetimeInput1 = document.getElementById('datetime-input-1');
            const datetimeInput2 = document.getElementById('datetime-input-2');
            
            const timezones = moment.tz.names();

            timezones.forEach(timezone => {
                const option1 = document.createElement('option');
                option1.value = timezone;
                option1.text = timezone;
                timezoneSelect1.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = timezone;
                option2.text = timezone;
                timezoneSelect2.appendChild(option2);
            });

            const updateTime = () => {
                const timezone1 = timezoneSelect1.value;
                const timezone2 = timezoneSelect2.value;
                const datetime1 = moment(datetimeInput1.value);
                const datetime2 = moment(datetimeInput2.value);
                if (datetime1.isValid()) {
                    clock1.innerHTML = datetime1.tz(timezone1).format('YYYY-MM-DD HH:mm:ss');
                }
                if (datetime2.isValid()) {
                    clock2.innerHTML = datetime2.tz(timezone2).format('YYYY-MM-DD HH:mm:ss');
                }
            }

            timezoneSelect1.addEventListener('change', function() {
                const datetime1 = moment(datetimeInput1.value);
                const timezone1 = timezoneSelect1.value;
                if (datetime1.isValid()) {
                    datetimeInput1.value = datetime1.tz(timezone1).format('YYYY-MM-DDTHH:mm');
                }
                updateTime();
            });
            timezoneSelect2.addEventListener('change', function() {
                const datetime2 = moment(datetimeInput2.value);
                const timezone2 = timezoneSelect2.value;
                if (datetime2.isValid()) {
                    datetimeInput2.value = datetime2.tz(timezone2).format('YYYY-MM-DDTHH:mm');
                }
                updateTime();
            });
            datetimeInput1.addEventListener('change', function() {
                const datetime1 = moment(datetimeInput1.value);
                const timezone2 = timezoneSelect2.value;
                if (datetime1.isValid()) {
                    datetimeInput2.value = datetime1.tz(timezone2).format('YYYY-MM-DDTHH:mm');
                }
                updateTime();
            });
            datetimeInput2.addEventListener('change', function() {
                const datetime2 = moment(datetimeInput2.value);
                const timezone1 = timezoneSelect1.value;
                if (datetime2.isValid()) {
                    datetimeInput1.value = datetime2.tz(timezone1).format('YYYY-MM-DDTHH:mm');
                }
                updateTime();
            });
            updateTime();

            setInterval(() => {
                updateTime();
            }, 1000);
        </script>
    </body>
    </html>`;
}


export function deactivate() {}
