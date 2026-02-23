import { useState } from 'react';
import type { Snippet } from '@shared/types';
import { Button } from './ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';

export function SnippetAccordion({ snippets, setCurrentSnippetId }: {
    snippets: Snippet[];
    setCurrentSnippetId: (id: number | null) => void;
}) {
    const categoriesSet = [...new Set(snippets.map((s) => s.category?.name).filter(Boolean))] as string[];
    const [openItems, setOpenItems] = useState<string[]>(categoriesSet);

    return (
        <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
            {categoriesSet.map((category) => (
                <AccordionItem key={category} value={category}>
                    <AccordionTrigger>{category}</AccordionTrigger>
                    <AccordionContent>
                        <ul className="list-none">
                            {snippets
                                .filter((s) => s.category?.name === category)
                                .map((s) => (
                                    <li key={s.id}>
                                        <Button
                                            variant="ghost"
                                            className="text-muted-foreground w-full justify-start"
                                            onClick={() => setCurrentSnippetId(s.id)}
                                        >
                                            {s.title}
                                        </Button>
                                    </li>
                                ))
                            }
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
