#!/usr/bin/env pwsh
# Claude Code Installer for Windows
# Usage: irm https://claude.ai/install.ps1 | iex

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$INSTALL_DIR = Join-Path $env:USERPROFILE '.local' 'bin'
$BINARY_NAME = 'claude.exe'
$BASE_URL = 'https://storage.googleapis.com/anthropic-cli'
$MIN_OS_BUILD = 17763  # Windows 10 1809

function Write-Status {
    param([string]$Message)
    Write-Host "  $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "  $Message" -ForegroundColor Green
}

function Write-Err {
    param([string]$Message)
    Write-Host "  Error: $Message" -ForegroundColor Red
}

function Test-Prerequisites {
    # Windows version check
    $os = [System.Environment]::OSVersion
    if ($os.Platform -ne 'Win32NT') {
        Write-Err 'This installer is for Windows only. Use install.sh for macOS/Linux.'
        exit 1
    }
    $build = $os.Version.Build
    if ($build -lt $MIN_OS_BUILD) {
        Write-Err "Windows 10 version 1809 (build $MIN_OS_BUILD) or later is required. Current build: $build"
        exit 1
    }

    # Architecture check
    $arch = [System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture
    if ($arch -eq [System.Runtime.InteropServices.Architecture]::X64) {
        return 'x64'
    }
    elseif ($arch -eq [System.Runtime.InteropServices.Architecture]::Arm64) {
        return 'arm64'
    }
    else {
        Write-Err "Unsupported architecture: $arch. Claude Code requires 64-bit Windows (x64 or ARM64)."
        exit 1
    }
}

function Get-LatestVersion {
    try {
        $version = (Invoke-RestMethod -Uri "$BASE_URL/latest/version.txt" -UseBasicParsing).Trim()
        if (-not $version) {
            throw 'Empty version response'
        }
        return $version
    }
    catch {
        Write-Err "Failed to fetch latest version: $_"
        exit 1
    }
}

function Get-Checksum {
    param([string]$Version, [string]$Arch)
    try {
        $checksumUrl = "$BASE_URL/$Version/claude-windows-$Arch.exe.sha256"
        $checksum = (Invoke-RestMethod -Uri $checksumUrl -UseBasicParsing).Trim().Split(' ')[0]
        return $checksum
    }
    catch {
        Write-Err "Failed to fetch checksum: $_"
        exit 1
    }
}

function Install-Claude {
    Write-Host ''
    Write-Host '  Claude Code Installer' -ForegroundColor Magenta
    Write-Host '  =====================' -ForegroundColor Magenta
    Write-Host ''

    # Check prerequisites
    Write-Status 'Checking system requirements...'
    $arch = Test-Prerequisites
    Write-Success "Architecture: $arch"

    # Fetch latest version
    Write-Status 'Fetching latest version...'
    $version = Get-LatestVersion
    Write-Success "Version: $version"

    # Set up download
    $downloadUrl = "$BASE_URL/$version/claude-windows-$arch.exe"
    $tempDir = Join-Path $env:TEMP "claude-install-$(Get-Random)"
    $tempFile = Join-Path $tempDir 'claude-installer.exe'

    try {
        # Create temp directory
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

        # Download binary
        Write-Status "Downloading Claude Code $version..."
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $downloadUrl -OutFile $tempFile -UseBasicParsing
        $ProgressPreference = 'Continue'
        Write-Success 'Download complete.'

        # Verify checksum
        Write-Status 'Verifying checksum...'
        $expectedChecksum = Get-Checksum -Version $version -Arch $arch
        $actualChecksum = (Get-FileHash -Path $tempFile -Algorithm SHA256).Hash.ToLower()

        if ($actualChecksum -ne $expectedChecksum) {
            Write-Err "Checksum mismatch!`n  Expected: $expectedChecksum`n  Got:      $actualChecksum"
            exit 1
        }
        Write-Success 'Checksum verified.'

        # Create install directory
        if (-not (Test-Path $INSTALL_DIR)) {
            New-Item -ItemType Directory -Path $INSTALL_DIR -Force | Out-Null
        }

        # Install binary
        Write-Status "Installing to $INSTALL_DIR..."
        $destPath = Join-Path $INSTALL_DIR $BINARY_NAME
        Copy-Item -Path $tempFile -Destination $destPath -Force
        Write-Success 'Binary installed.'

        # Add to PATH if not already present
        $userPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
        if ($userPath -notlike "*$INSTALL_DIR*") {
            Write-Status 'Adding to PATH...'
            [System.Environment]::SetEnvironmentVariable(
                'Path',
                "$INSTALL_DIR;$userPath",
                'User'
            )
            $env:Path = "$INSTALL_DIR;$env:Path"
            Write-Success 'Added to user PATH.'
        }
    }
    finally {
        # Clean up temp files
        if (Test-Path $tempDir) {
            Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
        }
    }

    Write-Host ''
    Write-Success "Claude Code $version installed successfully!"
    Write-Host ''
    Write-Host '  Get started by running:' -ForegroundColor White
    Write-Host '    claude' -ForegroundColor Yellow
    Write-Host ''
    Write-Host '  Note: You may need to restart your terminal for PATH changes to take effect.' -ForegroundColor DarkGray
    Write-Host ''
}

# Run installer
Install-Claude
