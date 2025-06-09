import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Trash2, 
  Zap, 
  Bluetooth,
  Clock,
  MapPin,
  Volume2,
  Car,
  Home
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  triggers: any[];
  conditions: any[];
  actions: any[];
  execution_count: number;
}

interface AutomationBuilderProps {
  automationRules: AutomationRule[];
  isDarkMode: boolean;
}

const AutomationBuilder: React.FC<AutomationBuilderProps> = ({ 
  automationRules, 
  isDarkMode 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    triggers: [],
    conditions: [],
    actions: []
  });
  const { toast } = useToast();

  const triggerTypes = [
    { id: 'bluetooth_connect', name: 'Bluetooth Device Connects', icon: Bluetooth, color: 'blue' },
    { id: 'time_schedule', name: 'Time/Schedule', icon: Clock, color: 'green' },
    { id: 'location_enter', name: 'Enter Location', icon: MapPin, color: 'purple' },
    { id: 'voice_command', name: 'Voice Command', icon: Volume2, color: 'orange' }
  ];

  const actionTypes = [
    { id: 'connect_device', name: 'Connect Device', icon: Bluetooth, color: 'blue' },
    { id: 'play_audio', name: 'Play Audio', icon: Volume2, color: 'purple' },
    { id: 'car_mode', name: 'Enable Car Mode', icon: Car, color: 'green' },
    { id: 'home_mode', name: 'Enable Home Mode', icon: Home, color: 'orange' }
  ];

  const createAutomationRule = async () => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .insert({
          name: newRule.name || 'New Automation Rule',
          description: newRule.description,
          triggers: newRule.triggers,
          conditions: newRule.conditions,
          actions: newRule.actions,
          enabled: true
        });

      if (error) throw error;

      toast({
        title: "Automation Rule Created",
        description: `Successfully created "${newRule.name}"`,
      });

      setIsCreating(false);
      setNewRule({ name: '', description: '', triggers: [], conditions: [], actions: [] });

    } catch (error) {
      console.error('Error creating automation rule:', error);
      toast({
        title: "Creation Failed",
        description: "Could not create automation rule",
        variant: "destructive",
      });
    }
  };

  const toggleRule = async (ruleId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .update({ enabled: !enabled })
        .eq('id', ruleId);

      if (error) throw error;

      toast({
        title: enabled ? "Rule Disabled" : "Rule Enabled",
        description: "Automation rule status updated",
      });

    } catch (error) {
      console.error('Error toggling rule:', error);
    }
  };

  const CircularTriggerAction = ({ item, type, onClick }) => {
    const Icon = item.icon;
    return (
      <div className="flex flex-col items-center space-y-2">
        <Button
          onClick={() => onClick(item.id)}
          className={`
            w-14 h-14 rounded-full p-0 border-2 transition-all duration-300 hover:scale-105
            bg-${item.color}-500/10 border-${item.color}-500/30 hover:bg-${item.color}-500/20
          `}
        >
          <Icon className={`h-5 w-5 text-${item.color}-400`} />
        </Button>
        <span className="text-xs font-medium text-center max-w-16 leading-tight">
          {item.name}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Quick Rule Templates */}
      <Card className={`p-4 border ${
        isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/80 border-gray-200/50'
      }`}>
        <h4 className="font-semibold mb-3">Quick Templates</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'Car Connect', desc: 'Auto-connect when car detected', triggers: ['bluetooth'], actions: ['connect', 'audio'] },
            { name: 'Home Arrival', desc: 'Enable home mode at location', triggers: ['location'], actions: ['home_mode'] },
            { name: 'Sleep Mode', desc: 'Night time automation', triggers: ['time'], actions: ['volume_down'] }
          ].map((template, index) => (
            <Button
              key={index}
              variant="outline"
              className={`p-3 h-auto text-left ${
                isDarkMode ? 'border-white/20 hover:bg-white/10' : 'border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => console.log(`Create template: ${template.name}`)}
            >
              <div>
                <p className="font-medium text-sm">{template.name}</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {template.desc}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Create New Rule */}
      <Card className={`p-4 border ${
        isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Create Automation Rule</h4>
          <Button
            onClick={() => setIsCreating(!isCreating)}
            size="sm"
            className="rounded-full"
          >
            <Plus className="h-4 w-4" />
            {isCreating ? 'Cancel' : 'New Rule'}
          </Button>
        </div>

        {isCreating && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ruleName">Rule Name</Label>
                <Input
                  id="ruleName"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Car Connect"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ruleDesc">Description</Label>
                <Input
                  id="ruleDesc"
                  value={newRule.description}
                  onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What does this rule do?"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Triggers */}
            <div>
              <Label>When (Triggers)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2 justify-items-center">
                {triggerTypes.map(trigger => (
                  <CircularTriggerAction
                    key={trigger.id}
                    item={trigger}
                    type="trigger"
                    onClick={(id) => console.log('Add trigger:', id)}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <Label>Then (Actions)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2 justify-items-center">
                {actionTypes.map(action => (
                  <CircularTriggerAction
                    key={action.id}
                    item={action}
                    type="action"
                    onClick={(id) => console.log('Add action:', id)}
                  />
                ))}
              </div>
            </div>

            <Button onClick={createAutomationRule} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>
        )}
      </Card>

      {/* Existing Rules */}
      <div className="space-y-3">
        <h4 className="font-semibold">Your Automation Rules</h4>
        {automationRules.map(rule => (
          <Card key={rule.id} className={`p-4 border ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/80 border-gray-200/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h5 className="font-medium">{rule.name}</h5>
                  <Badge variant={rule.enabled ? "default" : "secondary"} className="text-xs">
                    {rule.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {rule.description && (
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {rule.description}
                  </p>
                )}
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Executed {rule.execution_count} times
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleRule(rule.id, rule.enabled)}
                  className="rounded-full"
                >
                  {rule.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AutomationBuilder;
