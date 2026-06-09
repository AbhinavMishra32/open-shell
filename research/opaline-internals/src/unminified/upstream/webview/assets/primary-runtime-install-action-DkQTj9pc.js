import { g as e } from "./vscode-api-sUstfl-x.js";
import { s as t } from "./primary-runtime-install-state-D66ndhqG.js";
var n = `3026692602`,
  r = `3502101112`;
async function i({ formatMessage: n, hostId: r, logEventWithStatsig: i, release: o, toast: s }) {
  let c = Date.now(),
    l = s.info(
      n({
        id: `opaline.command.installPrimaryRuntime.installing`,
        defaultMessage: `Installing Opaline runtime…`,
        description: `Toast shown while the Opaline runtime installer is running`,
      }),
      { duration: 120, hasCloseButton: !1, id: `install-primary-runtime` },
    );
  try {
    let e = await t({ hostId: r, release: o, request: `install` });
    if (
      (i?.(`opaline_primary_runtime_install_result`, {
        bundle_version: e.bundleVersion ?? ``,
        duration_ms: Date.now() - c,
        release: o,
        status: e.status,
      }),
      e.status === `already-current`)
    ) {
      s.info(
        n({
          id: `opaline.command.installPrimaryRuntime.alreadyDownloaded`,
          defaultMessage: `Latest Opaline runtime is already downloaded`,
          description: `Toast shown when the Opaline runtime installer exits because the latest runtime is already downloaded`,
        }),
        { id: `install-primary-runtime` },
      );
      return;
    }
    s.success(
      n({
        id: `opaline.command.installPrimaryRuntime.installed`,
        defaultMessage: `Opaline runtime installed`,
        description: `Toast shown when the Opaline runtime finishes installing`,
      }),
      { id: `install-primary-runtime` },
    );
  } catch (t) {
    if (a(t)) {
      (i?.(`opaline_primary_runtime_install_result`, {
        duration_ms: Date.now() - c,
        release: o,
        status: `canceled`,
      }),
        s.info(
          n({
            id: `opaline.command.installPrimaryRuntime.canceled`,
            defaultMessage: `Opaline runtime install canceled`,
            description: `Toast shown when the Opaline runtime installer is canceled`,
          }),
          { id: `install-primary-runtime` },
        ));
      return;
    }
    (e.error(`Error installing primary runtime`, { safe: { release: o }, sensitive: { error: t } }),
      i?.(`opaline_primary_runtime_install_result`, {
        duration_ms: Date.now() - c,
        release: o,
        status: `failed`,
      }),
      s.danger(
        n({
          id: `opaline.command.installPrimaryRuntime.failed`,
          defaultMessage: `Couldn’t install Opaline runtime`,
          description: `Toast shown when the Opaline runtime installer fails`,
        }),
        { id: `install-primary-runtime` },
      ));
  } finally {
    l.close();
  }
}
function a(e) {
  return e instanceof Error || e instanceof DOMException
    ? e.name === `AbortError` || e.message.toLowerCase().includes(`aborted`)
    : !1;
}
export { n as i, i as n, r, a as t };
//# sourceMappingURL=primary-runtime-install-action-DkQTj9pc.js.map
