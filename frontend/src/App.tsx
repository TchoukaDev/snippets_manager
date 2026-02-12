import { useState, useEffect } from 'react'
import './App.css'


import ReactMarkdown from 'react-markdown'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// Dark
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Light
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'


// Interface déplacée en dehors du composant
interface Snippet {
  id?: number
  title: string
  content: string
}

function Snippet({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        code({ className, children }) {
          const language = className?.replace('language-', '') || ''

          return language ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={language}
            >
              {String(children)}
            </SyntaxHighlighter>
          ) : (
            <code>{children}</code>
          )
        }
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // ✅ Fetch initial seulement (tableau vide)
  useEffect(() => {
    fetchSnippets()
  }, [])

  const fetchSnippets = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("http://localhost:3001/snippets")
      const data = await res.json()
      setSnippets(data)
    } catch (err) {
      console.error("Erreur lors du chargement:", err)
    } finally {
      setIsLoading(false)
    }
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) return

    try {
      const title = file.name
      const content = await file.text() // ✅ API moderne + promesse

      const res = await fetch("http://localhost:3001/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, title }),
      })

      const data = await res.json()
      // ✅ Mise à jour optimiste du state
      setSnippets(prev => [...prev, data.snippet])
      setFile(null)

    } catch (err) {
      console.error("Erreur lors de l'ajout:", err)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit" disabled={!file}>
          Add
        </button>
      </form>

      <div>
        <h1>Snippets</h1>
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <ul>
            {snippets.map((snippet, index) => (
              <li key={snippet.id ?? index}>

                <Snippet content={snippet.content} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default App