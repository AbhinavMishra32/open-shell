export const metadata = {
  title: "Versions",
  description: "Open Shell UI component-system version history.",
};

const releases = [
  {
    version: "0.1.1",
    status: "current",
    notes: [
      "Composer slot is optional in AppShell.",
      "Sidebar chrome exposes native toggle/back/forward controls.",
      "FileTree now supports tree-view style expansion, selection, line guides, and data-node APIs while preserving the Open Shell visual style.",
      "Docs now track pages/history and release changes.",
    ],
  },
  {
    version: "0.1.0",
    status: "initial release",
    notes: [
      "Initial Open Shell UI package with AppShell, Sidebar, Composer, BottomPanel, FileTree, FileBrowserPanel, and overlay primitives.",
    ],
  },
];

export default function VersionsPage() {
  return (
    <article className="docs-page-shell">
      <p className="docs-kicker">Release notes</p>
      <h1>Versions</h1>
      <p className="docs-lede">
        Every component-system release should document API changes, visual changes, and migration notes before apps are
        upgraded.
      </p>

      <section className="docs-section">
        <div className="landing-component-grid">
          {releases.map((release) => (
            <article className="landing-component-card" key={release.version}>
              <span>{release.status}</span>
              <strong>{release.version}</strong>
              {release.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}
