# AI Setup Instructions

## Setting up Gemini API for AI Chart Suggestions

To enable AI-powered chart suggestions in the Excel Analytics application, follow these steps:

### 1. Get a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

1. Create a `.env` file in the `Frontend` directory
2. Add the following line to the `.env` file:

```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you copied from Google AI Studio.

### 3. Restart the Development Server

After adding the `.env` file, restart your development server:

```bash
npm run dev
```

### 4. Verify Setup

1. Upload an Excel file
2. Go to the Chart Creation page
3. You should see AI suggestions in the right panel
4. The suggestions will be based on your data structure

### Features

- **Smart Chart Recommendations**: AI analyzes your data and suggests the best chart types
- **Axis Recommendations**: Automatically suggests which columns to use for X and Y axes
- **Confidence Scores**: Each suggestion comes with a confidence level
- **Fallback Mode**: If no API key is set, the system provides intelligent fallback suggestions

### Troubleshooting

- **No suggestions appearing**: Check that your `.env` file is in the correct location and the API key is valid
- **API errors**: Verify your API key is correct and has proper permissions
- **Fallback mode**: If you see a yellow warning box, the system is using fallback suggestions

### Security Note

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Keep your API key secure and don't share it publicly 