// ./data.js
export const transactions = [
  {
    id: 1,
    type: 'Airtime',
    amount: '₦100.00',
    transactionType: 'Deposit',
    time: new Date('2024-10-17T10:30:00'),
  },
  {
    id: 2,
    type: 'Data',
    amount: '₦200.00',
    transactionType: 'Subscription',
    time: new Date(),
  },
  {
    id: 3,
    type: 'Electricity',
    amount: '₦500.00',
    transactionType: 'Subscription',
    time: new Date('2024-10-16T12:45:00'),
  },
  {
    id: 4,
    type: 'Cable TV',
    amount: '₦1500.00',
    transactionType: 'Subscription',
    time: new Date('2024-10-15T08:00:00'),
  },
];


// ./sidebarNavItems.js
export const sidebarNavItems = [
  {
    name: "Dashboard",
    link: "/dashboard",
    title: "Dashboard",
    icon: "pi pi-th-large"
  },
  {
    name: "Fund Account",
    link: "/fund",
    title: "Fund Account",
    icon: "pi pi-wallet"
  },
  {
    name: "Data Sub",
    link: "/data-sub",
    title: "Data Sub",
    icon: "pi pi-wifi"
  },
  {
    name: "Data Prices",
    link: "/data-prices",
    title: "Data Sub",
    icon: "bx bx-purchase-tag text-2xl"
  }
  ,
  {
    name: "Airtime Sub",
    link: "/airtime-sub",
    title: "Airtime Sub",
    icon: "pi pi-mobile"
  },
  {
    name: "Cable Sub",
    link: "/cable-sub",
    title: "Cable Sub",
    icon: "bx bx-tv text-2xl"
  },
  {
    name: "Electricity Sub",
    link: "/electricity-sub",
    title: "Electricity Sub",
    icon: "pi pi-bolt"
  },
  {
    name: "NECO/WAEC",
    link: "/education",
    title: "NECO/WAEC",
    icon: "pi pi-book"
  },
  {
    name: "Admin Panel",
    link: "/admin",
    title: "Admin Panel",
    icon: "pi pi-lock"
  },
  {
    name: "Payment",
    link: "/transactions/payment",
    title: "Payment",
    icon: "pi pi-dollar"
  },
  {
    name: "Purchase History",
    link: "/transactions/purchase-history",
    title: "Purchase History",
    icon: "pi pi-shopping-cart"
  },
  // {
  //   name: "Bonus",
  //   link: "/profile/bonus",
  //   title: "Bonus",
  //   icon: "pi pi-gift"
  // },
  {
    name: "Referrals",
    link: "/profile/referrals",
    title: "Referrals",
    icon: "pi pi-users"
  },
  {
    name: "Settings",
    link: "/settings",
    title: "Settings",
    icon: "pi pi-cog"
  },
  // {
  //   name: "Developers API",
  //   link: "/profile/api",
  //   title: "Developers API",
  //   icon: "pi pi-code"
  // },
  {
    name: "FAQs",
    link: "/support/faqs",
    title: "FAQs",
    icon: "pi pi-question-circle"
  },
  {
    name: "Support",
    link: "/support/contact",
    title: "Contact Us",
    icon: "pi pi-envelope"
  },
  {
    name: "Pricing",
    link: "/support/pricing",
    title: "Pricing",
    icon: "pi pi-money-bill"
  }
];
