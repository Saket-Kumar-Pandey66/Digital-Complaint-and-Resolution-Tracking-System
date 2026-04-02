import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Select({ className, children, value, onChange, required, disabled, ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Extract options from <option> children
  const options = React.Children.map(children, (child) => {
    if (child?.type === "option") {
      return {
        value: child.props.value,
        label: child.props.children,
        disabled: child.props.disabled,
      };
    }
    return null;
  }).filter(Boolean);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (option.disabled) return;
    setIsOpen(false);
    if (onChange) {
      // Create a synthetic event object to match native select onChange behavior
      onChange({ target: { value: option.value } });
    }
  };

  return (
    <div className={cn("relative", className?.includes("w-") ? "" : "w-full")} ref={containerRef}>
      {/* Hidden native input for required validation if needed, though strictly we just use custom */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "px-3.5 py-2.5 rounded-lg text-sm font-medium outline-none transition-all cursor-pointer flex items-center justify-between border",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          isOpen
            ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)] shadow-[0_0_0_3px_var(--color-accent-muted)] text-[var(--color-text-primary)]"
            : "border-[var(--color-border-base)] bg-[var(--color-surface)] hover:bg-[var(--color-hover)] text-[var(--color-text-primary)]",
          selectedOption?.disabled && !isOpen ? "text-[var(--color-text-faint)]" : "",
          className
        )}
        {...props}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className={isOpen ? "text-[var(--color-accent)]" : "text-[var(--color-text-faint)]"} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 rounded-lg overflow-hidden shadow-2xl origin-top border border-[var(--color-border-base)]"
            style={{
              background: "var(--color-elevated)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
            }}
          >
            <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "px-3 py-2.5 rounded-md text-sm transition-all flex items-center",
                    option.disabled
                      ? "opacity-50 cursor-not-allowed text-[var(--color-text-faint)]"
                      : "cursor-pointer hover:bg-[var(--color-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
                    value === option.value && !option.disabled
                      ? "bg-[var(--color-accent-muted)] text-[var(--color-accent)] font-semibold"
                      : ""
                  )}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
