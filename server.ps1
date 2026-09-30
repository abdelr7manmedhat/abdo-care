# Built-in Windows PowerShell Local Web Server
$port = 3000
$flowId = "46281994-dab4-493e-bf56-3b386f42d4d4"
$apiUrl = "https://core.aimicromind.com/api/v1/prediction/$flowId"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "🚀 GrowthOS Local Server is running on: http://localhost:$port" -ForegroundColor Green
Write-Host "🔗 Connected to AiMicromind Flow: $flowId" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

# Open default browser
Start-Process "http://localhost:$port"

$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        if ($request.HttpMethod -eq "POST" -and $request.Url.LocalPath -eq "/api/generate") {
            # Read POST body
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $postData = $reader.ReadToEnd()
            $json = $postData | ConvertFrom-Json

            Write-Host "[Localhost] Forwarding to AiMicromind: $($json.question)" -ForegroundColor Magenta

            try {
                $payload = @{ question = $json.question } | ConvertTo-Json
                $aiResponse = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $payload -ContentType "application/json" -TimeoutSec 30
                $text = if ($aiResponse.text) { $aiResponse.text } elseif ($aiResponse.response) { $aiResponse.response } else { $aiResponse | ConvertTo-Json }
                $resBody = @{ success = $true; text = $text } | ConvertTo-Json
            } catch {
                $resBody = @{ success = $false; error = $_.Exception.Message } | ConvertTo-Json
            }

            $buffer = [System.Text.Encoding]::UTF8.GetBytes($resBody)
            $response.ContentType = "application/json"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()
        } else {
            # Serve Static Files
            $localPath = $request.Url.LocalPath
            if ($localPath -eq "/") { $localPath = "/index.html" }
            $filePath = Join-Path $currentDir ($localPath.TrimStart('/'))

            if (Test-Path $filePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                if ($filePath.EndsWith(".html")) { $response.ContentType = "text/html; charset=utf-8" }
                elseif ($filePath.EndsWith(".css")) { $response.ContentType = "text/css" }
                elseif ($filePath.EndsWith(".js")) { $response.ContentType = "application/javascript" }
                
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.OutputStream.Close()
            } else {
                $response.StatusCode = 404
                $response.OutputStream.Close()
            }
        }
    }
} finally {
    $listener.Stop()
}
