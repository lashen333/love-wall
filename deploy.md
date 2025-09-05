# Deployment Guide

## 🚀 Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: World's Biggest Photo Wall"
   git branch -M main
   git remote add origin https://github.com/yourusername/world-biggest-photo-wall.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables (see `.env.example`)
   - Deploy!

## 🔧 Environment Variables Setup

### Required Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/photo-wall
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
ADMIN_PASSWORD=your_secure_password
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=https://yourdomain.vercel.app
```

### Optional Variables
```env
CLOUDINARY_URL=cloudinary://...
# OR
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
AWS_S3_BUCKET=...
```

## 🌐 Domain Configuration

1. **Custom Domain** (Optional)
   - Add custom domain in Vercel dashboard
   - Update `NEXTAUTH_URL` to your custom domain

2. **SSL Certificate**
   - Automatically handled by Vercel

## 📊 Database Setup

1. **MongoDB Atlas**
   - Create cluster
   - Set up database user
   - Get connection string
   - Add to environment variables

2. **Indexes** (Automatically created)
   - Couple status + createdAt
   - Secret code + names
   - Payment session ID

## 💳 Stripe Configuration

1. **Webhook Setup**
   - Go to Stripe Dashboard > Webhooks
   - Add endpoint: `https://yourdomain.vercel.app/api/webhook/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret to environment variables

2. **Test Mode**
   - Use test API keys for development
   - Switch to live keys for production

## 🖼️ Image Storage Setup

### Option 1: Cloudinary
1. Create Cloudinary account
2. Get cloud URL
3. Add to environment variables

### Option 2: AWS S3
1. Create S3 bucket
2. Set up IAM user with S3 access
3. Configure CORS for bucket
4. Add credentials to environment variables

## 🔒 Security Checklist

- [ ] Strong admin password
- [ ] Secure MongoDB connection
- [ ] Stripe webhook signature verification
- [ ] Rate limiting (implement if needed)
- [ ] Input validation
- [ ] CORS configuration

## 📱 Performance Optimization

1. **Image Optimization**
   - Client-side resizing
   - Thumbnail generation
   - Lazy loading in gallery

2. **Database**
   - Proper indexing
   - Pagination for large datasets
   - Connection pooling

3. **Caching**
   - Static generation where possible
   - API response caching
   - Image CDN

## 🧪 Testing

1. **Payment Flow**
   - Use Stripe test cards
   - Test webhook delivery
   - Verify photo upload after payment

2. **Admin Functions**
   - Test photo approval/rejection
   - Verify secret code generation
   - Test photo removal

3. **Mobile Responsiveness**
   - Test on various screen sizes
   - Verify touch interactions
   - Check heart wall scaling

## 📈 Monitoring

1. **Vercel Analytics**
   - Page views
   - Performance metrics
   - Error tracking

2. **MongoDB Atlas**
   - Database performance
   - Connection monitoring
   - Storage usage

3. **Stripe Dashboard**
   - Payment success rates
   - Webhook delivery
   - Revenue tracking

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors
   - Verify all dependencies installed
   - Check environment variables

2. **Database Connection**
   - Verify MongoDB URI
   - Check network access
   - Verify credentials

3. **Stripe Issues**
   - Check API keys
   - Verify webhook configuration
   - Test with Stripe CLI

### Debug Commands

```bash
# Local development
npm run dev

# Build check
npm run build

# Lint check
npm run lint

# Type check
npx tsc --noEmit
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] Stripe webhooks active
- [ ] Admin password changed
- [ ] SSL certificate active
- [ ] Performance monitoring enabled
- [ ] Error tracking configured
- [ ] Backup strategy in place

---

**Ready to launch your viral photo wall! 🚀❤️**


