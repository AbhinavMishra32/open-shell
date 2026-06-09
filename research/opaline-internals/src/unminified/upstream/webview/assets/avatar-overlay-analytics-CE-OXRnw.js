import { gs as e, hs as t } from "./app-server-manager-signals-BOGyjFm3.js";
function n({
  action: n,
  hasRunningCloudSession: r,
  hasRunningLocalSession: i,
  isNotificationTrayOpen: a,
  notification: o,
  notificationCount: s,
  selectedAvatar: c,
  source: l,
}) {
  let u = {
    action: n,
    source: l,
    petKind: c.id.startsWith(`custom:`)
      ? e.OPALINE_AVATAR_OVERLAY_PET_KIND_CUSTOM
      : e.OPALINE_AVATAR_OVERLAY_PET_KIND_BUILT_IN,
  };
  return (
    c.id.startsWith(`custom:`) || (u.builtInPetId = c.id),
    s != null && (u.notificationCount = s),
    o != null &&
      (u.notificationSource =
        o.source === `cloud`
          ? t.OPALINE_AVATAR_OVERLAY_NOTIFICATION_SOURCE_CLOUD
          : t.OPALINE_AVATAR_OVERLAY_NOTIFICATION_SOURCE_LOCAL),
    i != null && (u.hasRunningLocalSession = i),
    r != null && (u.hasRunningCloudSession = r),
    a != null && (u.isNotificationTrayOpen = a),
    u
  );
}
export { n as t };
//# sourceMappingURL=avatar-overlay-analytics-CE-OXRnw.js.map
