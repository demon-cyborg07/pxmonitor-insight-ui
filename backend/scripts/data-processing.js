
/**
 * Network Data Processing Module
 * 
 * This module handles the processing of network packet data
 * captured using TShark. It transforms raw packet data into
 * structured format for analysis and visualization.
 */

// Process raw TShark output into structured data
function processRawPacketData(rawData) {
  if (!rawData || !rawData.trim()) {
    return [];
  }
  
  const rows = rawData.trim().split('\n');
  const headers = rows[0].split(',').map(h => h.trim());
  const packets = [];
  
  // Skip the header row
  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(',').map(v => v.trim());
    if (values.length < headers.length) continue;
    
    const packet = {};
    headers.forEach((header, index) => {
      const value = values[index];
      
      switch (header) {
        case 'frame.time_epoch':
          packet.time = value ? parseFloat(value) : null;
          break;
        case 'ip.src':
          packet.srcIp = value || 'Unknown';
          break;
        case 'ip.dst':
          packet.dstIp = value || 'Unknown';
          break;
        case '_ws.col.Protocol':
          packet.protocol = value || 'Unknown';
          break;
        case 'frame.len':
          packet.frameLen = value ? parseFloat(value) : 0;
          break;
        case 'tcp.srcport':
          packet.tcp_src_port = value ? parseFloat(value) : null;
          break;
        case 'tcp.dstport':
          packet.tcp_dst_port = value ? parseFloat(value) : null;
          break;
        case 'ip.ttl':
          packet.ttl = value ? parseFloat(value) : null;
          break;
        case 'tcp.flags':
          if (value) {
            packet.tcpFlags = value.startsWith('0x') ? 
              parseInt(value.substring(2), 16) : parseFloat(value);
          } else {
            packet.tcpFlags = null;
          }
          break;
        case 'tcp.window_size_value':
          packet.window_size = value ? parseFloat(value) : null;
          break;
        case 'tcp.analysis.ack_rtt':
          packet.ack_rtt = value ? parseFloat(value) : null;
          break;
        case 'tcp.analysis.retransmission':
          packet.retransmission = value ? parseInt(value) : 0;
          break;
        case 'frame.time_delta':
          packet.time_delta = value ? parseFloat(value) : null;
          break;
        case 'dns.time':
          packet.dns_time = value ? parseFloat(value) : null;
          break;
        default:
          packet[header] = value;
      }
    });
    
    packets.push(packet);
  }
  
  return packets;
}

// Batch process packets for efficient analysis
function batchProcessPackets(packets, batchSize = 100) {
  const results = [];
  
  for (let i = 0; i < packets.length; i += batchSize) {
    const batch = packets.slice(i, i + batchSize);
    results.push(batch);
  }
  
  return results;
}

// Clean and filter packet data to remove anomalies
function cleanPacketData(packets) {
  if (!packets || packets.length === 0) return [];
  
  return packets.filter(packet => {
    // Remove packets with missing essential data
    if (!packet.time || !packet.protocol) {
      return false;
    }
    
    // Filter out anomalous values
    if (packet.frameLen > 100000 || // Unrealistically large packets
        (packet.ack_rtt !== null && packet.ack_rtt > 10)) { // Very high RTT
      return false;
    }
    
    return true;
  });
}

module.exports = {
  processRawPacketData,
  batchProcessPackets,
  cleanPacketData
};
