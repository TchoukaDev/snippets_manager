
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Dark
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'


interface CodeBlockProps {
    content: string;
    format: string;
}

export function CodeBlock({ content, format }: CodeBlockProps) {

    return (<div className="codeBlock">
        <SyntaxHighlighter style={vscDarkPlus} language={format}>
            {content}
        </SyntaxHighlighter>
    </div>);

}