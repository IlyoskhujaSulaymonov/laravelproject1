# AI Integration for Math Tutor

This guide explains how to set up AI integration for the Math Tutor component in the educational system.

## Supported AI Services

The system supports three AI services:
- **OpenAI** (GPT models) - Recommended for best results
- **Anthropic** (Claude models) - Good alternative
- **Google Gemini** - Budget-friendly option

## Environment Configuration

Add the following variables to your `.env` file:

### Basic Configuration
```env
# Choose your AI service: openai, anthropic, or gemini
AI_DEFAULT_SERVICE=openai

# AI Service Settings
AI_TIMEOUT=30
AI_MAX_TOKENS=500
AI_TEMPERATURE=0.7
AI_RATE_LIMIT=100
```

### OpenAI Setup (Recommended)
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_ORGANIZATION=your_org_id_optional
```

### Anthropic Setup
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-haiku-20240307
```

### Google Gemini Setup
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro
```

## Getting API Keys

### OpenAI
1. Go to [OpenAI API Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key to your `.env` file

### Anthropic
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Generate an API key
3. Copy the key to your `.env` file

### Google Gemini
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

## Features

The AI integration provides three main features:

### 1. Mathematical Explanations
- Explains step-by-step solutions
- Provides educational insights
- Helps students understand concepts

### 2. Problem Solving
- Generates complete solutions
- Shows mathematical steps
- Handles various problem types

### 3. Intelligent Hints
- Provides guidance without giving away answers
- Helps students when stuck
- Encourages independent thinking

## API Endpoints

The following endpoints are available:

- `POST /api/ai/explain-math` - Get explanations for solved problems
- `POST /api/ai/solve-problem` - Get AI-generated solutions
- `POST /api/ai/get-hint` - Get helpful hints
- `GET /api/ai/status` - Check AI service availability

## Rate Limiting

- Default: 100 requests per hour per user
- Prevents API abuse and controls costs
- Configurable via `AI_RATE_LIMIT` environment variable

## Cost Management

### Tips to Control Costs:
1. Use GPT-3.5-turbo instead of GPT-4 for lower costs
2. Set appropriate token limits (AI_MAX_TOKENS=500)
3. Monitor usage through AI provider dashboards
4. Implement rate limiting (included by default)
5. Use Claude Haiku or Gemini for budget-friendly options

### Estimated Costs (per 1000 requests):
- **GPT-3.5-turbo**: ~$1-2
- **Claude Haiku**: ~$0.50-1
- **Gemini Pro**: ~$0.25-0.50

## Troubleshooting

### Common Issues:

1. **AI service not available**
   - Check your API keys
   - Verify internet connection
   - Check AI service status

2. **Rate limit exceeded**
   - Wait for the limit to reset (1 hour)
   - Consider upgrading your AI plan
   - Adjust AI_RATE_LIMIT setting

3. **API errors**
   - Check Laravel logs for details
   - Verify API key permissions
   - Check AI service documentation

## Security Considerations

1. **Never commit API keys to version control**
2. **Use environment variables for all sensitive data**
3. **Regularly rotate API keys**
4. **Monitor API usage for unusual activity**
5. **Implement proper error handling**

## Testing

To test the AI integration:

1. Set up your API keys
2. Go to the Math Tutor page
3. Enter a mathematical problem
4. Click "Solve" to generate a solution
5. Use the AI buttons for explanations and hints

## Monitoring

Monitor your AI usage through:
- AI provider dashboards
- Laravel logs (`storage/logs/laravel.log`)
- Application metrics

## Support

If you encounter issues:
1. Check the logs for error messages
2. Verify your configuration
3. Test with a simple mathematical problem
4. Contact support with specific error details