# Production Setup Guide

This guide will help you deploy your Love Wall application to production.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
1. **Connect to GitHub**: Push your code to GitHub
2. **Deploy on Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy automatically

### Option 2: Netlify
1. **Connect to GitHub**: Push your code to GitHub
2. **Deploy on Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy automatically

### Option 3: Railway
1. **Connect to GitHub**: Push your code to GitHub
2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy automatically

## 🔧 Required Environment Variables

Set these in your production environment:

```env
# MongoDB Connection (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/photo-wall?retryWrites=true&w=majority

# Stripe Configuration (Required)
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloudinary Configuration (Required)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Configuration (Required)
ADMIN_PASSWORD=your_secure_admin_password

# Base URL for the application (Required)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## 📋 Pre-Deployment Checklist

### 1. Database Setup
- [ ] Create MongoDB Atlas cluster
- [ ] Set up database user with read/write permissions
- [ ] Whitelist your production IP addresses
- [ ] Test database connection

### 2. Stripe Setup
- [ ] Switch to live mode in Stripe dashboard
- [ ] Get live API keys (pk_live_ and sk_live_)
- [ ] Set up webhook endpoint: `https://your-domain.com/api/webhook/stripe`
- [ ] Configure webhook events: `checkout.session.completed`

### 3. Cloudinary Setup
- [ ] Create Cloudinary account
- [ ] Get API credentials
- [ ] Set up upload presets (optional)
- [ ] Test image uploads

### 4. Domain Setup
- [ ] Purchase domain name
- [ ] Configure DNS settings
- [ ] Set up SSL certificate (automatic with Vercel/Netlify)
- [ ] Test domain access

## 🛡️ Security Configuration

### 1. Environment Variables
- [ ] Use strong, unique passwords
- [ ] Never commit secrets to version control
- [ ] Use environment-specific configurations
- [ ] Regularly rotate API keys

### 2. Database Security
- [ ] Use connection string with SSL
- [ ] Restrict database access by IP
- [ ] Enable database authentication
- [ ] Regular backups

### 3. API Security
- [ ] Validate all inputs
- [ ] Rate limiting (implement if needed)
- [ ] CORS configuration
- [ ] HTTPS enforcement

## 📊 Monitoring Setup

### 1. Error Tracking
- [ ] Set up Sentry or similar service
- [ ] Monitor API errors
- [ ] Track user interactions
- [ ] Set up alerts

### 2. Analytics
- [ ] Google Analytics
- [ ] User behavior tracking
- [ ] Performance monitoring
- [ ] Conversion tracking

### 3. Logging
- [ ] Application logs
- [ ] Error logs
- [ ] Access logs
- [ ] Performance logs

## 🔄 CI/CD Pipeline

### 1. GitHub Actions (Optional)
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 2. Automatic Deployments
- [ ] Deploy on push to main branch
- [ ] Run tests before deployment
- [ ] Environment-specific builds
- [ ] Rollback capabilities

## 📈 Performance Optimization

### 1. Next.js Optimizations
- [ ] Enable compression
- [ ] Optimize images (already configured)
- [ ] Enable caching headers
- [ ] Bundle analysis

### 2. Database Optimization
- [ ] Add database indexes
- [ ] Optimize queries
- [ ] Connection pooling
- [ ] Query monitoring

### 3. CDN Setup
- [ ] Static asset delivery
- [ ] Image optimization
- [ ] Global edge locations
- [ ] Cache invalidation

## 🧪 Testing

### 1. Pre-Production Testing
- [ ] Test all features
- [ ] Test payment flow
- [ ] Test image uploads
- [ ] Test admin functions

### 2. Load Testing
- [ ] Concurrent users
- [ ] Database performance
- [ ] API response times
- [ ] Image upload limits

## 📱 Mobile Optimization

### 1. Responsive Design
- [ ] Test on mobile devices
- [ ] Touch-friendly interfaces
- [ ] Mobile performance
- [ ] Offline capabilities (if needed)

### 2. PWA Features (Optional)
- [ ] Service worker
- [ ] Offline support
- [ ] App manifest
- [ ] Push notifications (if needed)

## 🔍 SEO Setup

### 1. Meta Tags
- [ ] Title tags
- [ ] Meta descriptions
- [ ] Open Graph tags
- [ ] Twitter cards

### 2. Sitemap
- [ ] XML sitemap
- [ ] Submit to Google Search Console
- [ ] Monitor indexing
- [ ] Fix crawl errors

## 📞 Support Setup

### 1. Contact Information
- [ ] Support email
- [ ] Help documentation
- [ ] FAQ section
- [ ] User guides

### 2. Error Handling
- [ ] User-friendly error messages
- [ ] Fallback pages
- [ ] Error reporting
- [ ] Recovery mechanisms

## 🚨 Backup Strategy

### 1. Database Backups
- [ ] Automated daily backups
- [ ] Point-in-time recovery
- [ ] Cross-region backups
- [ ] Test restore procedures

### 2. Code Backups
- [ ] Version control
- [ ] Multiple repositories
- [ ] Release tags
- [ ] Rollback procedures

## 📊 Analytics & Metrics

### 1. Business Metrics
- [ ] Photo submissions
- [ ] Payment conversions
- [ ] User engagement
- [ ] Revenue tracking

### 2. Technical Metrics
- [ ] Page load times
- [ ] API response times
- [ ] Error rates
- [ ] Uptime monitoring

## 🔐 Privacy & Compliance

### 1. Data Protection
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Cookie policy
- [ ] GDPR compliance (if applicable)

### 2. User Data
- [ ] Data collection notice
- [ ] User consent
- [ ] Data deletion
- [ ] Data export

## 🎯 Launch Checklist

### Final Steps
- [ ] All environment variables set
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Payment processing tested
- [ ] Admin panel accessible
- [ ] All features working
- [ ] Performance optimized
- [ ] Monitoring active
- [ ] Backup system running
- [ ] Support channels ready

## 🆘 Troubleshooting

### Common Issues
1. **Environment Variables**: Ensure all required vars are set
2. **Database Connection**: Check MongoDB URI and network access
3. **Stripe Webhooks**: Verify endpoint URL and events
4. **Image Uploads**: Check Cloudinary configuration
5. **Domain Issues**: Verify DNS and SSL settings

### Support Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 📞 Post-Launch

### 1. Monitor
- [ ] Check error logs daily
- [ ] Monitor performance metrics
- [ ] Track user feedback
- [ ] Watch payment processing

### 2. Maintain
- [ ] Regular updates
- [ ] Security patches
- [ ] Performance optimizations
- [ ] Feature improvements

### 3. Scale
- [ ] Monitor resource usage
- [ ] Plan for growth
- [ ] Optimize bottlenecks
- [ ] Add features as needed

---

## 🎉 Congratulations!

Your Love Wall application is now production-ready! Remember to:

- Monitor your application regularly
- Keep dependencies updated
- Backup your data
- Listen to user feedback
- Scale as needed

Good luck with your launch! 🚀
