import { useState } from 'react';
import { SnippetList } from './components/SnippetList';
import { SnippetCard } from './components/SnippetCard';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { AddFileModal } from './components/Modals/AddFileModal';
import { ManageCategoriesModal } from './components/Modals/ManageCategoriesModal';
import { SnippetProvider, useSnippetContext } from './contexts/SnippetContext';

function AppContent() {
  const { currentSnippet } = useSnippetContext();
  const [isOpen, setIsOpen] = useState<Record<string, boolean> | null>(null);

  const handleOpenModal = (modal: string) => {
    setIsOpen({ ...isOpen, [modal]: true });
  };

  const handleCloseModal = (modal: string) => {
    setIsOpen({ ...isOpen, [modal]: false });
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 p-6 border-r border-sidebar-border bg-sidebar">
        <h1 className="text-2xl font-bold mb-6 border-b border-sidebar-border pb-6">Snippets Manager</h1>
        <nav className="space-y-4">
          <h2 className="font-semibold text-center text-accent-foreground mb-6">Liste des snippets</h2>
          <SnippetList />
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex gap-4">
          <Button onClick={() => handleOpenModal('addFile')}>+ Ajouter un snippet</Button>
          <Button onClick={() => handleOpenModal('manageCategories')}>Gérer les catégories</Button>
        </div>

        {currentSnippet ? <SnippetCard key={currentSnippet.id} /> : <Card><CardHeader><CardTitle className='text-center'>Aucun snippet sélectionné</CardTitle></CardHeader>
          <CardContent><p className='text-center'>Veuillez sélectionner un snippet pour l'afficher ici</p></CardContent>
        </Card>}

      </main>
      {/* Modals */}
      <AddFileModal isOpen={isOpen?.addFile ?? false} onClose={() => handleCloseModal('addFile')} />
      <ManageCategoriesModal isOpen={isOpen?.manageCategories ?? false} onClose={() => handleCloseModal('manageCategories')} />
    </div>
  );
}

function App() {
  return (
    <SnippetProvider>
      <AppContent />
    </SnippetProvider>
  );
}

export default App;
