import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const tex_monarch : monaco.languages.IMonarchLanguage = {
  //defaultToken: 'invalid',

  brackets: [
      {open:'{',close:'}',token:'delimiter.curly'},
      {open:'[',close:']',token:'delimiter.square'},
      {open:'(',close:')',token:'delimiter.parenthesis'}
    ],

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // whitespace
      { include: "@laTeX" }
      //{ include: "@whitespace" }
    ],
    // keyword = constant = tag, regexp, string, type
    teX: [
      [
        /(\\)(backmatter|else|fi|frontmatter|mainmatter|if(case|cat|dim|eof|false|hbox|hmode|inner|mmode|num|odd|true|undefined|vbox|vmode|void|x)?)(?![a-zA-Z@])/,
        "keyword.control.tex"
      ],
      [
        /(\\catcode\s*)(`)((?:\\.)|[^\\])(\s*=?\s*)(\d+)/,
        ["keyword.control.catcode.tex","punctuation.definition.keyword.tex",null,"punctuation.separator.key-value.tex","constant.numeric.category.tex"]
      ],
      /*[
        /%/,
        {token:"punctuation.whitespace.comment.leading.tex",goBack:1,next:"@teXComment"}
      ]*/
      [/(%:)(.*$\n?)/,["comment.punctuation.definition.comment.tex","comment.line.percentage.tex"]],
      [/(^(?:%!TEX)(?:\s*)=)(.*$\n?)/,["punctuation.definition.comment.tex","comment.line..directive.tex"]],
      [/(%)(.*$\n?)/,["comment.punctuation.definition.comment.tex","comment.line.percentage.tex"]],
      [
        /\$\$/,
        {token:"punctuation.definition.string.begin.tex",next:'@simpleMathB'}
      ],
      [
        /\$/,
        {token:"punctuation.definition.string.begin.tex",next:'@simpleMathA'}
      ],
      [/\\\\/,"keyword.control.newline.tex"],
      [/(\\)(?:[A-Za-z@]+|[,;])/,"support.function.general.tex"],
      [/(\\)[^a-zA-Z@]/,"constant.character.escape.tex"],
      {include: '@braces'},
      [/\(|\)|\[|\]|\{|\}/,"@brackets"]
    ],
    simpleMathA:[
      [/\\\$/,"constant.character.escape.tex"],
	    [/\$/,{token:"punctuation.definition.string.end.tex",next:'@pop'}],
      {include:'@texMath'}
    ],
    simpleMathB:[
      [/\\\$/,"constant.character.escape.tex"],
	    [/\$\$/,{token:"punctuation.definition.string.end.tex",next:'@pop'}],
      {include:'@texMath'}
    ],
    texMath:[
      [/((?:\\)(?:text|mbox)\s*)(\{)/,[{token:"constant.other.math.tex"},{token:"punctuation.definition.arguments.begin.tex",next:"@texMathEscape"}]],
      [/\\{|\\}/,"punctuation.math.bracket.pair.tex"],
      [/\\(left|right|((big|bigg|Big|Bigg)[lr]?))([\(\[\<\>\]\)\.\|]|\\[{}|]|\\[lr]?[Vv]ert|\\[lr]angle)/,"punctuation.math.bracket.pair.big.tex"],
      [
        /(\\)(s(s(earrow|warrow|lash)|h(ort(downarrow|uparrow|parallel|leftarrow|rightarrow|mid)|arp)|tar|i(gma|m(eq)?)|u(cc(sim|n(sim|approx)|curlyeq|eq|approx)?|pset(neq(q)?|plus(eq)?|eq(q)?)?|rd|m|bset(neq(q)?|plus(eq)?|eq(q)?)?)|p(hericalangle|adesuit)|e(tminus|arrow)|q(su(pset(eq)?|bset(eq)?)|c(up|ap)|uare)|warrow|m(ile|all(s(etminus|mile)|frown)))|h(slash|ook(leftarrow|rightarrow)|eartsuit|bar)|R(sh|ightarrow|e|bag)|Gam(e|ma)|n(s(hort(parallel|mid)|im|u(cc(eq)?|pseteq(q)?|bseteq))|Rightarrow|n(earrow|warrow)|cong|triangle(left(eq(slant)?)?|right(eq(slant)?)?)|i(plus)?|u|p(lus|arallel|rec(eq)?)|e(q|arrow|g|xists)|v(dash|Dash)|warrow|le(ss|q(slant|q)?|ft(arrow|rightarrow))|a(tural|bla)|VDash|rightarrow|g(tr|eq(slant|q)?)|mid|Left(arrow|rightarrow))|c(hi|irc(eq|le(d(circ|S|dash|ast)|arrow(left|right)))?|o(ng|prod|lon|mplement)|dot(s|p)?|u(p|r(vearrow(left|right)|ly(eq(succ|prec)|vee(downarrow|uparrow)?|wedge(downarrow|uparrow)?)))|enterdot|lubsuit|ap)|Xi|Maps(to(char)?|from(char)?)|B(ox|umpeq|bbk)|t(h(ick(sim|approx)|e(ta|refore))|imes|op|wohead(leftarrow|rightarrow)|a(u|lloblong)|riangle(down|q|left(eq(slant)?)?|right(eq(slant)?)?)?)|i(n(t(er(cal|leave))?|plus|fty)?|ota|math)|S(igma|u(pset|bset))|zeta|o(slash|times|int|dot|plus|vee|wedge|lessthan|greaterthan|m(inus|ega)|b(slash|long|ar))|d(i(v(ideontimes)?|a(g(down|up)|mond(suit)?)|gamma)|o(t(plus|eq(dot)?)|ublebarwedge|wn(harpoon(left|right)|downarrows|arrow))|d(ots|agger)|elta|a(sh(v|leftarrow|rightarrow)|leth|gger))|Y(down|up|left|right)|C(up|ap)|u(n(lhd|rhd)|p(silon|harpoon(left|right)|downarrow|uparrows|lus|arrow)|lcorner|rcorner)|jmath|Theta|Im|p(si|hi|i(tchfork)?|erp|ar(tial|allel)|r(ime|o(d|pto)|ec(sim|n(sim|approx)|curlyeq|eq|approx)?)|m)|e(t(h|a)|psilon|q(slant(less|gtr)|circ|uiv)|ll|xists|mptyset)|Omega|D(iamond|ownarrow|elta)|v(d(ots|ash)|ee(bar)?|Dash|ar(s(igma|u(psetneq(q)?|bsetneq(q)?))|nothing|curly(vee|wedge)|t(heta|imes|riangle(left|right)?)|o(slash|circle|times|dot|plus|vee|wedge|lessthan|ast|greaterthan|minus|b(slash|ar))|p(hi|i|ropto)|epsilon|kappa|rho|bigcirc))|kappa|Up(silon|downarrow|arrow)|Join|f(orall|lat|a(t(s(emi|lash)|bslash)|llingdotseq)|rown)|P(si|hi|i)|w(p|edge|r)|l(hd|n(sim|eq(q)?|approx)|ceil|times|ightning|o(ng(left(arrow|rightarrow)|rightarrow|maps(to|from))|zenge|oparrow(left|right))|dot(s|p)|e(ss(sim|dot|eq(qgtr|gtr)|approx|gtr)|q(slant|q)?|ft(slice|harpoon(down|up)|threetimes|leftarrows|arrow(t(ail|riangle))?|right(squigarrow|harpoons|arrow(s|triangle|eq)?))|adsto)|vertneqq|floor|l(c(orner|eil)|floor|l|bracket)?|a(ngle|mbda)|rcorner|bag)|a(s(ymp|t)|ngle|pprox(eq)?|l(pha|eph)|rrownot|malg)|V(dash|vdash)|r(h(o|d)|ceil|times|i(singdotseq|ght(s(quigarrow|lice)|harpoon(down|up)|threetimes|left(harpoons|arrows)|arrow(t(ail|riangle))?|rightarrows))|floor|angle|r(ceil|parenthesis|floor|bracket)|bag)|g(n(sim|eq(q)?|approx)|tr(sim|dot|eq(qless|less)|less|approx)|imel|eq(slant|q)?|vertneqq|amma|g(g)?)|Finv|xi|m(ho|i(nuso|d)|o(o|dels)|u(ltimap)?|p|e(asuredangle|rge)|aps(to|from(char)?))|b(i(n(dnasrepma|ampersand)|g(s(tar|qc(up|ap))|nplus|c(irc|u(p|rly(vee|wedge))|ap)|triangle(down|up)|interleave|o(times|dot|plus)|uplus|parallel|vee|wedge|box))|o(t|wtie|x(slash|circle|times|dot|plus|empty|ast|minus|b(slash|ox|ar)))|u(llet|mpeq)|e(cause|t(h|ween|a))|lack(square|triangle(down|left|right)?|lozenge)|a(ck(s(im(eq)?|lash)|prime|epsilon)|r(o|wedge))|bslash)|L(sh|ong(left(arrow|rightarrow)|rightarrow|maps(to|from))|eft(arrow|rightarrow)|leftarrow|ambda|bag)|Arrownot)(?=\b|_)/,
        "constant.character.math.tex"
      ],
      [/(\\)(sum|prod|coprod|int|oint|bigcap|bigcup|bigsqcup|bigvee|bigwedge|bigodot|bigotimes|bogoplus|biguplus)\b/,"constant.character.math.tex"],
      [
        /(\\)(arccos|arcsin|arctan|arg|cos|cosh|cot|coth|csc|deg|det|dim|exp|gcd|hom|inf|ker|lg|lim|liminf|limsup|ln|log|max|min|pr|sec|sin|sinh|sup|tan|tanh)\b/,
        "constant.other.math.tex"
      ],
      [/(\\)(?!begin\{|verb)([A-Za-z]+)/, "constant.other.general.math.tex"],
      [/(?<!\\)\{/,"punctuation.math.begin.bracket.curly.tex"],
      [/(?<!\\)\}/,"punctuation.math.end.bracket.curly.tex"],
      [/(?<!\\)\(/,"punctuation.math.begin.bracket.round.tex"],
      [/(?<!\\)\)/,"punctuation.math.end.bracket.round.tex"],
      [/(([0-9]*[\.][0-9]+)|[0-9]+)/,"constant.numeric.math.tex"],
      [/[\+\*\/_\^-]/,"punctuation.math.operator.tex"],
      {include:'@laTeX'}
    ],
    texMathEscape:[
      [/\}/,"punctuation.definition.arguments.end.tex","@pop"],
      {include: '@texMath'},
      {include:'@laTeX'}
    ],
    braces:[
      [/(?<!\\)\{/,{token:"punctuation.group.begin.tex",next:"@inbraces"}]
    ],
    inbraces:[
      [/(?<!\\)\}/,{token:"punctuation.group.end.tex",next:"@pop"}],
      {include: '@laTeX'}
    ],
    
    // ----------------------------------------------------------------------------------------------------------------------------

    laTeX: [
      [/(?<=\\[\w@]|\\[\w@]{2}|\\[\w@]{3}|\\[\w@]{4}|\\[\w@]{5}|\\[\w@]{6})\s/,"meta.space-after-command.latex"],
      [/((?:\\)(?:usepackage|documentclass|libinput|libusepackage))(\[|\{)/,{token:"keyword.control.preamble.latex",goBack:1,next:"@singleWithOptArg"}],
      [
        /((?:\\)(?:(?:sub){0,2}section|(?:sub)?paragraph|chapter|part|addpart|addchap|addsec|minisec|frametitle)(?:\*)?)((?:\[[^\[]*?\]){0,2})(\{)/,
        [{token:"support.function.section.latex"},{token:"variable.parameter.function.latex"},{token:"punctuation.definition.arguments.begin.latex",next:"@inargbraces"}]
      ],

      // ...
      [/(\s*\\begin\{document\})/,"meta.function.begin-document.latex"],
      [/(\s*\\end\{document\})/,"meta.function.end-document.latex"],
      // ...
      [
        /(\s*\\begin)(\{)(\w+\*?)(\})/,
        [{token:"meta.function.begin-environment.general.latex"},{token:"punctuation.definition.arguments.begin.latex"},{token:'meta.$3.begin-environment.latex'},
          {token:"punctuation.definition.arguments.end.latex",next:'@inEnv.$3'}
        ]
      ],
      [/(\\end)(\{)(\w+\*?)(\})/,{token:"invalid.$3.end-environment.latex"}],
      { include: '@teX' }
    ],
    inEnv:[
      [
        /(\\end)(\{)(\w+\*?)(\})/,
        {cases:{
          '$3==$S2': ["meta.function.end-environment.general.latex","punctuation.definition.arguments.begin.latex",{token:'meta.$3.end-environment.latex'},
          {token:"punctuation.definition.arguments.end.latex",next:'@pop'}],
          '': {token:'@rematch',next:'@pop'}
        }}
      ],
      { include: '@laTeX' }
    ],
    singleWithOptArg: [
      [/\[/,{token:"",next:"@optionalArg"}],
      [/(?<!\\)\{/,{token:"punctuation.definition.arguments.begin.latex",switchTo:"@inargbraces"}]
    ],
    inargbraces:[
      [/(?<!\\)\}/,{token:"punctuation.definition.arguments.end.latex",next:"@pop"}],
      {include: '@laTeX'}
    ],
    optionalArg:[
      [
        /(\[)([^\[]*?)(\])/,
        [{token:"punctuation.definition.optional.arguments.begin.latex"},{token:"variable.parameter.function.latex"},{token:"punctuation.definition.optional.arguments.end.latex",next:"@pop"}]
      ]
    ],
  },
};