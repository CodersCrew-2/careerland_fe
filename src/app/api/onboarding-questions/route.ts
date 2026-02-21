import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const QUESTION_SCHEMA = `
Generate exactly 8 onboarding questions for a career guidance platform. The questions should help understand:
- Basic info (name, age, education level)
- Current situation (student/working, field of study/work)
- Interests and passions
- Work style preferences
- Career aspirations

Return a valid JSON array with EXACTLY this structure for each question:
[
  {
    "id": "field_name_snake_case",
    "text": "The full question text?",
    "input_type": "text" | "number" | "radio" | "dropdown" | "multiselect",
    "options": ["Option 1", "Option 2"],  // ONLY for radio/dropdown/multiselect, omit for text/number
    "required": true | false,
    "image_keyword": "unsplash search keyword for a relevant image"
  }
]

Rules:
- Use "radio" for 2-5 clear options (e.g. Yes/No, A/B/C choices)
- Use "dropdown" for longer lists (education level, field of study)
- Use "multiselect" for "select all that apply" scenarios
- Use "text" for open-ended short answers
- Use "number" for numeric answers (age)
- First 3 questions should be required, rest optional
- Make questions conversational and friendly
- image_keyword must be a single descriptive keyword for Unsplash

Return ONLY the JSON array, no markdown code blocks, no explanation.
`;

// Fallback questions if Gemini fails or API key not set
const FALLBACK_QUESTIONS = [
    {
        id: 'full_name',
        text: "What's your name? I'd love to address you personally!",
        input_type: 'text',
        required: true,
        image_keyword: 'portrait'
    },
    {
        id: 'age',
        text: 'How old are you?',
        input_type: 'number',
        required: true,
        image_keyword: 'calendar'
    },
    {
        id: 'education_level',
        text: 'What is your current education level?',
        input_type: 'dropdown',
        options: ['High School', 'Undergraduate (1st–2nd year)', 'Undergraduate (3rd–4th year)', 'Postgraduate', 'PhD', 'Completed Education', 'Other'],
        required: true,
        image_keyword: 'graduation'
    },
    {
        id: 'current_status',
        text: 'Which best describes you right now?',
        input_type: 'radio',
        options: ['Student', 'Working professional', 'Fresher / Job seeker', 'Exploring options'],
        required: false,
        image_keyword: 'workplace'
    },
    {
        id: 'field_of_interest',
        text: 'Which fields genuinely excite you? Pick all that apply.',
        input_type: 'multiselect',
        options: ['Technology', 'Business & Entrepreneurship', 'Creative Arts & Design', 'Science & Research', 'Healthcare & Medicine', 'Education & Social Work', 'Finance & Law', 'Sports & Fitness'],
        required: false,
        image_keyword: 'inspiration'
    },
    {
        id: 'work_environment',
        text: 'What kind of work environment suits you best?',
        input_type: 'radio',
        options: ['Remote / Work from home', 'Office / On-site', 'Hybrid', 'Field / Outdoor'],
        required: false,
        image_keyword: 'office'
    },
    {
        id: 'biggest_strength',
        text: 'In one or two words, what would you say is your biggest strength?',
        input_type: 'text',
        required: false,
        image_keyword: 'strength'
    },
    {
        id: 'career_goal',
        text: 'What does your dream career look like? Any specific role or industry in mind?',
        input_type: 'text',
        required: false,
        image_keyword: 'goal'
    },
];

export async function GET() {
    // If no API key, return fallback
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
        return NextResponse.json(FALLBACK_QUESTIONS);
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(QUESTION_SCHEMA);
        const text = result.response.text().trim();

        // Strip markdown code fences if present
        const clean = text.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim();
        const questions = JSON.parse(clean);

        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error('Invalid response structure');
        }

        return NextResponse.json(questions);
    } catch (err) {
        console.error('[onboarding-questions]', err);
        // Return fallback instead of error
        return NextResponse.json(FALLBACK_QUESTIONS);
    }
}
