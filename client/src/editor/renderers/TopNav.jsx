export default function TopNav({ settings }) {
  return (
    <header className="w-full">
      <div
        className="mx-auto max-w-6xl py-3 px-4 flex items-center justify-between border-b"
        style={{
          background: settings.background_color,
          color: settings.text_color,
        }}
      >
        <div className="font-semibold">LOGO</div>
        <input
          className="hidden md:block px-3 py-2 rounded"
          placeholder={settings.desktop_search_bar_placeholder_text}
          style={{ background: settings.desktop_search_bar_background_color }}
        />
      </div>
    </header>
  );
}
