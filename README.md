# Fitness Image Generator

A React application that generates personalized fitness images based on user profile information using AWS Bedrock AI services.

## Features

- **User Profile Form**: Capture name, age, country, and sport preference
- **AI Text Generation**: Creates detailed fitness image prompts using AWS Bedrock Claude
- **AI Image Generation**: Generates custom fitness images based on the text prompts
- **Responsive Design**: Clean, fitness-themed UI with loading states
- **Environment Configuration**: Secure API endpoint management

## Tech Stack

- **Frontend**: React 18, CSS3
- **Backend**: AWS Lambda Functions
- **AI Services**: AWS Bedrock (Claude 3 Sonnet, Image Generation)
- **Deployment**: Lambda Function URLs

## Prerequisites

- Node.js 16+
- npm or yarn
- AWS Account with Bedrock access
- Lambda functions deployed (see Backend Setup)

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd personalized-image-generator
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

4. **Configure environment variables**
Edit `.env` file:
```env
REACT_APP_TEXT_ENDPOINT=your_text_generation_lambda_url
REACT_APP_IMAGE_ENDPOINT=your_image_generation_lambda_url
REACT_APP_MAX_PROMPT_LENGTH=1024
REACT_APP_REQUEST_TIMEOUT=30000
```

5. **Start development server**
```bash
npm start
```

## Backend Setup

### Text Generation Lambda (bedrock-text.py)

Deploy the Lambda function with:
- **Runtime**: Python 3.9+
- **Model**: anthropic.claude-3-sonnet-20240229-v1:0
- **Permissions**: Bedrock invoke access
- **Function URL**: Enable with CORS

### Image Generation Lambda

Deploy with:
- **Model**: Amazon Nova Canvas or Stable Diffusion
- **Permissions**: Bedrock invoke access
- **Function URL**: Enable with CORS

### CORS Configuration

Configure Lambda Function URLs with:
- **Allow Origins**: `*` or your domain
- **Allow Methods**: `POST, OPTIONS`
- **Allow Headers**: `content-type`

## Usage

1. **Fill the form** with your fitness profile
2. **Submit** to generate personalized content
3. **View results** with generated text prompt and fitness image

## Project Structure

```
personalized-image-generator/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main React component
│   ├── App.css         # Styling
│   └── index.js        # Entry point
├── backend-src/
│   └── bedrock-text.py # Lambda function
├── .env.example        # Environment template
├── .gitignore         # Git ignore rules
└── package.json       # Dependencies
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_TEXT_ENDPOINT` | Text generation Lambda URL | Required |
| `REACT_APP_IMAGE_ENDPOINT` | Image generation Lambda URL | Required |
| `REACT_APP_MAX_PROMPT_LENGTH` | Maximum prompt characters | 1024 |
| `REACT_APP_REQUEST_TIMEOUT` | Request timeout (ms) | 30000 |

## Supported Sports

- Yoga
- Martial Arts
- Football
- Gym
- Calisthenics

## Troubleshooting

### CORS Issues
- Ensure Lambda Function URLs have proper CORS configuration
- Check that both endpoints return appropriate CORS headers

### Image Generation Fails
- Verify prompt length doesn't exceed model limits
- Check AWS Bedrock service quotas and permissions

### Environment Variables Not Loading
- Ensure variables start with `REACT_APP_`
- Restart development server after .env changes

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Security

- Never commit `.env` files to version control
- Use least-privilege IAM policies for Lambda functions
- Consider implementing authentication for production use