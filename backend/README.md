
# PXMonitor Backend

This directory contains the backend services for the PXMonitor application, which handles network monitoring, data processing, and system operations.

## Structure

- `index.js` - Main entry point and data generation utilities
- `scripts/` - PowerShell scripts for network operations
  - `Flush-DnsCache.ps1` - Clears the DNS resolver cache
  - `Reset-NetworkIP.ps1` - Resets network adapter IP configuration
  - `Reconnect-WiFi.ps1` - Disconnects and reconnects WiFi
  - `Optimize-Bandwidth.ps1` - Optimizes network settings for bandwidth
  - `Switch-DnsServer.ps1` - Changes DNS server settings
  - `Clear-NetworkCongestion.ps1` - Alleviates network congestion
  - `Maintain-PowerfulConnection.ps1` - Enables high-performance mode

## Integration

In a production environment, this backend would:

1. Collect real network metrics using system APIs
2. Execute PowerShell scripts when needed for network repairs
3. Process and analyze network data
4. Expose API endpoints for the frontend to consume

For development purposes, mock data generation functions are provided.
