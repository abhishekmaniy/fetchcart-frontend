import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, Deal } from '@/types'
import { Bell, Plus, Tag, X } from 'lucide-react'
import React from 'react'

const DealAlerts = ({
  currentDeals,
  newAlert,
  setNewAlert,
  isCreatingAlert,
  createAlert,
  alerts
}: {
  currentDeals: Deal[]
  newAlert: Alert
  setNewAlert: React.Dispatch<React.SetStateAction<Alert>>
  isCreatingAlert: boolean
  createAlert: () => void
  alerts: Alert[]
}) => {
  const [showPreview, setShowPreview] = useState(false)

  if (!showPreview) {
    return (
      <Card className="border-dashed border-2 border-primary bg-muted text-center py-16">
        <CardHeader>
          <CardTitle className="text-3xl text-foreground">🚧 Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-base">
            We’re working hard to bring you this feature soon. Meanwhile, you can sneak a peek!
          </p>
          <Button onClick={() => setShowPreview(true)}>See Preview</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Deals */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Tag className="h-5 w-5" />
            <span>New Deals for You</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentDeals.map(deal => (
              <div
                key={deal.id}
                className="flex items-center justify-between p-3 bg-secondary/30 dark:bg-secondary/50 rounded-lg"
              >
                <div>
                  <h4 className="font-semibold text-foreground">{deal.name}</h4>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-lg font-bold text-primary">
                      ${deal.currentPrice}
                    </span>
                    <span className="text-muted-foreground line-through">
                      ${deal.originalPrice}
                    </span>
                    <Badge className="bg-green-500 text-white">
                      {deal.discount}% OFF
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {deal.store} • Ends in {deal.endsIn}
                  </div>
                </div>
                <Button size="sm">View Deal</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Alert */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Plus className="h-5 w-5" />
            <span>Create New Alert</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="alert-url" className="text-foreground">
              Product URL
            </Label>
            <Input
              id="alert-url"
              placeholder="Paste product URL from any supported store..."
              value={newAlert.productUrl}
              onChange={e =>
                setNewAlert({ ...newAlert, productUrl: e.target.value })
              }
              className="bg-background border-border text-foreground"
            />
          </div>

          <div>
            <Label htmlFor="target-price" className="text-foreground">
              Target Price ($)
            </Label>
            <Input
              id="target-price"
              type="number"
              placeholder="0.00"
              value={newAlert.targetPrice}
              onChange={e =>
                setNewAlert({
                  ...newAlert,
                  targetPrice: Number(e.target.value)
                })
              }
              className="bg-background border-border text-foreground"
            />
          </div>

          <Button
            onClick={createAlert}
            className="w-full"
            disabled={isCreatingAlert}
          >
            {isCreatingAlert ? (
              <>
                <Bell className="h-4 w-4 mr-2 animate-spin" />
                Creating alert...
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Create Price Alert
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Your Price Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-secondary/30 dark:bg-secondary/50 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {alert.productName}
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      Target: ${alert.targetPrice} • Created {alert.createdAt}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={alert.isActive} />
                    <Button size="sm" variant="destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DealAlerts
