/** 
 * Formata um número para o formato de moeda Kwanza angolano (por exemplo, Kz 1.250,00)
 * **/

export function formatoKwanza(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return 'Kz 0,00';
  }

  const parts = value.toFixed(2).split('.');
  const parteInteira = parts[0];
  const partDecimal = parts[1];

  // Adicionar pontos de milhar
  const formatacaoInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `Kz ${formatacaoInteira},${partDecimal}`;
}

/**
 * Formata uma string de data para uma data legível e localizada.
 */
export function formatoData(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}