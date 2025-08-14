import { createLogger } from './utils/logger.js';

const logger = createLogger('Categorizer');

class EmailCategorizer {
  constructor() {
    this.categories = {
      work: {
        keywords: ['meeting', 'project', 'deadline', 'task', 'client', 'business', 'report', 'presentation'],
        patterns: [
          /\b(urgent|asap|priority|deadline)\b/i,
          /\b(meeting|conference|call)\b/i,
          /\b(project|task|assignment)\b/i
        ],
        domains: ['company.com', 'business.org', 'work.net']
      },
      personal: {
        keywords: ['family', 'friend', 'birthday', 'vacation', 'personal', 'home'],
        patterns: [
          /\b(birthday|anniversary|celebration)\b/i,
          /\b(family|friend|personal)\b/i,
          /\b(vacation|holiday|trip)\b/i
        ],
        domains: ['gmail.com', 'yahoo.com', 'hotmail.com']
      },
      finance: {
        keywords: ['bank', 'payment', 'invoice', 'bill', 'transaction', 'receipt', 'account', 'credit'],
        patterns: [
          /\b(invoice|bill|payment|receipt)\b/i,
          /\b(bank|credit|debit|account)\b/i,
          /\$[\d,]+\.?\d*/,
          /\b(transaction|transfer|deposit)\b/i
        ],
        domains: ['bank.com', 'paypal.com', 'stripe.com']
      },
      shopping: {
        keywords: ['order', 'shipping', 'delivery', 'purchase', 'cart', 'checkout', 'product'],
        patterns: [
          /\b(order|shipping|delivery)\b/i,
          /\b(purchase|bought|cart|checkout)\b/i,
          /\b(product|item|goods)\b/i,
          /tracking number/i
        ],
        domains: ['amazon.com', 'ebay.com', 'shopify.com', 'store.com']
      },
      newsletters: {
        keywords: ['newsletter', 'subscribe', 'unsubscribe', 'weekly', 'monthly', 'digest'],
        patterns: [
          /\b(newsletter|digest|weekly|monthly)\b/i,
          /\b(subscribe|unsubscribe)\b/i,
          /view.*browser/i,
          /this.*email.*sent.*to/i
        ],
        domains: ['mailchimp.com', 'constantcontact.com']
      },
      promotions: {
        keywords: ['sale', 'discount', 'offer', 'deal', 'coupon', 'promo', 'limited time'],
        patterns: [
          /\b(sale|discount|offer|deal)\b/i,
          /\b(coupon|promo|limited.*time)\b/i,
          /\d+%.*off/i,
          /\b(free|save|special.*offer)\b/i
        ],
        domains: []
      },
      social: {
        keywords: ['notification', 'liked', 'commented', 'shared', 'friend request', 'message'],
        patterns: [
          /\b(liked|commented|shared)\b/i,
          /\b(friend.*request|connection)\b/i,
          /\b(notification|alert)\b/i
        ],
        domains: ['facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com']
      },
      spam: {
        keywords: ['viagra', 'lottery', 'winner', 'click here', 'act now', 'limited offer', 'free money'],
        patterns: [
          /\b(viagra|cialis|lottery|winner)\b/i,
          /\b(click.*here|act.*now)\b/i,
          /\b(free.*money|easy.*money)\b/i,
          /\b(congratulations.*you.*won)\b/i
        ],
        domains: []
      }
    };
  }

  categorizeEmail(email) {
    const { subject, from, body, snippet } = email;
    const content = `${subject} ${body} ${snippet}`.toLowerCase();
    const fromEmail = from.toLowerCase();
    
    const scores = {};
    
    // Initialize scores for all categories
    Object.keys(this.categories).forEach(category => {
      scores[category] = 0;
    });

    // Score based on keywords, patterns, and domains
    Object.entries(this.categories).forEach(([categoryName, category]) => {
      // Keyword matching
      category.keywords.forEach(keyword => {
        if (content.includes(keyword.toLowerCase())) {
          scores[categoryName] += 2;
        }
      });

      // Pattern matching
      category.patterns.forEach(pattern => {
        if (pattern.test(content)) {
          scores[categoryName] += 3;
        }
      });

      // Domain matching
      category.domains.forEach(domain => {
        if (fromEmail.includes(domain.toLowerCase())) {
          scores[categoryName] += 4;
        }
      });
    });

    // Additional heuristics
    this.applyAdditionalHeuristics(email, scores);

    // Find the category with the highest score
    const maxScore = Math.max(...Object.values(scores));
    
    if (maxScore === 0) {
      return { category: 'uncategorized', confidence: 0, scores };
    }

    const bestCategory = Object.keys(scores).find(key => scores[key] === maxScore);
    const confidence = Math.min(maxScore / 10, 1); // Normalize to 0-1

    logger.info(`Email "${subject}" categorized as "${bestCategory}" with confidence ${confidence.toFixed(2)}`);
    
    return {
      category: bestCategory,
      confidence,
      scores
    };
  }

  applyAdditionalHeuristics(email, scores) {
    const { subject, from, body } = email;
    const content = `${subject} ${body}`.toLowerCase();
    const fromEmail = from.toLowerCase();

    // Auto-reply detection
    if (subject.toLowerCase().includes('re:') || 
        subject.toLowerCase().includes('auto-reply') ||
        content.includes('out of office')) {
      scores.work += 2;
    }

    // Newsletter detection
    if (content.includes('unsubscribe') || 
        content.includes('view in browser') ||
        content.includes('this email was sent to')) {
      scores.newsletters += 3;
    }

    // Promotion detection
    if (content.match(/\d+%/) || 
        content.includes('limited time') ||
        content.includes('expires')) {
      scores.promotions += 2;
    }

    // Spam indicators
    const spamIndicators = [
      'click here now',
      'act immediately',
      'congratulations you have won',
      'claim your prize',
      'urgent action required'
    ];
    
    spamIndicators.forEach(indicator => {
      if (content.includes(indicator)) {
        scores.spam += 5;
      }
    });

    // Social media notifications
    if (fromEmail.includes('notification') || 
        fromEmail.includes('noreply') ||
        subject.includes('notification')) {
      scores.social += 2;
    }

    // Financial keywords in subject
    const financialSubjectWords = ['payment', 'invoice', 'statement', 'bill', 'receipt'];
    financialSubjectWords.forEach(word => {
      if (subject.toLowerCase().includes(word)) {
        scores.finance += 3;
      }
    });
  }

  async categorizeEmails(emails) {
    logger.info(`Starting categorization of ${emails.length} emails`);
    
    const results = emails.map(email => ({
      id: email.id,
      email,
      ...this.categorizeEmail(email)
    }));

    // Log categorization summary
    const categorySummary = results.reduce((acc, result) => {
      acc[result.category] = (acc[result.category] || 0) + 1;
      return acc;
    }, {});

    logger.info('Categorization summary:', categorySummary);
    
    return results;
  }

  getCategoryLabel(category) {
    const labelMap = {
      work: 'Work',
      personal: 'Personal',
      finance: 'Finance',
      shopping: 'Shopping',
      newsletters: 'Newsletters',
      promotions: 'Promotions',
      social: 'Social',
      spam: 'Spam',
      uncategorized: 'Uncategorized'
    };

    return labelMap[category] || 'Uncategorized';
  }

  updateCategories(newCategories) {
    this.categories = { ...this.categories, ...newCategories };
    logger.info('Categories updated');
  }

  addCategory(name, definition) {
    this.categories[name] = definition;
    logger.info(`Added new category: ${name}`);
  }
}

export default EmailCategorizer;