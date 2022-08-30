import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { MonacoLanguageClient, ProtocolNotificationType} from 'monaco-languageclient';
import {tex_monarch} from './texmonarch'

interface MathHubMessage {
    mathhub:string,
    remote:string
}

export function sTeXSetup() {
    monaco.editor.defineTheme('stex',{
        base:'vs-dark',
        inherit:true,
        colors: {},
        rules: [
            {token:"support",foreground:"DCDCAA"},
            {token:"meta.function",foreground:"DCDCAA",fontStyle:"bold"},
            {token:"keyword",foreground:"C586C0"},
            {token:"constant",foreground:"569CD6"},
            {token:"punctuation.definition",foreground:"4EC9B0"},
            {token:'stex-module',foreground: '4EC9B0'},
            {token:"stex-constant",foreground:"94763a"},
            {token:"stex-variable",foreground:"aaaaaa"},
            {token:"stex-symdecl",foreground:"ce63eb"}
        ]
    });

    // register Monaco languages
    monaco.languages.register({
        id: 'tex',
        extensions: ['.tex', '.ltx', '.cls', '.sty'],
        aliases: ['latex', 'stex'],
        mimetypes: ['text/plain']
    });
    monaco.languages.setMonarchTokensProvider('tex',tex_monarch);
}

export async function initialize(
    client:MonacoLanguageClient,
    mathhub:string="/home/jazzpirate/work/MathHub",
    remote:string="https://stexmmt.mathhub.info/:sTeX"
    ) {
    await client.sendNotification(new ProtocolNotificationType<MathHubMessage,void>("sTeX/setMathHub"),{
        mathhub:mathhub,
        remote:remote
    });
}