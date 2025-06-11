
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  Trash2, 
  Clock,
  MapPin,
  Bluetooth,
  Volume2,
  Smartphone,
  Lightbulb,
  Thermometer,
  Battery,
  Wifi,
  Calendar,
  Sun,
  Moon
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  execution_count: number;
  triggers: Trigger[];
  actions: Action[];
  conditions?: Condition[];
}

interface Trigger {
  id: string;
  type: 'time' | 'location' | 'device' | 'sensor' | 'app' | 'voice';
  config: any;
}

interface Action {
  id: string;
  type: 'audio' | 'device' | 'notification' | 'app' | 'voice';
  config: any;
}

interface Condition {
  id: string;
  type: 'time' | 'location' | 'device' | 'weather';
  config: any;
}

interface AutomationBuilderProps {
  automationRules: AutomationRule[];
  isDarkMode: boolean;
}

const AutomationBuilder: React.FC<AutomationBuilderProps> = ({ automationRules, isDarkMode }) => {
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: '',
    enabled: true,
    triggers: [],
    actions: [],
    conditions: []
  });

  const triggerTypes = [
    { id: 'time', name: 'Time', icon: Clock, description: 'Trigger at specific times' },
    { id: 'location', name: 'Location', icon: MapPin, description: 'Trigger when entering/leaving locations' },
    { id: 'device', name: 'Device', icon: Bluetooth, description: 'Trigger when devices connect/disconnect' },
    { id: 'sensor', name: 'Sensor', icon: Thermometer, description: 'Trigger on sensor readings' },
    { id: 'app', name: 'App Event', icon: Smartphone, description: 'Trigger on app events' },
    { id: 'voice', name: 'Voice Command', icon: Volume2, description: 'Trigger on voice commands' }
  ];

  const actionTypes = [
    { id: 'audio', name: 'Audio Control', icon: Volume2, description: 'Control audio playback' },
    { id: 'device', name: 'Device Control', icon: Lightbulb, description: 'Control connected devices' },
    { id: 'notification', name: 'Send Notification', icon: Smartphone, description: 'Send push notifications' },
    { id: 'app', name: 'App Action', icon: Smartphone, description: 'Perform app actions' },
    { id: 'voice', name: 'Voice Response', icon: Volume2, description: 'Respond with voice' }
  ];

  const createTrigger = (type: string) => {
    const baseConfig = getTriggerConfig(type);
    const newTrigger: Trigger = {
      id: Date.now().toString(),
      type: type as any,
      config: baseConfig
    };
    
    setNewRule(prev => ({
      ...prev,
      triggers: [...(prev.triggers || []), newTrigger]
    }));
  };

  const createAction = (type: string) => {
    const baseConfig = getActionConfig(type);
    const newAction: Action = {
      id: Date.now().toString(),
      type: type as any,
      config: baseConfig
    };
    
    setNewRule(prev => ({
      ...prev,
      actions: [...(prev.actions || []), newAction]
    }));
  };

  const getTriggerConfig = (type: string) => {
    switch (type) {
      case 'time':
        return { time: '09:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] };
      case 'location':
        return { latitude: 0, longitude: 0, radius: 100, entering: true };
      case 'device':
        return { deviceType: 'bluetooth', deviceName: '', action: 'connect' };
      case 'sensor':
        return { sensorType: 'battery', operator: 'less_than', value: 20 };
      case 'app':
        return { appName: '', eventType: 'opened' };
      case 'voice':
        return { phrase: 'activate car mode', exact: false };
      default:
        return {};
    }
  };

  const getActionConfig = (type: string) => {
    switch (type) {
      case 'audio':
        return { action: 'play', volume: 70, source: 'playlist' };
      case 'device':
        return { deviceType: 'lights', action: 'turn_on', brightness: 100 };
      case 'notification':
        return { title: 'Automation Triggered', message: 'Your automation rule has been executed', priority: 'normal' };
      case 'app':
        return { appName: '', action: 'open' };
      case 'voice':
        return { message: 'Automation completed successfully', voice: 'default' };
      default:
        return {};
    }
  };

  const saveRule = () => {
    if (!newRule.name || !newRule.triggers?.length || !newRule.actions?.length) {
      alert('Please provide a name, at least one trigger, and one action');
      return;
    }

    // Here you would save to your backend
    console.log('Saving automation rule:', newRule);
    
    setIsCreating(false);
    setNewRule({
      name: '',
      enabled: true,
      triggers: [],
      actions: [],
      conditions: []
    });
  };

  const TriggerCard = ({ trigger, onRemove }: { trigger: Trigger, onRemove: () => void }) => {
    const triggerType = triggerTypes.find(t => t.id === trigger.type);
    const Icon = triggerType?.icon || Clock;

    return (
      <Card className={`p-4 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{triggerType?.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 text-sm">
          {renderTriggerConfig(trigger)}
        </div>
      </Card>
    );
  };

  const ActionCard = ({ action, onRemove }: { action: Action, onRemove: () => void }) => {
    const actionType = actionTypes.find(a => a.id === action.type);
    const Icon = actionType?.icon || Lightbulb;

    return (
      <Card className={`p-4 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-green-500" />
            <span className="font-medium">{actionType?.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 text-sm">
          {renderActionConfig(action)}
        </div>
      </Card>
    );
  };

  const renderTriggerConfig = (trigger: Trigger) => {
    switch (trigger.type) {
      case 'time':
        return (
          <div>
            <p>Time: {trigger.config.time}</p>
            <p>Days: {trigger.config.days.join(', ')}</p>
          </div>
        );
      case 'location':
        return (
          <div>
            <p>Action: {trigger.config.entering ? 'Entering' : 'Leaving'}</p>
            <p>Radius: {trigger.config.radius}m</p>
          </div>
        );
      case 'device':
        return (
          <div>
            <p>Device: {trigger.config.deviceName || 'Any device'}</p>
            <p>Action: {trigger.config.action}</p>
          </div>
        );
      case 'sensor':
        return (
          <div>
            <p>Sensor: {trigger.config.sensorType}</p>
            <p>Condition: {trigger.config.operator} {trigger.config.value}</p>
          </div>
        );
      case 'voice':
        return (
          <div>
            <p>Phrase: "{trigger.config.phrase}"</p>
            <p>Match: {trigger.config.exact ? 'Exact' : 'Fuzzy'}</p>
          </div>
        );
      default:
        return <p>Configuration: {JSON.stringify(trigger.config)}</p>;
    }
  };

  const renderActionConfig = (action: Action) => {
    switch (action.type) {
      case 'audio':
        return (
          <div>
            <p>Action: {action.config.action}</p>
            <p>Volume: {action.config.volume}%</p>
          </div>
        );
      case 'notification':
        return (
          <div>
            <p>Title: {action.config.title}</p>
            <p>Message: {action.config.message}</p>
          </div>
        );
      case 'voice':
        return (
          <div>
            <p>Message: "{action.config.message}"</p>
            <p>Voice: {action.config.voice}</p>
          </div>
        );
      default:
        return <p>Configuration: {JSON.stringify(action.config)}</p>;
    }
  };

  if (isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Create New Automation
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={saveRule}>
              Save Rule
            </Button>
          </div>
        </div>

        <Card className={`p-6 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="space-y-4">
            <div>
              <Label>Rule Name</Label>
              <Input
                value={newRule.name}
                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter automation name"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={newRule.enabled}
                onCheckedChange={(checked) => setNewRule(prev => ({ ...prev, enabled: checked }))}
              />
              <Label>Enable this automation</Label>
            </div>
          </div>
        </Card>

        {/* Triggers Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Triggers
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              When should this automation run?
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {triggerTypes.map(trigger => (
              <Button
                key={trigger.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => createTrigger(trigger.id)}
              >
                <trigger.icon className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-medium">{trigger.name}</div>
                  <div className="text-xs opacity-70">{trigger.description}</div>
                </div>
              </Button>
            ))}
          </div>

          {newRule.triggers && newRule.triggers.length > 0 && (
            <div className="space-y-3">
              <h5 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Added Triggers
              </h5>
              {newRule.triggers.map((trigger, index) => (
                <TriggerCard
                  key={trigger.id}
                  trigger={trigger}
                  onRemove={() => {
                    setNewRule(prev => ({
                      ...prev,
                      triggers: prev.triggers?.filter((_, i) => i !== index)
                    }));
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Actions
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              What should happen when triggered?
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {actionTypes.map(action => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => createAction(action.id)}
              >
                <action.icon className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-medium">{action.name}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>

          {newRule.actions && newRule.actions.length > 0 && (
            <div className="space-y-3">
              <h5 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Added Actions
              </h5>
              {newRule.actions.map((action, index) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onRemove={() => {
                    setNewRule(prev => ({
                      ...prev,
                      actions: prev.actions?.filter((_, i) => i !== index)
                    }));
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Automation Rules
        </h3>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <div className="grid gap-4">
        {automationRules.map(rule => (
          <Card key={rule.id} className={`p-6 transition-all duration-300 hover:scale-[1.02] ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {rule.name}
                </h4>
                <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                  {rule.enabled ? 'Active' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  {rule.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Triggers
                </h5>
                <div className="space-y-2">
                  {/* Example triggers - you would map actual rule triggers here */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Every weekday at 8:00 AM</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Actions
                </h5>
                <div className="space-y-2">
                  {/* Example actions - you would map actual rule actions here */}
                  <div className="flex items-center gap-2 text-sm">
                    <Volume2 className="h-4 w-4 text-green-500" />
                    <span>Start morning playlist</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200/20">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Executed {rule.execution_count} times</span>
                <span>Last run: 2 hours ago</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AutomationBuilder;
