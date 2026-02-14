
import './index.css'


import { SnippetForm } from './components/SnippetForm';
import { SnippetList } from './components/SnippetList';

function App() {
  return (
    <div className="app">
      <SnippetForm />
      <SnippetList />
    </div>
  );
}

export default App;