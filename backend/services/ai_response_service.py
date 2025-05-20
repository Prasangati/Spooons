import json
from journal_entries.models import Resource

def process_ai_response(entry_obj, ai_raw_response):
    try:
        ai_data = ai_raw_response  
        entry_obj.ai_feedback = ai_data.get("ai_feedback")
        entry_obj.stressors = ai_data.get("stressors", [])
        entry_obj.save()

        for res in ai_data.get("resources", []):
            Resource.objects.create(
                journal_entry=entry_obj,
                name=res.get("name", ""),
                description=res.get("description", ""),
                link=res.get("link", "")
            )

    except Exception as e:
        print(f"Error processing AI response: {e}")

