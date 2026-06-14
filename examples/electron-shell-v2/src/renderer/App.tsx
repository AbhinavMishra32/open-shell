import {
  BroadcastIcon,
  DesktopIcon,
  DeviceMobileSpeakerIcon,
  DotsThreeIcon,
  HeartIcon,
  ListHeartIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  MusicNotesIcon,
  MusicNotesSimpleIcon,
  PauseIcon,
  PlayIcon,
  QueueIcon,
  RadioIcon,
  RepeatIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
  SpeakerHifiIcon,
  StarIcon,
  SunIcon,
  VinylRecordIcon,
  WaveformIcon,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import {
  AppShell,
  OpalineV2HeaderToolButton,
  OpalineV2InspectorIcon,
  OpalineV2Sidebar,
  ShellIconButton,
  useOpalineTheme,
  useShellHistory,
  type OpalineV2SidebarSection,
  type OpalineV2ShellTabItem,
} from "@opaline/ui/v2";
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ScrollArea,
  Separator,
  Slider,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@opaline/ui/components";
import "./index.css";

type Album = {
  id: string;
  title: string;
  artist: string;
  accent: string;
  plays: string;
  tag: string;
};

type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  active?: boolean;
};

const albums: Album[] = [
  { id: "a1", title: "Night Signals", artist: "Vera North", accent: "opaline-cover-cobalt", plays: "4.2M", tag: "Electronic" },
  { id: "a2", title: "Glass Garden", artist: "Mina Vale", accent: "opaline-cover-moss", plays: "1.8M", tag: "Ambient" },
  { id: "a3", title: "Soft Machine", artist: "June House", accent: "opaline-cover-rose", plays: "996K", tag: "Indie" },
  { id: "a4", title: "Small Hours", artist: "The Lanes", accent: "opaline-cover-ash", plays: "2.6M", tag: "Jazz" },
];

const tracks: Track[] = [
  { id: "t1", title: "Aperture", artist: "Vera North", album: "Night Signals", duration: "3:48", active: true },
  { id: "t2", title: "Rushlight", artist: "Mina Vale", album: "Glass Garden", duration: "4:12" },
  { id: "t3", title: "Room Tone", artist: "June House", album: "Soft Machine", duration: "2:59" },
  { id: "t4", title: "Low Bridge", artist: "The Lanes", album: "Small Hours", duration: "5:04" },
  { id: "t5", title: "Afterimage", artist: "Vera North", album: "Night Signals", duration: "3:36" },
  { id: "t6", title: "Kept Warm", artist: "Mina Vale", album: "Glass Garden", duration: "4:44" },
];

export function App() {
  const [activeTrackId, setActiveTrackId] = useState("t1");
  const [isPlaying, setIsPlaying] = useState(true);
  const activeTrack = tracks.find((track) => track.id === activeTrackId) ?? tracks[0];
  const { theme, setTheme } = useOpalineTheme();
  const history = useShellHistory(
    [
      { id: "library", title: "Library", type: "route" },
      { id: "queue", title: "Up Next", type: "route" },
      { id: "listen-now", title: "Listen Now", type: "route" },
    ],
    { maxEntries: 16 },
  );

  const pushRoute = (id: string, title: string) => {
    history.push({ id, title, type: "route" });
  };

  const selectTrack = (trackId: string) => {
    const track = tracks.find((item) => item.id === trackId);
    setActiveTrackId(trackId);
    if (track != null) {
      history.push({ id: `track-${track.id}`, title: track.title, type: "track" });
    }
  };

  const sidebarSections = useMemo<OpalineV2SidebarSection[]>(
    () => [
      {
        id: "library",
        label: "Library",
        items: [
          {
            id: "listen-now",
            label: "Listen Now",
            icon: <MusicNotesIcon />,
            active: history.current?.id === "listen-now",
            meta: "⌘1",
            onSelect: () => pushRoute("listen-now", "Listen Now"),
          },
          {
            id: "browse",
            label: "Browse",
            icon: <WaveformIcon />,
            active: history.current?.id === "browse",
            meta: "⌘2",
            onSelect: () => pushRoute("browse", "Browse"),
          },
          {
            id: "radio",
            label: "Radio",
            icon: <RadioIcon />,
            active: history.current?.id === "radio",
            meta: "⌘3",
            onSelect: () => pushRoute("radio", "Radio"),
          },
        ],
      },
      {
        id: "playlists",
        label: "Playlists",
        items: [
          { id: "late-work", label: "Late Work", icon: <ListHeartIcon />, meta: "42", onSelect: () => pushRoute("late-work", "Late Work") },
          { id: "quiet-focus", label: "Quiet Focus", icon: <ListHeartIcon />, meta: "18", onSelect: () => pushRoute("quiet-focus", "Quiet Focus") },
          { id: "new-system", label: "New System", icon: <ListHeartIcon />, meta: "31", onSelect: () => pushRoute("new-system", "New System") },
        ],
      },
      {
        id: "stations",
        label: "Stations",
        items: [
          { id: "night-signals", label: "Night Signals", icon: <VinylRecordIcon />, meta: "Live", onSelect: () => pushRoute("night-signals", "Night Signals") },
          { id: "glass-garden", label: "Glass Garden", icon: <BroadcastIcon />, meta: "Mix", onSelect: () => pushRoute("glass-garden", "Glass Garden") },
          { id: "small-hours", label: "Small Hours", icon: <SpeakerHifiIcon />, meta: "New", onSelect: () => pushRoute("small-hours", "Small Hours") },
        ],
      },
    ],
    [history.current?.id],
  );

  const headerTabs = useMemo<OpalineV2ShellTabItem[]>(
    () => [
      {
        id: history.current?.id ?? "listen-now",
        title: history.current?.title ?? "Listen Now",
        active: true,
      },
    ],
    [history.current],
  );

  return (
    <AppShell
      defaultSidebarWidth={264}
      history={history}
      headerTabs={headerTabs}
      onNavigateHome={() => pushRoute("listen-now", "Listen Now")}
      sidebar={<OpalineV2Sidebar title="Opaline Music" subtitle="Local library" sections={sidebarSections} footer={<SidebarFooter />} />}
      actions={(shell) => (
        <>
          <ShellIconButton label="Search">
            <MagnifyingGlassIcon />
          </ShellIconButton>
          <DropdownMenu>
            <DropdownMenuTrigger render={<OpalineV2HeaderToolButton label="Appearance" />}>
              {theme === "light" ? <SunIcon /> : theme === "dark" ? <MoonIcon /> : <DesktopIcon />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
              <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as "system" | "light" | "dark")}>
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuRadioItem value="system">
                  <DesktopIcon />
                  System
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="light">
                  <SunIcon />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <MoonIcon />
                  Dark
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger render={<OpalineV2HeaderToolButton label="More actions" />}>
              <DotsThreeIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Library</DropdownMenuLabel>
                <DropdownMenuItem>Start station</DropdownMenuItem>
                <DropdownMenuItem>Add to playlist</DropdownMenuItem>
                <DropdownMenuItem>Share album</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={shell.toggleInspector}>
                <OpalineV2InspectorIcon />
                Toggle inspector
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      main={
        <ScrollArea className="opaline-music-main">
          <section className="opaline-hero">
            <div className="opaline-hero-copy">
              <Badge variant="secondary">Featured Mix</Badge>
              <h1>Designed for quiet, dense desktop work.</h1>
              <p>
                A music app is only the demo. The shell underneath is the part Construct can reuse: sidebar, titlebar,
                inspector, bottom slot and app content all stay separate.
              </p>
              <div className="opaline-hero-actions">
                <Button onClick={() => setIsPlaying(true)}>
                  <PlayIcon data-icon="inline-start" />
                  Play mix
                </Button>
                <Button variant="outline">
                  <HeartIcon data-icon="inline-start" />
                  Save
                </Button>
              </div>
            </div>
            <div className="opaline-feature-card opaline-cover-cobalt">
              <div className="opaline-feature-orbit">
                <WaveformIcon />
              </div>
              <span>Night Signals</span>
            </div>
          </section>

          <Tabs defaultValue="albums" className="opaline-music-tabs">
            <div className="opaline-section-heading">
              <div>
                <h2>Library</h2>
                <p>Albums, rotation, and queue-ready tracks.</p>
              </div>
              <TabsList>
                <TabsTrigger value="albums">Albums</TabsTrigger>
                <TabsTrigger value="tracks">Tracks</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="albums">
              <div className="opaline-album-grid">
                {albums.map((album) => (
                  <AlbumCard album={album} key={album.id} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="tracks">
              <TrackList activeTrackId={activeTrackId} onTrackSelect={selectTrack} tracks={tracks} />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      }
      inspector={<QueueInspector activeTrack={activeTrack} onTrackSelect={selectTrack} tracks={tracks} />}
      composer={<PlayerBar activeTrack={activeTrack} isPlaying={isPlaying} onPlayingChange={setIsPlaying} />}
    />
  );
}

function SidebarFooter() {
  return (
    <div className="opaline-sidebar-user">
      <MusicNotesSimpleIcon />
      <div>
        <div className="opaline-sidebar-user-name">Aperture</div>
        <div className="opaline-sidebar-user-meta">Vera North</div>
      </div>
      <DeviceMobileSpeakerIcon className="opaline-sidebar-device" />
    </div>
  );
}

function AlbumCard({ album }: { album: Album }) {
  return (
    <article className="opaline-album-card opaline-v2-panel">
      <div className={`opaline-album-art ${album.accent}`}>
        <MusicNotesIcon />
      </div>
      <div className="opaline-album-info">
        <div>
          <h3>{album.title}</h3>
          <p>{album.artist}</p>
        </div>
        <Badge variant="outline">{album.tag}</Badge>
      </div>
      <Separator />
      <div className="opaline-album-meta">
        <span>{album.plays} plays</span>
        <Button size="icon-xs" variant="ghost">
          <PlayIcon />
        </Button>
      </div>
    </article>
  );
}

function TrackList({
  activeTrackId,
  onTrackSelect,
  tracks,
}: {
  activeTrackId: string;
  onTrackSelect: (trackId: string) => void;
  tracks: Track[];
}) {
  return (
    <div className="opaline-track-list opaline-v2-panel">
      {tracks.map((track, index) => (
        <button
          className="opaline-track-row"
          data-active={track.id === activeTrackId ? "true" : undefined}
          key={track.id}
          onClick={() => onTrackSelect(track.id)}
          type="button"
        >
          <span className="opaline-track-index">{String(index + 1).padStart(2, "0")}</span>
          <span>
            <strong>{track.title}</strong>
            <small>{track.artist}</small>
          </span>
          <span>{track.album}</span>
          <span>{track.duration}</span>
        </button>
      ))}
    </div>
  );
}

function QueueInspector({
  activeTrack,
  onTrackSelect,
  tracks,
}: {
  activeTrack: Track;
  onTrackSelect: (trackId: string) => void;
  tracks: Track[];
}) {
  return (
    <div className="opaline-inspector">
      <div className="opaline-inspector-header">
        <QueueIcon />
        <div>
          <h2>Up Next</h2>
          <p>Queue and playback context</p>
        </div>
      </div>
      <div className="opaline-now-card opaline-v2-panel">
        <div className="opaline-now-art opaline-cover-cobalt">
          <StarIcon />
        </div>
        <h3>{activeTrack.title}</h3>
        <p>{activeTrack.artist}</p>
      </div>
      <div className="opaline-queue-list">
        {tracks.map((track) => (
          <button
            className="opaline-queue-row"
            data-active={track.id === activeTrack.id ? "true" : undefined}
            key={track.id}
            onClick={() => onTrackSelect(track.id)}
            type="button"
          >
            <span>{track.title}</span>
            <small>{track.duration}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function PlayerBar({
  activeTrack,
  isPlaying,
  onPlayingChange,
}: {
  activeTrack: Track;
  isPlaying: boolean;
  onPlayingChange: (playing: boolean) => void;
}) {
  return (
    <div className="opaline-player">
      <div className="opaline-player-track">
        <div className="opaline-player-art opaline-cover-cobalt" />
        <div>
          <strong>{activeTrack.title}</strong>
          <span>{activeTrack.artist}</span>
        </div>
      </div>
      <div className="opaline-player-controls">
        <Button size="icon-sm" variant="ghost">
          <ShuffleIcon />
        </Button>
        <Button size="icon-sm" variant="ghost">
          <SkipBackIcon />
        </Button>
        <Button size="icon" onClick={() => onPlayingChange(!isPlaying)}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <Button size="icon-sm" variant="ghost">
          <SkipForwardIcon />
        </Button>
        <Button size="icon-sm" variant="ghost">
          <RepeatIcon />
        </Button>
      </div>
      <div className="opaline-player-progress">
        <span>1:21</span>
        <Slider defaultValue={[34]} max={100} />
        <span>{activeTrack.duration}</span>
      </div>
    </div>
  );
}
