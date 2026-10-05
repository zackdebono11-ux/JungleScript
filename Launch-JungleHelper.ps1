$bat = "C:\Users\farru\OneDrive\Desktop\JungleScript\jungle-helper.bat"

Start-Process `
    -FilePath "C:\Windows\System32\cmd.exe" `
    -ArgumentList "/c `"$bat`""
