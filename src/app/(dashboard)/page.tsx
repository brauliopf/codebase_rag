export default function friendsPage() {
  return (
    // flex-1 fills up all of the available space
    // divide-y creates a divider (line) between the header and the content
    // bring flex first! orer matters in className
    <div className="flex flex-1 flex-col divide-y">
      <header className="p-4">
        <h1 className="font-semibold">Codebase RAG</h1>
        <p className="py-4">Hold an AMA session with your GitHub repo.</p>
      </header>
    </div>
  );
}
