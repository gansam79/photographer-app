# Photography Billing & Quotation System

A full-stack MERN application for managing photography business quotations, invoices, clients, and payments.

## ✨ Features

- 📋 **Quotation Management** - Create, edit, and duplicate quotations
- 📄 **Invoice Generation** - Convert quotations to invoices
- 💰 **Payment Tracking** - Track payments with multiple payment methods
- 👥 **Client Database** - Store and manage client information
- 🔔 **Smart Reminders** - Get notifications for overdue invoices and upcoming events
- 📊 **Dashboard Analytics** - View key metrics at a glance
- 💾 **Auto-generated Numbers** - Automatic quotation and invoice numbering
- 🎨 **Luxury UI Design** - Professional, modern interface with gold and charcoal theme
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile

## 🏗️ Architecture

### Full MERN Stack
- **M**ongoDB - NoSQL database with Mongoose ODM
- **E**xpress - Node.js web framework
- **R**eact - Front-end UI library with hooks
- **N**ode.js - JavaScript runtime

### Tech Stack Details
- **Backend**: Node.js + Express.js
- **Frontend**: React 18 with Functional Components & Hooks
- **Database**: MongoDB with Mongoose
- **API**: RESTful architecture
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **PDF Generation**: jsPDF + html2canvas
- **Routing**: React Router v6

## 📁 Project Structure

```
photography-billing-app/
├── server/                    # Express Backend (Port 5000)
│   ├── config/               # Database configuration
│   ├── controllers/          # Business logic
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── middleware/           # Error handling
│   ├── server.js            # Entry point
│   ├── .env                 # Environment variables
│   ��── package.json
│
├── client/                   # React Frontend (Port 3000)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── styles/          # CSS & Tailwind
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Vite entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
└── docs/                     # Documentation
    ├── SETUP.md             # Installation guide
    ├── PROJECT_STRUCTURE.md # Architecture overview
    └── API.md               # API documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- npm or yarn
- MongoDB Atlas account (free tier)

### Installation

1. **Clone or download the project**
```bash
cd photography-billing-app
```

2. **Setup Server**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB credentials
npm run dev
```

3. **Setup Client** (in another terminal)
```bash
cd client
npm install
npm run dev
```

4. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- API Health Check: http://localhost:5000/api/health

## 📚 Documentation

- **[Setup Guide](./docs/SETUP.md)** - Detailed installation and configuration instructions
- **[Project Structure](./docs/PROJECT_STRUCTURE.md)** - Architecture and design patterns
- **[API Documentation](./docs/API.md)** - Complete API endpoint reference

## 🔌 API Endpoints

### Resources
- **Clients** - `/api/clients`
- **Services** - `/api/services`
- **Quotations** - `/api/quotations`
- **Invoices** - `/api/invoices`
- **Payments** - `/api/payments`

See [API.md](./docs/API.md) for detailed endpoint documentation.

## 💾 Database Models

### Client
- Name, Email, Phone
- Address, City, State, Zip
- Category (Regular, VIP, New Inquiry)
- Tags & Notes
- Financial tracking (totalBilled, totalPaid, pendingAmount)

### Service
- Name & Description
- Category (Photography, Video, Drone, Product, Other)
- Rate per day/unit
- Active/Inactive status

### Quotation
- Auto-generated quotation number
- Client & event information
- Services with quantities & rates
- Discount & tax calculations
- Status tracking (Draft, Sent, Accepted, Rejected)
- Conversion to invoice capability

### Invoice
- Auto-generated invoice number
- All quotation details
- Payment status tracking
- Bank details for payments
- Payment history

### Payment
- Invoice & client reference
- Amount & payment method
- Transaction tracking
- Payment date & notes

## 🎯 Use Cases

### 1. Create a Quotation
1. Add client information
2. Select services and quantities
3. Review calculations (subtotal, discount, tax)
4. Save as draft or send to client
5. Convert to invoice when accepted

### 2. Track Payments
1. Create invoices from quotations
2. Record payments as received
3. Track overdue invoices
4. View payment summary dashboard

### 3. Manage Clients
1. Maintain client database
2. Track client history
3. Categorize clients (VIP, Regular, etc.)
4. Add tags and notes
5. View client financials

## 🔒 Security Features

- Input validation on both client and server
- Environment variable protection
- Mongoose schema validation
- Error message sanitization
- CORS configuration
- Database connection security

## 🛠️ Development

### Available Scripts

**Server**
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

**Client**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📊 Dashboard Features

- **Key Metrics** - Total billed, received, pending, quotations sent
- **Recent Activity** - Latest quotations and invoices
- **Quick Actions** - Create new quotations, invoices, clients
- **Reminders** - Overdue invoices, upcoming events
- **Performance Trends** - Growth indicators

## 🚀 Deployment

### Frontend (Netlify)
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Backend (Heroku, Railway, Render)
- Ensure `NODE_ENV=production` in .env
- Add MongoDB URI to environment variables
- Deploy server folder

## 🔮 Future Enhancements

- [ ] User authentication & roles
- [ ] Payment gateway integration (Stripe, Razorpay)
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Google Drive integration
- [ ] WhatsApp integration
- [ ] Advanced reports & analytics
- [ ] Multi-user support
- [ ] Team collaboration
- [ ] Cloud file storage

## 📝 License

This project is private and for personal use.

## 👤 Author

Created for The Patil Photography & Film's

## 🤝 Support

For issues or questions:
1. Check the documentation in `/docs`
2. Review API documentation
3. Check console logs and error messages
4. Verify environment configuration

---

## 🎓 Learning Resources

This project demonstrates:
- MERN stack architecture
- RESTful API design
- MongoDB with Mongoose
- React hooks and custom hooks
- Service layer pattern
- Error handling middleware
- Component composition
- Responsive design with Tailwind CSS

## 📞 Contact

For questions about the application functionality, contact your development team.

---

Made with ❤️ for The Patil Photography & Film's
