# PowerShell Fix Guide

If you are seeing errors like `running scripts is disabled on this system`, follow these steps:

1.  **Open PowerShell as Administrator**
    - Click Start.
    - Type `PowerShell`.
    - Right-click "Windows PowerShell" and select **"Run as administrator"**.

2.  **Run the Execution Policy Command**
    Copy and paste this command:
    ```powershell
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```

3.  **Confirm**
    - It will ask for confirmation. Type `Y` (Yes) or `A` (Yes to All) and hit Enter.

4.  **Try `npm install` again**
    - Close the Administrator window.
    - Open your normal terminal (VS Code or standard).
    - Run `npm install` again.
