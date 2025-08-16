// client/src/editor/renderers/CategoriesGrid.jsx

export default function CategoriesGrid({ settings }) {
  const { categories = [] } = settings || {};
  return (
    <div className="grid grid-cols-2 gap-2">
      {categories.map((cat, i) => (
        <div key={i} className="p-2 border rounded bg-gray-50">
          {cat.name || `Category ${i + 1}`}
        </div>
      ))}
    </div>
  );
}
