import Editor from '@monaco-editor/react';

interface CodeBlockEditorProps {
    content: string;
    format: string;
    onChange: (content: string) => void;
}

export default function CodeBlockEditor({ content, format, onChange }: CodeBlockEditorProps) {
    // Convertit le format en langage Monaco
    const getLanguage = (format: string) => {
        const map: Record<string, string> = {
            'md': 'markdown',
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'css': 'css',
            'html': 'html',
            'json': 'json',
        }
        return map[format] || 'plaintext'
    }
    return (
        <div>
            <Editor
                height="70vh"
                width="100%"
                value={content}
                theme='vs-dark'
                language={getLanguage(format)}
                onChange={(value) => onChange(value ?? '')}
                options={{

                    wordWrap: 'on'
                }}
            />
        </div>
    );
}