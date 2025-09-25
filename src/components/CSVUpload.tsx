import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CSVProduct {
  ProductID?: string;
  ProductName: string;
  Brand: string;
  Price: number;
  Stock: number;
  SKU?: string;
  Description?: string;
  ImageURL: string;
  Category?: string;
  Sizes?: string[];
  Colors?: string[];
}

export default function CSVUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const csvContent = `ProductID,ProductName,Brand,Price,Stock,SKU,Description,ImageURL,Category,Sizes,Colors
,Nike Air Force 1,Nike,120.00,50,AF1-WHT-001,"Classic white sneakers with timeless style",https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400,Lifestyle,"7,8,9,10,11","White,Black"
,Adidas Ultraboost 22,Adidas,180.00,30,UB22-BLK-001,"Advanced running shoes with boost technology",https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400,Running,"8,9,10,11,12","Black,White,Blue"`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: "Product template CSV has been downloaded successfully."
    });
  };

  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const processCSV = async (csvText: string) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must contain at least a header and one data row');
    }

    const headers = parseCSVLine(lines[0]);
    const products: CSVProduct[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length !== headers.length) {
        throw new Error(`Row ${i + 1} has ${values.length} columns but expected ${headers.length}`);
      }

      const product: any = {};
      headers.forEach((header, index) => {
        const value = values[index].replace(/^"|"$/g, ''); // Remove surrounding quotes
        product[header] = value;
      });

      // Validate required fields
      if (!product.ProductName || !product.Brand || !product.Price || !product.ImageURL) {
        throw new Error(`Row ${i + 1} is missing required fields (ProductName, Brand, Price, ImageURL)`);
      }

      products.push({
        ProductID: product.ProductID || undefined,
        ProductName: product.ProductName,
        Brand: product.Brand,
        Price: parseFloat(product.Price),
        Stock: parseInt(product.Stock) || 0,
        SKU: product.SKU || undefined,
        Description: product.Description || undefined,
        ImageURL: product.ImageURL,
        Category: product.Category || undefined,
        Sizes: product.Sizes ? product.Sizes.split(',').map(s => s.trim()) : undefined,
        Colors: product.Colors ? product.Colors.split(',').map(c => c.trim()) : undefined,
      });
    }

    return products;
  };

  const uploadProducts = async (products: CSVProduct[]) => {
    let created = 0;
    let updated = 0;
    const errors: string[] = [];

    for (const product of products) {
      try {
        if (product.ProductID) {
          // Update existing product
          const { error } = await supabase
            .from('products')
            .update({
              name: product.ProductName,
              brand: product.Brand,
              price: product.Price,
              stock_quantity: product.Stock,
              description: product.Description,
              image_url: product.ImageURL,
              category: product.Category,
              sizes: product.Sizes || null,
              colors: product.Colors || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', product.ProductID);

          if (error) {
            errors.push(`Failed to update product ${product.ProductName}: ${error.message}`);
          } else {
            updated++;
          }
        } else {
          // Create new product
          const { error } = await supabase
            .from('products')
            .insert({
              name: product.ProductName,
              brand: product.Brand,
              price: product.Price,
              stock_quantity: product.Stock,
              description: product.Description,
              image_url: product.ImageURL,
              category: product.Category,
              sizes: product.Sizes || null,
              colors: product.Colors || null,
              in_stock: product.Stock > 0,
            });

          if (error) {
            errors.push(`Failed to create product ${product.ProductName}: ${error.message}`);
          } else {
            created++;
          }
        }
      } catch (err) {
        errors.push(`Error processing product ${product.ProductName}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    return { created, updated, errors };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadStatus('Reading file...');

    try {
      const csvText = await file.text();
      setUploadStatus('Processing products...');

      const products = await processCSV(csvText);
      setUploadStatus(`Uploading ${products.length} products...`);

      const { created, updated, errors } = await uploadProducts(products);

      let message = '';
      if (created > 0) message += `Created ${created} products. `;
      if (updated > 0) message += `Updated ${updated} products. `;
      if (errors.length > 0) message += `${errors.length} errors occurred.`;

      toast({
        title: "Upload Complete",
        description: message || "All products processed successfully.",
        variant: errors.length > 0 ? "destructive" : "default"
      });

      setUploadStatus(`Complete: ${created} created, ${updated} updated${errors.length > 0 ? `, ${errors.length} errors` : ''}`);

      // Log errors to console for debugging
      if (errors.length > 0) {
        console.error('CSV Upload Errors:', errors);
      }

    } catch (error) {
      console.error('CSV Upload Error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process CSV file.",
        variant: "destructive"
      });
      setUploadStatus('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Product Upload
        </CardTitle>
        <CardDescription>
          Upload products in bulk via CSV file. If ProductID exists, the product will be updated; otherwise, a new product will be created.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Download the template to get started
            </span>
          </div>
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>

        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            {uploading ? 'Processing...' : 'Drop your CSV file here'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {uploading ? uploadStatus : 'or click to browse'}
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="gap-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Processing
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Select File
              </>
            )}
          </Button>
        </div>

        {uploadStatus && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            {uploadStatus.includes('Complete') ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : uploadStatus.includes('failed') ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
            )}
            <span className="text-sm">{uploadStatus}</span>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>CSV Format Requirements:</strong></p>
          <p>• ProductID: Leave blank for new products, provide existing ID to update</p>
          <p>• Required fields: ProductName, Brand, Price, ImageURL</p>
          <p>• Sizes/Colors: Comma-separated values (e.g., "7,8,9,10" or "Red,Blue,Green")</p>
          <p>• Maximum file size: 10MB</p>
        </div>
      </CardContent>
    </Card>
  );
}