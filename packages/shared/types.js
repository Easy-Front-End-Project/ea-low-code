// Shared TypeScript/JavaScript type definitions
// These types should be kept in sync between frontend and backend

/**
 * Component schema definition
 * @typedef {Object} ComponentSchema
 * @property {string} id - Unique component ID
 * @property {string} type - Component type
 * @property {string} [name] - Component name
 * @property {Object} [props] - Component properties
 * @property {Object} [styles] - Component styles
 * @property {Array<ComponentSchema>} [children] - Child components
 * @property {Array<Object>} [events] - Component events
 */

/**
 * Page schema definition
 * @typedef {Object} PageSchema
 * @property {string} id - Page ID
 * @property {string} name - Page name
 * @property {string} [title] - Page title
 * @property {ComponentSchema} root - Root component
 * @property {Array<Object>} [variables] - Page variables
 * @property {Array<Object>} [functions] - Page functions
 */

/**
 * Project schema definition
 * @typedef {Object} ProjectSchema
 * @property {string} id - Project ID
 * @property {string} name - Project name
 * @property {string} [description] - Project description
 * @property {Array<PageSchema>} pages - Project pages
 * @property {Object} [config] - Project configuration
 */

export const SCHEMA_VERSION = "1.0.0";

export const DEFAULT_PAGE_CONFIG = {
  width: "100%",
  height: "100vh",
  backgroundColor: "#ffffff",
};

export const COMPONENT_CATEGORIES = {
  BASIC: "basic",
  FORM: "form",
  LAYOUT: "layout",
  NAVIGATION: "navigation",
  DATA: "data",
  FEEDBACK: "feedback",
  PROJECT: "project",
};
