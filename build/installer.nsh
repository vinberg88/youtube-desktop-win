!define TUBEDESK_UNINSTALL_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\TubeDesk for Windows"
!define TUBEDESK_APP_ID_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\se.vinberg.tubedesk"

!macro WriteTubeDeskArpMetadata ROOT KEY
  WriteRegStr ${ROOT} "${KEY}" "DisplayName" "TubeDesk for Windows"
  WriteRegStr ${ROOT} "${KEY}" "DisplayVersion" "0.4.6"
  WriteRegStr ${ROOT} "${KEY}" "Publisher" "youtube-desktop"
  WriteRegStr ${ROOT} "${KEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr ${ROOT} "${KEY}" "DisplayIcon" "$INSTDIR\TubeDesk for Windows.exe"
  WriteRegStr ${ROOT} "${KEY}" "UninstallString" '"$INSTDIR\Uninstall TubeDesk for Windows.exe"'
  WriteRegStr ${ROOT} "${KEY}" "QuietUninstallString" '"$INSTDIR\Uninstall TubeDesk for Windows.exe" /S'
  WriteRegStr ${ROOT} "${KEY}" "URLInfoAbout" "https://github.com/vinberg88/youtube-desktop-win"
  WriteRegStr ${ROOT} "${KEY}" "HelpLink" "https://github.com/vinberg88/youtube-desktop-win/issues"
  WriteRegDWORD ${ROOT} "${KEY}" "NoModify" 1
  WriteRegDWORD ${ROOT} "${KEY}" "NoRepair" 1
  WriteRegDWORD ${ROOT} "${KEY}" "EstimatedSize" 300000
!macroend

!macro customInstall
  DetailPrint "Writing TubeDesk Add/Remove Programs metadata"

  SetRegView 64
  !insertmacro WriteTubeDeskArpMetadata HKLM "${TUBEDESK_UNINSTALL_KEY}"
  !insertmacro WriteTubeDeskArpMetadata HKLM "${TUBEDESK_APP_ID_KEY}"
  !insertmacro WriteTubeDeskArpMetadata HKCU "${TUBEDESK_UNINSTALL_KEY}"
  !insertmacro WriteTubeDeskArpMetadata HKCU "${TUBEDESK_APP_ID_KEY}"

  SetRegView 32
  !insertmacro WriteTubeDeskArpMetadata HKLM "${TUBEDESK_UNINSTALL_KEY}"
  !insertmacro WriteTubeDeskArpMetadata HKLM "${TUBEDESK_APP_ID_KEY}"
  !insertmacro WriteTubeDeskArpMetadata HKCU "${TUBEDESK_UNINSTALL_KEY}"
  !insertmacro WriteTubeDeskArpMetadata HKCU "${TUBEDESK_APP_ID_KEY}"

  SetRegView lastused
!macroend

!macro customUnInstall
  DetailPrint "Removing TubeDesk Add/Remove Programs metadata"

  SetRegView 64
  DeleteRegKey HKLM "${TUBEDESK_UNINSTALL_KEY}"
  DeleteRegKey HKLM "${TUBEDESK_APP_ID_KEY}"
  DeleteRegKey HKCU "${TUBEDESK_UNINSTALL_KEY}"
  DeleteRegKey HKCU "${TUBEDESK_APP_ID_KEY}"

  SetRegView 32
  DeleteRegKey HKLM "${TUBEDESK_UNINSTALL_KEY}"
  DeleteRegKey HKLM "${TUBEDESK_APP_ID_KEY}"
  DeleteRegKey HKCU "${TUBEDESK_UNINSTALL_KEY}"
  DeleteRegKey HKCU "${TUBEDESK_APP_ID_KEY}"

  SetRegView lastused
!macroend
