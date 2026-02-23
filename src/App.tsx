import { useTranslation } from 'react-i18next'
import { AppProvider } from '@/context/AppContext'
import { ToastProvider } from '@/components/ui/toast'
import Header from '@/components/Header'
import ImageUploader from '@/components/ImageUploader'
import SettingsForm from '@/components/SettingsForm'
import PreviewPanel from '@/components/PreviewPanel'
import BatchSection from '@/components/BatchSection'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

function AppContent() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 桌面端布局 */}
        <div className="hidden md:grid md:grid-cols-[1fr_280px_380px] gap-6">
          {/* 图像编辑 */}
          <Card>
            <CardContent className="p-4">
              <ImageUploader />
            </CardContent>
          </Card>

          {/* 参数设置 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-4 text-foreground">{t('tab.settings')}</h3>
              <SettingsForm />
            </CardContent>
          </Card>

          {/* 预览 + 批量 */}
          <Card>
            <CardContent className="p-4">
              <PreviewPanel />
              <BatchSection />
            </CardContent>
          </Card>
        </div>

        {/* 移动端标签页布局 */}
        <div className="md:hidden">
          <Tabs defaultValue="edit">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="edit">{t('tab.edit')}</TabsTrigger>
              <TabsTrigger value="settings">{t('tab.settings')}</TabsTrigger>
              <TabsTrigger value="preview">{t('tab.preview')}</TabsTrigger>
            </TabsList>

            <TabsContent value="edit">
              <Card>
                <CardContent className="p-4">
                  <ImageUploader />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardContent className="p-4">
                  <SettingsForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardContent className="p-4">
                  <PreviewPanel />
                  <BatchSection />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 移动端底部留白 */}
      <div className="h-16 md:hidden" />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  )
}
