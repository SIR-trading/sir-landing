export declare type Chain = {
  id: string,
  token: string,
  label: string,
  rpcUrl?: string
}

export const ethereum: Chain = {
  id: '0x1',
  token: 'ETH',
  label: 'Ethereum',
}

export const local: Chain = {
  id: '0x539',
  token: 'ETH',
  label: 'Local'
}

export const sepolia: Chain = {
  id: '0xaa36a7',
  token: 'ETH',
  label: 'Sepolia',
}

export function isChain(obj: any): obj is Chain {
  return typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.token === 'string' &&
    typeof obj.label === 'string'
}