import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, Copy, Key } from 'lucide-react';

// Diccionario para símbolos astronómicos
const simbolos_astronomicos : { [key: string]: string }= {
    'A': '☉', 'a': '☀',
    'B': '☽', 'b': '☾',
    'C': '♂', 'c': '⚥',
    'D': '♀', 'd': '⚢',
    'E': '♃', 'e': '⚡',
    'F': '♄', 'f': '⚪',
    'G': '♅', 'g': '⚩',
    'H': '♆', 'h': '⚔',
    'I': '♇', 'i': '⚕',
    'J': '☿', 'j': '⚜',
    'K': '♁', 'k': '⚝',
    'L': '☊', 'l': '⚬',
    'M': '☋', 'm': '⚘',
    'N': '⚳', 'n': '⚴',
    'Ñ': '⚷', 'ñ': '⚸',
    'O': '⚵', 'o': '⚶',
    'P': '⚷', 'p': '⚸',
    'Q': '⚺', 'q': '⚻',
    'R': '⚼', 'r': '⚽',
    'S': '⛢', 's': '⛣',
    'T': '⛤', 't': '⛥',
    'U': '⛦', 'u': '⛧',
    'V': '⛨', 'v': '⛩',
    'W': '⛪', 'w': '⛰',
    'X': '⛯', 'x': '⛮',
    'Y': '⛬', 'y': '⛭',
    'Z': '⛱', 'z': '⛲',
    '0': '⛳', '1': '⛴', 
    '2': '⛵', '3': '⛶', 
    '4': '⛷', '5': '⛸', 
    '6': '⛹', '7': '⛺', 
    '8': '⛻', '9': '⛼',
    '+': '⚝', '!': '⚡', '?': '⚜', '.': '⛾', ',': '⛿'
}

  /**
   * 
   * 
   * 
   */

export function EncryptionForm() {

    const [message, setMessage] = useState('');
    const [key, setKey] = useState('');
    const [result, setResult] = useState('');
    const { toast } = useToast();
    


    /**
   * 
   * @param text "Texto a encriptar"
   * @param key  "LLave de encriptación"
   * @returns 
   */
    const encrypt = (text: string, key: string) => {
    let result = '';

    // Aplicar XOR en cada carácter del texto
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode ^ keyChar);
    }

    // Codificar resultado en Base64
    const base64Encoded = btoa(result);

    // Transformar caracteres a símbolos astronómicos usando el diccionario
    let encryptedWithSymbols = '';
    for (const char of base64Encoded) {
      encryptedWithSymbols += simbolos_astronomicos[char] || char; // Mantener el carácter si no tiene mapeo
    }

    return encryptedWithSymbols;
  };

  const decrypt = (encoded: string, key: string) => {
    try {
      // Revertir los símbolos astronómicos al texto original
      const reversedSimbolos = Object.fromEntries(
        Object.entries(simbolos_astronomicos).map(([k, v]) => [v, k])
      );

      let base64Decoded = '';
      for (const char of encoded) {
        base64Decoded += reversedSimbolos[char] || char; // Mantener el carácter si no tiene mapeo
      }

      // Decodificar de Base64
      const text = atob(base64Decoded);

      // Revertir la operación XOR
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode ^ keyChar);
      }
      return result;
    } catch {
      return 'Mensaje encriptado inválido';
    }
  };

  /**
   * 
   */
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
        description: "Ingrese ambos mensaje y llave.",
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
              Encriptar
            </TabsTrigger>
            <TabsTrigger value="decrypt">
              <Unlock className="w-4 h-4 mr-2" />
              Desencriptar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encrypt">
            <div className="space-y-4">
              <div>
                <Label htmlFor="message-encrypt">Mensaje a encriptar</Label>
                <Input
                  id="message-encrypt"
                  placeholder="Ingrese su mensaje secreto"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="key-encrypt" className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Llave de encriptacion
                </Label>
                <Input
                  id="key-encrypt"
                  placeholder="Ingrese su llave secreta"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>

              <Button 
                onClick={() => handleSubmit('encrypt')}
                className="w-full"
              >
                <Lock className="w-4 h-4 mr-2" />
                Encriptar mensaje
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="decrypt">
            <div className="space-y-4">
              <div>
                <Label htmlFor="message-decrypt">Mensaje encriptado</Label>
                <Input
                  id="message-decrypt"
                  placeholder="Ingrese el mensaje encriptado"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="key-decrypt" className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Llave de desencriptación
                </Label>
                <Input
                  id="key-decrypt"
                  placeholder="Ingrese su llave secreta"
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
                Desencriptar mensaje
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {result && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <Label>Resultado:</Label>
              <Button   variant="ghost" size="sm" onClick={handleCopy}>
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