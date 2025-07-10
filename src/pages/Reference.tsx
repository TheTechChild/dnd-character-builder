import { useState } from 'react';
import { Search, Book, Bookmark, HelpCircle, Info, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SearchModal } from '@/components/ReferenceSearch/SearchModal';
import { SpellBrowser } from '@/components/ReferenceSearch/SpellBrowser';
import { EquipmentBrowser } from '@/components/ReferenceSearch/EquipmentBrowser';
import { BookmarkManager } from '@/components/ReferenceSearch/BookmarkManager';
import { RulesPopup } from '@/components/ReferenceSearch/RulesPopup';
import { rulesDatabase } from '@/constants/rulesDatabase';
import { useCacheStats } from '@/hooks/useOpen5e';
import { cacheService } from '@/services/cacheService';
import { useToast } from '@/components/ui/use-toast';
import type { RuleContent } from '@/components/ReferenceSearch/RulesPopup';

export default function Reference() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<RuleContent | null>(null);
  const { data: cacheStats } = useCacheStats();
  const { toast } = useToast();

  const handleClearCache = async () => {
    await cacheService.clear();
    toast({
      title: 'Cache cleared',
      description: 'All cached content has been removed',
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">D&D 5e Reference</h1>
        <p className="text-gray-600 mb-6">
          Quick access to spells, items, rules, and more from the D&D 5e System Reference Document
        </p>

        <div className="flex gap-4 mb-6">
          <Button onClick={() => setIsSearchOpen(true)} size="large">
            <Search className="mr-2 h-5 w-5" />
            Quick Search
          </Button>
        </div>

        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Legal Notice:</strong> This reference uses content from the D&D 5e System Reference Document (SRD) 
            under the Open Gaming License. Content is provided by{' '}
            <a 
              href="https://open5e.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Open5e
            </a>
            . D&D 5e is a trademark of Wizards of the Coast. For the complete game rules, visit{' '}
            <a 
              href="https://www.dndbeyond.com/sources/basic-rules" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              D&D Beyond
            </a>
            .
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="spells" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="spells">
            <Book className="mr-2 h-4 w-4" />
            Spells
          </TabsTrigger>
          <TabsTrigger value="equipment">
            <Database className="mr-2 h-4 w-4" />
            Equipment
          </TabsTrigger>
          <TabsTrigger value="rules">
            <HelpCircle className="mr-2 h-4 w-4" />
            Rules
          </TabsTrigger>
          <TabsTrigger value="bookmarks">
            <Bookmark className="mr-2 h-4 w-4" />
            Bookmarks
          </TabsTrigger>
          <TabsTrigger value="cache">
            <Database className="mr-2 h-4 w-4" />
            Cache
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spells">
          <Card>
            <CardHeader>
              <CardTitle>Spell Reference</CardTitle>
              <CardDescription>
                Browse and search through all D&D 5e SRD spells
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SpellBrowser />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>Equipment & Magic Items</CardTitle>
              <CardDescription>
                Browse weapons, armor, gear, and magical items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EquipmentBrowser />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Rules Quick Reference</CardTitle>
              <CardDescription>
                Common rules and mechanics explained
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(rulesDatabase).map(([key, rule]) => (
                  <Card 
                    key={key} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedRule(rule)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        {rule.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {typeof rule.content === 'string' ? rule.content : 'Click to view details'}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">{rule.category}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookmarks">
          <Card>
            <CardHeader>
              <CardTitle>My Bookmarks</CardTitle>
              <CardDescription>
                Your saved spells, items, and references
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookmarkManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache">
          <Card>
            <CardHeader>
              <CardTitle>Offline Cache Management</CardTitle>
              <CardDescription>
                Manage cached content for offline access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cacheStats && (
                <>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Cache Usage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {formatBytes(cacheStats.totalSize)}
                        </div>
                        <p className="text-xs text-gray-500">
                          of {formatBytes(cacheStats.maxSize)} ({cacheStats.percentUsed.toFixed(1)}%)
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Cached Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{cacheStats.contentCount}</div>
                        <p className="text-xs text-gray-500">References cached</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{cacheStats.bookmarkCount}</div>
                        <p className="text-xs text-gray-500">Items bookmarked</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-gray-600">
                      Last cleanup: {new Date(cacheStats.lastCleanup).toLocaleString()}
                    </p>
                    <Button variant="danger" onClick={handleClearCache}>
                      Clear All Cache
                    </Button>
                  </div>
                </>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Cached content allows you to access reference material offline. The cache automatically 
                  manages space and removes old content when needed. Maximum cache size is 50MB.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(item) => {
          console.log('Selected item:', item);
          // In a real implementation, this would open the item details
        }}
      />

      {selectedRule && (
        <RulesPopup
          isOpen={!!selectedRule}
          onClose={() => setSelectedRule(null)}
          rule={selectedRule}
        />
      )}

      <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
        <p>
          Content provided by{' '}
          <a 
            href="https://open5e.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Open5e
          </a>
          {' '}under the{' '}
          <a 
            href="https://github.com/open5e/open5e-api/blob/main/LICENSE" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            MIT License
          </a>
        </p>
        <p className="mt-2">
          D&D 5e SRD content is licensed under the{' '}
          <a 
            href="http://media.wizards.com/2016/downloads/DND/SRD-OGL_V5.1.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Open Gaming License v1.0a
          </a>
        </p>
      </div>
    </div>
  );
}