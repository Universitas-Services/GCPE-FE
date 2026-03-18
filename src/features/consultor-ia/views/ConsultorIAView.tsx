'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  text: string;
  isUser: boolean;
}

export const ConsultorIAView: React.FC = () => {
  const [messages] = useState<Message[]>([
    {
      text: '¡Hola! Soy tu Consultor IA especializado en gestión de contrataciones públicas. ¿En qué puedo ayudarte hoy?',
      isUser: false,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full flex justify-center">
      <div className="flex flex-col h-full w-full max-w-4xl bg-slate-50 border rounded-lg shadow-xl">
        <div className="flex items-center p-4 border-b bg-white rounded-t-lg">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src="/logo.png" alt="ConsultorIA" />
            <AvatarFallback className="bg-[#005282] text-white">
              IA
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold text-gray-800">
            Consultor IA - Gestión de Contrataciones
          </h2>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-4',
                msg.isUser ? 'justify-end' : 'justify-start'
              )}
            >
              {!msg.isUser && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/logo.png" alt="ConsultorIA" />
                  <AvatarFallback className="bg-[#005282] text-white">
                    IA
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-md p-3 rounded-lg shadow-sm',
                  msg.isUser
                    ? 'bg-[#005282] text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
                )}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-white rounded-b-lg">
          <Button
            asChild
            className="w-full h-12 bg-[#0097b2] hover:bg-[#008299] text-white font-semibold"
          >
            <a
              href="https://universitas.myflodesk.com/ae-pro"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoLogoWhatsapp className="mr-2 h-6 w-6" />
              Activa el Consultor IA con la versión PRO
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
