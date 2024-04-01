import {
  // FiUser,
  FiGift,
  FiAlertCircle,
  FiHelpCircle,
  FiTruck,
  FiPhoneCall,
  FiCreditCard,
  FiMail,
  FiMapPin,
} from 'react-icons/fi';
import {
  HiOutlineDocumentText,
  HiOutlinePhoneIncoming,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlineBookOpen
} from 'react-icons/hi';
import {
  IoBagCheckOutline,
  IoGridOutline,
  IoListOutline,
  IoSettingsOutline,
} from 'react-icons/io5';

const pages = [
  // {
  //   title: 'User',
  //   href: '/user/dashboard',
  //   icon: FiUser,
  // },
  {
    title: 'Offer',
    href: '/offer',
    icon: FiGift,
  },
  {
    title: 'Checkout',
    href: '/checkout',
    icon: IoBagCheckOutline,
  },
  {
    title: 'FAQ',
    href: '/faq',
    icon: FiHelpCircle,
  },
  {
    title: 'About Us',
    href: '/about-us',
    icon: HiOutlineUserGroup,
  },
  {
    title: 'Contact Us',
    href: '/contact-us',
    icon: HiOutlinePhoneIncoming,
  },
  {
    title: 'Privacy Policy',
    href: '/privacy-policy',
    icon: HiOutlineShieldCheck,
  },
  {
    title: 'Terms & Conditions',
    href: '/terms-and-conditions',
    icon: HiOutlineDocumentText,
  },
  {
    title: '404',
    href: '/404',
    icon: FiAlertCircle,
  },
];

const userSidebar = [
  {
    title: 'Dashboard',
    href: '/user/dashboard',
    icon: IoGridOutline,
  },
  {
    title: 'Mis Ordenes',
    href: '/user/my-orders',
    icon: IoListOutline,
  },
  {
    title: 'Actualizar Perfil',
    href: '/user/update-profile',
    icon: IoSettingsOutline,
  },
  {
    title: 'Cambiar Password',
    href: '/user/change-password',
    icon: HiOutlineDocumentText,
  },
];

const adminSidebar = [
  {
    title: 'Ordenes',
    href: '/user/orders-admin',
    icon: IoListOutline,
  },
  {
    title: 'Crear usuario de tienda',
    href: '/user/createshopuser',
    icon: HiOutlineDocumentText,
  },
  {
    title: 'Productos',
    href: '/user/items',
    icon: HiOutlineBookOpen,
  },
];

const delyveryManSidebar = [
  {
    title: 'Ordenes en Ruta',
    href: '/user/orders-ruta',
    icon: IoListOutline,
  },
];

const sliderData = [
  {
    id: 1,
    title: 'The Best Quality Products Guaranteed!',
    info: 'Dramatically facilitate effective total linkage for go forward processes...',
    url: '/search?Category=biscuits--cakes',
    image: '/slider/slider-1.jpg',
  },
  {
    id: 2,
    title: 'Best Different Type of Grocery Store',
    info: 'Quickly aggregate empowered networks after emerging products...',
    url: '/search?Category=fish--meat',
    image: '/slider/slider-2.jpg',
  },
  {
    id: 3,
    title: 'Quality Freshness Guaranteed!',
    info: 'Intrinsicly fashion performance based products rather than accurate benefits...',
    url: '/search?category=fresh-vegetable',
    image: '/slider/slider-3.jpg',
  },
];

const ctaCardData = [
  {
    id: 1,
    title: 'Taste of',
    subTitle: 'Fresh & Natural',
    image: '/cta/cta-bg-1.jpg',
    url: '/search?category=fresh-vegetable',
  },
  {
    id: 2,
    title: 'Taste of',
    subTitle: 'Fish & Meat',
    image: '/cta/cta-bg-2.jpg',
    url: '/search?Category=fish--meat',
  },
  {
    id: 3,
    title: 'Taste of',
    subTitle: 'Bread & Bakery',
    image: '/cta/cta-bg-3.jpg',
    url: '/search?Category=biscuits--cakes',
  },
];

const featurePromo = [
  {
    id: 1,
    title: 'Free Shipping',
    info: 'From $500.00',
    icon: FiTruck,
  },
  {
    id: 2,
    title: 'Support 24/7',
    info: 'At Anytime',
    icon: FiPhoneCall,
  },
  {
    id: 3,
    title: 'Secure Payment',
    info: 'Totally Safe',
    icon: FiCreditCard,
  },
  {
    id: 4,
    title: 'Latest Offer',
    info: 'Upto 20% Off',
    icon: FiGift,
  },
];

const contactData = [
  {
    id: 1,
    title: 'Escribenos',
    info: 'Respondemos normalmente en 2 a 3 dias laborale.',
    icon: FiMail,
    contact: 'dollarsvoficial@gmail.com',
    className: 'bg-emerald-100',
  },
  {
    id: 2,
    title: 'WhatsApp',
    info: 'Respondemos normalmente en 2 a 3 dias laborales.',
    icon: FiPhoneCall,
    contact: '+503 ####-####',
    className: 'bg-yellow-100',
  },
/*   {
    id: 3,
    title: 'Location',
    info: 'Cecilia Chapman, 561-4535 Nulla LA, United States 96522',
    icon: FiMapPin,
    contact: '',
    className: 'bg-indigo-100',
  }, */
];

export {
  pages,
  userSidebar,
  adminSidebar,
  sliderData,
  ctaCardData,
  featurePromo,
  contactData,
  delyveryManSidebar
};
