import { create } from 'zustand';

// 1. Define the exact shapes based on your components
export interface BusinessInfo {
  name: string;
  address: string;
  gstin: string;
  email: string;
  phone: string;
}

export interface ClientInfo {
  name: string;
  company: string;
  address: string;
  gstin: string;
  email: string;
  phone: string;
}

export interface LineItem {
  id: string;
  description: string;
  hsnSac: string;
  quantity: number;
  per: string;
  rate: number;
  amount: number;
  gst: number;
}

export interface InvoiceTotals {
  subtotal: number;
  igst: number;
  cgst: number;
  sgst: number;
  round_off: number;
  total: number;
}

// --- NEW: The Math Engine ---
// This function calculates all taxes and totals automatically
const calculateTotals = (items: LineItem[]): InvoiceTotals => {
  let subtotal = 0;
  let cgst = 0;
  let sgst = 0;

  items.forEach((item) => {
    subtotal += item.amount;
    // Calculate total GST for this item, then split it half/half for CGST and SGST
    const itemTax = item.amount * (item.gst / 100);
    cgst += itemTax / 2;
    sgst += itemTax / 2;
  });

  const grossTotal = subtotal + cgst + sgst;
  const total = Math.round(grossTotal); // Standard invoice rounding
  const round_off = total - grossTotal;

  return {
    subtotal,
    igst: 0, // Keeping IGST at 0 by default for intra-state logic
    cgst,
    sgst,
    round_off,
    total,
  };
};

// 2. Define the exact functions your components are calling
interface InvoiceStore {
  business: BusinessInfo;
  setBusiness: (info: Partial<BusinessInfo>) => void;

  client: ClientInfo;
  setClient: (info: Partial<ClientInfo>) => void;

  items: LineItem[];
  setItems: (items: LineItem[]) => void;
  addItem: (item: LineItem) => void;
  addItemWithData: (item: LineItem) => void;
  removeItem: (id: string) => void;

  invoiceNumber: string;
  setInvoiceNumber: (num: string) => void;
  
  invoiceDate: string;
  setInvoiceDate: (date: string) => void;
  
  dueDate: string;
  setDueDate: (date: string) => void;

  sameGst: boolean;
  setSameGst: (val: boolean) => void;
  
  globalGst: number;
  setGlobalGst: (val: number) => void;

  totals: InvoiceTotals;
  setTotals: (totals: Partial<InvoiceTotals>) => void;
}

// 3. Create the store with default values
const useInvoiceStore = create<InvoiceStore>((set) => ({
  business: { name: '', address: '', gstin: '', email: '', phone: '' },
  setBusiness: (info) =>
    set((state) => ({ business: { ...state.business, ...info } })),

  client: { name: '', company: '', address: '', gstin: '', email: '', phone: '' },
  setClient: (info) =>
    set((state) => ({ client: { ...state.client, ...info } })),

  items: [],
  
  // UPDATED: Now these functions update the items AND crunch the numbers instantly
  setItems: (items) => set({ items, totals: calculateTotals(items) }),
  
  // FIX APPLIED HERE: Automatically assigns a unique ID if one is missing
  addItem: (item) => set((state) => {
    const newItem = { 
      ...item, 
      id: item.id || Date.now().toString() + Math.random().toString(36).substring(7) 
    };
    const newItems = [...state.items, newItem];
    return { items: newItems, totals: calculateTotals(newItems) };
  }),
  
  // FIX APPLIED HERE: Automatically assigns a unique ID if one is missing
  addItemWithData: (item) => set((state) => {
    const newItem = { 
      ...item, 
      id: item.id || Date.now().toString() + Math.random().toString(36).substring(7) 
    };
    const newItems = [...state.items, newItem];
    return { items: newItems, totals: calculateTotals(newItems) };
  }),
  
  removeItem: (id) => set((state) => {
    const newItems = state.items.filter((i) => i.id !== id);
    return { items: newItems, totals: calculateTotals(newItems) };
  }),

  invoiceNumber: 'INV-001',
  setInvoiceNumber: (num) => set({ invoiceNumber: num }),
  
  invoiceDate: '',
  setInvoiceDate: (date) => set({ invoiceDate: date }),
  
  dueDate: '',
  setDueDate: (date) => set({ dueDate: date }),

  sameGst: false,
  setSameGst: (val) => set({ sameGst: val }),
  
  globalGst: 0,
  setGlobalGst: (val) => set({ globalGst: val }),

  totals: { subtotal: 0, igst: 0, cgst: 0, sgst: 0, round_off: 0, total: 0 },
  setTotals: (info) =>
    set((state) => ({ totals: { ...state.totals, ...info } })),
}));

export default useInvoiceStore;