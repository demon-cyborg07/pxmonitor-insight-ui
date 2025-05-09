
/**
 * TShark Interface Module
 * 
 * This module provides functions to interact with TShark for network packet capture.
 * It handles executing TShark commands, parsing output, and error handling.
 */

const { spawn } = require('child_process');
const { processRawPacketData } = require('./data-processing');
const { calculateNetworkMetrics } = require('../network-metrics');

// Configuration for TShark command
const TSHARK_CONFIG = {
  command: 'tshark_libs/tshark',
  defaultInterface: 'Wi-Fi',
  outputFormat: 'fields',
  headerFormat: 'y',
  separator: ',',
  fields: [
    'frame.time_epoch',
    'ip.src',
    'ip.dst',
    '_ws.col.Protocol',
    'frame.len',
    'tcp.srcport',
    'tcp.dstport',
    'ip.ttl',
    'tcp.flags',
    'tcp.window_size_value',
    'tcp.analysis.ack_rtt',
    'tcp.analysis.retransmission',
    'frame.time_delta',
    'dns.time'
  ]
};

// Build TShark command based on configuration
function buildTSharkCommand(interface = TSHARK_CONFIG.defaultInterface) {
  const args = [
    '-i', interface,
    '-T', TSHARK_CONFIG.outputFormat,
    '-E', `header=${TSHARK_CONFIG.headerFormat}`,
    '-E', `separator=${TSHARK_CONFIG.separator}`
  ];
  
  // Add all requested fields
  TSHARK_CONFIG.fields.forEach(field => {
    args.push('-e', field);
  });
  
  return { command: TSHARK_CONFIG.command, args };
}

// Capture packets using TShark
function capturePackets(interface, duration = 5, callback) {
  const { command, args } = buildTSharkCommand(interface);
  
  // Add duration limit
  args.push('-a', `duration:${duration}`);
  
  let rawData = '';
  let errorOutput = '';
  
  try {
    const tsharkProcess = spawn(command, args);
    
    tsharkProcess.stdout.on('data', (data) => {
      rawData += data.toString();
    });
    
    tsharkProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    tsharkProcess.on('close', (code) => {
      if (code !== 0) {
        callback(new Error(`TShark exited with code ${code}: ${errorOutput}`));
        return;
      }
      
      try {
        const packets = processRawPacketData(rawData);
        callback(null, packets);
      } catch (err) {
        callback(new Error(`Failed to process TShark output: ${err.message}`));
      }
    });
  } catch (err) {
    callback(new Error(`Failed to start TShark: ${err.message}`));
  }
}

// Start continuous packet capture
function startContinuousCapture(interface, processingCallback, errorCallback) {
  const { command, args } = buildTSharkCommand(interface);
  let tsharkProcess = null;
  let buffer = '';
  let running = false;
  
  function start() {
    if (running) return false;
    
    try {
      running = true;
      tsharkProcess = spawn(command, args);
      
      tsharkProcess.stdout.on('data', (data) => {
        buffer += data.toString();
        
        // Process complete lines
        const lines = buffer.split('\n');
        if (lines.length > 1) {
          buffer = lines.pop(); // Keep the last incomplete line in buffer
          
          // Process complete lines
          const output = lines.join('\n');
          try {
            const packets = processRawPacketData(output);
            if (packets.length > 0) {
              const metrics = calculateNetworkMetrics(packets);
              processingCallback(packets, metrics);
            }
          } catch (err) {
            errorCallback(new Error(`Data processing error: ${err.message}`));
          }
        }
      });
      
      tsharkProcess.stderr.on('data', (data) => {
        errorCallback(new Error(`TShark error: ${data.toString()}`));
      });
      
      tsharkProcess.on('close', (code) => {
        if (code !== 0 && running) {
          errorCallback(new Error(`TShark process exited with code ${code}`));
        }
        running = false;
      });
      
      return true;
    } catch (err) {
      running = false;
      errorCallback(new Error(`Failed to start TShark: ${err.message}`));
      return false;
    }
  }
  
  function stop() {
    if (!running) return false;
    
    try {
      running = false;
      if (tsharkProcess) {
        tsharkProcess.kill();
        tsharkProcess = null;
      }
      return true;
    } catch (err) {
      errorCallback(new Error(`Failed to stop TShark: ${err.message}`));
      return false;
    }
  }
  
  return {
    start,
    stop,
    isRunning: () => running
  };
}

module.exports = {
  capturePackets,
  startContinuousCapture
};
