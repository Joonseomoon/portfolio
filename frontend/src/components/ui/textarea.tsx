import * as React from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => (
        <textarea
            className={cn("contact-field", className)}
            style={{ resize: 'vertical', minHeight: 100 }}
            ref={ref}
            {...props}
        />
    )
);
Textarea.displayName = "Textarea";

export { Textarea };
