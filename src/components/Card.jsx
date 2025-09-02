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
      // Accessible label for screen readers
      aria-label={title || "Card"}
      // Tailwind CSS classes for styling, rounded corners, shadow, hover, and padding
      className={`rounded-2xl border border-gray-800 
          bg-gray-900/60 backdrop-blur shadow-xl p-5 
          transition-colors duration-200 hover:bg-gray-800/60 
          ${className}`}
    >
      {/* Render header only if title or actions exist */}
      {(title || actions) && (
        <header className="flex items-center justify-between mb-4">
          {/* Left section: icon + title */}
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-gray-500" />} {/* Optional icon */}
            {title && (
              <h3 className="text-lg font-semibold text-gray-100">
                {title}
              </h3>
            )}
          </div>
          {/* Right section: optional actions */}
          {actions}
        </header>
      )}

      {/* Main content of the card */}
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
