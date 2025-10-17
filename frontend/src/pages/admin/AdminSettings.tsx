import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  Settings as SettingsIcon, Bell, Mail, Shield, Database,
  Save, RefreshCw, Download, Upload
} from 'lucide-react'
import { toast } from 'sonner'

export function AdminSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [autoApprove, setAutoApprove] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  const [settings, setSettings] = useState({
    platformName: 'Stray DogCare',
    supportEmail: 'support@straydogcare.com',
    maxReportsPerDay: '100',
    sessionTimeout: '30',
    emailTemplate: 'Thank you for your report. We will review it shortly.',
    notificationSettings: {
      newReport: true,
      newAdoption: true,
      newVolunteer: true,
      newDonation: true
    }
  })

  const handleSave = () => {
    toast.success('Settings saved successfully')
  }

  const handleBackup = () => {
    toast.success('Database backup initiated')
  }

  const handleRestore = () => {
    toast.success('Database restore initiated')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-500 mt-1">
          Configure platform settings and preferences
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>Basic platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platformName">Platform Name</Label>
            <Input
              id="platformName"
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxReports">Max Reports Per Day</Label>
              <Input
                id="maxReports"
                type="number"
                value={settings.maxReportsPerDay}
                onChange={(e) => setSettings({ ...settings, maxReportsPerDay: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-slate-500">Disable public access to the platform</p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure system notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-slate-500">Receive email alerts for important events</p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-slate-500">Receive browser push notifications</p>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <Separator />

          <div className="space-y-3 pt-2">
            <Label className="text-base">Notification Types</Label>
            
            <div className="flex items-center justify-between">
              <Label className="font-normal">New Dog Reports</Label>
              <Switch
                checked={settings.notificationSettings.newReport}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notificationSettings: { ...settings.notificationSettings, newReport: checked }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="font-normal">New Adoption Applications</Label>
              <Switch
                checked={settings.notificationSettings.newAdoption}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notificationSettings: { ...settings.notificationSettings, newAdoption: checked }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="font-normal">New Volunteer Applications</Label>
              <Switch
                checked={settings.notificationSettings.newVolunteer}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notificationSettings: { ...settings.notificationSettings, newVolunteer: checked }
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="font-normal">New Donations</Label>
              <Switch
                checked={settings.notificationSettings.newDonation}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notificationSettings: { ...settings.notificationSettings, newDonation: checked }
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Templates
          </CardTitle>
          <CardDescription>Customize automated email messages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailTemplate">Report Confirmation Email</Label>
            <Textarea
              id="emailTemplate"
              rows={4}
              value={settings.emailTemplate}
              onChange={(e) => setSettings({ ...settings, emailTemplate: e.target.value })}
              placeholder="Enter email template..."
            />
            <p className="text-xs text-slate-500">
              This message will be sent when a new report is submitted
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Preview Template
            </Button>
            <Button variant="outline" size="sm">
              Send Test Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>Configure security and access control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Approve Volunteers</Label>
              <p className="text-sm text-slate-500">Automatically approve volunteer applications</p>
            </div>
            <Switch
              checked={autoApprove}
              onCheckedChange={setAutoApprove}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Two-Factor Authentication</Label>
            <Button variant="outline">
              Enable 2FA
            </Button>
            <p className="text-xs text-slate-500">
              Add an extra layer of security to admin accounts
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>API Keys</Label>
            <div className="flex gap-2">
              <Input value="sk_live_••••••••••••••••" disabled />
              <Button variant="outline">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Manage API keys for external integrations
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Database Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Management
          </CardTitle>
          <CardDescription>Backup and restore database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleBackup} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Create Backup
            </Button>
            <Button onClick={handleRestore} variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Restore Backup
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Last Backup</Label>
            <p className="text-sm text-slate-600">
              October 17, 2025 at 6:00 AM
            </p>
          </div>

          <div className="space-y-2">
            <Label>Automatic Backups</Label>
            <div className="flex items-center gap-2">
              <Switch defaultChecked />
              <span className="text-sm text-slate-600">Daily at 2:00 AM</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>System activity and audit logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-slate-900">Settings Updated</p>
                <p className="text-slate-500">Email notifications enabled</p>
              </div>
              <span className="text-slate-500">2 hours ago</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-slate-900">Database Backup</p>
                <p className="text-slate-500">Automatic backup completed</p>
              </div>
              <span className="text-slate-500">1 day ago</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-slate-900">System Update</p>
                <p className="text-slate-500">Platform updated to v2.0.0</p>
              </div>
              <span className="text-slate-500">3 days ago</span>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4">
            View Full Activity Log
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2 pb-8">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  )
}
