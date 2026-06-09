var e = [
    {
      id: `hotkeyWindow`,
      titleIntlId: `opaline.command.hotkeyWindow`,
      descriptionIntlId: `opaline.commandDescription.hotkeyWindow`,
      shortcutScope: `os-global`,
    },
    {
      id: `globalDictationHold`,
      titleIntlId: `opaline.command.globalDictationHold`,
      descriptionIntlId: `opaline.commandDescription.globalDictationHold`,
      shortcutScope: `os-global`,
      allowsBareModifiers: !0,
    },
    {
      id: `globalDictationToggle`,
      titleIntlId: `opaline.command.globalDictationToggle`,
      descriptionIntlId: `opaline.commandDescription.globalDictationToggle`,
      shortcutScope: `os-global`,
      allowsBareModifiers: !0,
    },
    {
      id: `copyConversationPath`,
      descriptionIntlId: `opaline.commandDescription.copyConversationPath`,
      electron: {
        menuTitle: `Copy conversation path`,
        menuTitleIntlId: `opaline.commandMenuTitle.copyConversationPath`,
        defaultKeybindings: [{ key: `CmdOrCtrl+Alt+Shift+C` }],
      },
    },
    {
      id: `copyDeeplink`,
      descriptionIntlId: `opaline.commandDescription.copyDeeplink`,
      electron: {
        menuTitle: `Copy deeplink`,
        menuTitleIntlId: `opaline.commandMenuTitle.copyDeeplink`,
        defaultKeybindings: [{ key: `CmdOrCtrl+Alt+L` }],
      },
    },
    {
      id: `copySessionId`,
      descriptionIntlId: `opaline.commandDescription.copySessionId`,
      electron: {
        menuTitle: `Copy session id`,
        menuTitleIntlId: `opaline.commandMenuTitle.copySessionId`,
        defaultKeybindings: [{ key: `CmdOrCtrl+Alt+C` }],
      },
    },
    {
      id: `copyWorkingDirectory`,
      descriptionIntlId: `opaline.commandDescription.copyWorkingDirectory`,
      electron: {
        menuTitle: `Copy working directory`,
        menuTitleIntlId: `opaline.commandMenuTitle.copyWorkingDirectory`,
        defaultKeybindings: [{ key: `CmdOrCtrl+Shift+C` }],
      },
    },
    {
      id: `closeTabOrWindow`,
      descriptionIntlId: `opaline.commandDescription.closeTabOrWindow`,
      electron: {
        menuTitle: `Close`,
        menuTitleIntlId: `opaline.commandMenuTitle.closeTabOrWindow`,
        defaultKeybindings: [{ key: `CmdOrCtrl+W` }],
      },
    },
    {
      id: `reloadBrowserPage`,
      descriptionIntlId: `opaline.commandDescription.reloadBrowserPage`,
      electron: {
        menuTitle: `Reload Browser Page`,
        menuTitleIntlId: `opaline.commandMenuTitle.reloadBrowserPage`,
        defaultKeybindings: [{ key: `CmdOrCtrl+R` }],
      },
    },
    {
      id: `hardReloadBrowserPage`,
      descriptionIntlId: `opaline.commandDescription.hardReloadBrowserPage`,
      electron: {
        menuTitle: `Force Reload Browser Page`,
        menuTitleIntlId: `opaline.commandMenuTitle.hardReloadBrowserPage`,
        defaultKeybindings: [{ key: `CmdOrCtrl+Shift+R` }],
      },
    },
    {
      id: `newWindow`,
      descriptionIntlId: `opaline.commandDescription.newWindow`,
      electron: {
        menuTitle: `New Window`,
        menuTitleIntlId: `opaline.commandMenuTitle.newWindow`,
        defaultKeybindings: [{ key: `CmdOrCtrl+Shift+N` }],
      },
    },
    {
      id: `openCommandMenu`,
      descriptionIntlId: `opaline.commandDescription.openCommandMenu`,
      electron: {
        menuTitle: `Open command menu`,
        menuTitleIntlId: `opaline.commandMenuTitle.openCommandMenu`,
        defaultKeybindings: [{ key: `CmdOrCtrl+K` }, { key: `CmdOrCtrl+Shift+P` }],
      },
    },
    {
      id: `searchChats`,
      descriptionIntlId: `opaline.commandDescription.searchChats`,
      electron: {
        menuTitle: `Search Chats…`,
        menuTitleIntlId: `opaline.commandMenuTitle.searchChats`,
        defaultKeybindings: [{ key: `CmdOrCtrl+G` }],
      },
    },
    {
      id: `searchFiles`,
      descriptionIntlId: `opaline.commandDescription.searchFiles`,
      electron: {
        menuTitle: `Search Files…`,
        menuTitleIntlId: `opaline.commandMenuTitle.searchFiles`,
        defaultKeybindings: [{ key: `CmdOrCtrl+P` }],
      },
    },
    {
      id: `renameThread`,
      descriptionIntlId: `opaline.commandDescription.renameThread`,
      electron: {
        menuTitle: `Rename chat`,
        menuTitleIntlId: `opaline.commandMenuTitle.renameThread`,
        defaultKeybindings: [{ key: `CmdOrCtrl+Alt+R` }],
      },
    },
    {
      id: `toggleFileTreePanel`,
      descriptionIntlId: `opaline.commandDescription.toggleFileTreePanel`,
      electron: {
        menuTitle: `Toggle File Tree`,
        menuTitleIntlId: `opaline.commandMenuTitle.toggleFileTreePanel`,
        defaultKeybindings: [{ key: `CmdOrCtrl+Shift+E` }],
      },
    },
    {
      id: `toggleTraceRecording`,
      descriptionIntlId: `opaline.commandDescription.toggleTraceRecording`,
      electron: {
        menuTitle: `Start Trace Recording`,
        menuTitleIntlId: `opaline.commandMenuTitle.toggleTraceRecording`,
        defaultKeybindings: [{ key: `CmdOrCtrl+Shift+S` }],
      },
    },
  ],
  t = [
    { id: `implementTodo`, vscodeCommand: { title: `Implement with Opaline`, enablement: `false` } },
    {
      id: `openSidebar`,
      vscodeCommand: {
        title: `Open Opaline Sidebar`,
        icon: { light: `resources/blossom-black.svg`, dark: `resources/blossom-white.svg` },
      },
    },
    { id: `newOpalinePanel`, vscodeCommand: { title: `New Opaline Agent`, icon: `$(plus)` } },
    { id: `addToThread`, vscodeCommand: { title: `Add to Opaline Thread` } },
    { id: `addFileToThread`, vscodeCommand: { title: `Add File to Opaline Thread` } },
    { id: `showLspMcpCliArgs`, vscodeCommand: { title: `Copy Opaline CLI args for LSP MCP` } },
    {
      id: `dumpNuxState`,
      vscodeCommand: {
        title: `Debug: print NUX state to console`,
        enablement: `chatgpt.sidebarView.visible`,
      },
    },
    {
      id: `resetNuxState`,
      vscodeCommand: { title: `Debug: reset NUX state`, enablement: `chatgpt.sidebarView.visible` },
    },
  ],
  n = [
    ...r(
      [
        {
          id: `newThread`,
          titleIntlId: `opaline.command.newThread`,
          descriptionIntlId: `opaline.commandDescription.newThread`,
          commandMenuGroupKey: `thread`,
          commandMenu: !0,
          electron: {
            menuTitle: `New Chat`,
            menuTitleIntlId: `opaline.commandMenuTitle.newThread`,
            defaultKeybindings: [{ key: `CmdOrCtrl+N` }, { key: `CmdOrCtrl+Shift+O` }],
          },
          vscodeCommand: {
            commandId: `chatgpt.newChat`,
            title: `New Thread in Opaline Sidebar`,
            keybinding: { key: `ctrl+n`, mac: `cmd+n`, when: `chatgpt.supportsNewChatKeyShortcut` },
          },
        },
        {
          id: `quickChat`,
          titleIntlId: `opaline.command.quickChat`,
          descriptionIntlId: `opaline.commandDescription.quickChat`,
          commandMenuGroupKey: `thread`,
          commandMenu: !0,
          electron: {
            menuTitle: `Quick Chat`,
            menuTitleIntlId: `opaline.commandMenuTitle.quickChat`,
            defaultKeybindings: [{ key: `CmdOrCtrl+Alt+N` }],
          },
        },
        {
          id: `openThreadInNewWindow`,
          titleIntlId: `opaline.command.openThreadInNewWindow`,
          descriptionIntlId: `opaline.commandDescription.openThreadInNewWindow`,
          commandMenuGroupKey: `thread`,
          commandMenu: !0,
          electron: {
            menuTitle: `Open in New Window`,
            menuTitleIntlId: `opaline.commandMenuTitle.openThreadInNewWindow`,
          },
        },
        {
          id: `archiveThread`,
          titleIntlId: `opaline.command.archiveThread`,
          descriptionIntlId: `opaline.commandDescription.archiveThread`,
          commandMenuGroupKey: `thread`,
          commandMenu: !0,
          electron: {
            menuTitle: `Archive chat`,
            menuTitleIntlId: `opaline.commandMenuTitle.archiveThread`,
            defaultKeybindings: [{ key: `CmdOrCtrl+Shift+A` }],
          },
        },
        {
          id: `toggleThreadPin`,
          titleIntlId: `opaline.command.toggleThreadPin`,
          descriptionIntlId: `opaline.commandDescription.toggleThreadPin`,
          commandMenuGroupKey: `thread`,
          commandMenu: !0,
          electron: {
            menuTitle: `Pin/unpin chat`,
            menuTitleIntlId: `opaline.commandMenuTitle.toggleThreadPin`,
            defaultKeybindings: [{ key: `CmdOrCtrl+Alt+P` }],
          },
        },
        {
          id: `copyConversationMarkdown`,
          titleIntlId: `opaline.command.copyConversationMarkdown`,
          descriptionIntlId: `opaline.commandDescription.copyConversationMarkdown`,
        },
        {
          id: `openSideChat`,
          titleIntlId: `opaline.command.openSideChat`,
          descriptionIntlId: `opaline.commandDescription.openSideChat`,
          commandMenuGroupKey: `thread`,
          commandMenu: !0,
        },
        {
          id: `openControlWindow`,
          titleIntlId: `opaline.command.openControlWindow`,
          descriptionIntlId: `opaline.commandDescription.openControlWindow`,
          commandMenuGroupKey: `app`,
          commandMenu: !0,
        },
        {
          id: `composer.openModelPicker`,
          titleIntlId: `opaline.command.composer.openModelPicker`,
          descriptionIntlId: `opaline.commandDescription.composer.openModelPicker`,
          shortcutScope: `app`,
          electron: { defaultKeybindings: [{ key: `Ctrl+Shift+M` }] },
        },
        {
          id: `composer.startVoiceMode`,
          titleIntlId: `opaline.command.composer.startVoiceMode`,
          descriptionIntlId: `opaline.commandDescription.composer.startVoiceMode`,
          shortcutScope: `app`,
          electron: { defaultKeybindings: [{ key: `Ctrl+Shift+V` }] },
        },
        {
          id: `composer.startDictation`,
          titleIntlId: `opaline.command.composer.startDictation`,
          descriptionIntlId: `opaline.commandDescription.composer.startDictation`,
          shortcutScope: `app`,
          electron: {
            menuTitle: `Dictation`,
            menuTitleIntlId: `opaline.commandMenuTitle.composer.startDictation`,
            defaultKeybindings: [{ key: `Ctrl+Shift+D` }],
          },
        },
        {
          id: `composer.submit`,
          titleIntlId: `opaline.command.composer.submit`,
          descriptionIntlId: `opaline.commandDescription.composer.submit`,
          shortcutScope: `app`,
        },
        {
          id: `composer.toggleFastMode`,
          titleIntlId: `opaline.command.composer.toggleFastMode`,
          descriptionIntlId: `opaline.commandDescription.composer.toggleFastMode`,
          shortcutScope: `app`,
        },
        {
          id: `composer.increaseReasoningEffort`,
          titleIntlId: `opaline.command.composer.increaseReasoningEffort`,
          descriptionIntlId: `opaline.commandDescription.composer.increaseReasoningEffort`,
          shortcutScope: `app`,
        },
        {
          id: `composer.decreaseReasoningEffort`,
          titleIntlId: `opaline.command.composer.decreaseReasoningEffort`,
          descriptionIntlId: `opaline.commandDescription.composer.decreaseReasoningEffort`,
          shortcutScope: `app`,
        },
        {
          id: `composer.cycleReasoningEffort`,
          titleIntlId: `opaline.command.composer.cycleReasoningEffort`,
          descriptionIntlId: `opaline.commandDescription.composer.cycleReasoningEffort`,
          shortcutScope: `app`,
        },
        {
          id: `composer.togglePlanMode`,
          titleIntlId: `opaline.command.composer.togglePlanMode`,
          descriptionIntlId: `opaline.commandDescription.composer.togglePlanMode`,
          shortcutScope: `app`,
        },
        {
          id: `approval.approve`,
          titleIntlId: `opaline.command.approval.approve`,
          descriptionIntlId: `opaline.commandDescription.approval.approve`,
          shortcutScope: `app`,
          electron: { defaultKeybindings: [{ key: `Enter` }] },
        },
        {
          id: `approval.decline`,
          titleIntlId: `opaline.command.approval.decline`,
          descriptionIntlId: `opaline.commandDescription.approval.decline`,
          shortcutScope: `app`,
          electron: { defaultKeybindings: [{ key: `Escape` }] },
        },
        {
          id: `git.commit`,
          titleIntlId: `opaline.command.git.commit`,
          descriptionIntlId: `opaline.commandDescription.git.commit`,
          shortcutScope: `app`,
          commandMenuGroupKey: `workspace`,
          commandMenu: !0,
        },
        {
          id: `git.createPullRequest`,
          titleIntlId: `opaline.command.git.createPullRequest`,
          descriptionIntlId: `opaline.commandDescription.git.createPullRequest`,
          shortcutScope: `app`,
          commandMenuGroupKey: `workspace`,
          commandMenu: !0,
        },
        {
          id: `forkThread`,
          titleIntlId: `opaline.command.forkThread`,
          descriptionIntlId: `opaline.commandDescription.forkThread`,
          shortcutScope: `app`,
        },
        {
          id: `openAvatarOverlay`,
          titleIntlId: `opaline.command.openPetOverlay`,
          descriptionIntlId: `opaline.commandDescription.openPetOverlay`,
          commandMenuGroupKey: `app`,
          commandMenu: !0,
          electron: {
            menuTitle: `Wake Pet`,
            menuTitleIntlId: `opaline.commandMenuTitle.openAvatarOverlay`,
          },
        },
        {
          id: `previousThread`,
          titleIntlId: `opaline.command.previousThread`,
          descriptionIntlId: `opaline.commandDescription.previousThread`,
          commandMenuGroupKey: `navigation`,
          commandMenu: !0,
          electron: {
            menuTitle: `Previous Chat`,
            menuTitleIntlId: `opaline.commandMenuTitle.previousThread`,
            defaultKeybindings: [{ key: `CmdOrCtrl+Shift+[` }],
          },
        },
        {
          id: `previousRecentThread`,
          titleIntlId: `opaline.command.previousRecentThread`,
          descriptionIntlId: `opaline.commandDescription.previousRecentThread`,
          availableIn: [`electron`],
          shortcutScope: `app`,
          allowsKeyRepeat: !0,
          commandMenuGroupKey: `navigation`,
          electron: { defaultKeybindings: [{ key: `Ctrl+Shift+Tab` }] },
        },
        {
          id: `nextThread`,
          titleIntlId: `opaline.command.nextThread`,
          descriptionIntlId: `opaline.commandDescription.nextThread`,
          commandMenuGroupKey: `navigation`,
          commandMenu: !0,
          electron: {
            menuTitle: `Next Chat`,
            menuTitleIntlId: `opaline.commandMenuTitle.nextThread`,
            defaultKeybindings: [{ key: `CmdOrCtrl+Shift+]` }],
          },
        },
        {
          id: `nextRecentThread`,
          titleIntlId: `opaline.command.nextRecentThread`,
          descriptionIntlId: `opaline.commandDescription.nextRecentThread`,
          availableIn: [`electron`],
          shortcutScope: `app`,
          allowsKeyRepeat: !0,
          commandMenuGroupKey: `navigation`,
          electron: { defaultKeybindings: [{ key: `Ctrl+Tab` }] },
        },
        {
          id: `settings`,
          titleIntlId: `opaline.command.settings`,
          descriptionIntlId: `opaline.commandDescription.settings`,
          commandMenuGroupKey: `app`,
          commandMenu: !0,
          electron: {
            menuTitle: `Settings…`,
            menuTitleIntlId: `opaline.commandMenuTitle.settings`,
            defaultKeybindings: [{ key: `CmdOrCtrl+,` }],
          },
        },
        {
          id: `mcpSettings`,
          titleIntlId: `opaline.command.mcpSettings`,
          descriptionIntlId: `opaline.commandDescription.mcpSettings`,
          commandMenuGroupKey: `configure`,
          commandMenu: !0,
        },
        {
          id: `personalitySettings`,
          titleIntlId: `opaline.command.personalitySettings`,
          descriptionIntlId: `opaline.commandDescription.personalitySettings`,
          commandMenuGroupKey: `configure`,
          commandMenu: !0,
        },
        {
          id: `keyboardShortcuts`,
          titleIntlId: `opaline.command.keyboardShortcuts`,
          descriptionIntlId: `opaline.commandDescription.keyboardShortcuts`,
          commandMenuGroupKey: `configure`,
          commandMenu: !0,
        },
        {
          id: `showKeyboardShortcuts`,
          titleIntlId: `opaline.command.showKeyboardShortcuts`,
          descriptionIntlId: `opaline.commandDescription.showKeyboardShortcuts`,
          availableIn: [`electron`],
          shortcutScope: `app`,
          electron: {
            menuTitle: `Keyboard Shortcuts`,
            menuTitleIntlId: `opaline.commandMenuTitle.showKeyboardShortcuts`,
            defaultKeybindings: [{ key: `CmdOrCtrl+Shift+/` }],
          },
        },
        {
          id: `manageTasks`,
          titleIntlId: `opaline.command.manageTasks`,
          descriptionIntlId: `opaline.commandDescription.manageTasks`,
          commandMenuGroupKey: `app`,
          commandMenu: !0,
        },
        {
          id: `openProcessManager`,
          titleIntlId: `opaline.command.openProcessManager`,
          descriptionIntlId: `opaline.commandDescription.openProcessManager`,
          availableIn: [`electron`],
          shortcutScope: `app`,
          commandMenuGroupKey: `app`,
          commandMenu: !0,
          electron: {
            menuTitle: `Process Manager`,
            menuTitleIntlId: `opaline.commandMenuTitle.openProcessManager`,
            defaultKeybindings: [{ key: `Ctrl+Alt+M` }],
          },
        },
        {
          id: `forceReloadSkills`,
          titleIntlId: `opaline.command.forceReloadSkills`,
          descriptionIntlId: `opaline.commandDescription.forceReloadSkills`,
          commandMenuGroupKey: `skills`,
          commandMenu: !0,
        },
        {
          id: `installPrimaryRuntime`,
          titleIntlId: `opaline.command.installPrimaryRuntime`,
          descriptionIntlId: `opaline.commandDescription.installPrimaryRuntime`,
          commandMenuGroupKey: `configure`,
          commandMenu: !0,
        },
        {
          id: `openSkills`,
          titleIntlId: `opaline.command.openSkills`,
          descriptionIntlId: `opaline.commandDescription.openSkills`,
          commandMenuGroupKey: `skills`,
          commandMenu: !0,
        },
        {
          id: `openFolder`,
          titleIntlId: `opaline.command.openFolder`,
          descriptionIntlId: `opaline.commandDescription.openFolder`,
          commandMenuGroupKey: `workspace`,
          commandMenu: !0,
          electron: {
            menuTitle: `Open Folder…`,
            menuTitleIntlId: `opaline.commandMenuTitle.openFolder`,
            defaultKeybindings: [{ key: `CmdOrCtrl+O` }],
          },
        },
        {
          id: `toggleSidebar`,
          titleIntlId: `opaline.command.toggleSidebar`,
          descriptionIntlId: `opaline.commandDescription.toggleSidebar`,
          commandMenuGroupKey: `panels`,
          commandMenu: !0,
          electron: {
            menuTitle: `Toggle Sidebar`,
            menuTitleIntlId: `opaline.commandMenuTitle.toggleSidebar`,
            defaultKeybindings: [{ key: `CmdOrCtrl+B` }],
          },
        },
        {
          id: `toggleBottomPanel`,
          titleIntlId: `opaline.command.toggleBottomPanel`,
          descriptionIntlId: `opaline.commandDescription.toggleBottomPanel`,
          commandMenuGroupKey: `panels`,
          commandMenu: !0,
          electron: {
            menuTitle: `Toggle Bottom Panel`,
            menuTitleIntlId: `opaline.commandMenuTitle.toggleBottomPanel`,
            defaultKeybindings: [{ key: `CmdOrCtrl+J` }],
          },
        },
        {
          id: `toggleTerminal`,
          titleIntlId: `opaline.command.toggleTerminal`,
          descriptionIntlId: `opaline.commandDescription.toggleTerminal`,
          commandMenuGroupKey: `panels`,
          commandMenu: !0,
          electron: {
            menuTitle: `Open Terminal`,
            menuTitleIntlId: `opaline.commandMenuTitle.toggleTerminal`,
            defaultKeybindings: [{ key: "Control+`" }],
          },
        },
        {
          id: `openBrowserTab`,
          titleIntlId: `opaline.command.openBrowserTab`,
          descriptionIntlId: `opaline.commandDescription.openBrowserTab`,
          commandMenuGroupKey: `panels`,
          commandMenu: !0,
          electron: {
            menuTitle: `Open Browser Tab`,
            menuTitleIntlId: `opaline.commandMenuTitle.openBrowserTab`,
            defaultKeybindings: [{ key: `CmdOrCtrl+T` }],
          },
        },
        {
          id: `toggleBrowserPanel`,
          titleIntlId: `opaline.command.toggleBrowserPanel`,
          descriptionIntlId: `opaline.commandDescription.toggleBrowserPanel`,
          commandMenuGroupKey: `panels`,
          commandMenu: !0,
          electron: {
            menuTitle: `Toggle Browser Panel`,
            menuTitleIntlId: `opaline.commandMenuTitle.toggleBrowserPanel`,
            defaultKeybindings: [{ key: `CmdOrCtrl+Shift+B` }],
          },
        },
        {
          id: `openReviewTab`,
          titleIntlId: `opaline.command.openReviewTab`,
          descriptionIntlId: `opaline.commandDescription.openReviewTab`,
          availableIn: [`electron`, `browser`],
          shortcutScope: `app`,
          commandMenuGroupKey: `panels`,
          commandMenu: !0,
          electron: { defaultKeybindings: [{ key: `Ctrl+Shift+G` }] },
        },
        {
          id: `toggleSidePanel`,
          titleIntlId: `opaline.command.toggleSidePanel`,
          descriptionIntlId: `opaline.commandDescription.toggleSidePanel`,
          commandMenuGroupKey: `panels`,
          commandMenu: !0,
          electron: {
            menuTitle: `Toggle Side Panel`,
            menuTitleIntlId: `opaline.commandMenuTitle.toggleSidePanel`,
            defaultKeybindings: [{ key: `CmdOrCtrl+Alt+B` }],
          },
        },
        {
          id: `toggleMaximizeSidePanel`,
          titleIntlId: `opaline.command.toggleMaximizeSidePanel`,
          descriptionIntlId: `opaline.commandDescription.toggleMaximizeSidePanel`,
          shortcutScope: `app`,
        },
        {
          id: `findInThread`,
          titleIntlId: `opaline.command.findInThread`,
          descriptionIntlId: `opaline.commandDescription.findInThread`,
          commandMenuGroupKey: `navigation`,
          commandMenu: !0,
          electron: {
            menuTitle: `Find`,
            menuTitleIntlId: `opaline.commandMenuTitle.findInThread`,
            defaultKeybindings: [{ key: `CmdOrCtrl+F` }],
            platformDefaultKeybindings: {
              macOS: [{ key: `Command+F` }],
              default: [{ key: `Ctrl+F` }],
            },
          },
        },
        {
          id: `focusBrowserAddressBar`,
          titleIntlId: `opaline.command.focusBrowserAddressBar`,
          descriptionIntlId: `opaline.commandDescription.focusBrowserAddressBar`,
          commandMenuGroupKey: `navigation`,
          commandMenu: !0,
          electron: {
            menuTitle: `Focus Browser Address Bar`,
            menuTitleIntlId: `opaline.commandMenuTitle.focusBrowserAddressBar`,
            defaultKeybindings: [{ key: `CmdOrCtrl+L` }],
          },
        },
        {
          id: `navigateBack`,
          titleIntlId: `opaline.command.navigateBack`,
          descriptionIntlId: `opaline.commandDescription.navigateBack`,
          commandMenuGroupKey: `navigation`,
          commandMenu: !0,
          electron: {
            menuTitle: `Back`,
            menuTitleIntlId: `opaline.commandMenuTitle.navigateBack`,
            defaultKeybindings: [{ key: `CmdOrCtrl+[` }, { key: `MouseBack` }],
          },
        },
        {
          id: `navigateForward`,
          titleIntlId: `opaline.command.navigateForward`,
          descriptionIntlId: `opaline.commandDescription.navigateForward`,
          commandMenuGroupKey: `navigation`,
          commandMenu: !0,
          electron: {
            menuTitle: `Forward`,
            menuTitleIntlId: `opaline.commandMenuTitle.navigateForward`,
            defaultKeybindings: [{ key: `CmdOrCtrl+]` }, { key: `MouseForward` }],
          },
        },
        {
          id: `logOut`,
          titleIntlId: `opaline.command.logOut`,
          descriptionIntlId: `opaline.commandDescription.logOut`,
          commandMenuGroupKey: `app`,
          commandMenu: !0,
        },
        {
          id: `feedback`,
          titleIntlId: `opaline.command.feedback`,
          descriptionIntlId: `opaline.commandDescription.feedback`,
          commandMenuGroupKey: `app`,
          commandMenu: !0,
        },
        {
          id: `environmentAction1`,
          titleIntlId: `opaline.command.environmentAction1`,
          descriptionIntlId: `opaline.commandDescription.environmentActionSlot`,
          shortcutScope: `app`,
          commandMenuGroupKey: `workspace`,
          electron: { defaultKeybindings: [{ key: `Command+Shift+D` }] },
        },
        {
          id: `environmentAction2`,
          titleIntlId: `opaline.command.environmentAction2`,
          descriptionIntlId: `opaline.commandDescription.environmentActionSlot`,
          shortcutScope: `app`,
          commandMenuGroupKey: `workspace`,
        },
        {
          id: `environmentAction3`,
          titleIntlId: `opaline.command.environmentAction3`,
          descriptionIntlId: `opaline.commandDescription.environmentActionSlot`,
          shortcutScope: `app`,
          commandMenuGroupKey: `workspace`,
        },
        {
          id: `environmentAction4`,
          titleIntlId: `opaline.command.environmentAction4`,
          descriptionIntlId: `opaline.commandDescription.environmentActionSlot`,
          shortcutScope: `app`,
          commandMenuGroupKey: `workspace`,
        },
        {
          id: `environmentAction5`,
          titleIntlId: `opaline.command.environmentAction5`,
          descriptionIntlId: `opaline.commandDescription.environmentActionSlot`,
          shortcutScope: `app`,
          commandMenuGroupKey: `workspace`,
        },
        {
          id: `environmentAction6`,
          titleIntlId: `opaline.command.environmentAction6`,
          descriptionIntlId: `opaline.commandDescription.environmentActionSlot`,
          shortcutScope: `app`,
          commandMenuGroupKey: `workspace`,
        },
        {
          id: `environmentAction7`,
          titleIntlId: `opaline.command.environmentAction7`,
          descriptionIntlId: `opaline.commandDescription.environmentActionSlot`,
          shortcutScope: `app`,
          commandMenuGroupKey: `workspace`,
        },
        {
          id: `environmentAction8`,
          titleIntlId: `opaline.command.environmentAction8`,
          descriptionIntlId: `opaline.commandDescription.environmentActionSlot`,
          shortcutScope: `app`,
          commandMenuGroupKey: `workspace`,
        },
        {
          id: `environmentAction9`,
          titleIntlId: `opaline.command.environmentAction9`,
          descriptionIntlId: `opaline.commandDescription.environmentActionSlot`,
          shortcutScope: `app`,
          commandMenuGroupKey: `workspace`,
        },
        {
          id: `thread1`,
          titleIntlId: `opaline.command.thread1`,
          descriptionIntlId: `opaline.commandDescription.threadSlot`,
          electron: {
            menuTitle: `Go to Chat 1`,
            menuTitleIntlId: `opaline.commandMenuTitle.thread1`,
            defaultKeybindings: [{ key: `CmdOrCtrl+1` }],
          },
        },
        {
          id: `thread2`,
          titleIntlId: `opaline.command.thread2`,
          descriptionIntlId: `opaline.commandDescription.threadSlot`,
          electron: {
            menuTitle: `Go to Chat 2`,
            menuTitleIntlId: `opaline.commandMenuTitle.thread2`,
            defaultKeybindings: [{ key: `CmdOrCtrl+2` }],
          },
        },
        {
          id: `thread3`,
          titleIntlId: `opaline.command.thread3`,
          descriptionIntlId: `opaline.commandDescription.threadSlot`,
          electron: {
            menuTitle: `Go to Chat 3`,
            menuTitleIntlId: `opaline.commandMenuTitle.thread3`,
            defaultKeybindings: [{ key: `CmdOrCtrl+3` }],
          },
        },
        {
          id: `thread4`,
          titleIntlId: `opaline.command.thread4`,
          descriptionIntlId: `opaline.commandDescription.threadSlot`,
          electron: {
            menuTitle: `Go to Chat 4`,
            menuTitleIntlId: `opaline.commandMenuTitle.thread4`,
            defaultKeybindings: [{ key: `CmdOrCtrl+4` }],
          },
        },
        {
          id: `thread5`,
          titleIntlId: `opaline.command.thread5`,
          descriptionIntlId: `opaline.commandDescription.threadSlot`,
          electron: {
            menuTitle: `Go to Chat 5`,
            menuTitleIntlId: `opaline.commandMenuTitle.thread5`,
            defaultKeybindings: [{ key: `CmdOrCtrl+5` }],
          },
        },
        {
          id: `thread6`,
          titleIntlId: `opaline.command.thread6`,
          descriptionIntlId: `opaline.commandDescription.threadSlot`,
          electron: {
            menuTitle: `Go to Chat 6`,
            menuTitleIntlId: `opaline.commandMenuTitle.thread6`,
            defaultKeybindings: [{ key: `CmdOrCtrl+6` }],
          },
        },
        {
          id: `thread7`,
          titleIntlId: `opaline.command.thread7`,
          descriptionIntlId: `opaline.commandDescription.threadSlot`,
          electron: {
            menuTitle: `Go to Chat 7`,
            menuTitleIntlId: `opaline.commandMenuTitle.thread7`,
            defaultKeybindings: [{ key: `CmdOrCtrl+7` }],
          },
        },
        {
          id: `thread8`,
          titleIntlId: `opaline.command.thread8`,
          descriptionIntlId: `opaline.commandDescription.threadSlot`,
          electron: {
            menuTitle: `Go to Chat 8`,
            menuTitleIntlId: `opaline.commandMenuTitle.thread8`,
            defaultKeybindings: [{ key: `CmdOrCtrl+8` }],
          },
        },
        {
          id: `thread9`,
          titleIntlId: `opaline.command.thread9`,
          descriptionIntlId: `opaline.commandDescription.threadSlot`,
          electron: {
            menuTitle: `Go to Chat 9`,
            menuTitleIntlId: `opaline.commandMenuTitle.thread9`,
            defaultKeybindings: [{ key: `CmdOrCtrl+9` }],
          },
        },
      ],
      `webview`,
    ),
    ...r(t, `vscode-only`),
    ...r(e, `electron-only`),
  ];
function r(e, t) {
  return e.map((e) => ({ ...e, kind: t }));
}
var i = [`thread`, `navigation`, `panels`, `workspace`, `skills`, `configure`, `app`],
  a = new Map();
for (let e of n) {
  if (a.has(e.id)) throw Error(`Duplicate Opaline command id: ${e.id}`);
  a.set(e.id, e);
}
var o = n.filter((e) => e.kind === `webview` && /^thread[1-9]$/.test(e.id)).map((e) => e.id),
  s = n
    .filter((e) => e.kind === `webview` && /^environmentAction[1-9]$/.test(e.id))
    .map((e) => e.id);
(n.flatMap((e) => {
  let t = b(e);
  return t?.menuTitle == null || t.menuTitleIntlId == null ? [] : [t.menuTitleIntlId];
}),
  n.flatMap((e) => {
    if (!(`vscodeCommand` in e) || e.vscodeCommand == null) return [];
    let { commandId: t = `chatgpt.${e.id}`, ...n } = e.vscodeCommand;
    return [{ commandId: t, ...n }];
  }));
function c(e) {
  return a.get(e) ?? null;
}
function l(e) {
  return a.has(e);
}
function u(e) {
  return e.kind === `webview` && `commandMenu` in e && e.commandMenu === !0;
}
function d(e, t) {
  return e.availableIn?.includes(t) ?? !0;
}
function f(e) {
  return !x(e);
}
function p(e) {
  return `descriptionIntlId` in e;
}
function m(e) {
  return (
    `shortcutScope` in e &&
    e.shortcutScope === `os-global` &&
    `allowsBareModifiers` in e &&
    e.allowsBareModifiers === !0
  );
}
function h(e) {
  return `shortcutScope` in e && e.shortcutScope === `os-global`;
}
function g(e) {
  return e === `MouseBack` || e === `MouseForward`;
}
function _({ commandId: e, isMacOS: t }) {
  return v({ commandId: e, isMacOS: t })[0] ?? null;
}
function v({ commandId: e, isMacOS: t }) {
  let n = c(e);
  if (n == null || !f(n)) return [];
  let r = b(n);
  return r == null
    ? []
    : t === !0 && r.platformDefaultKeybindings?.macOS != null
      ? r.platformDefaultKeybindings.macOS.map((e) => e.key)
      : t === !1 && r.platformDefaultKeybindings?.default != null
        ? r.platformDefaultKeybindings.default.map((e) => e.key)
        : r.defaultKeybindings == null
          ? []
          : r.defaultKeybindings.map((e) => e.key);
}
function y({ commandId: e, keymapState: t, isMacOS: n }) {
  let r = c(e);
  if (r == null || !f(r)) return [];
  let i = t?.bindings.filter((t) => t.command === e);
  if (i != null && i.length > 0) {
    let e = [];
    for (let t of i) {
      if (t.key == null) return [];
      e.push(t.key);
    }
    return e;
  }
  return v({ commandId: e, isMacOS: n });
}
function b(e) {
  return e == null || !(`electron` in e) || e.electron == null ? null : e.electron;
}
function x(e) {
  return e.kind === `vscode-only`;
}
var S = 1e3;
function C(e) {
  return e.trim().split(/\s+/).filter(Boolean);
}
var w = new Map([
  [`LeftOption+RightOption`, `⌥ + ⌥`],
  [`LeftAlt+RightAlt`, `⌥ + ⌥`],
  [`LeftCommand+RightCommand`, `⌘ + ⌘`],
  [`LeftCmd+RightCmd`, `⌘ + ⌘`],
  [`LeftMeta+RightMeta`, `⌘ + ⌘`],
  [`LeftShift+RightShift`, `⇧ + ⇧`],
]);
function T() {
  return typeof navigator > `u` ? !1 : (navigator.platform ?? ``).startsWith(`Mac`);
}
function E() {
  return typeof navigator > `u` ? !1 : (navigator.platform ?? ``).startsWith(`Linux`);
}
function D(e, t = T(), n = !t && E()) {
  return C(e)
    .map((e) => O(e, t, n))
    .join(` `);
}
function O(e, t, n) {
  let r = w.get(e);
  if (t && r != null) return r;
  let i = e.split(`+`).filter(Boolean),
    a = new Set(),
    o = null;
  for (let e of i)
    switch (e) {
      case `CmdOrCtrl`:
        a.add(t ? `Command` : `Ctrl`);
        break;
      case `Command`:
      case `Cmd`:
        a.add(t ? `Command` : n ? `Super` : `Win`);
        break;
      case `Control`:
      case `Ctrl`:
        a.add(`Ctrl`);
        break;
      case `Alt`:
      case `Option`:
        a.add(`Alt`);
        break;
      case `Shift`:
        a.add(`Shift`);
        break;
      default:
        o = e;
        break;
    }
  t && o === `/` && a.has(`Shift`) && (a.delete(`Shift`), (o = `?`));
  let s = k(o, t);
  if (t) {
    let e = { Ctrl: `⌃`, Alt: `⌥`, Shift: `⇧`, Command: `⌘` };
    return `${[`Ctrl`, `Alt`, `Shift`, `Command`]
      .filter((e) => a.has(e))
      .map((t) => e[t])
      .join(``)}${s}`;
  }
  let c = Array.from(a).map((e) => (e === `Command` ? `Cmd` : e));
  return [...[`Ctrl`, `Alt`, `Shift`, `Cmd`, `Super`, `Win`].filter((e) => c.includes(e)), s]
    .filter(Boolean)
    .join(`+`);
}
function k(e, t) {
  if (e == null) return ``;
  if (t && e === `Plus`) return `+`;
  switch (e) {
    case `Enter`:
      return `⏎`;
    case `LeftOption`:
      return t ? `Left ⌥` : `Left Option`;
    case `RightOption`:
      return t ? `Right ⌥` : `Right Option`;
    case `DoubleOption`:
      return t ? `⌥ + ⌥` : `Double Option`;
    case `LeftCommand`:
      return t ? `Left ⌘` : `Left Command`;
    case `DoubleCommand`:
      return t ? `⌘ + ⌘` : `Double Command`;
    case `RightCommand`:
      return t ? `Right ⌘` : `Right Command`;
    case `LeftControl`:
      return t ? `Left ⌃` : `Left Control`;
    case `RightControl`:
      return t ? `Right ⌃` : `Right Control`;
    case `LeftShift`:
      return t ? `Left ⇧` : `Left Shift`;
    case `RightShift`:
      return t ? `Right ⇧` : `Right Shift`;
    case `DoubleShift`:
      return t ? `⇧ + ⇧` : `Double Shift`;
    case `Fn`:
      return `Fn`;
    case `MouseBack`:
      return `Mouse Back`;
    case `MouseForward`:
      return `Mouse Forward`;
    default:
      return e;
  }
}
function A(e, t = T()) {
  let n = _({ commandId: e, isMacOS: t });
  return n == null ? null : D(n, t);
}
export {
  f as _,
  C as a,
  n as b,
  o as c,
  y as d,
  v as f,
  h as g,
  g as h,
  S as i,
  m as l,
  l as m,
  D as n,
  i as o,
  p,
  A as r,
  s,
  T as t,
  c as u,
  u as v,
  d as y,
};
//# sourceMappingURL=electron-menu-shortcuts-CGQ9azZA.js.map
