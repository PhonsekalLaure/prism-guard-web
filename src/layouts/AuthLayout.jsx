/**
 * AuthLayout — full-screen split layout used for authentication pages
 * (login, forgot-password, etc.).
 *
 * Slot structure:
 *  - `brandPanel`: left decorative panel (hidden on mobile)
 *  - `children`:   right content panel
 */
export default function AuthLayout({ brandPanel, children }) {
  return (
    <div className="flex min-h-screen h-screen font-[Poppins]">
      {/* Left brand panel */}
      {brandPanel}

      {/* Right content panel */}
      <div
        className="
          flex-1 bg-[#ecf0f1] flex items-center justify-center
          p-6 md:p-12 overflow-y-auto
        "
      >
        {children}
      </div>
    </div>
  );
}
