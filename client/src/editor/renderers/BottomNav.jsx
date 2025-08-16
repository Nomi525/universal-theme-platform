export default function BottomNav({ settings }) {
  return (
    <nav className="fixed bottom-4 right-4">
      <div className="bg-white shadow rounded-lg px-4 py-2 flex gap-4">
        <span>{settings.home_icon}</span>
        <span>{settings.search_icon}</span>
        <span>{settings.cart_icon}</span>
        <span>{settings.account_icon}</span>
      </div>
    </nav>
  );
}
