import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, Copy, Key } from 'lucide-react';



export function EncryptionForm() {
    const [message, setMessage] = useState('');
    const [key, setKey] = useState('');
    const [result, setResult] = useState('');
    const { toast } = useToast();
    
    const encrypt = (text: string, key: string) => {
    let result = '';

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode ^ keyChar);
    }
    return btoa(result);
  };

  const decrypt = (encoded: string, key: string) => {
    try {
      const text = atob(encoded);
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode ^ keyChar);
      }
      return result;
    } catch {
      return 'Invalid encrypted message';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copiado al portapapeles",
      description: "El texto fue copiado al portapapeles",
    });
  };

  const handleSubmit = (mode: 'encrypt' | 'decrypt') => {
    if (!message || !key) {
      toast({
        title: "Falta información",
        description: "Please provide both message and key.",
        variant: "destructive",
      });
      return;
    }

    const result = mode === 'encrypt' ? encrypt(message, key) : decrypt(message, key);
    setResult(result);
  };


  return (

    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6 flex flex-col items-center justify-center">
      <Card className="max-w-2xl mx-auto p-6 shadow-xl justify-center content-center">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Herramienta de Encriptacion y Desencriptación
        </h1>
        
        <Tabs defaultValue="encrypt" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="encrypt">
              <Lock className="w-4 h-4 mr-2" />
              Encrypt
            </TabsTrigger>
            <TabsTrigger value="decrypt">
              <Unlock className="w-4 h-4 mr-2" />
              Decrypt
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encrypt">
            <div className="space-y-4">
              <div>
                <Label htmlFor="message-encrypt">Message to Encrypt</Label>
                <Input
                  id="message-encrypt"
                  placeholder="Enter your secret message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="key-encrypt" className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Encryption Key
                </Label>
                <Input
                  id="key-encrypt"
                  placeholder="Enter your secret key..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <Button 
                onClick={() => handleSubmit('encrypt')}
                className="w-full"
              >
                <Lock className="w-4 h-4 mr-2" />
                Encrypt Message
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="decrypt">
            <div className="space-y-4">
              <div>
                <Label htmlFor="message-decrypt">Encrypted Message</Label>
                <Input
                  id="message-decrypt"
                  placeholder="Enter the encrypted message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="key-decrypt" className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Decryption Key
                </Label>
                <Input
                  id="key-decrypt"
                  placeholder="Enter your secret key..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <Button 
                onClick={() => handleSubmit('decrypt')}
                className="w-full"
              >
                <Unlock className="w-4 h-4 mr-2" />
                Decrypt Message
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {result && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <Label>Result:</Label>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="font-mono break-all">{result}</p>
          </div>
        )}
      </Card>
    </div>
  );

}

export default EncryptionForm;