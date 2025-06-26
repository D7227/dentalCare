// Layout static values for consistent use across the app
// Update these values as needed to match your design system

// * TODO : This value is this time not working but we can use it in future
export const LayoutConstants = {
  // Header/Navbar
  NAVBAR_HEIGHT: 73, // px, matches h-16 (16*4=64px) in Tailwind
  NAVBAR_HEIGHT_MOBILE: 56, // px, for mobile if different

  // Sidebar
  SIDEBAR_WIDTH: 256, // px, matches w-64 (64*4=256px)
  SIDEBAR_WIDTH_COLLAPSED: 64, // px, matches w-16 (16*4=64px)
  SIDEBAR_LOGO_HEIGHT: 60, // px, as per Sidebar.tsx
  SIDEBAR_LOGO_WIDTH: 155, // px, as per Sidebar.tsx

  // Dashboard
  DASHBOARD_SECTION_GAP: 24, // px, e.g. gap-6 (6*4=24px)
  DASHBOARD_PADDING: 24, // px, e.g. p-6 (6*4=24px)
  DASHBOARD_HEADER_HEIGHT: 80, // px, estimate for dashboard header section

  // Card
  CARD_RADIUS: 12, // px, matches rounded-lg
  CARD_PADDING: 24, // px, matches p-6
  CARD_HEADER_HEIGHT: 64, // px, estimate for card header

  // Button
  BUTTON_HEIGHT: 40, // px, matches h-10
  BUTTON_HEIGHT_SM: 36, // px, matches h-9
  BUTTON_HEIGHT_LG: 44, // px, matches h-11

  // Table
  TABLE_ROW_HEIGHT: 48, // px, matches h-12
  TABLE_CELL_PADDING: 16, // px, matches px-4

  // Avatar
  AVATAR_SIZE: 40, // px, matches h-10 w-10
  AVATAR_SIZE_SM: 32, // px, for small avatars
  AVATAR_SIZE_LG: 48, // px, for large avatars

  // Progress Bar
  PROGRESS_HEIGHT: 16, // px, matches h-4

  // Tabs
  TAB_HEIGHT: 40, // px, matches h-10
  TAB_PADDING_X: 12, // px, matches px-3
  TAB_PADDING_Y: 6, // px, matches py-1.5

  // Accordion
  ACCORDION_TRIGGER_HEIGHT: 64, // px, matches py-4 (4*4=16px top+bottom) + font/line height

  // Misc
  MODAL_HEADER_HEIGHT: 64, // px, estimate for modal header
  MODAL_PADDING: 24, // px, matches p-6
};

export default LayoutConstants;
