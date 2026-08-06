import { create } from 'zustand';

// 1. Define the shapes of your data
export interface BusinessInfo {
  name: string;
  address: string;
  gstin: string;
  email: string;
  phone: string;
}

export interface ClientInfo {
  name: string;
  address: string;
  gstin: string;
  email: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  gstRate: number;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  date: string;
  dueDate: string;
}

// UPDATED: Now matches InvoiceSummary.tsx exactly
export interface InvoiceTotals {
  subtotal: number;
  igst: number;
  cgst: number;
  sgst: number;
  round_off: number;
  total: number;
}

// 2. Define the entire store structure
interface InvoiceStore {
  business: BusinessInfo;
  setBusiness: (info: Partial<BusinessInfo>) => void;

  client: ClientInfo;
  setClient: (info: Partial<ClientInfo>) => void;

  items: LineItem[];
  setItems: (items: LineItem[]) => void;
  addItem: (item: LineItem) => void;
  removeItem: (id: string) => void;

  details: InvoiceDetails;
  setDetails: (details: Partial<InvoiceDetails>) => void;

  totals: InvoiceTotals;
  setTotals: (totals: Partial<InvoiceTotals>) => void;
}

// 3. Create the actual store with default values
const useInvoiceStore = create<InvoiceStore>((set) => ({
  business: { name: '', address: '', gstin: '', email: '', phone: '' },
  setBusiness: (info) =>
    set((state) => ({ business: { ...state.business, ...info } })),

  client: { name: '', address: '', gstin: '', email: '' },
  setClient: (info) =>
    set((state) => ({ client: { ...state.client, ...info } })),

  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  details: { invoiceNumber: 'INV-001', date: '', dueDate: '' },
  setDetails: (info) =>
    set((state) => ({ details: { ...state.details, ...info } })),

  // UPDATED: Default values for all GST and total fields
  totals: { 
    subtotal: 0, 
    igst: 0, 
    cgst: 0, 
    sgst: 0, 
    round_off: 0, 
    total: 0 
  },
  setTotals: (info) =>
    set((state) => ({ totals: { ...state.totals, ...info } })),
}));

export default useInvoiceStore;