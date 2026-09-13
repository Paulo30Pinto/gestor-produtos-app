import type {Metadata} from 'next';
import './globals.css'; 

export const metadata: Metadata = {
  title: 'Gestão de Produtos',
  description: 'Painel para gerenciar produtos: visualizar, editar, adicionar e remover produtos com integração à API.',
  openGraph: {
    title: 'Gestão de Produtos',
    description: 'Painel para gerenciar produtos: visualizar, editar, adicionar e remover produtos com integração à API.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gestão de Produtos',
    description: 'Painel para gerenciar produtos: visualizar, editar, adicionar e remover produtos com integração à API.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
