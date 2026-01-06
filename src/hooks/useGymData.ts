export interface Client {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  endDate: string;
  membershipType: 'Monthly' | 'Quarterly' | 'Yearly';
  fee: number;
  status: 'Active' | 'Expired';
}

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    joinDate: '2024-01-01',
    endDate: '2024-02-01',
    membershipType: 'Monthly',
    fee: 50,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    joinDate: '2023-12-15',
    endDate: '2024-12-15',
    membershipType: 'Yearly',
    fee: 500,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    joinDate: '2023-11-01',
    endDate: '2023-12-01',
    membershipType: 'Monthly',
    fee: 50,
    status: 'Expired',
  },
];
