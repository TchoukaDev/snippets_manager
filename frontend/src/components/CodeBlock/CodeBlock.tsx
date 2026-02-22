import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Dark
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Light
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
    content: string;
    format: string;
}

export function CodeBlock({ content, format }: CodeBlockProps) {

    if (format === "md") {
        return (<div className="codeBlock">
            <ReactMarkdown
                components={{
                    code({ className, children }) {
                        const language = className?.replace('language-', '') || '';
                        return language ? (
                            <SyntaxHighlighter style={vscDarkPlus} language={language}>
                                {String(children)}
                            </SyntaxHighlighter>
                        ) : (
                            <code>{children}</code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>);
    } else {
        return (<div className="codeBlock">
            <SyntaxHighlighter style={vscDarkPlus} language={format}>
                {content}
            </SyntaxHighlighter>
        </div>);
    }
}