/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2022 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import 'monaco-editor/esm/vs/editor/editor.all.js';

// support all editor features
import 'monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickInput/standaloneQuickInputService.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import { buildWorkerDefinition } from 'monaco-editor-workers';

import { MonacoLanguageClient, CloseAction, ErrorAction, MonacoServices, MessageTransports, ProtocolNotificationType, integer } from 'monaco-languageclient';
import { toSocket, WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc';
import normalizeUrl from 'normalize-url';
import { StandaloneServices } from 'vscode/services';
import getMessageServiceOverride from 'vscode/service-override/messages';

import {sTeXSetup,initialize} from './stex';

export interface STeXClient {
  socket:WebSocket
  client?:MonacoLanguageClient
  editor?:monaco.editor.IStandaloneCodeEditor
  initialized:boolean
}

export function doClient(port:integer = 5008,dom:string="container",then:((cl:STeXClient) => void)): STeXClient {
  StandaloneServices.initialize({
    ...getMessageServiceOverride(document.body)
  });
  //buildWorkerDefinition('dist', new URL('', window.location.href).href, false);

  // install Monaco language client services
  MonacoServices.install();
  sTeXSetup();

  // create the web socket
  const url = createUrl('localhost', port,'/');
  let client: STeXClient = {
    socket:new WebSocket(url),
    initialized:false
  };

 client.socket.onopen = (ev:Event) => {
    const socket = toSocket(client.socket);
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);
    client.client = createLanguageClient({
        reader,
        writer
    });
    client.client.start().then(() => {
      initialize(client.client).then(() => {
        client.editor = monaco.editor.create(document.getElementById(dom)!,{
          glyphMargin: true,
          lightbulb: {
              enabled: true
          },
          theme:"stex",
          "semanticHighlighting.enabled": true
        });
        client.initialized = true;
        then(client);
      });
    });
    reader.onClose(() => client.client.stop());
  };
  return client
}

function createLanguageClient (transports: MessageTransports): MonacoLanguageClient {
    return new MonacoLanguageClient({
        name: 'Sample Language Client',
        clientOptions: {
            documentSelector: ['tex'],
            errorHandler: {
                error: () => ({ action: ErrorAction.Continue }),
                closed: () => ({ action: CloseAction.DoNotRestart })
            }
        },
        connectionProvider: {
            get: () => {
                return Promise.resolve(transports);
            }
        }
    });
}

function createUrl (hostname: string, port: number, path: string): string {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    return normalizeUrl(`${protocol}://${hostname}:${port}${path}`);
}
