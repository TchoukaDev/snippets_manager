import { Settings } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface SettingsWrapperProps {
    onManageCategories: () => void;
    onManageTags: () => void;
}

export function SettingsWrapper({ onManageCategories, onManageTags }: SettingsWrapperProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="ml-auto">
                    <Settings className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onManageCategories}>
                    Gérer les catégories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onManageTags}>
                    Gérer les tags
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
