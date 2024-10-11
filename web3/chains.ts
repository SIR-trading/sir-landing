import {SymbolKind} from "vscode-languageserver-types";
import Number = SymbolKind.Number;

export declare type Chain = {
  id: string,
  token: string,
  label: string,
  rpcUrl: string
}

export const ethereum: Chain = {
  id: '0x1',
  token: 'ETH',
  label: 'Ethereum',
  rpcUrl: "https://eth.llamarpc.com"
}

export const local: Chain = {
  id: '0x539',
  token: 'ETH',
  label: 'Ethereum',
  rpcUrl: "http://127.0.0.1:8545"
}


export function isChain(obj: any): obj is Chain {
  return typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.token === 'string' &&
    typeof obj.label === 'string' &&
    typeof obj.rpcUrl === 'string'
}