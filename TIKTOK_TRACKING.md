# TikTok Pixel & API Events Implementation

## TikTok Pixel Setup
- **Pixel ID**: D39NN03C77U10IM7GH9G
- **Location**: Added to app/layout.tsx in head section
- **Status**: ✅ Active

## Implemented TikTok Events

### 1. Page View Tracking
- **Event**: `ViewContent`
- **Trigger**: On component mount
- **Data**: Landing page view with content details

### 2. Package Selection Tracking  
- **Event**: `ViewContent`
- **Trigger**: When user changes package selection
- **Data**: Package details, pricing, currency (IDR)

### 3. Form Submission Tracking
- **Event**: `SubmitForm`
- **Trigger**: When partnership form is submitted
- **Data**: Lead generation data, package value, content details

### 4. WhatsApp Chat Tracking
- **Event**: `Contact`
- **Trigger**: When user clicks WhatsApp chat popup
- **Data**: Direct contact engagement

### 5. CTA Engagement Tracking
- **Event**: `ClickButton`
- **Trigger**: When user clicks scroll-to-form buttons
- **Data**: User engagement with call-to-action

## Event Parameters
All events include relevant parameters like:
- `content_name`: Descriptive name of the content/action
- `content_category`: Category classification
- `content_id`: Unique identifier
- `value`: Monetary value (for packages)
- `currency`: IDR for Indonesian market
- `description`: Additional context

## Benefits
✅ Complete conversion funnel tracking
✅ Package-specific performance measurement
✅ Engagement optimization data
✅ WhatsApp lead attribution
✅ ROI measurement capabilities