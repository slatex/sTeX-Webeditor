const value = `\\documentclass{llncs}

\\usepackage{stex}
\\libinput{preamble}
\\libusepackage{mylistings}

\\makeatletter

\\spn@wtheorem{axiom}{Axiom}{\\bfseries}{\\rmfamily}

\\makeatother

\\stexpatchdefinition{\\begin{definition}}{\\end{definition}}
\\stexpatchassertion[theorem]{\\begin{theorem}}{\\end{theorem}}
\\stexpatchassertion[axiom]{\\begin{axiom}}{\\end{axiom}}


\\begin{document}

\\usemodule[sTeX/ComputerScience/Software]{mod/systems/tex?sTeX}
% ^ this gives us \\stex and related concepts as semantic macros
\\usemodule[sTeX/ComputerScience/Software]{mod/systems?MMT}
% ^ this gives us \\MMT and related concepts as semantic macros
\\def\\MMT{\\symref{MMT}{{\\mdseries\\MMTname}}\\xspace}

\\title{\\stex and \\MMT}
\\author{Dennis Müller}
\\institute{Computer Science, FAU Erlangen-Nürnberg\\\\\\url{https://kwarc.info}}

\\maketitle

\\begin{abstract}
    Some examples regarding the \\MMT-integration for \\stex
\\end{abstract}

\\section{Basic Syntax}

\\stexinline"\\begin{smodule}{name}" opens a new \\symname{OMDoc?module}.
A \\symname{OMDoc?module} is translated to an \\MMT \\symname{MMT?theory}.

\\begin{smodule}{syntax}

    Within a module, we can declare new \\symname[post=s]{OMDoc?symbol} 
    with \\stexinline"\\symdecl" or \\stexinline"\\symdef":

    \\symdecl{foo}
    
    \\stexinline"\\symdecl{foo}" allows us to write \\symname{foo} or
    \\foo{\\comp{also foo}}. A \\symname{OMDoc?symbol} is translated
    to an \\MMT \\symname{MMT?constant}. 

    \\stexinline"\\notation" allows us to associate symbolic notations
    to a symbol:

    \\notation{foo}[first]{\\comp{F^{oo}}}
    \\notation{foo}[second]{\\comp{F^o_o}}

    $\\foo[first]$, $\\foo[second]$ and $\\foo$.

    \\stexinline"\\symdef" combines \\stexinline"\\symdecl" and 
    \\stexinline"\\notation":

    \\symdef{bar}{\\comp{b^{ar}}}

    $\\bar$.

    \\stexinline"\\importmodule[archive]{module}" allows us to import
    symbols from other modules (and export them to other modules).

    For example: 
    \\importmodule[sTeX/Logic/General]{mod/syntax?UniversalQuantifier}
    \\symname{foral}.

    \\stexinline"\\importmodule" is translated to an \\MMT 
    \\symname{MMT?include} and is only allowed \\emph{within}
    \\symname[post=s]{OMDoc?module}.

    \\stexinline"\\usemodule" is allowed everywhere, but does not
    \\emph{export} its contents along subsequent includes.

\\end{smodule}


\\usemodule[sTeX/MathBase/General]{mod?Mathematics}

\\section{Translating Phenomena in Informal \\Symname{mathematics} to a 
Formal System}

\\subsection{Formal Theories vs. Document Fragments}

\\stexinline"\\usemodule[archive]{module}" makes the 
\\symname[post=s]{symbol} in \\stexinline"module" available 
for use, but does not reexport its contents.
No such mechanism exists in \\MMT.

$\\Rightarrow$ \\stexinline"\\begin{smodule}" generates \\emph{two}
\\MMT \\symref{MMT?theory}{theories}: A \\emph{signature}
theory (containing exactly the \`\`declarative'' part) and a
\\emph{language} theory (containing everything else, including
an \\MMT \\symname{MMT?include} for every \\stexinline"\\usemodule").

$\\Rightarrow$ One language theory \\emph{per language} (multilingual library).

\\subsection{Implicit Arguments and Variables}

In \\MMT, \\symname[post=s]{declaration} are self-contained (i.e. closed) 
formal expressions, whereas 
\\symref{OMDoc?statement}{\\omdocname statements} are text 
fragments containing (usually/often open)
expressions. Compare
\`\`For a natural number $n$, $n+n$ is
even.'' (open expressions: $n$ and $n+n$), and the corresponding formal
declaration $\\vdash \\forall{n:\\mathbb{N}}. \\text{even}(n+n)$ (closed).

$\\Rightarrow$ We can declare variables with \\stexinline"\\vardef" 
(or on-the-fly with \\stexinline"\\svar", or single characters in math mode).

\\MMT abstracts away free variables using the \\symname{OMDoc?symbol}
\\stexinline"\\implicitbind", which marks the variable 
(and variables in its type) as an
\\emph{implicit argument}:

\\usemodule[sTeX/MathBase/Sets]{mod?Set}

\\vardef{setA}[type=\\collection]{\\comp A}
\\vardef{varx}[type=\\setA]{\\comp x}
\\vardef{vary}[type=\\setA]{\\comp y}
\\vardef{varz}[type=\\setA]{\\comp z}

\\begin{smodule}{ImplicitArguments}
    \\importmodule[sTeX/MathBase/Sets]{mod?Set}

    \\symdef{bineq}[
        name=binary-equality,eq,
        args=2, % <- semantic macro takes two arguments
        op={=}, % <- operator notation: $\\bineq!$ will yield "="
        type=\\bind{\\varx,\\vary}\\prop
    ]{#1 \\comp= #2}

    Note the actual type of \\symname{bineq} now:
        $\\bineq\\varx\\vary$
\\end{smodule}

\\subsection{Flexary Operators and Argument Sequences}

\\begin{smodule}{FlexaryOperators}
    \\importmodule[sTeX/MathBase/Sets]{mod?Set}

    How do we write e.g. $a+b+c+d+e$? Or, even worse $a=b=c$?

    $\\Rightarrow$ \\emph{Sequence arguments}

    \\symdef{eq}[name=equality,
        args=a, % <- takes one argument *sequence*
        op={=},eq,
        assoc=conj, % <- ...which represents a conjunction of 
                    %  binary applications
        type=\\bind{\\varx,\\vary}\\prop % <- type is still binary
    ]{#1}{##1 \\comp= ##2}

    \\importmodule[sTeX/Logic/General]{mod/syntax?Conjunction}
    % ^ gives us a conjunction symbol

    $\\eq{\\varx,y,z,w,v}$

    % $\\eq{a,b,c}$ % <- this will fail with type inference

    Also, for variable sequences:

    \\varseq{seqx}[type=\\setA]{1}{\\svar{n}}{{\\comp x}_{#1}}

    $\\eq\\seqx$

\\end{smodule}

\\subsection{\\Symname[post=s]{OMDoc?statement} (Theorems, Definitions, Axioms, Proofs, \\ldots)}


\\begin{smodule}{Statements}
    \\importmodule[sTeX/Logic/General]{mod/syntax?UniversalQuantifier}
    \\importmodule[sTeX/MathBase/Functions]{mod?Function}
    \\importmodule{FlexaryOperators}

    Informally, statements are complex objects with
    \`\`substatements'' (inline definitions, premises, etc.)

    Formally, statements are individual closed terms.

    $\\Rightarrow$ allow for marking up complex statements to
    allow \\MMT to assemble them into individual terms:

    \\begin{sassertion}[type=axiom,name=equality-reflexive]
        \\conclusion{\\foral{The \\symref{equality}{equation} 
        $\\arg[2]{\\eq{\\varx,\\varx}}$ holds 
        \\comp{for all} $\\arg[1]{\\inset\\varx\\setA}$}}.
    \\end{sassertion}

    (One conclusion, no premises)

    And now: \\symname{equality-reflexive}


    \\vardef{varop}[args=a,op=\\circ,assoc=bin,type=\\funspace{\\setA,\\setA}\\setA]{#1}{##1 \\comp\\circ ##2}
    \\symdecl{associative}[args=1,type=\\bind{\\varop!}\\prop]

    Definitions work similarly:

    \\begin{sdefinition}[for=associative]
        \\varbindforall{varop}

        An operation $\\fun{\\varop!}{\\setA,\\setA}\\setA$ is called
        \\definame{associative}, if \\definiens{\\foral{$\\arg[2]{
        \\eq{
            \\varop{(\\varop{\\varx,\\vary}),\\varz},
            \\varop{\\varx,(\\varop{\\vary,\\varz})}
        }
        }$ \\comp{for all} $\\arg[1]{\\inset{\\varx,\\vary,\\varz}\\setA}$}}.
    \\end{sdefinition}

    Definiens and type: \\symname{associative}.

    Or \`\`inline'':

    \\symdecl{commutative}[args=1,
        def=\\bind{\\varop!}{\\foral{\\varx,\\vary}{
            \\eq{\\varop{\\varx,\\vary},\\varop{\\vary,\\varx}}
        }}
    ]
    \\symdecl{idempotent}[args=1,
        def=\\bind{\\varop!}{\\foral{\\varx}{
            \\eq{\\varop{\\varx,\\varx},\\varx}
        }}
    ]
\\end{smodule}

\\section{Implementing \\symref{structural-feature}{Structural Features} in \\stex}

\\subsection{Mathematical Structures (Module types)}

\\begin{smodule}{MathematicalStructures}
    \\importmodule{Statements}
    \\usemodule[sTeX/MathBase/Relations]{mod?DefEqual}
    \\usemodule[sTeX/Logic/TypeTheory]{mod/types?RecType}
    
    Given a \\symname{MMT?theory} $M$, the type $\\mathtt{MOD}(M)$ 
    represents a 
    \\symname{RecType?dependent} \\symname{rectype} with 
    \\symname[post=s]{manifest-field}, with a
    \\symref{recfield}{field} of name $d$ for every 
    \\symname{MMT?declaration} with name $d$ in $M$.
    Given a 
    \\symref{recterm}{record} $m:\\mathtt{MOD}(M)$, a 
    \\symref{recfield}{field} $d$ is accessible
    via the \\symname{recproj} $m.d$ 

    \\begin{mathstructure}{semilattice}
        \\symdef{universe}[type=\\collection]{\\comp L}
        \\symdef{op}[circ,type=\\funspace{\\universe,\\universe}\\universe,args=a,op=\\circ,assoc=bin]
        {#1}{##1 \\comp\\circ ##2}
        \\begin{sdefinition}[for=semilattice,id=def:semilattice]
            A structure $\\mathstruct{\\universe,\\op!}$
            with $\\fun{\\op!}{\\universe,\\universe}\\universe$
            is called a \\definame{semilattice}, if
            \\inlineass[name=associative-axiom]{\\conclusion{
            \\associative{$\\arg{\\op!}$ is \\comp{associative}}%
            }},
            \\inlineass[name=commutative-axiom]{\\conclusion{
            \\commutative{$\\arg*{\\op!}$\\comp{commutative}}%
            }} and
            \\inlineass[name=idempotent-axiom]{\\conclusion{
            \\idempotent{$\\arg*{\\op!}$\\comp{idempotent}}%
            }}
        \\end{sdefinition}
    \\end{mathstructure}

    Instantiation:

    \\varinstantiate{varL}{semilattice}{\\mathcal{L}}

    \\begin{quotation}
    Let $\\defeq{\\varL!}{\\mathstruct{\\varL{universe},\\varL{op}!}}$
    a \\symname{semilattice}, then $\\varL!$ is 
    \\varL{commutative-axiom}{\\comp{commutative}} by definition.
    \\end{quotation}

    \\begin{quotation}
        \\varinstantiate{varLb}{semilattice}{\\mathcal{L}_2}[
          universe=setA
        ]
        Let $\\defeq{\\varLb!}{\\mathstruct{\\varLb{universe},\\varLb{op}!}}$
        a \\symname{semilattice} on $\\setA$.
    \\end{quotation}
\\end{smodule}

\\subsection{Includes with Modification (\\MMT-structures)}

\\begin{smodule}{MMTStructures}
    \\importmodule{MathematicalStructures}

    \\begin{mathstructure}{lattice}
        \\begin{copymodule}{MathematicalStructures/semilattice-structure}{joinsl}
            \\renamedecl[name=universe]{universe}{universe}
            % the target of "universe" is now called "lattice-structure?universe"
            % rather than "lattice-structure?joinsl/universe"
            \\renamedecl[name=join]{op}{join}
        \\end{copymodule}
        \\begin{copymodule}{MathematicalStructures/semilattice-structure}{meetsl}
            \\assign{universe}{\\symname{lattice-structure?universe}}
            \\renamedecl[name=meet]{op}{meet}
        \\end{copymodule}

        \\notation*{join}[op=\\vee,vee]{#1}{##1 \\comp\\vee ##2}
        \\notation*{meet}[op=\\wedge,wedge]{#1}{##1 \\comp\\wedge ##2}


        \\begin{sdefinition}[type=symdoc,for={lattice,join,meet}]
            \\vardef{vara}[type=\\universe]{\\comp a}
            \\vardef{varb}[type=\\universe]{\\comp b}
            A structure $\\mathstruct{\\universe,\\join!,\\meet!}$
            is called a \\definame{?lattice}, if
            both $\\mathstruct{\\universe,\\join!}$ and
            $\\mathstruct{\\universe,\\meet!}$ are \\symname[post=s]{semilattice},
            and the \\symref{eq}{equations}
            \\inlineass[name=absorp1-axiom]{\\conclusion{
            \\foral{
                $\\arg[2]{\\eq{
                \\join{\\vara,(\\meet{\\vara,\\varb})},\\vara
                }}$%
                $\\arg*[1]{\\vara}\\arg*[1]{\\varb}$%
            }%
            }} and
            \\inlineass[name=absorp2-axiom]{\\conclusion{
            \\foral{%
                $\\arg[2]{\\eq{
                \\meet{\\vara,(\\join{\\vara,\\varb})},\\vara
                }}$ hold \\comp{for all}
                $\\arg[1]{\\inset{\\vara,\\varb}\\universe}$%
            }%
            }}.

            The operations $\\join!$ and $\\meet!$ are called
            \\definame{join} and \\definame{meet}, respectively.
        \\end{sdefinition}
    \\end{mathstructure}
\\end{smodule}

\\subsection{Parametric Theories, Views, Realizations and Realms}

\\begin{smodule}{Realizations}
    \\importmodule{MMTStructures}

    \\begin{smodule}{DualLattice}
        \\importmodule{MMTStructures/lattice-structure}
        \\begin{interpretmodule}{MMTStructures/lattice-structure}{dual}
            \\assign{universe}{\\symname{lattice-structure?universe}}
            \\assign{join}{\\meet!}
            \\assign{meet}{\\join!}
            \\assign{joinsl/associative-axiom}{\\symname{meetsl/associative-axiom}}
            \\assign{meetsl/associative-axiom}{\\symname{joinsl/associative-axiom}}
            \\assign{joinsl/commutative-axiom}{\\symname{meetsl/commutative-axiom}}
            \\assign{meetsl/commutative-axiom}{\\symname{joinsl/commutative-axiom}}
            \\assign{joinsl/idempotent-axiom}{\\symname{meetsl/idempotent-axiom}}
            \\assign{meetsl/idempotent-axiom}{\\symname{joinsl/idempotent-axiom}}
            \\assign{absorp1-axiom}{\\symname{absorp2-axiom}}
            \\assign{absorp2-axiom}{\\symname{absorp1-axiom}}
        \\end{interpretmodule}
    \\end{smodule}
    
    \\begin{mathstructure}{lbporder}
        \\symdef{universe}[type=\\collection]{\\comp S}
        \\symdef{porder}[type=\\funspace{\\universe,\\universe}\\prop,args=2,op=\\leq]{#1 \\comp\\leq #2}

        \\symdef{lup}[name=least-upper-bound,args=a,assoc=bin,prec=\\neginfprec,
            type=\\funspace{\\universe,\\universe}\\universe,op=\\mathtt{lup}]
            {\\comp{\\mathtt{lup}}\\dobrackets{#1}}{##1 \\comp, ##2}

        \\symdef{glb}[name=greatest-lower-bound,args=a,assoc=bin,prec=\\neginfprec,
            type=\\funspace{\\universe,\\universe}\\universe,op=\\mathtt{glb}]
            {\\comp{\\mathtt{glb}}\\dobrackets{#1}}{##1 \\comp, ##2}

        \\vardef{vara}[type=\\universe]{\\comp a}
        \\vardef{varb}[type=\\universe]{\\comp b}

        \\begin{sdefinition}[for={lbporder,lup,glb}]
        A structure $\\mathstruct{\\universe,\\porder!}$ 
        is called a \\definiendum{lbporder}{locally-bounded partial order},
        if $\\porder!$ is a partial order and for all $\\inset{\\vara,\\varb}\\universe$
        there is a \\definame{lup} $\\inset{\\lup{\\vara,\\varb}}\\universe$ and 
        a \\definame{glb} $\\inset{\\glb{\\vara,\\varb}}\\universe$.
        \\end{sdefinition}

        \\begin{sassertion}[type=theorem]
            \\begin{realization}{MMTStructures/lattice-structure}
            \\assign{universe}{\\symname{lbporder-structure?universe}}
            \\assign{join}{\\lup!}  \\assign{meet}{\\glb!}
            \\end{realization}
            Every \\symref{lbporder}{locally-bounded partial order} 
            $\\mathstruct{\\universe,\\porder!}$ is a \\symname{lattice}
            $\\mathstruct{\\universe,\\join!,\\meet!}$
            with $\\eq{\\join{\\vara,\\varb},\\lup{\\vara,\\varb}}$ and 
            $\\eq{\\meet{\\vara,\\varb},\\glb{\\vara,\\varb}}$
        \\end{sassertion}
    \\end{mathstructure}
  \\end{smodule}

\\end{document}`;

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {doClient} from './client';
//import {liftOff} from './texmonarch';

doClient(5008,"container",cl => {
    //liftOff(cl.editor);
    cl.editor.setModel(monaco.editor.createModel(value, 'tex', monaco.Uri.parse('/home/jazzpirate/work/MathHub/sTeX/DemoExamples/source/mmt.tex')));
});