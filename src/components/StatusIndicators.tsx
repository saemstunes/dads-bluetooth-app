
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Bluetooth, Volume2, ArrowUp } from 'lucide-react';

interface StatusIndicatorsProps {
  connectedDevices: Array<{
    id: number;
    name: string;
    type: string;
    status: string;
    signal: number;
  }>;
}

const StatusIndicators: React.FC<StatusIndicatorsProps> = ({ connectedDevices }) => {
  const bluetoothDevices = connectedDevices.filter(d => d.type === 'bluetooth' && d.status === 'connected');
  const wifiDevices = connectedDevices.filter(d => d.type === 'wifi' && d.status === 'connected');

  return (
    <div className="flex items-center gap-2">
      {bluetoothDevices.length > 0 && (
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          <Bluetooth className="h-3 w-3 mr-1" />
          {bluetoothDevices.length}
        </Badge>
      )}
      
      {wifiDevices.length > 0 && (
        <Badge variant="outline" className="text-green-600 border-green-600">
          <ArrowUp className="h-3 w-3 mr-1" />
          {wifiDevices.length}
        </Badge>
      )}
      
      <Badge variant="outline" className="text-purple-600 border-purple-600">
        <Volume2 className="h-3 w-3 mr-1" />
        Ready
      </Badge>
    </div>
  );
};

export default StatusIndicators;
