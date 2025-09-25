import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Hero from './Hero';
import { HeroSplitLayout, HeroTopLayout, HeroEnhancedCenter } from './HeroLayoutOptions';
import { LayoutGrid, ArrowLeft, ArrowRight, Eye } from 'lucide-react';

const layoutOptions = [
  {
    id: 'current',
    name: 'Current: Left-Aligned',
    description: 'Text positioned on the left, shoes visible on the right',
    component: Hero,
    pros: ['Better text readability', 'Clean separation', 'Mobile friendly'],
    status: 'active'
  },
  {
    id: 'split',
    name: 'Split Layout',
    description: 'Clear division with strong content backdrop on left',
    component: HeroSplitLayout,
    pros: ['Maximum readability', 'Strong visual hierarchy', 'Professional look'],
    status: 'option'
  },
  {
    id: 'top',
    name: 'Top-Focused',
    description: 'Main content at top, stats over shoes at bottom',
    component: HeroTopLayout,
    pros: ['Immediate attention to text', 'Shoes as background', 'Balanced layout'],
    status: 'option'
  },
  {
    id: 'enhanced',
    name: 'Enhanced Center',
    description: 'Centered with strong backdrop and borders',
    component: HeroEnhancedCenter,
    pros: ['Premium feel', 'All content contained', 'Strong contrast'],
    status: 'option'
  }
];

export function HeroLayoutSelector() {
  const [selectedLayout, setSelectedLayout] = useState('current');
  const [previewMode, setPreviewMode] = useState(false);
  
  const currentLayout = layoutOptions.find(layout => layout.id === selectedLayout);
  const SelectedComponent = currentLayout?.component || Hero;
  
  if (previewMode) {
    return (
      <div className="relative">
        <div className="absolute top-4 left-4 z-50">
          <Button 
            onClick={() => setPreviewMode(false)}
            variant="secondary"
            size="sm"
            className="bg-black/80 text-white hover:bg-black/90 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Options
          </Button>
        </div>
        <div className="absolute top-4 right-4 z-50">
          <Badge variant="secondary" className="bg-black/80 text-white backdrop-blur-sm">
            {currentLayout?.name}
          </Badge>
        </div>
        <SelectedComponent />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <LayoutGrid className="h-5 w-5" />
            <span className="text-sm font-medium">Layout Options</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold">Choose Your Hero Layout</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the layout that works best for text readability while showcasing your sneaker collection.
          </p>
        </div>
        
        {/* Layout Options Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {layoutOptions.map((layout) => (
            <Card 
              key={layout.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedLayout === layout.id 
                  ? 'ring-2 ring-primary shadow-md' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedLayout(layout.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {layout.name}
                    {layout.status === 'active' && (
                      <Badge variant="secondary" className="text-xs">Current</Badge>
                    )}
                  </CardTitle>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedLayout === layout.id 
                      ? 'bg-primary border-primary' 
                      : 'border-muted-foreground'
                  }`} />
                </div>
                <CardDescription>{layout.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-green-700">Advantages:</h4>
                    <ul className="text-sm space-y-1">
                      {layout.pros.map((pro, index) => (
                        <li key={index} className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Preview Button */}
        <div className="text-center space-y-4">
          <Button 
            size="lg" 
            onClick={() => setPreviewMode(true)}
            className="px-8 py-6 text-lg"
          >
            <Eye className="h-5 w-5 mr-2" />
            Preview {currentLayout?.name}
          </Button>
          
          <div className="flex flex-wrap justify-center gap-4">
            {layoutOptions.filter(l => l.id !== selectedLayout).map((layout) => (
              <Button 
                key={layout.id}
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedLayout(layout.id);
                  setPreviewMode(true);
                }}
                className="text-sm"
              >
                Quick Preview: {layout.name}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Implementation Note */}
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> The current layout (Left-Aligned) is already applied. 
            If you'd like to switch to a different option, let me know which one you prefer and I'll implement it!
          </p>
        </div>
      </div>
    </div>
  );
}