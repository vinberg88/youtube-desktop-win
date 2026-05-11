!macro customInstall
  DetailPrint "Writing TubeDesk Add/Remove Programs metadata"

  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TubeDesk for Windows" "DisplayName" "TubeDesk for Windows"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TubeDesk for Windows" "DisplayVersion" "0.4.1"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TubeDesk for Windows" "Publisher" "Mattias Vinberg"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TubeDesk for Windows" "InstallLocation" "$INSTDIR"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TubeDesk for Windows" "DisplayIcon" "$INSTDIR\TubeDesk for Windows.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TubeDesk for Windows" "UninstallString" '"$INSTDIR\Uninstall TubeDesk for Windows.exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TubeDesk for Windows" "QuietUninstallString" '"$INSTDIR\Uninstall TubeDesk for Windows.exe" /S'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TubeDesk for Windows" "URLInfoAbout" "https://github.com/vinberg88/youtube-desktop-win"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TubeDesk for Windows" "HelpLink" "https://github.com/vinberg88/youtube-desktop-win/issues"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TubeDesk for Windows" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TubeDesk for Windows" "NoRepair" 1
!macroend

!macro customUnInstall
  DetailPrint "Removing TubeDesk Add/Remove Programs metadata"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\TubeDesk for Windows"
!macroend
