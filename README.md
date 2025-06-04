# VAPI Voice Assistant

A clean, minimal web application for making voice calls to VAPI assistants. Built with React, TypeScript, and a modern UI inspired by ChatGPT's speech interface.

## Features

- **Simple Voice Interface**: Clean, centered microphone button for easy voice interaction
- **Real-time Call Status**: Shows connection state and call duration
- **Mute/Unmute Control**: Toggle microphone during calls
- **Error Handling**: Graceful error messages and permission prompts
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatic theme switching

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS
- **Voice Integration**: VAPI AI SDK
- **State Management**: React Query (TanStack Query)
- **Backend**: Express.js (for development server)

## Prerequisites

- Node.js 18+ 
- VAPI account and public key from [vapi.ai](https://vapi.ai)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vapi-voice-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key_here
```

4. Update the assistant ID in `client/src/lib/vapi-client.ts`:
```typescript
this.assistantId = "your-assistant-id-here";
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage

1. Click the microphone button to start a voice call
2. Allow microphone permissions when prompted
3. Speak with your VAPI assistant
4. Click the microphone button again to mute/unmute
5. Click "End Call" to terminate the conversation

## Project Structure

```
├── client/src/
│   ├── components/          # React components
│   │   ├── call-interface.tsx
│   │   ├── error-alert.tsx
│   │   └── permission-prompt.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── use-vapi.tsx
│   ├── lib/                # Utilities and clients
│   │   ├── vapi-client.ts
│   │   └── utils.ts
│   └── pages/              # Application pages
│       └── home.tsx
├── server/                 # Express backend
│   ├── index.ts
│   └── routes.ts
└── shared/                 # Shared types and schemas
    └── schema.ts
```

## Configuration

### VAPI Assistant Setup

1. Create an assistant at [vapi.ai](https://vapi.ai)
2. Note your assistant ID
3. Get your public API key
4. Update the configuration in the code

### Environment Variables

- `VITE_VAPI_PUBLIC_KEY`: Your VAPI public key for authentication

## Deployment

The application can be deployed to any platform that supports Node.js:

- **Vercel**: Deploy the frontend with serverless functions
- **Netlify**: Static site deployment with edge functions
- **Railway**: Full-stack deployment
- **Replit**: Development and hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For VAPI-related issues, visit [VAPI Documentation](https://docs.vapi.ai)

For application issues, please open an issue in this repository.