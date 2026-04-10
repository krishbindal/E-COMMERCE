export type Project = {
  _id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  fileUrl: string;
  category: string;
};

export type MarketplaceOrder = {
  id?: string;
  userId: string;
  email: string;
  projectId: string;
  paymentId: string;
  status: "paid" | "failed";
  createdAt: string;
};

export type CustomRequest = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  budget: string;
  deadline: string;
  createdAt: string;
};
