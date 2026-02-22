import { Button, buttonVariants } from "./button";
import type { VariantProps } from "class-variance-authority";
import React from "react";

interface NewCategoryOrTagButtonProps extends
    React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
    handleOpenModal: () => void;
    title: string;
    ariaLabel: string;
}

export function NewCategoryOrTagButton({ handleOpenModal, title, ariaLabel, ...props }: NewCategoryOrTagButtonProps) {
    return (
        <Button
            type="button"
            title={title}
            aria-label={ariaLabel}
            onClick={handleOpenModal}
            {...props}
        >
            +
        </Button>
    )
}