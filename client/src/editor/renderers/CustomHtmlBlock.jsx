export default function CustomHtmlBlock({ settings }) {
  // render raw HTML (trusted from your own admin)
  return (
    <div className="my-4">
      <div dangerouslySetInnerHTML={{ __html: settings.html || "" }} />
      {settings.generate_css && settings.css ? (
        <style dangerouslySetInnerHTML={{ __html: settings.css }} />
      ) : null}
    </div>
  );
}
