export const calcularRodizio = (placa: string): string => {
  if (!placa || placa.length < 7) return 'N/A';
  
  const ultimoDigito = placa.slice(-1);
  const penultimoDigito = placa.slice(-2, -1);
  
  // Sistema de rodízio baseado nos dois últimos dígitos
  const digitos = [penultimoDigito, ultimoDigito];
  
  if (digitos.includes('1') || digitos.includes('2')) return 'Segunda';
  if (digitos.includes('3') || digitos.includes('4')) return 'Terça';
  if (digitos.includes('5') || digitos.includes('6')) return 'Quarta';
  if (digitos.includes('7') || digitos.includes('8')) return 'Quinta';
  if (digitos.includes('9') || digitos.includes('0')) return 'Sexta';
  
  return 'N/A';
};

export const verificarRodizioHoje = (rodizio: string): boolean => {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 = Domingo, 1 = Segunda, etc.
  
  const mapeamentoDias: { [key: number]: string } = {
    1: 'Segunda',
    2: 'Terça',
    3: 'Quarta',
    4: 'Quinta',
    5: 'Sexta'
  };
  
  return mapeamentoDias[diaSemana] === rodizio;
};