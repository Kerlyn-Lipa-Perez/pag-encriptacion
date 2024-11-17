import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, Copy, Key } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster"
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
    
    const validateInput = (input: string, type: 'message' | 'key'): boolean => {
      const allowedCharsRegex = /^[a-zA-ZñÑ0-9\s.,!?+]+$/;
      
      if (!allowedCharsRegex.test(input) && input !== '') {
        toast({
          title: "Invalid Input",
          description: `${type === 'message' ? 'Message' : 'Key'} can only contain letters, numbers, and basic punctuation`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    };

    /**
   * 
   * @param text "Texto a encriptar"
   * @param key  "LLave de encriptación"
   * @returns 
   */
    const encrypt = (text: string, key: string) => {
    // Validar que no haya caracteres especiales
    const invalidCharsRegex = /[^A-Za-z0-9\s]/;
    if (invalidCharsRegex.test(text)) {
    // Mostrar un mensaje de toast
    toast({
      title: "Error",
      description: "El texto contiene caracteres especiales no permitidos.",
      duration: 3000,
    });
    return; // Salir de la función si hay caracteres no permitidos
  }
    let result = '';

    // Aplicar XOR en cada carácter del texto
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode ^ keyChar);
    }

    // Codificar resultado en Base64
    const base64Encoded = btoa(encodeURIComponent(result))

    // Transformar caracteres a símbolos astronómicos usando el diccionario
    let encryptedWithSymbols = '';
    for (const char of base64Encoded) {
      encryptedWithSymbols += simbolos_astronomicos[char] || char; // Mantener el carácter si no tiene mapeo
    }

    return encryptedWithSymbols;
  };

  const decrypt = (encoded: string, key: string) => {
    try {
      console.log("Texto encriptado recibido:", encoded);

      const reversedSimbolos = Object.fromEntries(
        Object.entries(simbolos_astronomicos).map(([k, v]) => [v, k])
      )

      let base64Decoded = ''
      for (const char of encoded) {
        base64Decoded += reversedSimbolos[char] || char
      } 

      // Validar y corregir longitud para Base64
      while (base64Decoded.length % 4 !== 0) {
        base64Decoded += '=';
      }

      console.log("Texto transformado a Base64:", base64Decoded);

      // Decodificar Base64
      if (!/^[A-Za-z0-9+/=]*$/.test(base64Decoded)) {
        throw new Error("La cadena transformada no es un Base64 válido");
      }
      
      // Decode Base64 and handle URL-encoded characters
      const text = decodeURIComponent(atob(base64Decoded))
      
      console.log("Texto decodificado de Base64:", text);

      // Revertir operación XOR
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode ^ keyChar);
      }
      return result;
    } catch (error) {
      console.error("Error durante el descifrado:", error);
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
     setResult(result || '');
  };


  return (

    <div className="min-h-screen bg-gradient- to-b from-background to-muted p-6 flex flex-col items-center justify-center via-blue-100">
      <Card className="max-w-2xl mx-auto p-6 shadow-xl justify-center content-center border border-blue-200 bg-white/80 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
          Herramienta de Encriptacion y Desencriptación
        </h1>
        
        <Tabs defaultValue="encrypt" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-50">
            <TabsTrigger value="encrypt" className='data-[state=active]:bg-blue-600 data-[state=active]:text-white'>
              <Lock className="w-4 h-4 mr-2" />
              Encriptar
            </TabsTrigger>
            <TabsTrigger value="decrypt" className='data-[state=active]:bg-blue-600 data-[state=active]:text-white'>
              <Unlock className="w-4 h-4 mr-2" />
              Desencriptar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encrypt">
            <div className="space-y-4">
              <div>
                <Label htmlFor="message-encrypt" className="text-blue-800">Mensaje a encriptar</Label>
                <Input
                  id="message-encrypt"
                  placeholder="Ingrese su mensaje secreto"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1.5 bg-white border-blue-200 focus:border-blue-400 "
                  required
                />
              </div>

              <div>
                <Label htmlFor="key-encrypt" className="flex items-center gap-2 text-blue-800">
                  <Key className="w-4 h-4" />
                  Llave de encriptacion
                </Label>
                <Input
                  id="key-encrypt"
                  placeholder="Ingrese su llave secreta"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="mt-1.5 bg-white border-blue-200 focus:border-blue-400"
                  required
                />
              </div>

              <Button 
                onClick={() => handleSubmit('encrypt')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Lock className="w-4 h-4 mr-2" />
                Encriptar mensaje
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="decrypt">
            <div className="space-y-4">
              <div>
                <Label htmlFor="message-decrypt" className="text-blue-800">Mensaje encriptado</Label>
                <Input
                  id="message-decrypt"
                  placeholder="Ingrese el mensaje encriptado"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1.5 bg-white border-blue-200 focus:border-blue-400"
                />
              </div>

              <div>
                <Label htmlFor="key-decrypt" className="flex items-center gap-2 text-blue-800">
                  <Key className="w-4 h-4" />
                  Llave de desencriptación
                </Label>
                <Input
                  id="key-decrypt"
                  placeholder="Ingrese su llave secreta"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="mt-1.5 bg-white border-blue-200 focus:border-blue-400"
                />
              </div>

              <Button 
                onClick={() => handleSubmit('decrypt')}
                className="w-full bg-blue-700 text-white hover:bg-blue-800 "
              >
                <Unlock className="w-4 h-4 mr-2" />
                Desencriptar mensaje
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {result && (
          <div className="mt-6 p-4 bg-muted  bg-blue-50 rounded-lg border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <Label>Resultado:</Label>
              <Button   className="hover:bg-blue-100" variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="font-mono break-all text-blue-900">{result}</p>
          </div>
        )}
      </Card>
    </div>
  );

}

export default EncryptionForm;
