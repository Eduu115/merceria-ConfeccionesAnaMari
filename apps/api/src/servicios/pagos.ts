export type PasarelaDePago = {
  cobrar(centimos: number, moneda: string): Promise<void>;
};

export class PasarelaInactiva implements PasarelaDePago {
  async cobrar(): Promise<void> {
    throw new Error('La pasarela de pago no está activa.');
  }
}

export const pasarela: PasarelaDePago = new PasarelaInactiva();
