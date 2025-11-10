-- Seed data for email templates

INSERT INTO templates (name, subject, body) VALUES
(
  'welcome_email',
  'Welcome to Our Platform!',
  '<html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4CAF50;">Welcome {{userName}}! 🎉</h1>
        <p>We''re thrilled to have you join our community!</p>
        <p>Your account has been successfully created. Here are your next steps:</p>
        <ul>
          <li>Complete your profile</li>
          <li>Explore our features</li>
          <li>Connect with other members</li>
        </ul>
        <a href="{{dashboardUrl}}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Go to Dashboard
        </a>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          If you have any questions, feel free to reply to this email.
        </p>
      </div>
    </body>
  </html>'
),
(
  'password_reset',
  'Reset Your Password',
  '<html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #FF6B6B;">Password Reset Request 🔒</h1>
        <p>Hi {{userName}},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <a href="{{resetUrl}}" style="display: inline-block; background-color: #FF6B6B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #666;">This link will expire in 1 hour.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          If you didn''t request this, please ignore this email. Your password will remain unchanged.
        </p>
      </div>
    </body>
  </html>'
),
(
  'order_confirmation',
  'Order Confirmation - Order #{{orderId}}',
  '<html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2196F3;">Thank You for Your Order! 🛍️</h1>
        <p>Hi {{userName}},</p>
        <p>Your order has been confirmed and is being processed.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> {{orderId}}</p>
          <p><strong>Order Date:</strong> {{orderDate}}</p>
          <p><strong>Total Amount:</strong> ${{totalAmount}}</p>
        </div>
        <a href="{{trackingUrl}}" style="display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Track Your Order
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Questions? Contact our support team at support@example.com
        </p>
      </div>
    </body>
  </html>'
),
(
  'account_verification',
  'Verify Your Email Address',
  '<html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #9C27B0;">Verify Your Email ✉️</h1>
        <p>Hi {{userName}},</p>
        <p>Please verify your email address to complete your registration.</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #9C27B0;">
            {{verificationCode}}
          </p>
        </div>
        <p>Or click the button below:</p>
        <a href="{{verificationUrl}}" style="display: inline-block; background-color: #9C27B0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This code will expire in 24 hours.
        </p>
      </div>
    </body>
  </html>'
),
(
  'subscription_renewal',
  'Your Subscription is About to Renew',
  '<html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #FF9800;">Subscription Renewal Notice 🔔</h1>
        <p>Hi {{userName}},</p>
        <p>Your {{planName}} subscription will automatically renew on {{renewalDate}}.</p>
        <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #FF9800; margin: 20px 0;">
          <p><strong>Renewal Amount:</strong> ${{amount}}</p>
          <p><strong>Billing Date:</strong> {{renewalDate}}</p>
          <p><strong>Payment Method:</strong> •••• {{lastFourDigits}}</p>
        </div>
        <p>No action is required. Your subscription will continue uninterrupted.</p>
        <a href="{{manageSubscriptionUrl}}" style="display: inline-block; background-color: #FF9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Manage Subscription
        </a>
      </div>
    </body>
  </html>'
),
(
  'newsletter',
  '{{monthName}} Newsletter - Latest Updates',
  '<html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #00BCD4;">This Month''s Highlights 📰</h1>
        <p>Hi {{userName}},</p>
        <p>Here''s what''s new this month:</p>
        <div style="margin: 20px 0;">
          <h3 style="color: #00BCD4;">🚀 New Features</h3>
          <p>{{newFeatures}}</p>
          
          <h3 style="color: #00BCD4;">📊 Product Updates</h3>
          <p>{{productUpdates}}</p>
          
          <h3 style="color: #00BCD4;">💡 Tips & Tricks</h3>
          <p>{{tips}}</p>
        </div>
        <a href="{{readMoreUrl}}" style="display: inline-block; background-color: #00BCD4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Read Full Newsletter
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          <a href="{{unsubscribeUrl}}" style="color: #666;">Unsubscribe</a> from future newsletters
        </p>
      </div>
    </body>
  </html>'
),
(
  'invoice',
  'Invoice #{{invoiceNumber}} from {{companyName}}',
  '<html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #607D8B;">Invoice 📄</h1>
        <p>Hi {{userName}},</p>
        <p>Please find your invoice attached to this email.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px;"><strong>Invoice Number:</strong></td>
              <td style="padding: 5px;">{{invoiceNumber}}</td>
            </tr>
            <tr>
              <td style="padding: 5px;"><strong>Invoice Date:</strong></td>
              <td style="padding: 5px;">{{invoiceDate}}</td>
            </tr>
            <tr>
              <td style="padding: 5px;"><strong>Due Date:</strong></td>
              <td style="padding: 5px;">{{dueDate}}</td>
            </tr>
            <tr>
              <td style="padding: 5px;"><strong>Total Amount:</strong></td>
              <td style="padding: 5px; font-size: 18px; font-weight: bold;">{{totalAmount}}</td>
            </tr>
          </table>
        </div>
        <a href="{{viewInvoiceUrl}}" style="display: inline-block; background-color: #607D8B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          View Invoice Online
        </a>
      </div>
    </body>
  </html>'
),
(
  'notification_alert',
  'New Notification: {{notificationTitle}}',
  '<html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #F44336;">New Notification 🔔</h1>
        <p>Hi {{userName}},</p>
        <div style="background-color: #ffebee; border-left: 4px solid #F44336; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0;">{{notificationTitle}}</h3>
          <p>{{notificationMessage}}</p>
          <p style="color: #666; font-size: 12px;">{{notificationTime}}</p>
        </div>
        <a href="{{actionUrl}}" style="display: inline-block; background-color: #F44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          View Details
        </a>
      </div>
    </body>
  </html>'
);
