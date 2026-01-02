from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import uvicorn
import os
from datetime import datetime

import json
import openai

# Add configuration
openai.api_key = "your-api-key"

def get_ai_response(message):
    """Get AI-powered response using OpenAI"""
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful shopping assistant."},
            {"role": "user", "content": message}
        ]
    )
    return response.choices[0].message.content



app = FastAPI(
    title="Polashtoli Store AI Chatbot",
    description="AI-powered shopping assistant for Polashtoli Store",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    action: Optional[Dict[str, Any]] = None
    suggestions: Optional[List[str]] = None
    timestamp: str

class ProductRecommendationRequest(BaseModel):
    user_id: Optional[str] = None
    category: Optional[str] = None
    price_range: Optional[Dict[str, float]] = None
    limit: int = 5

# In-memory session storage (use Redis in production)
chat_sessions = {}

# AI/NLP Functions
def process_message(message: str, context: Dict = None) -> Dict[str, Any]:
    """
    Process user message and generate appropriate response
    This can be enhanced with OpenAI, Anthropic Claude, or custom models
    """
    message_lower = message.lower()
    
    # Intent detection
    if any(word in message_lower for word in ['hello', 'hi', 'hey', 'greetings']):
        return {
            'response': "Hello! Welcome to Polashtoli Store. I'm your AI shopping assistant. How can I help you today?",
            'suggestions': [
                "Show me featured products",
                "I'm looking for electronics",
                "What are today's deals?",
                "Check my order status"
            ]
        }
    
    elif any(word in message_lower for word in ['product', 'show', 'find', 'search', 'looking for']):
        category = extract_category(message_lower)
        if category:
            return {
                'response': f"I'll help you find {category} products. Let me search our inventory...",
                'action': {
                    'type': 'navigate',
                    'url': f'/products.html?category={category}'
                },
                'suggestions': [
                    f"Show top-rated {category}",
                    f"Discounted {category}",
                    f"New arrivals in {category}"
                ]
            }
        else:
            return {
                'response': "I can help you find products! What category are you interested in? We have Electronics, Fashion, Home & Living, Beauty, and Sports.",
                'suggestions': [
                    "Show me electronics",
                    "I want fashion items",
                    "Home & Living products"
                ]
            }
    
    elif any(word in message_lower for word in ['cart', 'basket', 'checkout']):
        cart_items = context.get('cart', []) if context else []
        item_count = len(cart_items)
        
        if item_count > 0:
            return {
                'response': f"You have {item_count} item(s) in your cart. Would you like to proceed to checkout or continue shopping?",
                'action': {
                    'type': 'navigate',
                    'url': '/cart.html'
                },
                'suggestions': [
                    "View cart",
                    "Proceed to checkout",
                    "Continue shopping"
                ]
            }
        else:
            return {
                'response': "Your cart is currently empty. Let me help you find some great products!",
                'suggestions': [
                    "Show featured products",
                    "Today's deals",
                    "Browse categories"
                ]
            }
    
    elif any(word in message_lower for word in ['order', 'delivery', 'track', 'shipping']):
        return {
            'response': "I can help you track your order. Please provide your order number, or you can check your order history in your profile.",
            'action': {
                'type': 'navigate',
                'url': '/profile.html?tab=orders'
            },
            'suggestions': [
                "View order history",
                "Track my latest order",
                "Shipping information"
            ]
        }
    
    elif any(word in message_lower for word in ['price', 'cost', 'how much', 'discount', 'deal', 'offer']):
        return {
            'response': "I can help you find the best deals! We have ongoing discounts on many products. Would you like to see our discounted products or search for something specific?",
            'action': {
                'type': 'navigate',
                'url': '/products.html?filter=discounted'
            },
            'suggestions': [
                "Show discounted products",
                "Today's best deals",
                "Free shipping products"
            ]
        }
    
    elif any(word in message_lower for word in ['help', 'support', 'contact', 'problem', 'issue']):
        return {
            'response': "I'm here to help! You can reach our customer support team at +880 1234-567890 or email us at info@polashtoli.com. What specific issue can I assist you with?",
            'suggestions': [
                "Return policy",
                "Payment methods",
                "Shipping information",
                "Contact support"
            ]
        }
    
    elif any(word in message_lower for word in ['recommend', 'suggestion', 'popular', 'trending', 'best']):
        return {
            'response': "I'd love to recommend some products! Based on our top sellers and customer reviews, here are some popular items. Would you like to see recommendations for a specific category?",
            'action': {
                'type': 'navigate',
                'url': '/products.html?filter=top-rated'
            },
            'suggestions': [
                "Top-rated products",
                "Best sellers",
                "New arrivals",
                "Customer favorites"
            ]
        }
    
    elif any(word in message_lower for word in ['thank', 'thanks', 'appreciate']):
        return {
            'response': "You're welcome! Is there anything else I can help you with today?",
            'suggestions': [
                "Continue shopping",
                "View cart",
                "Contact support"
            ]
        }
    
    else:
        # Default response with search capability
        return {
            'response': f"I understand you're asking about '{message}'. Let me search our products for you, or I can help you with specific information about our store, shipping, returns, or any other questions you might have!",
            'action': {
                'type': 'search',
                'query': message
            },
            'suggestions': [
                "Search products",
                "Browse categories",
                "View featured items",
                "Customer support"
            ]
        }

def extract_category(message: str) -> Optional[str]:
    """Extract product category from message"""
    categories = {
        'electronics': ['electronic', 'electronics', 'phone', 'laptop', 'computer', 'gadget', 'tech'],
        'fashion': ['fashion', 'clothes', 'clothing', 'dress', 'shirt', 'pants', 'shoes', 'wear'],
        'home': ['home', 'furniture', 'living', 'kitchen', 'bedroom', 'decor'],
        'beauty': ['beauty', 'makeup', 'cosmetic', 'skincare', 'perfume'],
        'sports': ['sports', 'fitness', 'gym', 'exercise', 'yoga', 'athletic']
    }
    
    for category, keywords in categories.items():
        if any(keyword in message for keyword in keywords):
            return category
    
    return None

def generate_product_recommendations(user_data: Dict = None) -> List[Dict]:
    """
    Generate personalized product recommendations
    This can be enhanced with ML models for better personalization
    """
    # Placeholder for ML-based recommendations
    # In production, integrate with recommendation engine
    return []

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "Polashtoli Store AI Chatbot API",
        "version": "1.0.0",
        "status": "active"
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process chat message and return AI response
    """
    try:
        # Process the message
        result = process_message(request.message, request.context)
        
        # Create response
        response = ChatResponse(
            response=result['response'],
            action=result.get('action'),
            suggestions=result.get('suggestions'),
            timestamp=datetime.now().isoformat()
        )
        
        # Store in session if session_id provided
        if request.session_id:
            if request.session_id not in chat_sessions:
                chat_sessions[request.session_id] = []
            
            chat_sessions[request.session_id].append({
                'user_message': request.message,
                'bot_response': result['response'],
                'timestamp': datetime.now().isoformat()
            })
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recommendations")
async def get_recommendations(request: ProductRecommendationRequest):
    """
    Get personalized product recommendations
    """
    try:
        recommendations = generate_product_recommendations({
            'user_id': request.user_id,
            'category': request.category,
            'price_range': request.price_range
        })
        
        return {
            "recommendations": recommendations,
            "count": len(recommendations)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/stats")
async def get_stats():
    """Get chatbot statistics"""
    return {
        "active_sessions": len(chat_sessions),
        "total_messages": sum(len(session) for session in chat_sessions.values()),
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
