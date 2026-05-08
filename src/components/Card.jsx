// src/components/Card.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * Card component – a reusable UI container with optional title, icon, actions, and children content.
 * 
 * Props:
 * - title (string): Optional. Title of the card displayed at the top.
 * - icon (React component): Optional. Icon displayed next to the title.
 * - children (React node): Optional. Main content of the card.
 * - actions (React node): Optional. Action buttons or elements displayed on the top-right.
 * - className (string): Optional. Additional Tailwind CSS classes for customization.
 */
export default function Card({ title, icon: Icon, children, actions, className = "" }) {
  return (
    <section
      aria-label={title || "Card"}
      className={`premium-card p-6 overflow-hidden ${className}`}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-gray-500" />}
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

// Prop validation for better developer experience and error catching
Card.propTypes = {
  title: PropTypes.string,        // optional title string
  icon: PropTypes.elementType,    // optional React component for icon
  children: PropTypes.node,       // optional children content
  actions: PropTypes.node,        // optional actions element
  className: PropTypes.string,    // optional additional classes
};
