Write-Host "========= *********************** ========="
Write-Host "========= This is Post Deployment ========="
Write-Host "========= *********************** ========="

# Get-Host | Select-Object Version

Import-Module WebAdministration
Write-Host "The Default Action Preference in case of any error is $ErrorActionPreference"
$ErrorActionPreference = "Stop"
Write-Host "The Changed Action Preference in case of any error to $ErrorActionPreference"


# Checking the state of architecture
if([IntPtr]::size -eq 8) { Write-Host 'x64' } else { Write-Host 'x86' }

# If its 32 bit change it to 64 bit 
if ($PSHOME -like "*SysWOW64*"){
    Write-Warning "Restarting this script under 64-bit Windows PowerShell."

    # Restart this script under 64-bit Windows PowerShell.
    # (\SysNative\ redirects to \System32\ for 64-bit mode)

    & (Join-Path ($PSHOME -replace "SysWOW64", "SysNative") powershell.exe) -File `
    (Join-Path $PSScriptRoot $MyInvocation.MyCommand) @args

    # Exit 32-bit script.

    Exit $LastExitCode
}
# Was restart successful?
Write-Warning "Hello from $PSHOME"
Write-Warning "  (\SysWOW64\ = 32-bit mode, \System32\ = 64-bit mode)"
Write-Warning "Original arguments (if any): $args"


$Website_Name = "Qpharma.OrderPoint.Web"
try{
    Write-Host "Stopping Website" $Website_Name
    Stop-Website $Website_Name

    sleep 2

    Write-Host "Starting Website Again"
    Start-Website $Website_Name

    sleep 5

    $WEBSITE_DETAILS = Get-Website $Website_Name

}catch{
   Write-Error "`nError Message: " $_.Exception.Message
   Write-Error "`nError in Line: " $_.InvocationInfo.Line
   Write-Error "`nError in Line Number: "$_.InvocationInfo.ScriptLineNumber
   throw "Something went wrong"
}

if ($WEBSITE_DETAILS.Attributes['state'].Value -eq 1){
    Write-Host "Website is running"
}else{ 
    Write-Error "Website is not running"
}


Write-Host "Getting Website Status"
Get-Website $Website_Name

