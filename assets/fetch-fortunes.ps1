param(
    [Parameter(Mandatory=$true)]
    [string]$ApiUrl,
    [string]$OutFile = "assets/fortunes.json"
)

# Example expected API response shape:
# {
#   "rat": ["...", "..."],
#   "ox": ["..."],
#   ...
# }

try {
    Write-Host "Fetching fortunes from $ApiUrl"
    $response = Invoke-WebRequest -Uri $ApiUrl -UseBasicParsing -Headers @{ 'Accept' = 'application/json' }
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
        $json = $response.Content
        $outPath = Join-Path (Get-Location) $OutFile
        $outDir = Split-Path $outPath
        if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
        Set-Content -Path $outPath -Value $json -Encoding UTF8
        Write-Host "Saved to $outPath"
        exit 0
    } else {
        Write-Error "Request failed with status $($response.StatusCode)"
        exit 2
    }
} catch {
    Write-Error $_.Exception.Message
    exit 1
}

