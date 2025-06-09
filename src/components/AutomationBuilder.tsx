
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowUp, ArrowDown, Volume2, Bluetooth } from 'lucide-react';

interface Automation {
  id: number;
  name: string;
  enabled: boolean;
  lastTriggered: string;
}

interface AutomationBuilderProps {
  automations: Automation[];
  onAutomationUpdate: (automations: Automation[]) => void;
}

const AutomationBuilder: React.FC<AutomationBuilderProps> = ({ automations, onAutomationUpdate }) => {
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    trigger: '',
    condition: '',
    action: ''
  });

  const toggleAutomation = (id: number) => {
    const updated = automations.map(auto => 
      auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
    );
    onAutomationUpdate(updated);
  };

  const createAutomation = () => {
    if (newAutomation.name && newAutomation.trigger && newAutomation.action) {
      const automation = {
        id: automations.length + 1,
        name: newAutomation.name,
        enabled: true,
        lastTriggered: 'Never'
      };
      onAutomationUpdate([...automations, automation]);
      setNewAutomation({ name: '', trigger: '', condition: '', action: '' });
    }
  };

  const triggerOptions = [
    { value: 'bluetooth_connect', label: 'Bluetooth Device Connected' },
    { value: 'bluetooth_disconnect', label: 'Bluetooth Device Disconnected' },
    { value: 'location_enter', label: 'Enter Location' },
    { value: 'location_exit', label: 'Exit Location' },
    { value: 'time_schedule', label: 'Time/Schedule' },
    { value: 'voice_command', label: 'Voice Command' },
    { value: 'app_launch', label: 'App Launch' },
    { value: 'headphone_plug', label: 'Headphones Connected' }
  ];

  const actionOptions = [
    { value: 'play_music', label: 'Play Music/Playlist' },
    { value: 'connect_device', label: 'Connect to Device' },
    { value: 'set_volume', label: 'Set Volume Level' },
    { value: 'send_message', label: 'Send Message/Notification' },
    { value: 'launch_app', label: 'Launch Application' },
    { value: 'speak_text', label: 'Speak Text (TTS)' },
    { value: 'adjust_settings', label: 'Adjust Device Settings' }
  ];

  const predefinedTemplates = [
    {
      name: 'Car Connection',
      description: 'Auto-connect and play music when car Bluetooth is detected',
      trigger: 'bluetooth_connect',
      action: 'play_music'
    },
    {
      name: 'Home Arrival',
      description: 'Connect to home speakers when arriving home',
      trigger: 'location_enter',
      action: 'connect_device'
    },
    {
      name: 'Workout Mode',
      description: 'Connect headphones and start workout playlist',
      trigger: 'headphone_plug',
      action: 'play_music'
    },
    {
      name: 'Morning Routine',
      description: 'Play news and weather at scheduled time',
      trigger: 'time_schedule',
      action: 'speak_text'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Automation Builder</h2>
          <p className="text-muted-foreground">Create smart triggers and actions</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Create New Automation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Automation</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Automation Name</label>
                  <Input 
                    placeholder="e.g., Car Connect Music"
                    value={newAutomation.name}
                    onChange={(e) => setNewAutomation({...newAutomation, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Trigger (When)</label>
                  <Select value={newAutomation.trigger} onValueChange={(value) => setNewAutomation({...newAutomation, trigger: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Action (Then)</label>
                  <Select value={newAutomation.action} onValueChange={(value) => setNewAutomation({...newAutomation, action: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an action" />
                    </SelectTrigger>
                    <SelectContent>
                      {actionOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Condition (Optional)</label>
                  <Input 
                    placeholder="e.g., Only on weekdays, Battery > 50%"
                    value={newAutomation.condition}
                    onChange={(e) => setNewAutomation({...newAutomation, condition: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={createAutomation} className="w-full">
                Create Automation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predefinedTemplates.map((template, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <Button size="sm" variant="outline" className="w-full">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Automations */}
      <Card>
        <CardHeader>
          <CardTitle>Your Automations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {automations.map(automation => (
            <div key={automation.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Switch 
                    checked={automation.enabled}
                    onCheckedChange={() => toggleAutomation(automation.id)}
                  />
                  <div>
                    <h4 className="font-medium">{automation.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Last triggered: {automation.lastTriggered}
                    </p>
                  </div>
                </div>
                <Badge variant={automation.enabled ? "default" : "secondary"}>
                  {automation.enabled ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm bg-muted/50 rounded p-3">
                <div className="flex items-center gap-2">
                  <Bluetooth className="h-4 w-4" />
                  <span>Bluetooth Connect</span>
                </div>
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <span>Play Music</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-3">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline">Test</Button>
                <Button size="sm" variant="outline">Delete</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Automation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <ArrowUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">{automations.filter(a => a.enabled).length}</p>
            <p className="text-sm text-muted-foreground">Active Automations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Volume2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">156</p>
            <p className="text-sm text-muted-foreground">Times Triggered Today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Bluetooth className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">98%</p>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutomationBuilder;
