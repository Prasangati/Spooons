# utils/gemini_helper.py
import os
import requests
import json
import re
from journal_entries.models import DetectedStressor, Stressors

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"



def build_prompt(entry_text):
    return f"""
You are a supportive mental health assistant. A user has submitted the following journal entry.

Your job is to:
1. Analyze the entry and provide friendly, supportive feedback that reflects on their emotions and potential stressors.
2. Extract a list of the key stressors mentioned in the entry.
3. Recommend 2-3 helpful resources (books, websites, or self-care practices) that may help the user cope. Include the resource name, a short description, and a link if available.

IMPORTANT: Return your entire response strictly as valid JSON in the following format:

{{
  "ai_feedback": "string of supportive feedback",
  "stressors": ["list", "of", "stressors"],
  "resources": [
    {{"name": "resource name", "description": "short description", "link": "https://example.com"}},
    {{"name": "resource name", "description": "short description", "link": "https://example.com"}}
  ]
}}

Do not include any markdown, extra text, or explanation — ONLY the JSON object.

Here is the journal entry:
\"\"\"{entry_text}\"\"\"
"""


def clean_gemini_response(raw_response):
    # Remove triple backticks and any "json" hint
    cleaned = re.sub(r"```(?:json)?\s*|\s*```", "", raw_response).strip()
    return cleaned


def get_gemini_response(prompt):
    headers = {
        "Content-Type": "application/json",
    }
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    response = requests.post(GEMINI_API_URL, headers=headers, json=data)
    response.raise_for_status()

    result = response.json()
    try:
        ai_text = result["candidates"][0]["content"]["parts"][0]["text"]

        # If ai_text is string, clean and load as JSON
        if isinstance(ai_text, str):
            cleaned_text = clean_gemini_response(ai_text)
            return json.loads(cleaned_text)
        else:
            # Already parsed as dict
            return ai_text

    except (KeyError, IndexError, json.JSONDecodeError) as e:
        print(f"Error parsing Gemini API response: {e}")
        """print(f"Raw response was: {result}")"""
        return None



def generate_ai_stressors(entry):
    user = entry.user

    # Combine existing stressor titles (manual + detected) to avoid duplication
    existing_titles = set(
        Stressors.objects.filter(user=user).values_list('title', flat=True)
    ) | set(
        DetectedStressor.objects.filter(user=user).values_list('title', flat=True)
    )

    # Construct prompt for Gemini
    prompt = f"""
You are part of an AI journal entry application that helps users identify life stressors based on their writing.

For example:
- If someone writes about uncertainty in job searching, the stressor might be "Job search"
- If someone writes about conflict with a romantic partner, it might be "Relationship issues"

Your task:
- Read the journal entry below
- Return a list of **0 to 5** new stressors (avoid duplicates from user's existing stressors)
- Try to be reasonable — if there isn't a clear stressor, don't return one.
- Focus on stressors that might be recurring
- For each stressor, give a **short description** (1–2 sentences)

Journal entry:
\"\"\"{entry.entry}\"\"\"

### Stressors the user already has:
{list(existing_titles)}

Respond with raw JSON only. Do **not** include triple backticks or markdown formatting. Just return the JSON array directly, like:
[
  {{
    "title": "...",
    "description": "..."
  }}
]
    """

    headers = {"Content-Type": "application/json"}
    params = {"key": GEMINI_API_KEY}  #  safely pulled from settings.py
    body = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ]
    }

    try:
        response = requests.post(
            GEMINI_API_URL,
            headers=headers,
            params=params,
            json=body
        )
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print("Error contacting Gemini:", e)
        return

    try:
        data = response.json()
        raw_json = data["candidates"][0]["content"]["parts"][0]["text"]
        suggestions = json.loads(raw_json)
    except Exception as e:
        print("Error parsing Gemini response:", e)
        print("Raw Gemini response:")
        print(data)  # or `response.text`
        return


    for item in suggestions:
        title = item.get("title", "").strip()
        desc = item.get("description", "").strip()

        if title and title.lower() not in [t.lower() for t in existing_titles]:
            DetectedStressor.objects.create(
                user=user,
                entry=entry,
                title=title,
                description=desc
            )